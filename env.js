var os = require('os');
var env = {
	'port' 	: 3000 
}

// console.log(os.platform())
// console.log(os.networkInterfaces())

var address = os.networkInterfaces();
if(address['Wi-Fi']){
	env.host = address['Wi-Fi'][1].address
} else if(address['wlan0']){
	env.host = address['wlan0'][0].address
} else {
	env.host = '127.0.0.1'
}

module.exports = env;