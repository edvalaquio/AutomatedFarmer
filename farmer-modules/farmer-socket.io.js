module.exports = function(server){
	var io = require('socket.io')(server);
	io.on('connection', function(socket){
		console.log("A user has connected.");

		var gps = require('./../gps/gps-module-test');
		var stepper = require('./stepper-module');
		var motor = new stepper(2, 3, 4, 17, 27, 22, 10, 9);

		socket.on('disconnect', function(){
			console.log('User disconnected.');
		});

		socket.on('manual-move', function(direction){
			motor.clearPins();
			if(direction == "up"){
				motor.forward()
			} else if(direction == "down"){
				motor.reverse()
			} else if(direction == "left"){
				motor.left()
			} else if(direction == "right"){
				motor.right()
			}

			// Supply GPS coordinates after moving a few steps in this part.
			console.log("Tr actor is moving: " + direction);
		});

		socket.on('auto-move', function(directionArray){
			var directionArray = [
				"up", "up", "up", "up", "right", 
				"down", "down", "down", "down", "right",
				"up", "up", "up", "up", "right", 
				"down", "down", "down", "down", "right",
				"up", "up", "up", "up",  "end" 
			]      
			motor.clearPins();
		})

		socket.on('stop', function(){
			motor.clearPins();
		});

	});
}
