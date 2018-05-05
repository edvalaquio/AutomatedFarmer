var ServerFunctions = function(con){
	this.con = con;
}

ServerFunctions.prototype.serverSender = function(res, data, message){
	res.send({
		data: data,
		message: message 
	});
};

ServerFunctions.prototype.serverInserter = function(res, tableName, columns, data){
	var sf = this;

	columns = columns.join(', ');
	var query = "INSERT INTO " + tableName + " (" + columns + ") VALUES ?"
	sf.con.query(query, [[data]], function(err, result){
		if(err){
			console.log(err);
			sf.serverSender(res, err, "Error in inserting to: " + tableName);
			return;
		}
		console.log(result);
		sf.serverSender(res, result.insertId, "Successfully inserted into: " + tableName);
		return;
	});
};

ServerFunctions.prototype.serverSelector = function(res, tableName, columns, on, where, filter){
	var sf = this;
	
	columns = columns.join(', ');
	// var values;
	var query = "SELECT " + columns + " FROM " + tableName + on + where;
	console.log(query);
	sf.con.query(query, function(err, result){
		if(err){
			console.log(err);
			sf.serverSender(res, err, "Error in selecting from: " + tableName);
			return;
		}
		if(filter){
			result = filter(result);
		}
		sf.serverSender(res, result, "Successfully selected from: " + tableName);
	});
};

module.exports = ServerFunctions;