(function(root) {
  var Color = net.brehaut.Color;
  var simplex = new SimplexNoise();
  var mxKTarget = 1;
  var myKTarget  =1;
  var mxK = 1;
  var myK = 1;
  var time = 0;



  ///////////////////////////////////////////////////////////////////////// 
  //////////////////////////////////shape//////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  var Shape = function(canvas,gridW,x,y) {
    this.x = x;
    this.y = y;
    this.gridW = gridW;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.t = 0;
  }


  /////////////////////shape之内的更新///////////////////
  Shape.prototype.render = function(t) {
    var gridW = this.gridW*myK;
    var x = this.x;
    var y = this.y;
    // var phi = 100*simplex.noise3D(x/5000,y/5000,t);
    // phi = 0;
    phi = 10*Math.cos(x*t/50)+10*Math.cos(y*t/50)
    // phi = Math.cos(x*y/100000)*t*100
    // var phi = 200*simplex.noise2D(x/1000,y/1000)*t;
    var context = this.context;
    var centerX = this.x + gridW/2;
    var centerY = this.y + gridW/2
    var startX = this.x + Math.cos(phi)*gridW/2;
    var startY = this.y + Math.sin(phi)*gridW/2;
    var endX = this.x - Math.cos(phi)*gridW/2;
    var endY = this.y - Math.sin(phi)*gridW/2;
    context.strokeStyle = "#000"
    context.beginPath();
    context.lineWidth = gridW*mxK;
    context.moveTo(startX,startY);
    context.lineTo(endX,endY);
    context.stroke();
    context.closePath();
  }

  ////////////////////////////////////////////////////////
  ////////////////////////Perlin////////////////////////
  ////////////////////////////////////////////////////////
  var self;
  var mouseK;
  var Perlin = function(node) {
    var node = $(node);
    this.node = node;
    var width = this.width = node.width();
    var height = this.height = node.height();
    this.t = 0;
    this.speed = 0.0003; //默认的变化速度
    this.gridW = 150;
    this.initCanvas();
    var context = this.context;
    this.initShapes();
    this.render();
  }

  Perlin.prototype.initCanvas = function() {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    this.node.append(canvas);
    this.canvas = canvas;
    this.context = canvas.getContext('2d')
  }

  Perlin.prototype.initShapes = function() {
    var gridW = this.gridW;
    var shapes = this.shapes = [];
    var canvas = this.canvas;
    for (var x = 0; x <= this.width+1; x += this.gridW) {
      for(var y =0;y<=this.height+1;y+=this.gridW){
      var shape = new Shape(canvas,gridW, x, y);
      shapes.push(shape);
      }
    }
  }

  Perlin.prototype.render = function() {
    this.loop();
  }

  Perlin.prototype.loop = function() {
    time+=1;
    if(time%60===0){
      mxKTarget =Math.random();
      myKTarget = Math.random();
    }
    
    mxK+=(mxKTarget-mxK)*0.2;
    myK+=(myKTarget-myK)*0.4;

    var shapes = this.shapes;
    this.context.fillStyle = 'rgba(255,255,255,1)'; //"rgba(0,0,0,1)" 
    this.context.fillRect(0, 0, this.width, this.height);
    this.t += this.speed;
    var t = this.t;
    for (var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      shape.render(t);
    }

    window.requestAnimationFrame(this.loop.bind(this))
  }


  function update(e){
    time = 0;
    mxKTarget = 0.001+e.pageX/2000;
    myKTarget = 0.001+e.pageY/500;
  }

  $("#banner").mousemove(update).on('touchstart', update);

  console.log(Board)

  new Board('野兽的图形草稿').black();

  root.Perlin = Perlin;
  root.Shape = Shape;

})(window)
