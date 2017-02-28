var client = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var promise = require('bluebird');

module.exports.getIndex = function(aurl){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/';

    console.log(url);

    client({
      url: url,
      method: "GET",
    },function(err,resp,body){
      console.log(res.statusCode);
      if(err!=null){
          console.log(err);
          res(resp.statusCode);
      }else{
        res(resp.statusCode);
      }
    });
  })
}

module.exports.getFailsafe = function(aurl){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/enterprise/payments/attempts/result';

    var message = JSON.stringify(request);

    client({
      url: url,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
       }
    },function(err,resp,body){
      console.log(res.statusCode);
      if(err!=null){
          console.log(err);
          res(resp.statusCode);
      }else{
        res(resp.statusCode);
      }
    });
  })
}

module.exports.postToken = function(aurl){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/direct/v1605/anonymous-access-token';

    var request = { brand: "AMI" }

    var message = JSON.stringify(request);

    client({
      url: url,
      method: "POST",
      body: message,
      headers: {
        "Content-Type": "application/json"
       }
    },function(err,resp,body){
      console.log(res.statusCode);
      if(err!=null){
          console.log(err);
          res(resp.statusCode);
      }else{
        res(resp.statusCode);
      }
    });
  })
}

global.API = module.exports;
