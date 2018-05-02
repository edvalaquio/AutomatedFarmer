var _ = require('lodash');

module.exports = function(app, con, env){

	app.get('/getSocketData', function(req, res){
		res.send(env.host);
	});

	app.get('/getLots', function(req, res){
		var query = "SELECT id, name, province, town, brgy FROM lot;";
		con.query(query, function (err, result, fields) {
			if (err){
				res.send(err);
				return;
			};
			var data = [];
			result.forEach(function(item){
				data.push({
					'id' 		: item.id,
					'name'		: item.name,
					'address' 	: item.brgy + ", " + item.town + ", " + item.province
				})
			})
			res.send(data);
		});
	});

	app.get('/getLot/:lotid', function(req, res){
		var query = "SELECT * FROM lot WHERE id=" + req.params.lotid + ";";
		con.query(query, function (err, result, fields){
			if (err){
				res.send(err);
				return;
			};
			res.send(result[0]);
		});
	});

	app.get('/getTemplateActivity/:lotid/:type', function(req, res){

		var columns = "", table = "", where = "";
		if(req.params.type == "plow"){
			columns = [' plow.id', ' plow.label', ' plow.template_id', ' template.grid', ' template.path'];
			table = "plow INNER JOIN template ON plow.template_id=template.id";
			where = "plow.lot_id="
		} else if(req.params.type == "seed"){
			columns = [' seed.id', ' seed.label', ' seed.template_id', ' template.grid', ' template.path'];
			table = "seed INNER JOIN template ON seed.template_id=template.id";
			where = "seed.lot_id="
		} else {
			columns = [' harvest.id', ' harvest.label', ' harvest.template_id', ' template.grid', ' template.path'];
			table = "harvest INNER JOIN template ON harvest.template_id=template.id";
			where = "harvest.lot_id="
		}
		var query = "SELECT" + columns + " FROM " + table + " WHERE " + where + req.params.lotid;
		console.log(query);

		con.query(query, function(err, result, fields){
			if(err){
				res.send(err);
				return;
			}
			result.forEach(function(activity){
				activity.path = JSON.parse(activity.path)
				activity.grid = JSON.parse(activity.grid)
			})
			console.log(result);
			res.send(result);
		});
	});

	app.post('/addLot', function(req, res){

		console.log(req.body);
		var lotDetails = _.map(req.body);
		console.log(lotDetails);
		var query = "INSERT INTO lot (name, province, town, brgy, length, width) VALUES ?";
		con.query(query, [[lotDetails]], function (err, result) {
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			console.log("Successfully inserted into lot!");
			console.log(result);
			res.send({
				lotid 	: result.insertId
			});
		});
	});

	// ACTIVITY TEMPLATES

	app.post('/getTemplates', function(req, res){
		console.log(req.body);
		var activity = req.body.activity;
		var template = req.body.template;
		
		var query = "";
		if(activity.type == 'plow'){
			query = "SELECT plow.label FROM plow INNER JOIN template ON plow.template_id=template.id WHERE template.grid='" + JSON.stringify(req.body.template.grid) + "'";
		} else if(activity.type == 'seed'){
			query = "SELECT * FROM seed INNER JOIN template ON seed.template_id=template.id WHERE seed.lot_id=" + activity.lot_id;
		} else if(activity.type == 'harvest'){
			query = "SELECT * FROM harvest INNER JOIN template ON harvest.template_id=template.id WHERE harvest.lot_id=" + activity.lot_id;
		}
		// var query = "";
		// 
		con.query(query, function(err, result){
			if(err){
				console.log(err);
				res.send("Error!");
				return;
			}
			console.log(result);
			res.send(result);
		});
	});

	app.post('/addTemplate', function(req, res){

		var insertFunction = function(data){
			var statement = "INSERT INTO " + data.type + " (label, template_id, lot_id) VALUES?";
			var data = _.map(_.omit(data, 'type'));
			con.query(statement, [[data]], function(err, result){
				if(err){
					console.log(err);
					res.send("Error");
					return;
				}
				console.log("Successfully inserted into table!");
				res.send("Success!");
			});
		}

		var activity = req.body.activity;
		activity.lot_id = parseInt(activity.lot_id);
		var query = "";

		if(activity.type == 'plow'){
			var template = {
				grid 	: JSON.stringify(req.body.template.grid),
				path 	: JSON.stringify(req.body.template.path),
				lot_id 	: activity.lot_id
			}
			console.log(template);
			template = _.map(template)
			query = "INSERT INTO template (grid, path, lot_id) VALUES ?";
			con.query(query, [[template]], function (err, result) {
				if(err){
					console.log(err);	
					res.send("Error");
					return;
				}
				console.log("Successfully inserted into template!");
				activity.template = result.insertId;
				insertFunction(activity);
			});

		} else {
			insertFunction(activity);
		}



	});

	app.get('/getLotActivities', function(req, res){
		var query = "SELECT activity.type, activity.status, activity.start_time, activity.end_time, lot.name FROM activity JOIN lot ON activity.lot_id = lot.id";
		con.query(query, function(err, result){
			if(err){
				console.log(err);
				return;
			}
			res.send(result);
		})
	});

	// app.post('/addActivity', function(req, res){
	// 	var activityDetails = req.body;
	// 	console.log(activityDetails);

	// 	var labelCount = "SELECT id, COUNT(*) from " + activityDetails.type + " WHERE label LIKE '" + activityDetails.label + "%'";
	// 	con.query(labelCount, function(err, result, fields){
	// 		if(err){
	// 			console.log(err);
	// 			res.send("Error");
	// 			return;
	// 		}
	// 		// console.log(result);
	// 		var count =  "_" + (result[0]['COUNT(*)'] + 1); 
	// 		activityDetails.label += count;
			
		// 	var columns;
		// 	if(activityDetails.type == 'plow'){
		// 		columns = "label, grid, path, lot_id";
		// 		activityDetails.path = JSON.stringify(activityDetails.path);
		// 		activityDetails.grid = JSON.stringify(activityDetails.grid);
		// 		activityDetails = _.omit(activityDetails, 'template')
		// 	} else {
		// 		columns = "label, template, lot_id";
		// 		activityDetails = _.omit(activityDetails, ['grid', 'path'])
		// 	}

		// 	var query = "INSERT INTO " + activityDetails.type + " (" + columns + ") VALUES ?";
			
		// 	activityDetails = _.omit(activityDetails, 'type');
		// 	activityDetails = _.map(activityDetails);
		// 	console.log(activityDetails);
		// 	con.query(query, [[activityDetails]], function (err, result, fields) {
		// 		if(err){
		// 			console.log(err);
		// 			res.send("Error");
		// 			return;
		// 		}
		// 		console.log("These is success!");
		// 		res.send("Success!");
		// 	});
		// });

	// });
}