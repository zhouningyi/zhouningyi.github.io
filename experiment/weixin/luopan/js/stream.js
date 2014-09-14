define(function(require, exports, module) {
  var Table = require('./table.js')

  function Stream(node) {
    this.node = node.empty();
    this.load();
  };

  //避免横着玩手机
  Stream.prototype.load = function() {
    this.node.append('<h2 class="text-muted inline">努力生产中..</h2>');
  };


  Stream.prototype.update = function() {
  };

  module.exports = Stream;
});
