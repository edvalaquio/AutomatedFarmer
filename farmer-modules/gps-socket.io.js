
var serial = require('serialport');
var nmea = require('nmea')


module.exports = function(socket){
	var port = new serialport.SerialPort('/dev/ttyAMA0', {
		baudrate: 9600,
		parser: serialport.parsers.readline('\r\n')});

	port.on('data', function(line) {
		console.log(nmea.parse(line));
	});

}