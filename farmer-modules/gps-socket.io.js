var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;


module.exports = function(socket){


	var serial = new SerialPort('/dev/ttyAMA0');
	var parser = new Readline();
	var gpgga_array = [];
	serial.pipe(parser);

	parser.on('data', function(data){
		if(data.startsWith("$GPGGA")){
			gpgga_array.push(data);
		}
	});

	socket.on('request-gps-data', function(data){

		var labels = ['label', 'time', 'latitude', 'latDirection', 'longitude', 'lonDirection', 
		'quality', 'numSat', 'horPosition', 'altitude', 'height', 'geoSep', 'geoMet', 'age', 
		'statID', 'checksum'];

		var temp = gpgga_array[gpgga_array.length - 1].split(',');
		var gpgga = {};
		labels.forEach(function(item, index){
			gpsData[item] = temp[index];
		})

		socket.emit('gps-data', gpgga);
	});

}
