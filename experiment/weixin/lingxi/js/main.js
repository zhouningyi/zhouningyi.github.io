
var base = window.base = 'http://115.29.15.119:8080';
// var base = '';

(function(exports){

function CombineMain(node) {
  //最多传入100个名人
  var showN = 100;
  var url = base + '/lx-web/rest/composite?pn=1&ps=' + showN + '&orderby=floatReturn';
  // var url = 'http://115.29.15.119:8080/lx-web/rest/composite?pn=1&ps=' + showN + '&orderby=floatReturn';
  var dataHead =
    [{
      name: '用户',
      type: 'text',
      key: function(obj) {
        return obj.user.username
      }
    },{
      name: '总资产',
      type: 'chartColumn',
      key: function(obj) {
        return obj.totalValue;
      }
    }, {
      name: '当日盈亏',
      type: 'textColor',
      key: function(obj) {
        return obj.dailyReturn;
      }
    }, {
      name: '总收益',
      type: 'textColor',
      key: function(obj) {
        return obj.totalReturn;
      }
    }, {
      name: '总收益率',
      type: 'textColor',
      key: function(obj) {
        return obj.totalReturnRate
      }
    }, {
      name: '月收益率',
      type: 'textColor',
      key: function(obj) {
        return obj.monthlyReturnRate;
      }
    }, {
      name: 'userID',
      type: 'text',
      key: function(obj) {
        return obj.user.id
      }
    },  {
      name: 'compositeID',
      type: 'text',
      key: function(obj) {
        return obj.id
      }
    }, 
     ];
      // {name:'年收益率',type:'text',key:function(obj){return obj.annualReturnRate;}},
      // {name:'月收益率',type:'text',key:function(obj){return obj.monthlyReturnRate;}},
      // {name:'周收益率',type:'text',key:function(obj){return obj.weeklyReturnRate;}}
      
  $.ajax({
    type: "GET",
    dataType: 'jsonp',
    url: url,
    success: function(data) {
      var dataLines = [];
      for (var k = 0; k < data.length; k++) {
        var obj = data[k];
        var dataLine = []
        for (var j = 0; j < dataHead.length; j++) {
          var func = dataHead[j].key;
          dataLine[j] = func(obj);
        }
        dataLines.push(dataLine);
      }
      var dataAll = {
        keys: dataHead,
        values: dataLines
      };

      var sheet = new Sheet(node);
      sheet.data(dataAll);
      sheet.render();
    }
  });
}
exports.CombineMain = CombineMain;
})(window)
