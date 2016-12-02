var mongo = require('mongodb');
var Server = mongo.Server,
	Db = mongo.Db;
	
function openDB(ip, port, db_name, callback){
	var server = new Server(ip, port, {auto_reconnect: true });
	DB = new Db(db_name, server);
	DB.open(function(err, db) {
		if(!err && db){
		 	console.log("Connected", db.databaseName, db.serverConfig.host, db.serverConfig.port);
		 	callback(true);
		}else{
			console.log(err, db);
		 	callback(false);
		}
	});
};
// server config
var server_ip = 'localhost',
	port = 27017,
	db_name = 'bing';

openDB(server_ip, port, db_name, function(flag){
	if(flag == false){
		console.log("Can't mongodb connection with DB Farm");
	}
});