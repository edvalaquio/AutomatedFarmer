var geolib = require('geolib');
var fs = require('fs');
var path = require('path');
// var coordinates = ;

var Gps = function(){
	// var directory = __dirname;
	// console.log(directory.split("\\"));
	// this.coordinates = JSON.parse(fs.readFileSync(__dirname  + testFile));
	this.coordinates = JSON.parse(fs.readFileSync('gps\\test_North_5s.json'));
};

Gps.prototype.getDistance = function(start, end){
	return geolib.getDistance(start, end);
};

Gps.prototype.getCurrentPosition = function(){
	return this.coordinates.pop();
};

module.exports = Gps;