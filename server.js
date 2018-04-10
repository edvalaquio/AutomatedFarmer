var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var stepper = require('./stepper-socket/stepper-socket-test')(io);

// var cors = require("cors");
var port = 3000;
server.listen(port, function(){
	console.log("Listening on port: " + port);
})
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

module.exports = app;
