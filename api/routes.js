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

	app.get('/getActivity/:lotid', function(req, res){
		var query = "SELECT id, label, grid, path FROM acitivity WHERE lot_id=" + req.params.lotid;
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
		})
	});

	app.get('/getActivity/:lotid/:type', function(req, res){

		var query = "";
		if(req.params.type == "plow"){
			query = "SELECT id, grid, path, label FROM " + req.params.type + " WHERE lot_id=" + req.params.lotid;
		} else if(req.params.type == "seed"){
			query = "SELECT seed.id, seed.label, seed.lot_id, seed.template, plow.grid, plow.path FROM seed INNER JOIN plow ON seed.template=plow.id WHERE seed.lot_id=" + req.params.lotid;
		} else {
			query = "SELECT harvest.id, harvest.label, harvest.lot_id, harvest.template, plow.grid, plow.path FROM harvest INNER JOIN seed INNER JOIN plow ON harvest.template=seed.id AND seed.template=plow.id WHERE harvest.lot_id=" + req.params.lotid;
		}

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
		})
	});

	app.post('/addLot', function(req, res){

		var lotDetails = [];
		lotDetails = _.map(req.body);
		var query = "INSERT INTO lot (name, province, town, brgy, length, width) VALUES ?";
		con.query(query, [[lotDetails]], function (err, result) {
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			console.log("These is success!");
			console.log(result);
			res.send({
				lotid 	: result.insertId
			});
		});
	});

	app.post('/addActivity', function(req, res){
		var activityDetails = req.body;
		console.log(activityDetails);

		var labelCount = "SELECT id, COUNT(*) from " + activityDetails.type + " WHERE label LIKE '" + activityDetails.label + "%'";
		con.query(labelCount, function(err, result, fields){
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			// console.log(result);
			var count =  "_" + (result[0]['COUNT(*)'] + 1); 
			activityDetails.label += count;
			
			var columns;
			if(activityDetails.type == 'plow'){
				columns = "label, grid, path, lot_id";
				activityDetails.path = JSON.stringify(activityDetails.path);
				activityDetails.grid = JSON.stringify(activityDetails.grid);
				activityDetails = _.omit(activityDetails, 'template')
			} else {
				columns = "label, template, lot_id";
				activityDetails = _.omit(activityDetails, ['grid', 'path'])
			}

			var query = "INSERT INTO " + activityDetails.type + " (" + columns + ") VALUES ?";
			
			activityDetails = _.omit(activityDetails, 'type');
			activityDetails = _.map(activityDetails);
			console.log(activityDetails);
			con.query(query, [[activityDetails]], function (err, result, fields) {
				if(err){
					console.log(err);
					res.send("Error");
					return;
				}
				console.log("These is success!");
				res.send("Success!");
			});
		});

	})
}