define(function(require, exports, module) {
  var Basic = require('./basic.js')
  var User =  require('./user.js')
  var Stream =  require('./stream.js')
  function Controller(node) {
    this.node = node;

    this.warn();
    this.click();
    this.page = new Basic($('#container'));
    this.update();
  };

  //避免横着玩手机
  Controller.prototype.warn = function() {
    var node = $('#small-tip');
    $(window).on("orientationchange", function(e) {
      if (window.orientation == 0) {
        node.text('亲,横着看屏幕效果更好？');
      }else{
        node.text('');
      }
    });
  };

  Controller.prototype.update = function() {
    //一秒刷新一次
    var self = this;
    this.page.update();
    setTimeout(this.update.bind(this), 5000);
  };

  Controller.prototype.click = function(){
    var self = this;
    var node = $('#container');
    $('#basic').click(function(){
      $('#tabs').children().removeClass('active');
      $(this).addClass('active');
      self.page = new Basic(node);
    });
    $('#stream').click(function(){
      $('#tabs').children().removeClass('active');
      $(this).addClass('active');
      self.page = new Stream(node);
    });
    $('#user').click(function(){
      $('#tabs').children().removeClass('active');
      $(this).addClass('active');
      self.page = new User(node);
    });
  }

  module.exports = Controller;
});
