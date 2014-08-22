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

  ///////////////////////////////////////////////////////////////////////// 
  //////////////////////////////////shape//////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  var Shape = function(paper, c, options) {
    var ep = this.ep = options.ep;
    this.c = c;

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
    }).hover(function(){
      this.attr({'fill-opacity':0.8});
      this.toFront();
    },function(){
      this.attr({'fill-opacity':opacity});
    }).click(function(){
      self.ep.emit('select',{circle:this,c:c});
    })
    ;

    circle.node.setAttribute('cursor','pointer')
    circle.node.setAttribute('transition','all 0.3s ease-in-out');
  }

  /////////////////////shape之内的更新///////////////////
  Shape.prototype.update = function(t) {
    this.r = parseInt((Math.cos(t*50+this.index)+1.1)*80);
    this.x = this.width * Math.abs(Math.cos(Math.sin(t*this.speed)  + this.index * 100000));
    this.y = this.height * Math.abs(Math.sin(Math.cos(t*this.speed)   + this.index * this.index));
  }
  Shape.prototype.render = function(t) {
    this.update(t);

    this.circle.attr({
      cx:this.x,
      cy:this.y,
      r:this.r,
      'z-index':this.r,
    })
  }

  ////////////////////////////////////////////////////////
  ////////////////////////ShapeSystem////////////////////////
  ////////////////////////////////////////////////////////
  var self;
  var ShapeSystem = function(node,cArr) {
    var self = this;
    var node = $(node);
    this.node = node;
    this.cArr = cArr;
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

    var ep = this.ep = new EventProxy();
    ep.on('select',function(data){
      self.stop();
      self.rank();
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
    this.paper = new Raphael(node[0],width,height);

  }
  ShapeSystem.prototype.resize = function() {
    this.node.empty();
    this.initSVG();
    this.parameters();
    this.initShapes();
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


  ShapeSystem.prototype.rank = function() {
    var shapes = this.shapes;
    for(var k in shapes){
      var obj = shapes[k];
      var circle = obj.circle;

      var c = obj.c;
      var i = c.i;
      var j = c.j;
      var index = c.index;
      var time = (1+Math.random())*300;
      var delay = index*(1+Math.random())*2;

      var anim = Raphael.animation({
        'cx':i*60,
        'cy':j*60+30,
        'r':8,
        'fill-opacity':1,
      }, time).delay(delay);

      circle.animate(anim); 
      circle.animateWith({ease:'easeInOut'});
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
