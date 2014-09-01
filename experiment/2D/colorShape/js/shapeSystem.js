/*
@ 在外部运行：
@var shapeSystem = new ShapeSystem(node);
*/
(function(root) {
  var mxKTarget = 1;
  var myKTarget = 1;
  var mxTarget = 0;
  var myTarget = 0;
  var mx = 0;
  var my = 0;
  var mxKTargetPre = 1;
  var myKTargetPre = 1;
  var mxK = 1;
  var myK = 1;
  var time = 0;
  var alpha = 0;
  var alphaTarget = 0.1;
  var x = 0;
  var y = 0;

  var circles = [];
  var width;
  var height;

  var ep;

  ///////////////////////////////////////////////////////////////////////// 
  //////////////////////////////////shape//////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  var Shape = function(paper, c) {

    var index = this.index = c.index;
    var fillColor = c.color;
    this.r = 10;
    this.speed = this.r*0.1;
    var opacity = 0.6;

    this.paper = paper;
    this.width = paper.width;
    this.height = paper.height;
    this.t = 0;
    
    var self = this;
    var circle = this.circle = paper.circle(40,40,this.r).attr({
      'stroke':null,
      'fill':fillColor,
      'fill-opacity':opacity,
    })
    .hover(function(){
      self.reset(circles);
      this.toFront();
      this.node.setAttribute('class','circle-animation');
    },function(){
      var cx = this.attr('cx');
      var cy = this.attr('cy');
      self.shakes(circles,cx,cy);
    }).click(function(){
      this.select = true;
      ep.emit('select',this);
    });
    circle.select = false;
    circle.node.setAttribute('class','circle');
    circles.push(circle);
    circle.c = c;
  }

  /////////////////////shape之内的更新///////////////////
  Shape.prototype.update = function(t) {
    this.r = 80//parseInt((Math.cos(t*50+this.index)+5)*20);
    this.x = this.width * Math.abs(Math.cos(Math.sin(t*this.speed)  + this.index * 100000));
    this.y = this.height * Math.abs(Math.sin(Math.cos(t*this.speed)   + this.index * this.index));
  };

  Shape.prototype.render = function(t) {
    this.update(t);
    this.circle.attr({
      'cx':this.x,
      'cy':this.y,
      'r' :this.r,
      'z-index':this.r,
    })
  }

  Shape.prototype.reset = function(circles) {
    for (var k in circles){
      var circle = circles[k];
      circle.node.setAttribute('class','circle')}
    }  

  Shape.prototype.shakes = function(circles, cx, cy) {
    for (var k in circles){
      var circle = circles[k];
      this.shake(circle, cx, cy);
    }
  }

  Shape.prototype.shake = function(circle, cx, cy) {
    var cx1 = circle.attr('cx');
    var cy1 = circle.attr('cy');
    var dist = Math.abs(cx-cx1)+Math.abs(cy-cy1);
    var d = dist/(width+height);
    var delay = (d*5)*300;
    setTimeout(function(){circle.node.setAttribute('class','circle-animation-all')},delay);
    // setTimeout(function(){circle.node.setAttribute('class','circle')},5000);
  };

  ////////////////////////////////////////////////////////
  ////////////////////////ShapeSystem////////////////////////
  ////////////////////////////////////////////////////////
  var self;
  var ShapeSystem = function(node,cArr,options) {
    var self = this;
    var node = $(node);
    iMax = options.iMax||10;
    jMax = options.jMax||5;
    this.node = node;
    this.cArr = cArr;
    width = node.width();
    height = node.height();
    var shapeN = this.shapeN = cArr.length;
    
    // this.initCanvas();
    this.initSVG();
    this.event();
    this.parameters();
    this.initShapes(shapeN);
    this.render();
  }

  ShapeSystem.prototype.parameters = function() {
    this.t = 0;
    this.speed = 0.0003; //默认的变化速度
    this.gridW = Math.sqrt(this.width * this.height / 100);
  }


  ShapeSystem.prototype.event = function() {
    var self = this;
    this.node
      .mousemove(onMouseMove)
      .mouseover(onMouseOver)
      .mouseout(onMouseOut);

    ep = new EventProxy();
    ep.on('select',function(center){
      self.stop();
      for(var k in circles){
        var circle = circles[k];
        explode(circle, center);
      }
      rank(center);
    })
  }


  // ShapeSystem.prototype.initCanvas = function() {
  //   this.width = this.node.width();
  //   this.height = this.node.height();
  //   var canvas = document.createElement("canvas");
  //   canvas.width = this.width;
  //   canvas.height = this.height;

  //   this.node.append(canvas);
  //   this.canvas = canvas;
  //   this.context = canvas.getContext('2d');
  // }

  ShapeSystem.prototype.initSVG = function() {
    var node = this.node;
    var width = this.width = node.width();
    var height = this.height = node.height();
    paper = this.paper = new Raphael(node[0],width,height);
  }
  ShapeSystem.prototype.resize = function() {
    this.node.empty();
    this.initSVG();
    this.parameters();
    this.initShapes();
  }

   ShapeSystem.prototype.shrink = function() {
    // var anim = Raphael.animation({
    //   'cx': pos.cx,
    //   'cy': pos.cy,
    //   'r': r,
    //   'fill-opacity': 1,
    // }, time, 'bounce', rankOther).delay(delay);
    // this.animate(anim);
   }

  ShapeSystem.prototype.initShapes = function(shapeN) {
    var cArr = this.cArr;
    var shapes = this.shapes = [];
    var paper = this.paper;
    var gridW = this.gridW;
    var options = {ep:this.ep}

    var index = 0;
    while (++index < shapeN) {
      var c = cArr[index];
      var shape = new Shape(paper, c, options);
      shapes.push(shape);
    }
  }
  ShapeSystem.prototype.render = function() {
    this.loop();
  };

  ShapeSystem.prototype.stop = function() {
    var self = this;
    window.cancelAnimationFrame(self.loopId);
    this.loopId = null;
    setTimeout(function(){window.cancelAnimationFrame(self.loopId);},100)
  };

  ShapeSystem.prototype.start = function() {
    if(this.loopId ==null){
      this.loop();
    }
  };

  ShapeSystem.prototype.clear = function(alpha) {
  };

  ShapeSystem.prototype.loop = function() {
    time += 1;
    var self = this;
    // this.context.clearRect(0, 0, this.width, this.height);

    mxK += (mxKTarget - mxK) * 0.1;
    myK += (myKTarget - myK) * 0.1;
    mx += (mxTarget-mx)*0.3;
    my += (myTarget-my)*0.3;
    alpha += (alphaTarget - alpha) * 0.1;

    var shapes = this.shapes;
    this.t += this.speed;
    var t = this.t;
    for (var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      shape.render(t);
    }
    // this.clear(alpha);
    
    this.loopId = window.requestAnimationFrame(function(){self.loop()});
  }

  function getPosition(circle){
      var dx = width/iMax;
      var dy = 30;
      var c = circle.c;
      var i = c.i;
      var j = c.j;
      var obj = {};
      obj.cx = i*dx +dx/2;
      obj.cy = j*dy+30;

      return obj;
  }

 
  curJ = null;
  function rank(circle) {
    var r = 12;
    // var index = c.index;
    var time = 1000;
    var delay = 300;
    curJ = circle.c.j;

    var pos = getPosition(circle);

    var anim = Raphael.animation({
      'cx': pos.cx,
      'cy': pos.cy,
      'r': r,
      'fill-opacity': 1,
    }, time, 'bounce', rankOther).delay(delay);

    circle.animate(anim);

    function rankOther() {
      var time = 300;
      var r = 6;
      for (var k in circles) {
        var circle = circles[k];
        if (circle.c.j == curJ && !circle.select) {
          var i = circle.c.i;
          var delay = i *20;
          var pos = getPosition(circle);
          var anim = Raphael.animation({
            'cx': pos.cx,
            'cy': pos.cy,
            'r': r,
            'fill-opacity': 1,
          }, time, 'easeInOut',function(){
            paper.setSize(paper.width,300)
          })
          .delay(delay);
          circle.animate(anim);
        }
      }
    }
  };

  function explode(circle, center){
    var centerX = center.attr('cx');
    var centerY = center.attr('cy');
    var r = 1900;
    // var phi = Math.random()*6.28;
    if(!circle.select){
      var x = circle.attr('cx');
      var y = circle.attr('cy');
      var dx = (x - centerX);
      var dy = (y - centerY);
      var dr = Math.sqrt(dx*dx+dy*dy);

      function out() {
        var time = 1000;
        var anim = Raphael.animation({
          'cx': centerX + r * dx/dr,
          'cy': centerY + r * dy/dr,
        }, time, 'easeInOut')
        circle.animate(anim);
      }

      function small() {
        var time = 400;
        var delay = (1 + Math.random()) * 20;
        var anim = Raphael.animation({
          'cx': x + r * dx/dr/50,
          'cy': y + r * dy/dr/50,
          'r': 8,
          'fill-opacity': 1,
        }, time, 'bounce',out).delay(delay);
        circle.animate(anim);
      }

      small();
    }
  }
  var xMax = 2000;
  var yMax = 500;
  function onMouseMove(e) {
    time = 0;
    x = e.offsetX;
    y = e.offsetY;
    var speed = 100;
    var dL = Math.abs(mxKTargetPre - x) + Math.abs(myKTargetPre - y);
    if (dL < speed) {
      alphaTarget = 0.5;
    } else {
      mxKTarget = x / xMax;
      myKTarget = y / yMax;
      alphaTarget = 0.9;
    }
    mxTarget = x;
    myTarget = y;
    mxKTargetPre = x;
    myKTargetPre = y;
  }

  function onMouseOut(e) {
    alphaTarget = 0.1;
  }

  function onMouseOver(e) {
    alphaTarget = 0.9;
    x = e.offsetX;
    y = e.offsetY;
    mxKTarget = x / xMax;
    myKTarget = y / yMax;
  }

  root.ShapeSystem = ShapeSystem;
  root.Shape = Shape;

})(window);
