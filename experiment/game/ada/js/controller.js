define(function(require, exports, module) {
 var Detect = require('./detect');
 var Game = require('./game');
 var Show = require('./show');
 var weixin = require('./weixin');

  function Controller(node) {
    this.node = node;
    
    this.detect = new Detect();
    this.start();
    this.warn();
  };

  Controller.prototype.warn = function() {
    $(window).on("orientationchange", function(e) {
      if (window.orientation == 90) {
        alert('亲 请竖着玩游戏哈！');
      }
    });
  }

  Controller.prototype.start = function(){
    var node = this.node;
    console.log(node)
    var game = new Game(node,5,6);
    // setTimeout(function(){game.pass();},3100);
    
    var show = new Show(node);
    show.preLoad();

    node.on('pass',function(){
        game.clean();
        show.begin();
    })
    .on('result',function(e){
        game.result();
    })
  }

  module.exports = Controller;
});
