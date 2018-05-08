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
	var query = "INSERT INTO " + tableName + " (" + columns + ") VALUES ?";
	sf.con.query(query, [[data]], function(err, result){
		if(err){
			console.log(err);
			sf.serverSender(res, err, "Error in inserting to: " + tableName);
			return;
		}
		if(!res){
			// console.log("Successfully inserted into coordinates");
			return {
				data 	: result,
				message : "Successfully inserted into coordinates"
			};
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

ServerFunctions.prototype.serverUpdater = function(res, tableName, columns, where, data){
	var sf = this;

	var set = function(columns, data){
		var temp = ""
		var i = 0;
		while(true){
			temp += columns[i] + "=" + data[i];
			if(i == columns.length){return temp;}
			temp += ",";
			i++;
		}
	}

	var query = "UPDATE " + tableName + " SET " + set(columns, data) + where;
	sf.con.query(query, function(err, result){
		if(err){
			console.log(err);
			sf.serverSender(res, err, "Error in updating: " + tableName);
			return;
		}
		sf.serverSender(res, result, "Successfully updated: " + tableName);
	});

};

ServerFunctions.prototype.insertWithPromise = function(tableName, columns, data){
	var sf = this;

	columns = columns.join(', ');
	var query = "INSERT INTO " + tableName + " (" + columns + ") VALUES ?";
	return new Promise(function(resolve, reject){
		sf.con.query(query, [[data]], function(err, result){
			if(err){ return reject(err); }
			resolve({
				data 	: result.insertId,
				message : "Successfully inserted coordinates!"
			});
		});
	});
}

ServerFunctions.prototype.selectWithPromise = function(tableName, columns, on, where, filter){
	var sf = this;

	columns = columns.join(', ');
	var query = "SELECT " + columns + " FROM " + tableName + on + where;
	return new Promise(function(resolve, reject){
		sf.con.query(query, function(err, result){
			if(err){ return reject(err); }
			resolve({
				data 	: result,
				message : "Successfully selected from coordinates!"
			});
		});
	});
}

ServerFunctions.prototype.updateWithPromise = function(tableName, column, where, data){
	var sf = this;
	var set = function(columns, data){
		var temp = ""
		var i = 0;
		while(true){
			temp += columns[i] + "=" + data[i];
			if(i == columns.length){return temp;}
			temp += ",";
			i++;
		}
	}
	var query = "UPDATE " + tableName + " SET " + set(columns, data) + where;
	return new Promise(function(resolve, reject){
		sf.con.query(query, function(err, result){
			if(err){return reject(err)};
			resolve({
				data 	: result,
				message : "Successfully updated table!"
			});
		});
	});
}

module.exports = ServerFunctions;