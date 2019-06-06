var EventEmitter = require("events").EventEmitter;
var net = require("net");
var util = require("util");
var debug = require("debug")("Server");

function TcpServer(options, handler){
	EventEmitter.call(this);
	
	if(!handler){
		handler = options;
		options = {};
	}
	
	this.handler = handler;
	this.server = null;
}

util.inherits(TcpServer, EventEmitter);

function Req(msg){
	this.msg = msg;
	this.raw = msg;
}

function Res(socket){
	this.ack = "";
	this.end = function(ack){
		debug("Sending Ack message to Client");
		socket.write(ack.toString());
	}
}

TcpServer.prototype.start = function(port, address, encoding, options){
	var self = this;
	options = options || {};
	console.log("Starting Server");
	this.server = net.createServer(function(socket){
		socket.on("data", function(data){
			try {
				var req = new Req(data.toString());
				var res = new Res(socket);
				self.handler(null, req, res);
			} catch (err){
				self.handler(err);
			}
		}).setEncoding(encoding ? encoding : "utf-8");
	});
	this.server.listen(port, address ? address : "0.0.0.0");
}

TcpServer.prototype.stop = function(){
	this.server.close();
}

module.exports = TcpServer;