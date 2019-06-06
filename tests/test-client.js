var simpleTcp = require("../src/index");

var client = simpleTcp.createClient("localhost", 43433);

client.send("Hey Server", function(err, msg){
	console.log(msg);
	if(err)
		console.log(err);
});