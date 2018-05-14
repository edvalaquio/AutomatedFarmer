var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
console.log(__dirname);
app.use(express.static(path.join(__dirname, '/../public')));

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
module.exports = app;