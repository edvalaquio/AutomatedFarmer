var numUsers = 0;
var geolib = require('geolib');

// var stepper = require('./stepper');
// var gps = require('./../gps/gps-module-test');
// var location = new gps('test_North_5s.json');
// var motors = new stepper(2, 3, 4, 17, 27, 22, 10, 9);



// var index = 0;
// var startPoint = location.getCurrentPosition();
// while(true){
// 	var currentLocation = location.getCurrentPosition();
// 	console.log(index + ", " + currentLocation + ", " + sampleInput[index]);

// 	if(sampleInput[index] == 'End'){
// 		break;
// 	}

// 	if(location.getDistance(startPoint, currentLocation) == 1){
// 		index++;
// 		startPoint = currentLocation;
// 	}
// }

var Path = function(input){
	this.path = input;
	this.directions = this.getDirections(input);
	this.testCoordinates = this.getTestGPS();
}

Path.prototype.getDirections = function(input){
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

Path.prototype.getDistanceFromTo = function(face, currentPoint){

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
	return geolib.computeDestinationPoint(currentPoint, 1, bearing);

}


var stopper = function(name){
	clearInterval(name);
}

module.exports = function(socket, con){
	socket.on('generate-dummy-data', function(data){

		var currentLocation = {latitude: 51.516272, longitude: 0.45425};
		var coordinates = [];
		coordinates.push(currentLocation);

		if(data.type == 'plow'){
			var path = new Path(data.path);
			var numPushed = 1;
			var counter = 0;
			console.log(data.path.length);
			var interval = setInterval(function(){
				console.log("Tractor is moving: ", path.directions[counter]);
				var coordinateData = [data.activity, currentLocation.latitude, currentLocation.longitude];
				var query = "INSERT INTO coordinates (activity_id, latitude, longitude) VALUES ?";
				con.query(query, [[coordinateData]], function (err, result) {
					if(err){
						console.log(err);
						return;
					}
					numPushed++;
					console.log(numPushed);
					if(numPushed > data.path.length){
						var socketData = {
							message 	: "Tractor has finished " + data.type,
							coordinates : coordinates,
							activity_id	: data.activity
						}
						socket.emit('plow-finished', socketData);
						stopper(interval);
						return;
					}	
				});
				coordinates.push(currentLocation = path.getDistanceFromTo(path.directions[counter], currentLocation));
				counter++;
			}, 1000)


		} else if(data.type == 'seed') {
			console.log(data);
			var query = "SELECT coordinates.latitude, coordinates.longitude FROM activity JOIN coordinates ON activity.id=coordinates.activity_id WHERE activity.id=" + data.selected.id;
			console.log(query);
			con.query(query, function(err, result){
				if(err){
					console.log(err);
					return;
				}
				var coordinates = []
				coordinates = result;
				counter = 0;
				var numPushed = 0;
				var interval = setInterval(function(){
					var currentLocation = coordinates[counter];
					var coordinateData = [data.activity, currentLocation.latitude, currentLocation.longitude]
					query = "INSERT INTO coordinates (activity_id, latitude, longitude) VALUES ?";
					con.query(query, [[coordinateData]], function(err, result){
						if(err){
							console.log(err);
						}

						numPushed++;
						if(numPushed == coordinates.length){
							var socketData = {
								message 	: "Tractor has finished " + data.type,
								coordinates : coordinates,
								activity_id	: data.activity
							}
							socket.emit('plow-finished', socketData);
							stopper(interval);
							return;
						}
					});
					counter++;
				}, 1000);
			});
			// var query = "SELECT coordinates.latitude, coordinates.longitude FROM activity JOIN coordinates JOIN plow ON activity.id=coordinates.activity_id AND plow.id=activity.type_id WHERE activity.id=11 AND plow.template_id=21 "
		}
		
	})	
}