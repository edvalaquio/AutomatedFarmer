var Gpio = require('onoff').Gpio;
var sleep = require('sleep');
var Stepper = function(orange, yellow, pink, blue){
	var pins = this.setPins(orange, yellow, pink, blue);
	this.sequence = [
		[1,0,0,0],
		[1,1,0,0],
		[0,1,0,0],
		[0,1,1,0],
		[0,0,1,0],
		[0,0,1,1],
		[0,0,0,1],
		[1,0,0,1]
	]
	this.gpioPins = pins
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
	this.gpioPins.forEach(function(item){
		item.writeSync(0);
	});
}

Stepper.prototype.forward = function(){
	console.log("Moving forward...")
	for(var i = 0; i < 1024; i++){
		for(var halfstep = 0; halfstep < this.sequence.length; halfstep++){
			for(var pin = 0; pin < this.gpioPins.length; pin++){
				this.gpioPins[pin].writeSync(this.sequence[halfstep][pin]);
			}
			sleep.msleep(1);
		}
	}	
}

Stepper.prototype.reverse = function(){
	console.log("Moving backward...")
	var reverse = this.sequence;
	reverse.reverse();
	for(var i = 0; i < 1024; i++){
		for(var halfstep = 0; halfstep < reverse.length; halfstep++){
			for(var pin = 0; pin < this.gpioPins.length; pin++){
				this.gpioPins[pin].writeSync(reverse[halfstep][pin]);
			}
			sleep.msleep(1);
		}
	}
	reverse.reverse();
}

//~ var orange1 = 17;
//~ var yellow1 = 23;
//~ var pink1 = 24;
//~ var blue1 = 4;
var	motorA = new Stepper(17, 23, 24, 4);
motorA.reverse();
motorA.forward();

module.exports = Stepper;
