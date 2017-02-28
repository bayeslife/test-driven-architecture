#!node
var client = require('./lib.js');

//var environment = require("./environment.js");

//var url = environment.config(process.env.ENVIRONMENT)

var url = "https://api.dev.iag.co.nz";
var url2 = "https://w12dvdidesb01.ldstatdv.net:7024";
var polnum="R123";

console.log(url);
client.postToken(url).then(function(res){
    client.getCustomerAmountOwedDescription(url2,polnum).then(function(res){
      console.log(res);
    })
})
