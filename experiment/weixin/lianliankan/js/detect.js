define(function(require, exports, module) {
function Detect(){


}
Detect.prototype.basic = function(){
  var obj = this.obj = {};
  this.info();
  this.weixin();
  var result = ''
  for(var name in obj){
    result+='&' + name +'='+ obj[name];
  }
  result = '?' + result.substring(1,result.length);

  return result;
}
Detect.prototype.info = function(){
  var n = window.navigator;
  var obj = this.obj;
  if(n){
    obj.platform = n.platform;
    obj.product = n.product;
    obj.vendor = n.vendor;
  }
};

Detect.prototype.weixin = function(obj){
  var code = getQueryString("code");
  var obj = this.obj;
  if(window.location){
    var from = window.location.search.split('?')[1];
    obj.from = from;
    obj.code = code;
  }
}

Detect.prototype.clickStream = function(){
  
};

Detect.prototype.cookie = function(){
  var cookie = document.cookie;
}

  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

module.exports = Detect;
});

