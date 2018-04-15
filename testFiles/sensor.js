
var Gpio = require('onoff').Gpio;
var sleep = require('sleep');

var trigger = new Gpio(18, 'out');
var echo = new Gpio(24, 'in');

var distance = function(){
	trigger.writeSync(1);
	sleep.usleep(10);
	trigger.writeSync(0);

	var startTime;
	var stopTime;

	console.log(echo.readSync());
	var start = echo.readSync();
	while(echo.readSync() == 0){

		startTime = new Date() / 1000;
	}
	console.log("Start: " + startTime);
	var end = 
	console.log(echo.readSync());
	while(echo.readSync() == 1){
		stopTime = new Date() / 1000;
	}
	console.log("Stop: " + stopTime);

	var timeElapsed = stopTime - startTime;
	console.log("Elapsed time: " + timeElapsed);
	var something = (timeElapsed * 34300) / 2;

	return something;
}

//~ console.log(distance);
//~ console.log(distance);
//~ console.log(distance);
//~ console.log(distance);

//~ var sample = setInterval

var count = 0;
while(true){
	var temp = distance();
	console.log(temp);
	
	sleep.sleep(1)
	if(count == 10){
		break;
	}
	count++;
}
