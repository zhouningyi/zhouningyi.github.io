define(function(require, exports, module) {
function Detect(){
  this.info();
}

Detect.prototype.info = function(){
  if(window.navigator){
    var platform = navigator.platform;
    alert('您的手机型号为'+platform);
    navigator.geolocation.getCurrentPosition(function(pos){
      alert('您的位置在：经度-'+pos.coords.longitude+','+'纬度：'+pos.coords.latitude);
    })
  }
  // var geolocation = navigator.geolocation.getCurrentPosition();
}

Detect.prototype.clickStream = function(){
  
}

module.exports = Detect;
});

