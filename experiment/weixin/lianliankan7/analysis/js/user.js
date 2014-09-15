define(function(require, exports, module) {

  function Users(node) {
    this.node = node.empty();
    this.load();
  };

  //避免横着玩手机
  Users.prototype.load = function() {
    this.node.append('<h2 class="text-muted inline" style="text-align:center">努力生产中..</h2>');
  };


  Users.prototype.update = function() {
  };

  module.exports = Users;
});
