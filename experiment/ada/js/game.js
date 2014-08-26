   var picList = ['./image/logo4.png', './image/logo1.png', './image/logo2.png', './image/logo3.png'];
   var marginPercent = 0.05;
   var titleText = '连﹋连﹏抽';
   (function(exports) {

     selected = null;

     function Game(node, N) {
       this.node = node;
       this.N = N;

       this.dom();
       this.table();
       this.title();
       this.imgs();
     }

     Game.prototype.dom = function() {

       var node = this.node;
       var w = node.width();
       var h = node.height();
       var N = this.N;

       if (w <= h) {
         var gridsH = this.gridsH = parseInt((1 - 2 * marginPercent) * w / N) * N;
         var gridsL = parseInt(marginPercent * w);
         var gridsT = parseInt((h - gridsH) / 2);
         var gridsNode = this.gridsNode = $('<table class="lianlian-table"></table>')
           .css({
             'width': gridsH + 'px',
             'height': gridsH + 'px',
             'left': gridsL + 'px',
             'top': gridsT + 'px',
           });
         node.append(gridsNode);

         var titleH = parseInt(gridsT*0.8);
         var titleT = parseInt(gridsT*0.1);
         var fontSize = parseInt(titleH*0.6);
         var titleNode = this.titleNode = $('<div class="lianlian-title"></div>')
         .css({
          'width':gridsH +'px',
          'left':gridsL +'px',
          'top':titleT +'px',
          'height':titleH +'px',
          'lineHeight':titleH +'px',
          'fontSize':fontSize +'px',
          'fontWeight':'bold'
         })
         this.node.append(titleNode);
       }

     }

     Game.prototype.table = function() {
       var N = this.N;
       var gridsNode = this.gridsNode;

       var tds = this.tds = [];
       var gridH = (this.gridsH / N);

       for (var y = 0; y < N; y++) {
         var tr = $('<tr class="lianlian-tr"></tr>');
         gridsNode.append(tr);
         for (var x = 0; x < N; x++) {
           var td = $('<td class="lianlian-td"></td>')
             .css({
               'width': gridH + 'px',
               'height': gridH + 'px'
             })
             .click(function() {
              console.log('css')
               var node = $(this);
               var css = node.attr('class');

               if (css == "lianlian-td") {
                 if (check(node)) {
                   node
                     .addClass("lianlian-td-selected");
                 }
               } else {
                 node
                   .removeClass("lianlian-td-selected");
               }
             });
           tr.append(td);
           tds.push(td);
         }
       }
     };

     Game.prototype.title = function() {
      this.titleNode.text(titleText)

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
       var trs = ranSort(this.tds);

       var gridsNode = this.gridsNode;

       for (var k = 0; k < N * N; k += 2) {
         var url = randint(picList);

         trs[k]
           .css({
             'backgroundImage': 'url(' + url + ')'
           })
           .attr('imgType', curType);

         trs[k + 1]
           .css({
             'backgroundImage': 'url(' + url + ')'
           })
           .attr('imgType', curType);
       }
       curType = null;
     };

     function check(node) {
      console.log(selected,node)
       if (!selected) {
         selected = node;
         return true;
       } else if (selected) {
         if (node.attr('imgType') === selected.attr('imgType')) {
           node.fadeOut();
           selected.fadeOut();
           selected = null
         } else {
           return false;
         }
       }
     }

     exports.Game = Game;
   })(window);
