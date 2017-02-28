#!node
var client = require('./lib.js');

var env = process.env.ENVIRONMENT;
url = "https://pay.dev.ami.co.nz";

if(env=='DEV'){
  url = "https://pay.dev.ami.co.nz";
} else if(env=='DEV_INTERNAL'){
  url = "https://pay.ami.dev.ldstatdv.net";
} else if(env=='PRODUCTION'){
  url = "https://api.live.iag.co.nz";
}


console.log(url);
client.getIndex(url).then(function(res){
    console.log(res);
})
