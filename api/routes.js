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
		console.log("hello");
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
	})

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
		console.log(req.body);
		var activityDetails = req.body;
		console.log(activityDetails);

		var labelCount = "SELECT id, COUNT(*) from acitivity WHERE label LIKE '" + activityDetails.label + "%'";
		con.query(labelCount, function(err, result, fields){
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			console.log(result);
			var count =  "_" + (result[0]['COUNT(*)'] + 1); 
			// console.log(activityDetails.label);

			activityDetails.label += count;
			
			activityDetails.path = JSON.stringify(activityDetails.path);
			activityDetails.grid = JSON.stringify(activityDetails.grid);
			activityDetails = _.map(activityDetails);
			console.log(activityDetails);
			var query = "INSERT INTO acitivity (label, date, type, grid, path, lot_id) VALUES ?"
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