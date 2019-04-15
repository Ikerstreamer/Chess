class Engine {
  constructor(){

  }

  init(){
    
  }

  calculateMoves(moves){
    let movesOut = [];
    for(let i = 0; i < moves.length; i++){
      if (moves[i].y <= 8 && moves[i].y >= 1 && moves[i].x <= 8 && moves[i].x >= 1 && !Game.pieceAt(moves[i].x, moves[i].y).active) {
        movesOut.push(moves[i]);
      }
    }
    return movesOut;
  }

  calculateCaptures(captures) {
    let capturesOut = [];
    for (let i = 0; i < captures.length; i++) {
      if (captures[i].y <= 8 && captures[i].y >= 1 && captures[i].x >= 1 && captures[i].x <= 8 && !Game.pieceAt(captures[i].x, captures[i].y).active) {
        capturesOut.push(captures[i]);
        capturesOut[capturesOut.length - 1].target = game.pieceAt(captures[i].x, captures[i].y);
      }
    }
    return capturesOut;
  }


}
