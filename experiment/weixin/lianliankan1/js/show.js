
define(function(require, exports, module) {
  var titlePhi = 0.35;
  var picList = ['adv10.png', 'adv20.png', 'adv30.png']
  var marginPercent = 0.1;

  selected = null;

  function Show(container) {
    this.container = container;
    this.index = 0;
    this.showN = 3;
  }

  Show.prototype.preLoad = function() {
    var imgList = this.imgList = [];
    for (var k in picList) {
      var url = picList[k];
      var img = new Image();
      img.src = imgBase + url;
      img.onload = function() {
        imgList.push(this);
      }
    }
  };

  Show.prototype.begin = function() {
    this.index = 0;
    this.bg();
    this.slider();
    this.loading();
    this.broadCast();
  }

  Show.prototype.bg = function() {
    var node = this.node = $('<div class="lianlian-show"></div>');
    alert(this.node.width+','+this.node.height())
    this.container.append(node);
    var canvasImg = this.canvasImg = generateSprite('#477', '#8aa', '#dee', 360, 640);
    node.css({
      backgroundImage: 'url(' + canvasImg + ')'
    })
  }

  Show.prototype.loading = function() {
    var loading = $('<div class="lianlian-loading"></div>')
      .text('奖品生成中...');
    this.node.append(loading);
  }

  Show.prototype.broadCast = function() {
    var time = 2000;
    if (this.index < this.showN) {
      this.img(this.index);
      setTimeout(this.broadCast.bind(this), time);
      this.index++;
    } else {
      this.clear();
      return;
    }
  }

  Show.prototype.clear = function() {
    var outTime = 500;
    this.node.remove();
    setTimeout(function() {
      window.ep.emit('result');
    }.bind(this), outTime)
  }

  Show.prototype.slider = function() {
    var showNode = this.showNode = $('<div class="lianlian-slider"></div>');
    this.node.append(showNode);
  }

  Show.prototype.img = function(index) {
    var imgList = this.imgList;
    this.showNode.find('img').remove();
    this.showNode.append($(imgList[index]).css({
      'width': '100%',
    }));
  }

  function generateSprite(colorOut, colorCenter, colorIn, w, h) {
    var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      gradient;

    canvas.width = w;
    canvas.height = h;

    gradient = context.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.height / 2
    );

    gradient.addColorStop(1.0, colorOut);
    gradient.addColorStop(0.7, colorCenter);
    gradient.addColorStop(0.0, colorIn);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas.toDataURL();
  }

  module.exports = Show;
});
