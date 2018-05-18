var os = require('os');
var env = {
	port 	: 3000,
	host	: '127.0.0.1'
}
console.log(os.arch());

// if()
env.db = {
	host     	: env.host,
	user     	: 'root',
	password 	: '',
	database	: 'automated_farmer' 	
}

if(os.platform() == 'linux' && os.arch() == 'arm'){
	env.db.socketPath = "/var/run/mysqld/mysqld.sock";
}

env.host = '127.0.0.1'
module.exports = env;
