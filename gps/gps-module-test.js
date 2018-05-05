var geolib = require('geolib');
var fs = require('fs');
var path = require('path');
// var coordinates = ;

var Gps = function(){
	// var directory = __dirname;
	// console.log(directory.split("\\"));
	// this.coordinates = JSON.parse(fs.readFileSync(__dirname  + testFile));
	// this.coordinates = JSON.parse(fs.readFileSync('gps\\test_North_5s.json'));
	this.currentLocation = {latitude: 51.516272, longitude: 0.45425};
};

Gps.prototype.getDistance = function(start, end){
	return geolib.getDistance(start, end);
};

Gps.prototype.getCurrentPosition = function(){
	// test only.
	return this.currentLocation;
};

Gps.prototype.changeCurrentPosition = function(position){
	this.currentLocation = position;
};

Gps.prototype.getNextPosition = function(){
	
}

module.exports = Gps;