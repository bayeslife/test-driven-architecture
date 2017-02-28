
module.exports.config = function(env){
  url = "http://localhost";
  if(env=='MOCK'){
    url = "https://localhost:1080";
  } else if(env=='DEV'){
    url = "https://api.dev.iag.co.nz";
  } else if(env=='DEV_INTERNAL'){
    url = "https://api.dev.ldstatdv.net";
  } else if(env=='PRODUCTION'){
    url = "https://api.live.iag.co.nz";
  }
  return url;
}
