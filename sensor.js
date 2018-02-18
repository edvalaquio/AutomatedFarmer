var Gpio = require('onoff').Gpio;
var sleep = require('sleep');

var trigger = new Gpio(18, 'out');
var echo = new Gpio(24, 'in');

var distance = function(){
	trigger.writeSync(1);
	sleep.usleep(10);
	trigger.writeSync(0);
	
	//~ startTime = new Date();
	//~ stopTime = new Date();
	var startTime;
	var stopTime;

	while(echo.readSync() == 0){
		var temp = new Date();
		startTime = Math.round(temp.getTime() / 1000);
	}

	while(echo.readSync() == 1){
		var temp = new Date();
		stopTime = Math.round(temp.getTime() / 1000);
	}

	var timeElapsed = stopTime - startTime;
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
