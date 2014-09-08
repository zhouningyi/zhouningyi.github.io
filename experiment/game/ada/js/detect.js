define(function(require, exports, module) {
function Detect(){
  this.info();
  this.cookie();
}

Detect.prototype.info = function(){
  if(window.navigator){
    var platform = navigator.platform;
    // alert('您的手机型号为'+platform);
    // navigator.geolocation.getCurrentPosition(function(pos){
    //   alert('您的位置在：经度-'+pos.coords.longitude+','+'纬度：'+pos.coords.latitude);
    // })
  }
  // var geolocation = navigator.geolocation.getCurrentPosition();
}

Detect.prototype.clickStream = function(){
  
};

Detect.prototype.cookie = function(){
  var cookie = document.cookie;
  console.log(cookie);
}

module.exports = Detect;
});

