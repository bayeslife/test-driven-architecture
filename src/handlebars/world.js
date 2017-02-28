var CustomWorld = function() {
};

CustomWorld.prototype.environment = "DEV";
CustomWorld.prototype.status = 0;

CustomWorld.prototype.setEnv = function(e) {
  CustomWorld.prototype.environment =e;
};

CustomWorld.prototype.setStatus = function(s) {
  CustomWorld.prototype.status =s;
};
