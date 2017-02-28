#!node
var client = require('./lib.js');

var environment = require("./environment.js");

var url = environment.config(process.env.ENVIRONMENT)

console.log(url);
client.postToken(url).then(function(res){
    console.log(res);
})
