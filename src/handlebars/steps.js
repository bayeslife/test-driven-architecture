function mysupport() {
  this.World = CustomWorld;

  this.Given(/The environment is (\w+)/, function(environment) {
    this.setEnv(environment);
  });
  
this.When(/an index.html request is sent to (.+)/, function(domain,callback) {
  var t = this;
  API.getIndex(domain).then(function(r){
    t.setStatus(r);
    callback()
  })
});

  this.When(/a anonymous-access-token request is sent to (.+)/, function(domain,callback) {
    var t = this;
    API.postToken(domain).then(function(r){
      t.setStatus(r);
      callback()
    })
  });

  this.When(/a failsafe notification request is sent to (.+) with (.+)/, function(domain,qparam,callback) {
    var t = this;
    API.getFailsafe(domain,qparam).then(function(r){
      t.setStatus(r);
      callback()
    })
  });

  this.When(/a customer-amount-owed-description request is sent to (.+) with (.+)/, function(domain,policynumber,callback) {
    var t = this;
    API.getCustomerAmountOwedDescription(domain,policynumber).then(function(r){
      t.setStatus(r);
      callback()
    })
  });

  this.When(/a policy-description request is sent to (.+) with (.+)/, function(domain,policynumber,callback) {
    var t = this;
    API.getPolicyDescription(domain).then(function(r){
      t.setStatus(r);
      callback()
    })
  });

  this.When(/a payment-attempt request is sent to (.+) with (.+)/, function(domain,policynumber,callback) {
    var t = this;
    API.postPaymentAttempt(domain,policynumber).then(function(r){
      t.setStatus(r);
      callback()
    })
  });
  this.When(/a payment-result request is sent to (.+) with (.+)/, function(domain,res,callback) {
    var t = this;
    API.postPaymentResult(domain,res).then(function(r){
      t.setStatus(r);
      callback()
    })
  });


  this.When(/the path is (.+)/, function() {
  });

  this.Then(/the result should be (\d+)/, function(number) {
    if (this.status != parseInt(number))
      throw new Error('Variable should contain ' + number +
        ' but it contains ' + this.status + '.');
  });
}
