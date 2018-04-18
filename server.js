var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var env = require('./env');
var farmer = require('./farmer-modules/farmer-socket.io')(server);

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

	console.log('connected as id ' + con.threadId);
	server.listen(env.port, function(){
		console.log("Listening on port: " + env.port);
	})
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(function(req, res, next) {
		console.log(`${req.method} request for '${req.url}'`);
		next();
	});
});
app.get('/getSocketData', function(req, res){
	res.send(env.host);
});
app.get('/getLotData', function(req, res){
	con.query("SELECT * FROM lot", function (err, result, fields) {
		if (err){
			console.log(err);
			res.send(err);
		};
		console.log(result);
		res.send(result);
	});
});

