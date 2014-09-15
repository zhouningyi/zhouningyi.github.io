define(function(require, exports, module) {
  var Table = require('./table.js')

  function Controller(node) {
    this.node = node;

    this.warn();
    this.update();
  };

  //避免横着玩手机
  Controller.prototype.warn = function() {
    $(window).on("orientationchange", function(e) {
      if (window.orientation == 90) {
        alert('亲 请竖着玩游戏哈！');
      }
    });
  };

  Controller.prototype.update = function() {
    //将(距现在一小时以上)中奖并没有领取的奖品重新纳入抽奖列表
    this.info();
    this.prize();
    setTimeout(this.update.bind(this), 2000);
  };

  Controller.prototype.info = function() {
    var url = 'http://lenovowx.duapp.com/ServletGetGameInfo';
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(d) {
        d = d[0];
        $('#all').text(d.accesscountAll);
        $('#all-today').text(d.accesscount);
        $('#all-prize').text(d.sharecountAll);
        $('#all-prize-today').text(d.sharecount);
      }
    })
  };

  Controller.prototype.prize = function() {
    var dataHead =
      [{
        name: '奖品',
        type: 'text',
        key: function(obj) {
          return obj.pricename;
        }
      }, {
        name: '姓名',
        type: 'text',
        key: function(obj) {
          return obj.name;
        }
      }, {
        name: '电话',
        type: 'text',
        key: function(obj) {
          return obj.tel;
        }
      }, {
        name: '地址',
        type: 'text',
        key: function(obj) {
          return obj.address;
        }
      }, {
        name: '状态',
        type: 'text',
        key: function(obj) {
          return obj.priceid;
        }
      }, {
        name: 'openID',
        type: 'text',
        key: function(obj) {
          return obj.pricewinopenid;
        }
      }];

    var url = 'http://lenovowx.duapp.com/ServletGetWinnerInfo';
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(d) {
        d = d[0];
        var dataLines = [];
        for(var k in d){
          var arr = [];
          for(var p in dataHead){
            var obj = dataHead[k];
            var value = obj.key(d);
            arr.push(value);
          }
        }
      }
    })
    var node = $();
    node.empty();
    var table = new Table($('#table'));
   

    table.dataHead(dataHead);
    var dataLines = [
      ['loading..', 'loading..', 'loading..', 'loadingloadingloadingloading..', 'loading..', 'loading..'],
      ['loading..', 'loading..', 'loading..', 'loading..', 'loading..', 'loading..'],
      ['loading..', 'loading..', 'loading..', 'loading..', 'loading..', 'loading..'],
      ['loading..', 'loading..', 'loading..', 'loading..', 'loading..', 'loading..'],
      ['loading..', 'loading..', 'loading..', 'loading..', 'loading..', 'loading..']
    ];
    table.dataLines(dataLines);
    table.render();
    console.log(333)
  }

  module.exports = Controller;
});
