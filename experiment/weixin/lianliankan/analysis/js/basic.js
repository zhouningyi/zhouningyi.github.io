define(function(require, exports, module) {
  var Table = require('./table.js');

  var pwd = '?password=39b4ba45-c4f4-4e69-bb32-bb2e803b6781'

  function Basic(node) {
    this.node = node.empty();
    this.load();
    this.update();
  };

  //避免横着玩手机
  Basic.prototype.load = function() {
    this.node.append(
        '<div class="starter-template" style="margin-top:5px">\
        <h4 class="text-muted inline">活动简报：</h4>\
        <br>\
        <p class="text-muted inline"> 总计参与(pv)：</p> \
        <h3 id="all" class="text-primary inline" >loading..</h3>\
        <br>\
        <p class="text-muted inline"> 今日参与(pv)：</p>\
        <h3 id="all-today" class="text-primary inline">loading..</h3>\
        <br>\
        <p class="text-muted inline"> 所有分享：</p>\
        <h3 id="all-prize" class="text-primary inline">loading..</h3>\
        <br>\
        <p class="text-muted inline"> 今日分享：</p>\
        <h3 id="all-prize-today" class="text-primary inline">loading..</h3>\
        <br>\
        <br>\
        <br>\
        <h4 class="text-muted inline">中奖名单：</h4>\
        <div id="table" style="width:100%"></div>');
  };


  Basic.prototype.info = function() {
    var url = 'http://lenovowx.duapp.com/ServletGetGameInfo'+pwd;
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(d) {
        console.log(d);
        d = d[0];
        $('#all').text(d.accesscountAll);
        $('#all-today').text(d.accesscount);
        $('#all-prize').text(d.sharecountAll);
        $('#all-prize-today').text(d.sharecount);
      }
    })
  };

  Basic.prototype.prize = function() {
    var dataHead =
      [{
        name: '奖品',
        type: 'text',
        key: function(obj) {
          return obj.pricename;
        }
      }, {
        name: '状态',
        type: 'text',
        key: function(obj) {
          return obj.pricewinifwin;
        }
      }, {
        name: 'openID',
        type: 'text',
        key: function(obj) {
          return obj.pricewinopenid;
        }
      },{
        name: '姓名',
        type: 'text',
        key: function(obj) {
          return obj.name;
        }
      }, {
        name: '地址',
        type: 'text',
        key: function(obj) {
          return obj.address;
        }
      }, {
        name: '电话',
        type: 'text',
        key: function(obj) {
          return obj.tel;
        }
      }, {
        name: '时间',
        type: 'text',
        key: function(obj) {
          return obj.pricewintime;
        }
      }

      ];

    var table = new Table(this.node.find('#table'));
    table.dataHead(dataHead);

    var url = 'http://lenovowx.duapp.com/ServletGetWinnerInfo'+pwd;
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(d) {
        console.log(d,'===')
        var dataLines = [];
        var darkList = []
        for(var k in d){
          var arr = [];
          for(var p in dataHead){
            var obj = dataHead[p];
            var value = obj.key(d[k]);
            arr.push(value);
          }
          // if(obj.pricetype ==1){
          //   table.dark(k);
          // }
          dataLines.push(arr);
        }
        console.log(dataLines)
          table.dataLines(dataLines);
          table.render();
      }
    })
  }

  Basic.prototype.update = function() {
    //将(距现在一小时以上)中奖并没有领取的奖品重新纳入抽奖列表 +++++++++++todd
    this.info();
    this.prize();
  };

  module.exports = Basic;
});
