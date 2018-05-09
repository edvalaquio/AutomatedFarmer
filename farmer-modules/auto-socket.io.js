var numUsers = 0;
var geolib = require('geolib');
var moment = require('moment');
var ServerFunction = require('./../api/server-functions.js');
var Path = require('./path-partner.js');
var _ = require('lodash');
// var stepper = require('./manual-socket.js');
// var motor = new stepper(pin numbers);

var updateEvent = function(event, sf, status){
	var where = " WHERE event.id=" + event.id;
	sf.updateWithPromise('event', ['status'], where, [status]);
}

var reuseCoordinates = function(activity, event, path, coordinates, sf, socket){
	var pathTemplate = new Path(path);
	var directions = pathTemplate.getDirections();
	var counter = 0;
	// console.log(coordinates[0].latitude);
	var interval = setInterval(function(){
		if(counter == coordinates.length-1){
			clearInterval(interval);
			updateEvent(event, sf, "'success'");
			isOngoing = false;
			socket.emit('finished', coordinates);
		}

		console.log(directions[counter]);
		console.log(coordinates[counter]);
		counter++;
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
			console.log(event);
			updateEvent(event, sf, "'success'");
			isOngoing = false;
			socket.emit('finished', coordinates);
			return;
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


var isOngoing = false;
module.exports = function(socket, con){

	socket.on('event-ongoing', function(){
		socket.emit('is-ongoing', isOngoing);
	})

	socket.on('start-event', function(data){
		console.log("start event");
		var sf = new ServerFunction(con);
		var currentLocation = {latitude: 51.516272, longitude: 0.45425};
		var activity = data.activity, event = data.event, path1 = data.path;

		updateEvent(event, sf, "'ongoing'");
		isOngoing = true;

		console.log("Performing: " + activity.type);
		// if(activity.type == 'plow'){
		var tableName = 'coordinates AS c JOIN activity AS a';
		var columns = ['c.latitude', 'c.longitude'];
		var on = " ON c.activity_id=a.id ";
		var where = " WHERE a.id=" + activity.id + " AND a.type='" + activity.type + "'";
		console.log(where);
		sf.selectWithPromise(tableName, columns, on, where).then(function(rows){
			var results = rows.data;
			if(results.length){
				console.log(results);
				coordinates = results
				reuseCoordinates(activity, event, path1, results, sf, socket);
				return;
			}
			if(activity.type == 'plow'){
				// console.log(data.path);
				generateCoordinates(activity, event, path1, currentLocation, sf, socket);
			} else {
				console.log(activity);
				var tempType = "";
				if(activity.type == 'seed'){
					tempType = "plow";
				} else {
					tempType = "harvest";
				}

				where = " WHERE a.template_id=" + activity.template_id + " AND a.type='" + tempType + "'";
				sf.selectWithPromise(tableName, columns, on, where).then(function(rows){
					console.log(rows.data);
					var coordinates = rows.data;
					reuseCoordinates(activity, event, path1, coordinates, sf, socket);
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