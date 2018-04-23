'use strict';

var app = require("./config/express.js");
// var path = require('path');
// var bodyParser = require('body-parser');
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
	require('./farmer-modules/farmer-socket.io')(server);
	server.listen(env.port, function(){
		console.log("Listening on port: " + env.port);
	})
});
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
// 	console.log(`${req.method} request for '${req.url}'`);
// 	next();
// });

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json());