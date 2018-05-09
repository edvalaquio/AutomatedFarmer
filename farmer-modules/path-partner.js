var geolib = require('geolib');

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

module.exports = Path;