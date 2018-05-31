var SerialPort = require('serialport');
var Readline = new SerialPort.parsers.Readline;
var serial = new SerialPort('/dev/ttyAMA0');
var parser = new ReadLine();

serial.pipe(parser);
parser.on('data', function(data){
	console.log(data);
});

module.exports = function(socket){
}
