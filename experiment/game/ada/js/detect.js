define(function(require, exports, module) {
function Detect(){
  // this.info();
  // this.cookie();

}

Detect.prototype.info = function(){
  var n = window.navigator;
  if(n){
    return {'platform':n.platform,'product':n.product,'vendor':n.vendor};
  }
  return {'platform':null,'product':null,'vendor':null};
}

Detect.prototype.clickStream = function(){
  
};

Detect.prototype.cookie = function(){
  var cookie = document.cookie;
  console.log(cookie);
}

module.exports = Detect;
});

