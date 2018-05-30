
var serial = require('serialport');
// var nmea = require('nmea')


module.exports = function(socket){
	var serialport = require("serialport");
	var SerialPort = serialport.SerialPort;
	var sp = new SerialPort("/dev/ttyAMA0", {
		baudrate:9600,
		databits: 8,
		parity: 'none',
		stopBits: 1,
		flowControl: false,
		parser: serialport.parsers.readline("\n"),
	});

	sp.on('open', function() {
		console.log('open');
		sp.on('data', function(data) {
			console.log('data received: ' + data);
		});
	});

}