var Gpio = require('onoff').Gpio;
var sleep = require('sleep');
var Stepper = function(orange1, yellow1, pink1, blue1, orange2, yellow2, pink2, blue2){
	this.leftMotor = this.setPins(orange1, yellow1, pink1, blue1);
	this.rightMotor = this.setPins(orange2, yellow2, pink2, blue2);
	this.leftSequence = [
		[1,0,0,0],
		[1,1,0,0],
		[0,1,0,0],
		[0,1,1,0],
		[0,0,1,0],
		[0,0,1,1],
		[0,0,0,1],
		[1,0,0,1]
	];
	this.rightSequence = [
		[1,0,0,1],
		[0,0,0,1],
		[0,0,1,1],
		[0,0,1,0],
		[0,1,1,0],
		[0,1,0,0],
		[1,1,0,0],
		[1,0,0,0]
	]
}

Stepper.prototype.setPins = function(orange, yellow, pink, blue){
	var array = [];
	var num = [orange, yellow, pink, blue];
	num.forEach(function(item){
		var temp = new Gpio(item, 'out');
		array.push(temp);
	});
	
	return array;
}

Stepper.prototype.clearPins = function(){
	this.leftMotor.forEach(function(item){
		item.writeSync(0);
	});
	this.rightMotor.forEach(function(item){
		item.writeSync(0);
	});
}

Stepper.prototype.forward = function(){
	console.log("Moving forward...");
	this.clearPins();
	for(var i = 0; i < 1024; i++){
		for(var halfstep = 0; halfstep < this.leftSequence.length || halfstep < this.rightSequence.length; halfstep++){
			for(var pin = 0; pin < this.leftMotor.length || pin < this.rightMotor.length; pin++){
				this.leftMotor[pin].writeSync(this.leftSequence[halfstep][pin]);
				this.rightMotor[pin].writeSync(this.rightSequence[halfstep][pin]);
			}
			sleep.msleep(1);
		}
	}	
	this.clearPins();
}

Stepper.prototype.reverse = function(){
	console.log("Moving backward...");
	this.clearPins();
	this.leftSequence.reverse();
	this.rightSequence.reverse();
	for(var i = 0; i < 1024; i++){
		for(var halfstep = 0; halfstep < this.leftSequence.length || halfstep < this.rightSequence.length; halfstep++){
			for(var pin = 0; pin < this.leftMotor.length || pin < this.rightMotor.length; pin++){
				this.leftMotor[pin].writeSync(this.leftSequence[halfstep][pin]);
				this.rightMotor[pin].writeSync(this.rightSequence[halfstep][pin]);
			}
			sleep.msleep(1);
		}
	}
	this.leftSequence.reverse();
	this.rightSequence.reverse();
	this.clearPins();
}

Stepper.prototype.left = function(){
	console.log("Moving left...");
	this.clearPins();
	this.rightSequence.reverse();
	for(var i = 0; i < 1024; i++){
		for(var halfstep = 0; halfstep < this.leftSequence.length || halfstep < this.rightSequence.length; halfstep++){
			for(var pin = 0; pin < this.leftMotor.length || pin < this.rightMotor.length; pin++){
				this.leftMotor[pin].writeSync(this.leftSequence[halfstep][pin]);
				this.rightMotor[pin].writeSync(this.rightSequence[halfstep][pin]);
			}
			sleep.msleep(1);
		}
	}
	this.rightSequence.reverse();
	this.clearPins();
}


Stepper.prototype.right = function(){
	console.log("Moving right...");
	this.clearPins();
	this.leftSequence.reverse();
	for(var i = 0; i < 1024; i++){
		for(var halfstep = 0; halfstep < this.leftSequence.length || halfstep < this.rightSequence.length; halfstep++){
			for(var pin = 0; pin < this.leftMotor.length || pin < this.rightMotor.length; pin++){
				this.leftMotor[pin].writeSync(this.leftSequence[halfstep][pin]);
				this.rightMotor[pin].writeSync(this.rightSequence[halfstep][pin]);
			}
			sleep.msleep(1);
		}
	}
	this.leftSequence.reverse();
	this.clearPins();
}



//~ var motors = new Stepper(2, 3, 4, 17, 27, 22, 10, 9);
//~ motors.clearPins();
//~ motors.forward();
//~ motors.reverse();
//~ motors.left();
//~ motors.right();
//~ motors.clearPins();

module.exports = Stepper;
