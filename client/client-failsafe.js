#!node
var client = require('./lib.js');

var env = process.env.ENVIRONMENT;

if(env=='DEV'){
  url = "https://api.dev.iag.co.nz";
} else if(env=='DEV_INTERNAL'){
  url = "https://api.dev.ldstatdv.net";
} else if(env=='PRODUCTION'){
  url = "https://api.live.iag.co.nz";
}

console.log(url);
client.getFailsafe(url).then(function(res){
    console.log(res);
})
