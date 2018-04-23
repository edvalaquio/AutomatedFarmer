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
		var query = "SELECT * FROM acitivity WHERE lot_id=" + req.params.lotid;
		con.query(query, function(err, result, fields){
			if(err){
				res.send(err);
				return;
			}
			console.log(result);
			res.send(result);
		})
	})

	app.post('/addLot', function(req, res){

		var lotDetails = [];
		lotDetails = _.map(req.body);
		var query2 = "INSERT INTO lot (name, province, town, brgy, length, width) VALUES ?";
		con.query(query2, [[lotDetails]], function (err, result, fields) {
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			console.log("These is success!");
			res.send({
				lotid 	: lotDetails[0]
			});
		});
	});

	app.post('/addActivity', function(req, res){
		console.log(req.body);
		var activityDetails = req.body;
		var temp = [];
		for(var i = 0; i < activityDetails.path.length; i++){
			for(var j = 0; j < activityDetails.path[i].length; j++){
				temp.push('(' + i + ',' + j + ')');
			}
		}
		activityDetails.path = JSON.stringify(temp);
		activityDetails = _.map(activityDetails);
		console.log(activityDetails);
		var query = "INSERT INTO acitivity (label, date, type, path, startpoint, direction, lot_id) VALUES ?"
		con.query(query, [[activityDetails]], function (err, result, fields) {
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			console.log("These is success!");
			res.send("Success!");
		});
	})
}
