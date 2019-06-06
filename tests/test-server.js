var simpleTcp = require("./src/index");

var app = simpleTcp.tcp();

app.start(28889, "localhost", "utf-8");

app.use(function(req, res, next){
	var message = req.msg;
	console.log(message);
	next(new Error("Everything is all broken forever"));
});

app.use(function(err, req, res, next){
	res.end("Hey there");
});