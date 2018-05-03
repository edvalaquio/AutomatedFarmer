_ = require('lodash');
ServerFunctions = require('./server-functions.js')

module.exports = function(app, con, env){

	var sf = new ServerFunctions(con);

	app.get('/getSocketData', function(req, res){
		res.send(env.host);
	});

	// ==============================================================
	//ROUTES FOR LOTS 

	app.post('/addLot', function(req, res){
		console.log(req.body);
		var lotDetails = _.map(req.body);
		console.log(lotDetails);
		var tableName = "lot"
		var columns = ["name", "province", "town", "brgy", "length", "width"];
		sf.serverInserter(res, tableName, columns, lotDetails);
	});

	app.get('/getLots', function(req, res){
		var filter = function(values){
			var temp = [];
			values.forEach(function(item){
				item.address = item.brgy + ", " + item.town + ", " + item.province;
				temp.push(_.omit(item, ['brgy', 'town', 'province']));
			});
			return temp;
		}

		var columns = ["id", "name", "province", "town", "brgy"];
		sf.serverSelector(res, "lot", columns, '', '', filter);
	});

	app.get('/getLot/:lot_id', function(req, res){
		var where = " WHERE id=" + req.params.lot_id
		sf.serverSelector(res, "lot", ['*'], '', where, _.head);
	});

	// ==============================================================
	//ROUTES FOR EVENT

	app.post('/addEvent', function(req, res){
		// Expected data:
		// > start_time
		// > estimated_end_time	====> Computed server-side, sent to user, then sent back by user.
		// > status = 'pending'
		// > lot_id
		// > activity_id
		var eventDetails = _.map(req.body);
		var columns = ["start_time", "estimated_end_time", "status", "lot_id", "activity_id"];
		sf.serverInserter(res, "event", columns, eventDetails);

	});

	app.get('/getEvents', function(req, res){
		// event status, lot name, activity type, start_time, expected_end_time, actual_end_time, 
		// var query = "SELECT * FROM event AS e JOIN activity AS a ON e.event_id="
		// serverSelector = function(res, tableName, columns, on, where, filter, flag)
		var tableName = " event AS e JOIN activity AS a JOIN lot ";
		var columns = ["lot.name", "a.type", "e.start_time", "e.expected_end_time", "e.actual_end_time", "e.status"];
		var on = " ON e.activity_id=a.id AND e.lot_id=lot.id ";

		sf.serverSelector(res, tableName, columns, on, '');
	});

	app.put('/updateEvent', function(req, res){

	})

	// ==============================================================
	//ROUTES FOR ACTIVITY
	app.post('/addActivity', function(req, res){
		// Expected data:
		// > label, type, template_id, lot_id
		console.log(req.body);
		var activityDetails = _.map(req.body);
		var columns = ["label", "template_id", "lot_id", "type"];
		sf.serverInserter(res, "activity", columns, activityDetails);

	});

	app.get('/getActivities/:lot_id/:type', function(req, res){
		var tableName = " activity AS a JOIN template AS t ";
		var columns = ["a.id", "a.label", "a.type", "a.template_id", "t.path", "t.grid", "a.lot_id"];
		var on = " ON a.template_id=t.id ";
		var where = " WHERE a.lot_id=" + req.params.lot_id + " AND a.type='" + req.params.type + "'";

		var filter = function(values){
			var temp = []
			values.forEach(function(item){
				item.path = JSON.parse(item.path);
				item.grid = JSON.parse(item.grid);
				temp.push(item);
			})
			return temp;
		}
		sf.serverSelector(res, tableName, columns, on, where, filter);
	});

	app.get('/getActivities/:lot_id', function(req, res){
		var tableName = " activity JOIN template ";
		var columns = ["activity.id", "activity.label", "activity.type", "activity.template_id", "template.path", "template.grid", "activity.lot_id"];
		var on = " activity.template_id=template.id ";
		sf.serverSelector(res, tableName, columns, on, '');
	});

	// app.get('/getActivityTemplate/:lot_id/')

	// ==============================================================
	//ROUTES FOR TEMPLATE

	app.post('/addTemplate', function(req, res){
		// Expected data:
		var templateDetails = _.map(req.body);
		var columns = ["grid", "path", "lot_id"];
		// console.log(templateDetails);
		sf.serverInserter(res, "template", columns, templateDetails);
	});

	app.get('/getTemplate/:template_id', function(req, res){
		var where = " WHERE id=" + req.params.template_id;
		sf.serverSelector(res, 'template', ['*'], '', where);
	});

	app.post('/getTemplateByPath', function(req, res){
		var template = req.body.template;
		var activity = req.body.activity;

		var columns = ["activity.label"];
		var table = " activity JOIN template ";
		var on = " ON activity.template_id=template.id "
		var where = " WHERE template.path LIKE '" + JSON.stringify(template.path) + "' AND activity.type='" + activity.type + "'";

		// var filter = function(values){
			// return values[0]['COUNT(*)'];
		// }

		sf.serverSelector(res, table, columns, on, where);
	});


	// app.get('/getTemplateActivity/:lotid/:type', function(req, res){

	// 	var columns = "", table = "", where = "";
	// 	if(req.params.type == "plow"){
	// 		columns = [' plow.id', ' plow.label', ' plow.template_id', ' template.grid', ' template.path'];
	// 		table = "plow INNER JOIN template ON plow.template_id=template.id";
	// 		where = "plow.lot_id="
	// 	} else if(req.params.type == "seed"){
	// 		columns = [' seed.id', ' seed.label', ' seed.template_id', ' template.grid', ' template.path'];
	// 		table = "seed INNER JOIN template ON seed.template_id=template.id";
	// 		where = "seed.lot_id="
	// 	} else {
	// 		columns = [' harvest.id', ' harvest.label', ' harvest.template_id', ' template.grid', ' template.path'];
	// 		table = "harvest INNER JOIN template ON harvest.template_id=template.id";
	// 		where = "harvest.lot_id="
	// 	}
	// 	var query = "SELECT" + columns + " FROM " + table + " WHERE " + where + req.params.lotid;
	// 	console.log(query);

	// 	con.query(query, function(err, result, fields){
	// 		if(err){
	// 			res.send(err);
	// 			return;
	// 		}
	// 		result.forEach(function(activity){
	// 			activity.path = JSON.parse(activity.path)
	// 			activity.grid = JSON.parse(activity.grid)
	// 		})
	// 		console.log(result);
	// 		res.send(result);
	// 	});
	// });



	// app.get('/getLotActivities', function(req, res){
	// 	var query = "SELECT activity.type, activity.status, activity.start_time, activity.end_time, lot.name FROM activity JOIN lot ON activity.lot_id = lot.id";
	// 	con.query(query, function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 			return;
	// 		}
	// 		res.send(result);
	// 	})
	// });
	// app.post('/addRiceAge', function(req, res){
	// 	var queryForRiceAge = "";
	// });

	// app.get('/getLotActivities/:lotid/:type/:template', function(req, res){
	// 	console.log(req.params);
	// 	// SELECT activity.id, plow.label, activity.start_time, activity.end_time FROM plow JOIN activity ON activity.type_id=plow.id WHERE activity.status='success' AND activity.lot_id=0 AND plow.id=(SELECT plow.id FROM plow JOIN template ON plow.template_id=template.id WHERE template.id=21)
	// 	var innerQuery = "SELECT type.id FROM " + req.params.type + " AS type JOIN template ON type.template_id=template.id WHERE template.id=" + req.params.template;
	// 	var outerQuery = "SELECT activity.id, type.label, activity.start_time, activity.end_time FROM " + req.params.type + " AS type JOIN activity ON activity.type_id=type.id WHERE activity.status='success' AND activity.lot_id=" + req.params.lotid + " AND type.id=(" + innerQuery + ")";
	// 	console.log(outerQuery);
	// 	con.query(outerQuery, function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 			return;
	// 		}
	// 		console.log("Retreived rows!");
	// 		res.send(result)
	// 	})
		// var select = "SELECT activity.id, " + req.params.type + ".label, activity.start_time, activity.end_time ";
		// var table = "FROM " + req.params.type + " JOIN activity ON activity.type_id=" + req.params.template

	// app.get('/getLotActivities/:lotid/:type/:template', function(req, res){
	// 	console.log(req.params);
	// 	// SELECT activity.id, plow.label, activity.start_time, activity.end_time FROM plow JOIN activity ON activity.type_id=plow.id WHERE activity.status='success' AND activity.lot_id=0 AND plow.id=(SELECT plow.id FROM plow JOIN template ON plow.template_id=template.id WHERE template.id=21)
	// 	var innerQuery = "SELECT type.id FROM " + req.params.type + " AS type JOIN template ON type.template_id=template.id WHERE template.id=" + req.params.template;
	// 	var outerQuery = "SELECT activity.id, type.label, activity.start_time, activity.end_time FROM " + req.params.type + " AS type JOIN activity ON activity.type_id=type.id WHERE activity.status='success' AND activity.lot_id=" + req.params.lotid + " AND type.id=(" + innerQuery + ")";
	// 	console.log(outerQuery);
	// 	con.query(outerQuery, function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 			return;
	// 		}
	// 		console.log("Retreived rows!");
	// 		res.send(result)
	// 	})
	// 	// var select = "SELECT activity.id, " + req.params.type + ".label, activity.start_time, activity.end_time ";
	// 	// var table = "FROM " + req.params.type + " JOIN activity ON activity.type_id=" + req.params.template

	// });

	// // ACTIVITY TEMPLATES

	// app.post('/getTemplates', function(req, res){
	// 	console.log(req.body);
	// 	var activity = req.body.activity;
	// 	var template = req.body.template;
		
	// 	var query = "";
	// 	if(activity.type == 'plow'){
	// 		query = "SELECT plow.label FROM plow INNER JOIN template ON plow.template_id=template.id WHERE template.grid='" + JSON.stringify(req.body.template.grid) + "'";
	// 	} else{
	// 		query = "SELECT * FROM " + activity.type + " INNER JOIN template ON " + activity.type + ".template_id=template.id WHERE template.id=" + activity.template;
	// 	}
	// 	// var query = "";
	// 	// 
	// 	con.query(query, function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 			res.send("Error!");
	// 			return;
	// 		}
	// 		console.log(result);
	// 		res.send(result);
	// 	});
	// });

	// app.post('/addTemplate', function(req, res){

	// 	var insertFunction = function(data){
	// 		var statement = "INSERT INTO " + data.type + " (label, template_id, lot_id) VALUES?";
	// 		var data = _.map(_.omit(data, 'type'));
	// 		con.query(statement, [[data]], function(err, result){
	// 			if(err){
	// 				console.log(err);
	// 				res.send("Error");
	// 				return;
	// 			}
	// 			console.log("Successfully inserted into table!");
	// 			res.send("Success!");
	// 		});
	// 	}

	// 	var activity = req.body.activity;
	// 	activity.lot_id = parseInt(activity.lot_id);
	// 	var query = "";

	// 	if(activity.type == 'plow'){
	// 		var template = {
	// 			grid 	: JSON.stringify(req.body.template.grid),
	// 			path 	: JSON.stringify(req.body.template.path),
	// 			lot_id 	: activity.lot_id
	// 		}
	// 		console.log(template);
	// 		template = _.map(template)
	// 		query = "INSERT INTO template (grid, path, lot_id) VALUES ?";
	// 		con.query(query, [[template]], function (err, result) {
	// 			if(err){
	// 				console.log(err);	
	// 				res.send("Error");
	// 				return;
	// 			}
	// 			console.log("Successfully inserted into template!");
	// 			activity.template = result.insertId;
	// 			insertFunction(activity);
	// 		});

	// 	} else {
	// 		insertFunction(activity);
	// 	}



	// });

	// app.post('/addActivity', function(req, res){
	// 	// console.log(req.body);
	// 	// console.log(activityDetails);
	// 	var activityDetails = _.map(req.body);
	// 	activityDetails.push('ongoing');
	// 	var query = "INSERT INTO activity (lot_id, type, type_id, status) VALUES ?";
	// 	con.query(query, [[activityDetails]], function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 			res.send("Error");
	// 			return;
	// 		}
	// 		console.log("Successfully inserted into activity.");
	// 		res.send({
	// 			activityID 	: result.insertId
	// 		});
	// 	});

	// });

	// app.put('/updateActivity', function(req, res){

	// 	console.log(req.body);
	// 	var query = "UPDATE activity SET status='" + req.body.status + "', end_time=CURRENT_TIME() WHERE activity.id=" + req.body.activity_id;
	// 	con.query(query, function(err, result){
	// 		if(err){
	// 			console.log(err);
	// 			return;
	// 		}
	// 		res.send("Successfully updated!");
	// 	});


	// });
}