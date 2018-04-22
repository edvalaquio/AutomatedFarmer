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

// ***************************************************
// EXPRESS ROUTES

app.get('/getSocketData', function(req, res){
	res.send(env.host);
});

app.get('/getLots', function(req, res){
	var query = "SELECT id, name, province, town, brgy FROM lot;";
	con.query(query, function (err, result, fields) {
		if (err){
			res.send(err);
			return;
		};
		var data = [];
		result.forEach(function(item){
			data.push({
				'id' 		: item.id,
				'name'		: item.name,
				'address' 	: item.brgy + ", " + item.town + ", " + item.province
			})
		})
		res.send(data);
	});
});

app.get('/getLot/:lotid', function(req, res){
	var query = "SELECT * FROM lot WHERE id=" + req.params.lotid + ";";
	con.query(query, function (err, result, fields) {
		if (err){
			res.send(err);
			return;
		};
		res.send(result[0]);
	});
});

app.post('/addLot', function(req, res){

	var lotDetails = [];
	lotDetails = _.map(req.body);
	var query2 = "INSERT INTO lot (name, province, town, brgy, length, width) VALUES ?";
	con.query(query2, [[lotDetails]], function (err, result, fields) {
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
});

app.post('/addActivity', function(req, res){
	console.log(req.body);
	var activityDetails = req.body;
	var temp = [];
	for(var i = 0; i < activityDetails.path.length; i++){
		for(var j = 0; j < activityDetails.path[i].length; j++){
			temp.push('(' + i + ',' + j + ')');
		}
	}
	activityDetails.path = JSON.stringify(temp);
	activityDetails = _.map(activityDetails);
	console.log(activityDetails);
	var query = "INSERT INTO activitiy (label, date, type, path, startpoint, direction, lot_id) VALUES ?"
	con.query(query, [[activityDetails]], function (err, result, fields) {
		if(err){
			console.log(err);
			res.send("Error");
			return;
		}
		console.log("These is success!");
		res.send("Success!");
	});

	// label, date, type, path, start_time, end_time, lot_id
})
