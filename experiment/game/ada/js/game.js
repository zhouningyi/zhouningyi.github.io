(function(exports) {
  var picList = ['./image/logo1.png', './image/logo2.png', './image/logo3.png', './image/logo4.png', './image/logo5.png', './image/logo6.png', './image/logo7.png', './image/logo8.png', './image/logo9.png'];
  var marginPercent = 0.1;

  var titlePhi = 0.363;
  var sucN = 0;
  selected = null;

  function Game(node, nX, nY) {
    this.node = node;
    this.nX = nX;
    this.nY = nY;
    this.N = nX * nY;

    this.id();

    this.initMap = [];
    this.dom();
    this.bg();
    this.table();
    this.imgs();

    startTime = new Date();
    this.timer();
  }

  Game.prototype.id = function() {
    //@陆扬才 获取openID接口的方法
    openID = null;
    var id = openID|| this.time() +'_'+parseInt(Math.random()*100, 10);
    //@陆扬才 发送openid的方法,这个用户开始玩游戏了
  }
  
  Game.prototype.time = function() {
    //为获得id而设计的计时器
      var now = new Date();
      var time = now.getMonth()+'-'+now.getDate()+'_'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds(); 
      return time;
  }

  var startTime = null;
  Game.prototype.timer = function() {
    curTime = new Date();
    var ms = curTime.getTime() - startTime.getTime();
    var s = parseInt(ms/1000, 10);
    var min = parseInt(s/60, 10);
    var sec = parseInt(s%60, 10);
    var milli = parseInt(ms%1000*0.06);
    milli = (milli<10)?'0'+milli:milli;
    sec = (sec<10)?'0'+sec:sec;
    min = (min<10)?'0'+min:min;

    var showTime = min+': '+sec+': ' + milli;
    this.timerNode.text(showTime);
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.animateID = requestAnimationFrame(this.timer.bind(this));
  }

  Game.prototype.stopTimer = function() {
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
    cancelAnimationFrame(window.animateID);
    this.timerNode.text('');
  }


  //连连看的抽象图
  Game.prototype.initMap = function() {
    var map = this.map = window.mapGame = [];
    for (var x = 0; x < this.nX; x++) {
      for (var y = 0; y < this.nY; y++) {
        map[x][y] = {
          'exist': true,
          'searched': false
        };
      }
    }
  }

  Game.prototype.bg = function() {
    var bgURL = 'url(' + './image/bg.png' + ')';
    this.node
      .css({
        'backgroundImage': bgURL
      });

    var bgURL = 'url(' + './image/table.png' + ')';
    this.gridsNode
      .css({
        'backgroundImage': bgURL
      });
  }

  Game.prototype.dom = function() {

    var node = this.node;
    var w = this.w = node.width();
    var h = this.h = node.height();
    var N = this.N;
    var nX = this.nX;
    var nY = this.nY;

    var tinerMin = 50;

    var gridsHx = this.gridsHx = 
    Math.min(parseInt((1 - 2 * marginPercent) * w / nX) * nX, h/(titlePhi+nY/nX)-tinerMin);
    // var gridHx1 = parseInt(h - gridsHx*titlePhi*nX/nY)
    // gridsHx*titlePhi+gridsHx*nY/nX = 
    //console.log(parseInt((1 - 2 * marginPercent) * w / nX) * nX, parseInt(w*titlePhi),nX/nY)
     
    var gridsHy = this.gridsHy = this.nY / this.nX * gridsHx;
    var gridsL = parseInt(w / 2 - gridsHx / 2 - nX);
    // var gridsT = parseInt((h - gridsH) / 2*1.5);
    var gridsT = parseInt(gridsHx *1* titlePhi);
    var gridsNode = this.gridsNode = $('<table class="lianlian-table"></table>')
      .css({
        'width': gridsHx + 'px',
        'height': gridsHy + 'px',
        'left': gridsL + 'px',
        'top': gridsT + 'px',
      });
    node.append(gridsNode);
    
    // var titleT = parseInt(gridsT * 0.0);
    var titleH = gridsT;
    var bgURL = 'url(' + './image/title.png' + ')';
    var titleNode = this.titleNode =
      $('<div class="lianlian-title"></div>')
      .css({
        'width': gridsHx + 'px',
        'left': gridsL + 'px',
        'top': '0px',
        'height': titleH + 'px',
        'lineHeight': titleH + 'px',
        'backgroundImage': bgURL,
      })
    this.node.append(titleNode);
    
    var timeT = gridsHy + titleH + 5;
    var timeH = h - timeT;
    timeH = (timeH<50)?timeH:50;
    var fontSize = parseInt(timeH*0.75, 10);
    var timerNode = this.timerNode =$('<div class="lianlian-timer"></div>')
    .css({
      'top':timeT + 'px',
      'height':timeH + 'px',
      'lineHeight':timeH + 'px',
      'fontSize':fontSize + 'px',
      'left':gridsL+'px',
      'width':gridsHx+'px',
    })
    this.node.append(timerNode);
  }

  Game.prototype.table = function() {
    var nX = this.nX;
    var nY = this.nY;
    var N = this.N;
    var gridsNode = this.gridsNode;

    var tds = this.tds = [];
    var gridH = this.gridH = (this.gridsHx / nX);

    var self = this;

    for (var y = 0; y < nY; y++) {
      var tr = $('<tr class="lianlian-tr"></tr>');
      gridsNode.append(tr);
      for (var x = 0; x < nX; x++) {
        var td = $('<td class="lianlian-td"></td>')
          .css({
            'width': gridH + 'px',
            'height': gridH + 'px'
          })
          .data({
            x: x,
            y: y
          })
          .on('mousedown', function(e) {
            var node = $(this);
            var css = node.attr('class');
            if (css == "lianlian-td") {
              var grid = node.find('.lianlian-grid');
              if (check(grid, self)) {
                grid.addClass("lianlian-grid-selected");
              }
            } else {
              grid.removeClass("lianlian-grid-selected");
            }
            if(sucN>=self.nX*self.nY){
              self.pass();
            }
          });
        tr.append(td);
        tds.push(td);
      }
    }
  };


  function randint(arr) {
    curType = parseInt(Math.random() * arr.length);
    return arr[curType];
  }

  function ranSort(arr) {
    arr.sort(function(a, b) {
      return Math.random() > .5 ? -1 : 1;
    });
    return arr;
  }

  Game.prototype.ranTds = function() {
    //打乱格子顺序
    var self = this;
    
    var nodes = [];
    this.gridsNode.find('div').each(function(){
      var node = $(this);
      nodes.push(
        node.clone()
        .attr('imgType', node.attr('imgType'))
        .data(node.data())
        )
     })
    this.gridsNode.find('td').empty();

    var tds = ranSort(this.tds);
    for (var k = 0; k < self.N - sucN; k += 1) {
        tds[k].append($(nodes[k]));
    }
 };

  Game.prototype.imgs = function() {
    var N = this.N;
    var tds = ranSort(this.tds);
    var gridH = this.gridH;

    var gridsNode = this.gridsNode;

    for (var k = 0; k < N; k += 2) {
      var url = randint(picList);

      var td = tds[k];
      var grid =
        $('<div class="lianlian-grid"></div>')
        .css({
          'width': (gridH - 4) + 'px',
          'height': (gridH - 4) + 'px',
          'backgroundImage': 'url(' + url + ')'
        })
        .attr('imgType', curType)
        .data(td.data())
      td.append(grid);

      var td = tds[k + 1];
      var grid1 =
        $('<div class="lianlian-grid"></div>')
        .css({
          'width': (gridH - 4) + 'px',
          'height': (gridH - 4) + 'px',
          'backgroundImage': 'url(' + url + ')'
        })
        .attr('imgType', curType)
        .data(td.data());

      td.append(grid1)
    }
    curType = null;
  };
  
  function check(node, self) {
    if (!selected) {
      selected = node;
      return true;
    } else if (selected) {
      var obj = selected.data();
      var obj1 = node.data();
      if (obj.x === obj1.x && obj.y === obj1.y) {
        node.removeClass('lianlian-grid-selected');
        selected = null;
        return;
      } else if (node.attr('imgType') === selected.attr('imgType')) {
        if (link(obj, obj1)) {
          node.remove();
          selected.remove();
          sucN+=2;
          self.ranTds();
          selected = null
        }
      } else {
        return false;
      }
    }
  };

  function link(obj, obj1) {
    var xFrom = obj.x;
    var yFrom = obj.y;
    var xTo = obj1.x;
    var yTo = obj1.y;
    // mapGame[x][y]
    return true;
  };

  Game.prototype.pass = function(){
    this.stopTimer();

    var w = this.w;
    var h = this.h;
    
    var passPhi = 0.98;
    var passW = parseInt(w*passPhi);
    var passL = parseInt(w*(1-passPhi)/2);
    var passH = passW;
    var passT = (h-w)/2;
    var passImg = 'url('+'./image/pass.png' +')';

    var passNode = this.passNode = $('<div class="lianlian-pass"></div>')
    .css({
        'width': passW + 'px',
        'left': passL + 'px',
        'top': passT + 'px',
        'height': passH + 'px',
        'backgroundImage': passImg,      
    })
    .on('mousedown', function(e){
      $(this).trigger('pass');
      $(this).off('mousedown').off('mousedown').off('click');
    })
    .fadeIn(200);

    this.node.append(passNode);
  };

  Game.prototype.clean = function(){
    this.gridsNode.empty();
    this.gridsNode.fadeOut();
    this.passNode.empty().css({'background':'rgba(0,0,0,0.7)'}).hide();
  };

  Game.prototype.clear = function(){
    this.node.empty();
  };

  Game.prototype.result = function(){
    //@陆扬才： 是否中奖的接口
    var bol =(Math.random()>0.4)?false:true;
    // var bol = false;
    var resultNode = this.passNode.show();
    resultNode.empty();
    resultNode.css({
      'top':'0%',
      'left':'0%',
      'width':'100%',
      'height':'100%',
      'backgroundSize':'100%, 100%',
      'backgroundRepeat':'no-repeat'
    });
    if(bol){
      this.win();
    }else{
      this.loose();
    }
  };

  Game.prototype.win = function(){
    var self = this;
    var resultNode = this.passNode;

    var imgURL = './image/result.png';
    imgURL = 'url('+imgURL+')';
    resultNode.css({
      'background':'rgba(0,0,0,0.8)',
      'backgroundImage':imgURL,
      'backgroundSize':'100%, 100%',
      'backgroundRepeat':'no-repeat'
    });
    
    var checkBox = 
    $(
     '<div class="lianlian-checkbox">\
     <div class="lianlian-win-title">恭 喜 您 中 奖 了</div>\
     <div class="input-group">\
       <input type="text" id="name" class="form-control" placeholder="输入姓名">\
     </div>\
     <div class="input-group">\
       <input type="text" id="adress" class="form-control" placeholder="收货地址">\
     </div>\
     <div class="input-group">\
       <input type="text" id="tel" class="form-control" placeholder="联系电话">\
     </div>\
     <div class="lianlian-commit">提 交</div>\
     </div>'
    );
    checkBox.find('.input-group').css('height','30px');
    checkBox.find('input').css({
      'display':'inline-block',
      'margin':'2px',
      'borderRadius':'5px'
    });
    checkBox.find('.lianlian-commit').click(function(e){
      var name = checkBox.find('#name')[0].value;
      var adress = checkBox.find('#adress')[0].value;
      var tel = checkBox.find('#tel')[0].value;
      if(name&&adress&&tel){
        checkBox.remove();
        self.restart();
        //@陆扬才 中奖信息 写入后端的接口;
      }
    })
   resultNode.append(checkBox);
  };

  Game.prototype.loose = function(){
    var self = this;
    var resultNode = this.passNode;

    var imgURL = './image/loose.png';
    imgURL = 'url('+imgURL+')';
    resultNode.css({
      'backgroundColor':'rgba(0,0,0,0.6)',
      'backgroundImage':imgURL,
    });

    resultNode.click(function(e){
      var x = e.pageX/$(this).width();
      var y = e.pageY/$(this).height();
      if(x<0.5){
        self.restart();
      }
    })
  };

  Game.prototype.restart = function(){
    this.clear();

    sucN = 0;
    startTime = new Date();
    this.timer();

    this.dom();
    this.bg();
    this.table();
    this.imgs();
  };

  exports.Game = Game;
})(window);
