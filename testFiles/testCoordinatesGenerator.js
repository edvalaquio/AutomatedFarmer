var geolib = require('geolib');
var fs = require('fs');

var limX = 10;
var limY = 10;
outputFileName = "test_North_10s.json";

var coordinates = [];
var dist = 0.5;
var bearing = 0;
var initialPoint = {latitude: 51.516272, longitude: 0.45425}
var shift = false;
coordinates.push(initialPoint)
for(var i = 1; i < 2*(limX*limY); i++){
	if(i >= (2*limX)){
		if(i % (2*limX) == 0){
			bearing = 90;
		} else if((i % (2*limX) == 1) && (shift)){
			bearing = 0;
			shift = !shift;
		} else if((i % (2*limX) == 1) && (!shift)){
			bearing = 180;
			shift = !shift;
		}
	}
	var tempCoord = geolib.computeDestinationPoint(initialPoint, dist, bearing);
	coordinates.push(tempCoord);
	initialPoint = tempCoord;
}

console.log(coordinates.length);

fs.writeFile(outputFileName, JSON.stringify(coordinates), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(outputFileName);
});