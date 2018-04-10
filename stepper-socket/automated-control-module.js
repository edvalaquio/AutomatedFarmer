
var numUsers = 0;
// var stepper = require('./stepper');
var gps = require('./../gps/gps-module-test');
var location = new gps('test_North_5s.json');
// var motors = new stepper(2, 3, 4, 17, 27, 22, 10, 9);

var sampleInput = [

	"Up", "Up", "Up", "Up", "Right", 
	"Down", "Down", "Down", "Down", "Right",
	"Up", "Up", "Up", "Up", "Right", 
	"Down", "Down", "Down", "Down", "Right",
	"Up", "Up", "Up", "Up",  "End" 

]

var index = 0;
var startPoint = location.getCurrentPosition();
while(true){
	var currentLocation = location.getCurrentPosition();
	console.log(index + ", " + currentLocation + ", " + sampleInput[index]);

	if(sampleInput[index] == 'End'){
		break;
	}

	if(location.getDistance(startPoint, currentLocation) == 1){
		index++;
		startPoint = currentLocation;
	}
}