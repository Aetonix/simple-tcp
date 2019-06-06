var merge = require("utils-merge");
var proto = require("./proto");
var EventEmitter = require("events").EventEmitter;
var TcpServer = require("./server");

module.exports = createServer;

var base = {};

function createServer(options){
	function app(err, req, res, next){
		app._handle(req, res, next);
	}
	merge(app, proto);
	merge(app, base);
	merge(app, EventEmitter.prototype);
	app.stack = [];
	app.server = null;
	app.options = options;
	return app;
}

base.start = function(){
	this.server = this.options ? new TcpServer(this.options, this) : new TcpServer(this);
	this.server.start.apply(this.server, arguments);
	return this.server;
}

base.stop = function(){
	this.server.stop();
}