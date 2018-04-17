var os = require('os');
var env = {
	'port' 	: 3000 
}

var address = os.networkInterfaces();
if(os.platform() == 'win32'){
	env.host = address['Wi-Fi'][1].address
} else {
	env.host = address['wlan0'][0].address
}

module.exports = env;