class GameClass {
  constructor() {
    this.board = new Board();
    this.engine = new Engine();
    this.turn = "white";
    this.turnsTaken = 0;
  }

  init() {
    this.board.init();
    //this.engine.init();
  }

  updatePosOf(piece, oldPos) {
    this.board.move(piece, oldPos);
  }

  draw() {
    this.board.draw();
  }

  pieceAt(x, y) {
    return this.board.cellFromCoord(x, y);
  }

  highlightAt(x, y) {
    this.board.highlight(x, y);
  }

  highlightKing(side, state) {
    this.board.highlightCheck(side, state);
  }

  nextTurn() {
    if (this.turn === "white") this.turn = "black";
    else this.turn = "white";
    this.turnsTaken++;
  }

  highlightAllMoves() {
    let all = this.engine.moves.concat(this.engine.captures);
    for (let i = 0; i < all.length; i++) {
      const move = all[i];
      this.highlightAt(move.x, move.y);
    }
  }

  allPieces(side) {
    return this.board.allPieces(side);
  }

  findKing(side) {
    return this.board.findKing(side);
  }

  isInCheck(side, altx, alty) {
    let pos = this.findKing(side).pos;
    if (altx !== undefined && alty !== undefined && altx !== false && alty !== false) {
      pos.x = altx;
      pos.y = alty;
    }
    const checkSide = side === "white" ? "black" : "white";
    const pieceList = this.allPieces(checkSide);
    let canCheck = this.engine.piecesThatCanCheck(pieceList, pos.x, pos.y).indexOf(true);
    return canCheck > -1;
  }

  isCheckMate(side) {
    let basicCheck = this.engine.possibleMovesCaptures(this.findKing(side).moves, this.findKing(side).captures, side, true).length === 0 && this.isInCheck(side);
    if (!basicCheck) return false;
    const otherSide = side === "white" ? "black" : "white";
    let pieces = this.allPieces(otherSide);
    let checks = this.engine.piecesThatCanCheck(pieces, this.findKing(side).pos.x, this.findKing(side).pos.y);
    pieces = pieces.filter((_elem, id) => {
      return checks[id];
    });
    for (let i = 0; i < pieces.length; i++) {
      if (this.isInCheck(otherSide, pieces[i].pos.x, pieces[i].pos.y)) {
        return false;
      }
    }
    return true;
  }

  mapMoves(piece, moves, captures) {
    if (piece.side === this.turn) {
      if (piece === this.engine.piece) {
        this.highlightAllMoves();
        this.engine.clearMoveCommand();
      } else {
        this.highlightAllMoves();
        this.engine.clearMoveCommand();
        this.engine.startMoveCommand(piece, moves, captures);
        this.highlightAllMoves();
      }
    } else {
      this.highlightAllMoves();
      this.engine.clearMoveCommand();
    }
    this.draw();
  }

  completeMove(x, y) {
    if (this.pieceAt(x, y).active) this.pieceAt(x, y).die();
    let oldPos = this.engine.piece.pos;
    this.highlightAllMoves();
    this.updatePosOf(this.engine.completeMoveCommand(x, y), oldPos);
    this.engine.clearMoveCommand();
    if (!this.isInCheck(this.turn)) this.highlightKing(this.turn, false);
    this.nextTurn();
    if (this.isInCheck(this.turn)) {
      if (this.isCheckMate(this.turn)) {
        console.log(this.turn.slice(0, 1).toUpperCase() + this.turn.slice(1) + " has been checkmated!");
      }
      this.highlightKing(this.turn, true);
    }
    this.draw();
  }
}

function init() {
  window.Game = new GameClass();
  Game.init();
  Game.draw();
}