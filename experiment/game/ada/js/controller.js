define(function(require, exports, module) {
  var Detect = require('./detect');
  var Game = require('./game');
  var Show = require('./show');
  require('./weixin');

  window.base = 'http://lenovowx.duapp.com';
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
  };

  Controller.prototype.start = function() {
    var node = this.node;
    var game = new Game(node, 5, 6);
    // setTimeout(function() {
    //   game.pass();
    // }, 1000);

    var show = new Show(node);
    show.preLoad();

    node.on('pass', function() {
      game.clean();
      game.price();
      show.begin();
      //@陆扬才： 是否中奖的接口
    })
      .on('result', function(e) {
        game.result();
      })
  };

  module.exports = Controller;
});
