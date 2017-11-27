var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var cors = require("cors");
var port = 3000;
server.listen(port, function(){
	console.log("Listening on port: " + port);
})
app.use(express.static(path.join(__dirname, 'public')));

var numUsers;
var stepper = require('./stepper');
var motor = new stepper(17, 23, 24, 4);
io.on('connection', function(socket){
	numUsers++;
	console.log("A user has connected.");
	socket.on('disconnect', function(){
		console.log('User disconnected.');
		numUsers--;
	});
	socket.on('move', function(direction){
		//~ console.log(stepper);
		motor.clearPins();
		if(direction == "up"){
			motor.forward();
		} else if(direction == "down"){
			motor.reverse();
		}
		motor.clearPins();
		console.log("Tractor is moving: " + direction);
	});
});

// app.use(function(req, res, next) {
// 	console.log(`${req.method} request for '${req.url}'`);
// 	next();
// });

// app.use(express.static("./public"));

// app.use(cors());

// app.listen(3000);

// console.log("Express app running on port 3000");

// module.exports = app;
