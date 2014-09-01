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

    this.initMap = [];
    this.dom();
    this.bg();
    this.table();
    this.title();
    this.imgs();
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

    var gridsHx = this.gridsHx = 
    Math.min(parseInt((1 - 2 * marginPercent) * w / nX) * nX, h/(titlePhi+nY/nX)-30);
    // var gridHx1 = parseInt(h - gridsHx*titlePhi*nX/nY)
    // gridsHx*titlePhi+gridsHx*nY/nX = 
    //console.log(parseInt((1 - 2 * marginPercent) * w / nX) * nX, parseInt(w*titlePhi),nX/nY)
     

    var gridsHy = this.gridsHy = this.nX / this.nY * gridsHx;
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
          .mousedown(function() {
            var node = $(this);
            var css = node.attr('class');
            if (css == "lianlian-td") {
              var grid = node.find('.lianlian-grid');
              if (check(grid)) {
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

  Game.prototype.title = function() {

  }

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
  
  function check(node) {
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
          node.fadeOut();
          selected.fadeOut();
          sucN+=2;
          selected = null
        }
      } else {
        return false;
      }
    }
  }

  function link(obj, obj1) {
    var xFrom = obj.x;
    var yFrom = obj.y;
    var xTo = obj1.x;
    var yTo = obj1.y;
    // mapGame[x][y]
    return true;
  }

  Game.prototype.pass = function(){
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
    .click(function(e){
      $(this).trigger('pass');
      $(this).off('click');
    })
    .fadeIn();

    this.node.append(passNode);
  }

  Game.prototype.clear = function(){
    this.gridsNode.empty();
    this.gridsNode.fadeOut();
    this.passNode.empty().css({'background':'rgba(0,0,0,0.7)'}).hide();
    // this.titleNode.fadeOut();
  }

  Game.prototype.result = function(){
    var resultNode = this.passNode.show();
    resultNode.css({
      'height':'80%'});
    var imgURL = './image/result.png';
    var img = $('<img class="lianlian-result-img" src="'+imgURL+'"></img>');
    resultNode.append(img);
  }

  exports.Game = Game;
})(window);
