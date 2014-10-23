
(function(exports){

  function Board(text){
    var board = this.board = $('<div class="board"></div>').text(text);
    $('body').append(board);
  };

  Board.prototype.black = function() {
    this.board.css('background','#000');
  };


  exports.Board = Board;

})(window)
