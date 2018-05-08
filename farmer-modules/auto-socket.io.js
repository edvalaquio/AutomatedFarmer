var numUsers = 0;
var geolib = require('geolib');
var moment = require('moment');
var ServerFunction = require('./../api/server-functions.js');
var Path = require('./path-partner.js');
var _ = require('lodash');
// var stepper = require('./manual-socket.js');
// var motor = new stepper(pin numbers);



var reuseCoordinates = function(activity, path, coordinates, sf, socket){
	var pathTemplate = newPath(path);
	var directions = pathTemplate.getDirections();
	var counter = 0;

	// var currentLocation = coordinates.pop();
	var interval = setInterval(function(){
		if(counter == coordinates.length){
			clearInterval(interval);
			// var socketData = {
			// 	data 	: coordinates,
			// 	time 	: new Date(),
			// 	status 	: "success",
			// 	message : "Successfully finished plowing!"
			// }
			// socket.emit('finished', coordinates);
		}
	}, 1000);
}

var generateCoordinates = function(activity, event, path, currentLocation, sf, socket){
	var pathTemplate = new Path(path);
	var directions = pathTemplate.getDirections();
	var coordinates = [], counter = 0, inc = 0.5;

	coordinates.push(currentLocation);
	var interval = setInterval(function(){
		if(counter == directions.length){
			clearInterval(interval);

			// sf.updateWithPromise('event');


			// socket.emit('finished', coordinates);
			// return;
		}
		console.log("Tractor is moving: ", directions[counter]);

		var tempLocation = pathTemplate.getDestinationPoint(currentLocation, 0.5, directions[counter]);
		var distance = geolib.getDistanceSimple(currentLocation, tempLocation);
		console.log(distance);;
		if(distance >= 1){
			counter++;
			coordinates.push(currentLocation);
			var tableName = "coordinates";
			var columns = ['latitude', 'longitude', 'activity_id'];
			var insertData = [currentLocation.latitude, currentLocation.longitude, activity.id];
			sf.insertWithPromise(tableName, columns, insertData).then(function(rows){
				console.log(rows.data);
				console.log(rows.message);
			});
		}
		currentLocation = tempLocation
	}, 1000);

	return coordinates;
}

module.exports = function(socket, con){
	
	socket.on('start-event', function(data){
		var sf = new ServerFunction(con);
		var currentLocation = {latitude: 51.516272, longitude: 0.45425};
		var coordinates = [];

		var activity = data.activity, event = data.event, path1 = data.path;
		console.log("Performing: " + activity.type);
		// if(activity.type == 'plow'){
		var tableName = 'coordinates AS c JOIN activity AS a';
		var columns = ['c.latitude', 'c.longitude'];
		var on = " ON c.activity_id=a.id ";
		var where = " WHERE a.id=" + activity.id + " AND a.type='" + activity.type + "'";
		sf.selectWithPromise(tableName, columns, on, where).then(function(rows){
			var results = rows.data;
			if(results.length){
				// reuse coordinates
				return;
			}
			if(activity.type == 'plow'){
				generateCoordinates(activity, data.path, currentLocation, sf, socket);
			} else {
				console.log(activity);
				var tempType = "";
				if(activity.type == 'seed'){
					tempType = "plow";
				} else {
					tempType = "harvest";
				}

				where = " WHERE a.template_id=" + activity.template + " AND a.type='" + tempType + "'";
				// console.log(where);
				sf.selectWithPromise(tableName, columns, on, where).then(function(rows){
					console.log(rows);
				});
			}
		});
	});

	socket.on('get-event-data', function(data){
		var minPerMsq = 0.006;
		var speedKmPerHr = 1;

		var event = data.event;
		var path = data.path;


		console.log(data);

		var distance = path.length;
		var speed = speedKmPerHr * (1000/3600);
		var time = distance / speed;
		console.log(time);
		var startTime = moment(new Date(data.event.start));
		var estimatedEndTime = moment(new Date(data.event.start)).add(time, 'seconds');

		var socketData = {
			startTime			: startTime.format(),
			estimatedEndTime	: estimatedEndTime.format() ,
			estimatedDuration	: time
		}
		socket.emit('returned-event-data', socketData);

	})	
}