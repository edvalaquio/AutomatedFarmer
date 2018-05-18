var os = require('os');
var env = {
	port 	: 3000,
	host	: '127.0.0.1'
}
console.log(os.platform());
// if()
env.db = {
	host     	: env.host,
	user     	: 'root',
	password 	: '',
	database	: 'automated_farmer' 	
}

env.host = '127.0.0.1'
module.exports = env;