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

Path.prototype.getFromTo = function(face, currentPoint){

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

module.exports = function(socket, con){
	socket.on('generate-dummy-data', function(data){
		console.log(data);
		if(data.type == 'plow'){
			var path = new Path(data.path);
			
			var currentLocation = {latitude: 51.516272, longitude: 0.45425};
			var coordinates = [];
			coordinates.push(currentLocation);
			var numPushed = 1;
			var query = "INSERT INTO plow_coordinates (plow_id, latitude, longitude) VALUES ?";
			for(var i = 0; i < path.directions.length; i++){
				
				var coordinateData = [data.id, currentLocation.latitude, currentLocation.longitude];
				con.query(query, [[coordinateData]], function (err, result) {
					if(err){
						console.log(err);
						return;
					}
					numPushed++;
					console.log(numPushed);
					console.log(data.path.length);
					if(numPushed == data.path.length){
						var socketData = {
							message 	: "Tractor has finished plowing",
							coordinates : coordinates
						}
						socket.emit('plow-finished', socketData);
					}	
				});

				currentLocation = path.getFromTo(path.directions[i], currentLocation);
				coordinates.push(currentLocation);
				console.log("Tractor is moving: ", path.directions[i]);
			}	

		} else {
			// do something
		}
	})	
}