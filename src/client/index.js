var TcpClient = require("./client");

module.exports = function() {
		if(arguments.length === 2){
			return new TcpClient(arguments[0], arguments[1]);
		} else {
			return new TcpClient(arguments[0]);
		}
	}