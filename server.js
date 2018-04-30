'use strict';

var app = require("./config/express.js");
var server = require('http').createServer(app);
var env = require('./env');


var mysql = require('mysql');
var con = mysql.createConnection({
	host     	: 'localhost',
	user     	: 'root',
	password 	: '',
	database	: 'automated_farmer' 	
});
 
con.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log("Successfully connected!");
	require('./api/routes.js')(app, con, env);

	var io = require('socket.io')(server);
	io.on('connection', function(socket){
		console.log("A user has connected");
		require('./farmer-modules/manual-socket.io')(socket);
		require('./farmer-modules/auto-socket.io')(socket, con);

		socket.on('disconnect', function(){
			console.log('User disconnected.');
		});
	})
	server.listen(env.port, function(){
		console.log("Listening on port: " + env.port);
	})
});
