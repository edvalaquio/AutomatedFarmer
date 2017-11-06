'use strict';

var express = require('express');
var cors = require("cors");


module.exports = function(){
	var app = express();
	app.set('port', 3000);
	app.use(express.static(path.resolve('./public')));
}