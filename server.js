var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var env = require('./env');
// console.log(address['Wi-Fi'][1].address);
var farmer = require('./farmer-modules/farmer-socket.io')(server);

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


app.get('/getSocketData', function(req, res){
	res.send(env.host);
});
