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
		var where = " WHERE id=" + req.params.lot_id;
		sf.serverSelector(res, "lot", ['*'], '', where, _.head);
	});

	app.get('/getLotTypes/:lot_id', function(req, res){
		var where=" WHERE id=" + req.params.lot_id;
		sf.serverSelector(res, "lot", ['COUNT(*)'], '', where);
	});

	// ==============================================================
	//ROUTES FOR EVENT

	app.post('/addEvent', function(req, res){
		// Expected data:
		// > start_time
		// > estimated_end_time	====> Computed server-side, sent to user, then sent back by user.
		// > status = 'pending'
		// > lot_id
		var eventDetails = _.map(_.omit(req.body, ['end', 'estimatedDuration', 'id']));
		console.log(req.body);
		eventDetails.push("pending");
		console.log(eventDetails);

		var columns = ["start_time", "lot_id", "estimated_end_time", "status"];
		sf.serverInserter(res, "event", columns, eventDetails);

	});

	app.get('/getEvents', function(req, res){
		var tableName = " event AS e JOIN sequence AS s JOIN activity AS a ";
		var columns = ['e.id', 'e.start_time', 'e.estimated_end_time', 'e.actual_end_time', 'e.status', 'a.lot_name', 'a.type'];
		var on = " ON e.id=s.event_id AND a.id=s.activity_id"

		sf.serverSelector(res, tableName, columns, on, '');
	});

	app.put('/updateEvent', function(req, res){
		var tableName = "event";
		var column = "";
		// function(res, tableName, columns, where, data)
	})

	// ==============================================================
	//ROUTES FOR ACTIVITY
	app.post('/addActivity', function(req, res){
		// Expected data:
		// > label, type, template_id, lot_id
		console.log(req.body);
		var columns = _.keysIn(req.body)
		console.log(columns);
		var activityDetails = _.map(req.body);
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

	app.get('/getActivitiesWithCoordinates/:lot_id', function(req, res){
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

		sf.serverSelector(res, table, columns, on, where);
	});

	// ==============================================================
	//ROUTES FOR COORDINATES

	app.get('/getActivityCoordinates/:event_id/:activity_id', function(req, res){
		var where = " WHERE id=" + req.params.event_id;
		sf.serverSelector(res, 'coordinates', ['*'], '', where);
	});

}