var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var env = require('./env');
var _ = require('lodash');
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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getSocketData', function(req, res){
	res.send(env.host);
});

app.get('/getLots', function(req, res){
	con.query("SELECT * FROM lot", function (err, result, fields) {
		if (err){
			res.send(err);
		};

		var data = [];
		result.forEach(function(item){
			data.push({
				'lot_id' 		: item.lot_id,
				'lot_name'		: item.lot_name,
				'lot_address' 	: item.lot_brgy + ", " + item.lot_town + ", " + item.lot_province
			})
		})
		res.send(data);
	});
});

app.post('/addLot', function(req, res){
	var query1 = "SELECT MAX(lot_id) FROM lot;";
	var lot_details = []
	con.query(query1, function(err, result){
		lot_details.push(result[0]['MAX(lot_id)'] + 1);
		lot_details = lot_details.concat(_.map(req.body));
		console.log(lot_details);
		var query2 = "INSERT INTO lot (lot_id, lot_name, lot_province, lot_town, lot_brgy, lot_length, lot_width) VALUES (" + lot_details + ");";

		con.query(query2, function (err, result, fields) {
			if(err){
				console.log(err);
				res.send("Error");
			} else {
				console.log("These is success!");
				res.send("Success");
			}
		});
	})
});

