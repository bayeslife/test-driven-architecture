var client = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var promise = require('bluebird');

var thetoken="";

module.exports.getIndex = function(aurl){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/';

    console.log(url);

    client({
      url: url,
      method: "GET",
      //mode: 'no-cors'
    },function(err,resp,body){
       if(err)
          console.log(err);
        handleResponse(res,err,resp,body);
    });
  })
}

module.exports.getFailsafe = function(aurl,qp){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/enterprise/payments/attempts/result';

    client({
      url: url,
      method: "GET",
      qs: {
        result: qp
      },
      headers: {
        "Content-Type": "application/json"
       }
    },function(err,resp,body){
        handleResponse(res,err,resp,body);
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
        "Content-Type": "application/json",
        "Authorization": 'Negotiate'
       }
    },function(err,resp,body){
        if(err==null){
          thetoken = JSON.parse(body).token;
        }
        handleResponse(res,err,resp,body);
    });
  })
}

module.exports.getCustomerAmountOwedDescription = function(aurl,policynumber){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/direct/customer-amount-owed-description';

    client({
      url: url,
      headers: {
        "Authorization": "Bearer "+thetoken
      },
      qs: {
        policyNumber: policynumber
      },
      method: "GET",
    },function(err,resp,body){
        handleResponse(res,err,resp,body);
    });
  })
}

module.exports.postPaymentAttempt = function(aurl,policyNumber){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/enterprise/payments/v1605/attempts';

    client({
      url: url,
      headers: {
        "Authorization": "Bearer "+thetoken
      },
      body: JSON.stringify({
        policyNumber: policyNumber,
        paymentChannel: 'ONLINE_PAYMENT'
      }),
      method: "POST",
    },function(err,resp,body){
        handleResponse(res,err,resp,body);
    });
  })
}

module.exports.postPaymentResult = function(aurl,result){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/enterprise/payments/v1605/results';

    client({
      url: url,
      headers: {
        "Authorization": "Bearer "+thetoken
      },
      qs: {
        result: result
      },
      method: "GET",
    },function(err,resp,body){
        handleResponse(res,err,resp,body);
    });
  })
}

module.exports.getPolicyDescription = function(aurl,policyNumber){
  return new Promise(function(res,rej){
    var url = aurl;

    url = url +'/direct/policies/'+policynumber+'/v1604/description';

    client({
      url: url,
      headers: {
        "Authorization": "Bearer "+thetoken
      },
      method: "GET",
    },function(err,resp,body){
        handleResponse(res,err,resp,body);
    });
  })
}


function handleResponse(res,err,resp,body){
    if(err!=null){
        console.log(err);
        if(resp!=null)
          res(resp.statusCode);
        else {
          res(err);
        }
    }else{
      res(resp.statusCode);
    }
  }

global.API = module.exports;
