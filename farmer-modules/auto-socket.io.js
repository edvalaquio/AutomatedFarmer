var numUsers = 0;
var geolib = require('geolib');
var moment = require('moment');
// var stepper = require('./manual-socket.js');
// var motor = new stepper(pin numbers);

var Path = function(input){
	this.path = input;
	this.testCoordinates = this.getTestGPS();
	var printDirections = function(input){
		var temp = [];
		for(var i = 1; i < input.length; i++){

			var currentPoint = input[i - 1];
			var nextPoint = input[i];

			if(currentPoint.x + 1 == (nextPoint.x)){
				temp.push("South");
			} else if(currentPoint.x - 1 == (nextPoint.x)){
				temp.push("North");
			}else if(currentPoint.y + 1 == (nextPoint.y)){
				temp.push("East");
			} else if(currentPoint.y - 1 == (nextPoint.y)){
				temp.push("West");
			}
		}
		return temp;
	}
	this.directions = printDirections(input);

}

Path.prototype.getDirections = function(){
	return this.directions;
};

Path.prototype.getTestGPS = function(){
	if(!this.directions){
		return false;
	}
	var coordinates = [];
	var currentPoint = {latitude: 51.516272, longitude: 0.45425};
	var bearing = 0;
	var temp = this.directions;
 																												

	for(var i = 0; i < this.directions.length; i++){
		coordinates.push(currentPoint);
		var face = this.directions[i];

		if(face == 'North'){
			bearing = 0;
		} else if(face == 'South'){
			bearing = 180;
		} else if(face == 'East'){
			bearing = 90;
		} else if(face == 'West'){
			bearing = 270;
		}
		
		currentPoint = geolib.computeDestinationPoint(currentPoint, 1, bearing);
	}

	return coordinates;

}

// Path.prototype.getDestinationPoint = function(face, currentPoint, inc){
Path.prototype.getDestinationPoint = function(currentPoint, inc, face){

	var bearing = 0;
	if(face == 'North'){
		bearing = 0;
	} else if(face == 'South'){
		bearing = 180;
	} else if(face == 'East'){
		bearing = 90;
	} else if(face == 'West'){
		bearing = 270;
	}
	return geolib.computeDestinationPoint(currentPoint, inc, bearing);

}


var stopper = function(name){
	clearInterval(name);
}

module.exports = function(socket, con){
	var currentLocation = {latitude: 51.516272, longitude: 0.45425};
	var coordinates = [];
	socket.on('start-event', function(data){

		var interval;
		var activity = data.activity, event = data.event, path1 = data.path;

		if(activity.type == 'plow'){
			// expected data are chosen template.path
			var pathTemplate = new Path(path1);
			var directions = pathTemplate.getDirections();
			console.log(directions);
			// var previousLocation = currentLocation;
			// coordinates.push(currentLocation);
			var counter = 0;
			var inc = 0.5;

			coordinates.push(currentLocation);
			interval = setInterval(function(){
				if(counter == directions.length){
					stopper(interval);
					socket.emit('finished', coordinates);
					return;
				}
				console.log("Tractor is moving: ", directions[counter]);

				var tempLocation = pathTemplate.getDestinationPoint(currentLocation, 0.5, directions[counter]);
				var distance = geolib.getDistanceSimple(currentLocation, tempLocation);
				console.log(distance);
				console.log(tempLocation);
				console.log(currentLocation);
				if(distance >= 1){
					counter++;
					coordinates.push(currentLocation);
				}
				currentLocation = tempLocation
			}, 1000);

		} else if(activity.type == 'seed'){
			// expected data are coordinates from chosen plow cycle
		} else if(activity.type == 'harvest'){
			// expected data are coordinates from chosen seed cycle
		}

		// if(data.type == 'plow'){
			// var path = new Path(data.path);
		// 	var numPushed = 1;
		// 	var counter = 0;
		// 	console.log(data.path.length);
		// 	var interval = setInterval(function(){
		// 		console.log("Tractor is moving: ", path.directions[counter]);
		// 		var coordinateData = [data.activity, currentLocation.latitude, currentLocation.longitude];
		// 		var query = "INSERT INTO coordinates (activity_id, latitude, longitude) VALUES ?";
		// 		con.query(query, [[coordinateData]], function (err, result) {
		// 			if(err){
		// 				console.log(err);
		// 				return;
		// 			}
		// 			numPushed++;
		// 			console.log(numPushed);
		// 			if(numPushed > data.path.length){
		// 				var socketData = {
		// 					message 	: "Tractor has finished " + data.type,
		// 					coordinates : coordinates,
		// 					activity_id	: data.activity
		// 				}
		// 				socket.emit('plow-finished', socketData);
		// 				stopper(interval);
		// 				return;
		// 			}	
		// 		});
		// 		coordinates.push(currentLocation = path.getDistanceFromTo(path.directions[counter], currentLocation));
		// 		counter++;
		// 	}, 1000)


		// } else if(data.type == 'seed') {
		// 	console.log(data);
		// 	var query = "SELECT coordinates.latitude, coordinates.longitude FROM activity JOIN coordinates ON activity.id=coordinates.activity_id WHERE activity.id=" + data.selected.id;
		// 	console.log(query);
		// 	con.query(query, function(err, result){
		// 		if(err){
		// 			console.log(err);
		// 			return;
		// 		}
		// 		var coordinates = []
		// 		coordinates = result;
		// 		counter = 0;
		// 		var numPushed = 0;
		// 		var interval = setInterval(function(){
		// 			var currentLocation = coordinates[counter];
		// 			var coordinateData = [data.activity, currentLocation.latitude, currentLocation.longitude]
		// 			query = "INSERT INTO coordinates (activity_id, latitude, longitude) VALUES ?";
		// 			con.query(query, [[coordinateData]], function(err, result){
		// 				if(err){
		// 					console.log(err);
		// 				}

		// 				numPushed++;
		// 				if(numPushed == coordinates.length){
		// 					var socketData = {
		// 						message 	: "Tractor has finished " + data.type,
		// 						coordinates : coordinates,
		// 						activity_id	: data.activity
		// 					}
		// 					socket.emit('plow-finished', socketData);
		// 					stopper(interval);
		// 					return;
		// 				}
		// 			});
		// 			console.log(numPushed);
		// 			counter++;
		// 		}, 1000);
		// 	});
		// 	// var query = "SELECT coordinates.latitude, coordinates.longitude FROM activity JOIN coordinates JOIN plow ON activity.id=coordinates.activity_id AND plow.id=activity.type_id WHERE activity.id=11 AND plow.template_id=21 "
		// }
		
	});

	var minPerMsq = 0.006;
	var speedKmPerHr = 1;
	socket.on('get-event-data', function(data){


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