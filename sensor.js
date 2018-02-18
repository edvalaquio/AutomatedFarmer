var Gpio = require('onoff').Gpio;
var sleep = require('sleep');

var trigger = new Gpio(18, 'out');
var echo = new Gpio(24, 'in')

var distance = function(){
	trigger.writeSync(1);
	sleep.msleep(1);

	trigger.writeSync(0);
	startTime = new Date();
	stopTime = new Date();

	while echo.readSync() == 0{
		startTime = new Date();
	}

	while echo.readSync() == 1{
		stopTime = new Date();
	}

	timeElapsed = stopTime - startTime;
	something = (timeElapsed * 34300) / 2;

	return something;
}

console.log(distance);
console.log(distance);
console.log(distance);
console.log(distance);

