'use strict';

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
	console.log("Successfully connected!");
	server.listen(env.port, function(){
		console.log("Listening on port: " + env.port);
	})
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/getSocketData', function(req, res){
	res.send(env.host);
});

app.get('/getLots', function(req, res){
	var query = "SELECT lot_id, lot_name, lot_province, lot_town, lot_brgy FROM lot;";
	con.query(query, function (err, result, fields) {
		if (err){
			res.send(err);
			return;
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

app.get('/getLot/:lotid', function(req, res){
	var query = "SELECT * FROM lot WHERE lot_id=" + req.params.lotid + ";";
	con.query(query, function (err, result, fields) {
		if (err){
			res.send(err);
			return;
		};
		res.send(result[0]);
	});
});

app.post('/addLot', function(req, res){
	var query1 = "SELECT MAX(lot_id) FROM lot;";
	var lotDetails = []
	con.query(query1, function(err, result){
		if(err){
			console.log(err);
			console.log("Error");
			return;
		}
		lotDetails.push(result[0]['MAX(lot_id)'] + 1);
		lotDetails = lotDetails.concat(_.map(req.body));
		console.log(lotDetails);
		var query2 = "INSERT INTO lot (lot_id, lot_name, lot_province, lot_town, lot_brgy, lot_length, lot_width) VALUES (" + lotDetails + ");";
		con.query(query2, function (err, result, fields) {
			if(err){
				console.log(err);
				res.send("Error");
				return;
			}
			console.log("These is success!");
			res.send({
				lotid 	: lotDetails[0]
			});
		});
	})
});

