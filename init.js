class GameClass {
  constructor() {
    this.board = new Board();
    this.engine = new Engine();
  }
  init(){
    this.board.init();
    this.engine.init();
  }
  draw(){
    this.board.draw();
  }

  mapMoves(piece, moves, captures) {
    this.engine.calculateMoves(moves);
    this.engine.calculateCaptures(captures);
  }

  pieceAt(x, y){
    return this.board.cellFromCoord(x, y);
  }

}

function init() {
  window.Game = new GameClass();
  Game.init();
  Game.draw();
}
