var client = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var promise = require('bluebird');

module.exports.sendRequest = function(aurl){
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

global.APIFailsafe = module.exports;
