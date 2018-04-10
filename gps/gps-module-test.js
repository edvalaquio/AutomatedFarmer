var geolib = require('geolib');
var fs = require('fs');
// var coordinates = ;

var Gps = function(testFile){
	this.coordinates = JSON.parse(fs.readFileSync('../testFiles/' + testFile));
	// this.coordinates = JSON.parse(fs.readFileSync('../testFiles/test_North_10s.json'));
};

Gps.prototype.getDistance = function(start, end){
	return geolib.getDistance(start, end);
};

Gps.prototype.getCurrentPosition = function(){
	return this.coordinates.pop();
};

module.exports = Gps;