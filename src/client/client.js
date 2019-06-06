var net = require("net");
var debug = require("debug")("Client");

function TcpClient(){
	this.options = {};
	if(arguments.length === 2){
		this.options.host = arguments[0];
		this.options.port = arguments[1];
	} else if (arguments.length === 1){
		this.options = arguments[0];
	}
	this.host = this.options.host;
	this.port = this.options.port;
	this.callback = this.options.callback;
	this.keepalive = this.options.keepalive;
	this.awaitingResponse = false;
}

TcpClient.prototype.connect = function(callback){
	var self = this;
	self.client = net.connect(self.port, self.host, function(){
		debug("Client has connected");
		self.client.on("data", function(data){
			self.awaitingResponse = false;
			self.callback(null, data.toString());
			if(!self.keepalive)
				self.close();
		});
		callback();
		self.client.on("error", function(err){
			callback(err);
		});
	});
}

TcpClient.prototype.send = function(msg, callback){
	var self = this;
	self.callback = callback || self.callback;
	if(self.awaitingResponse){
		self.callback(new Error("Can't send while awaiting response"));
	}
	self.awaitingResponse = true;
	try {
		if(self.client){
			self.client.write(msg.toString());
			debug("Sending message to server");
		} else {
			self.connect(function(err){
				if(err) return self.callback(err);
				self.awaitingResponse = true;
				self.client.write(msg.toString());
				debug("Sending message to server");
			});
		}
	} catch(e){
		self.callback(e);
	}
}

TcpClient.prototype.close = function(){
	var self = this;
	if(self.client){
		self.client.end();
		delete self.client;
	}
}

module.exports = TcpClient;

