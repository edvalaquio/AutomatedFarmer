var numUsers = 0;
var geolib = require('geolib');
var moment = require('moment');
var ServerFunction = require('./../api/server-functions.js');
var Path = require('./path-partner.js');
var _ = require('lodash');
// var stepper = require('./manual-socket.js');
// var motor = new stepper(pin numbers);

module.exports = function(io, socket, con){
	// console.log(io);
	var isOngoing = false;
	var activity, event, path;
	var sf = new ServerFunction(con);

	var updateEvent = function(status){
		var where = " WHERE event.id=" + event.id;
		sf.updateWithPromise('event', ['status', 'actual_end_time'], where, [status, 'NOW()']);
	}

	var storeCoordinates = function(data){
		var tableName = "coordinates";
		var columns = ['latitude', 'longitude', 'activity_id'];
		var insertData = [data.latitude, data.longitude, activity.id];
		sf.insertWithPromise(tableName, columns, insertData).then(function(rows){
			console.log(rows.data);
			console.log(rows.message);
		});
	}

	var reuseCoordinates = function(coordinates, flag){
		var pathTemplate = new Path(path);
		var directions = pathTemplate.getDirections();
		var counter = 0;
		// console.log(coordinates[0].latitude);
		var interval = setInterval(function(){
			if(counter == coordinates.length-1){
				clearInterval(interval);
				updateEvent("'success'");
				isOngoing = false;
				io.emit('finished', coordinates);
				return;
			}

			if(flag){
				storeCoordinates(coordinates[counter])
			}
			io.emit('tractor-details', {
				currentLocation : coordinates[counter],
				status			: isOngoing,
				currentActivity : activity.type
			});

			counter++;
		}, 1000);
	}

	var generateCoordinates = function(currentLocation){
		var pathTemplate = new Path(path);
		var directions = pathTemplate.getDirections();
		var coordinates = [], counter = 0, inc = 0.5;

		coordinates.push(currentLocation);
		var interval = setInterval(function(){
			if(counter == directions.length){
				clearInterval(interval);
				console.log(event);
				updateEvent("'success'");
				isOngoing = false;
				io.emit('finished', coordinates);
				return;
			}
			console.log("Tractor is moving: ", directions[counter]);

			var tempLocation = pathTemplate.getDestinationPoint(currentLocation, 0.5, directions[counter]);
			var distance = geolib.getDistanceSimple(currentLocation, tempLocation);
			console.log(distance);;
			if(distance >= 1){
				counter++;
				coordinates.push(currentLocation);
				storeCoordinates(currentLocation);
			}
			currentLocation = tempLocation
			io.emit('tractor-details', {
				currentLocation : coordinates[counter],
				status			: isOngoing,
				currentActivity : activity.type
			});
		}, 1000);

		return coordinates;
	}

	socket.on('start-event', function(data){
		activity = data.activity;
		event = data.event;
		path = data.path;

		updateEvent("'ongoing'");
		isOngoing = "Ongoing";

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
				reuseCoordinates(results, false);
				return;
			}
			
			if(activity.type == 'plow'){
				var currentLocation = {latitude: 51.516272, longitude: 0.45425};
				generateCoordinates(currentLocation);
			} else {
				console.log(activity);
				var tempType = "";
				if(activity.type == 'seed'){
					tempType = "plow";
				} else {
					tempType = "seed";
				}

				where = " WHERE a.template_id=" + activity.template_id + " AND a.type='" + tempType + "'";
				sf.selectWithPromise(tableName, columns, on, where).then(function(rows){
					reuseCoordinates(rows.data, true);
				});
			}
		});
	});

	socket.on('get-tractor-details', function(){
		io.emit('tractor-details', {
			currentLocation : "Calculating...",
			status			: isOngoing,
			currentActivity : "Checking..."
		});
	})

	socket.on('get-event-data', function(data){
		var minPerMsq = 0.006;
		var speedKmPerHr = 1;

		var event = data.event;
		var path = data.path;

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
		io.emit('returned-event-data', socketData);

	})	
}