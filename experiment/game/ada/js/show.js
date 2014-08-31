var titlePhi = 0.35;
(function(exports) {
  var picList = ['./image/adv10.png', './image/adv20.png', './image/adv30.png']
  var marginPercent = 0.1;

  selected = null;

  function Show(node) {
    this.node = node;
    this.bg();
  }

  Show.prototype.preLoad = function() {
    var imgList = this.imgList = [];
    for (var k in picList) {
      var url = picList[k];
      var img = new Image();
      img.src = url;
      img.onload = function() {
        imgList.push(img);
      }
    }
  };

  Show.prototype.bg = function() {
    var canvasImg = this.canvasImg = generateSprite('#477', '#8aa', '#dee', 360, 640);
    this.node.css({
      backgroundImage: 'url(' + canvasImg + ')'
    })
  }

  Show.prototype.slider = function() {
    var imgList = this.imgList;
    var showNode = $('<div class="lianlian-slider"></div>');
    this.node.append(showNode);
    var img = $(imgList[0])
    .css({
      'width':'100%',
    }).click(function(){
      alert('下一步设计中奖后的界面')
    });
    showNode.append(img);
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

  exports.Show = Show;
})(window);
