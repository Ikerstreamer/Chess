class GameClass {
  constructor() {
    // contructor for GameClass which defines all its private variables
    // creates new Engine and Board classes which can be referenced
    this.board = new Board();
    this.engine = new Engine();
    this.turn = "white";
    this.turnsTaken = 0;
    this.checkedPlayer = null;
  }

  // start: utility functions referencing functions in sub class (board, engine)
  init() {
    this.board.init();
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

  spawnPiece(name, x, y, side) {
    return this.board.spawnPieceAt(name, x, y, side);
  }

  allPieces(side) {
    return this.board.allPieces(side);
  }

  findKing(side) {
    return this.board.findKing(side);
  }
  //end: utility functions

  // highlights all legal moves that the player can make with the selected piece
  highlightAllMoves() {
    let all = this.engine.moves.concat(this.engine.captures);
    for (let i = 0; i < all.length; i++) {
      const move = all[i];
      this.highlightAt(move.x, move.y);
    }
  }

  // increments the turn order by 1 swaping the active player (black, white)
  nextTurn() {
    if (this.turn === "white") this.turn = "black";
    else this.turn = "white";
    this.turnsTaken++;
  }

  // returns wheter or not a given side is in check at postion [altx, alty]
  // or the side's King's current position if left undefined or false
  isInCheck(side, altx, alty, ignore, add) {
    const pos = this.findKing(side).pos;
    let piecesToIgnore = [this.findKing(side)];
    let positionsToAdd = [];
    if (add && add.length > 0) positionsToAdd = positionsToAdd.concat(add);
    if (ignore && ignore.length > 0) piecesToIgnore = piecesToIgnore.concat(ignore);
    if (altx !== undefined && alty !== undefined && altx !== false && alty !== false) {
      pos.x = altx;
      pos.y = alty;
      positionsToAdd.push({
        x: altx,
        y: alty
      });
    }
    const checkSide = side === "white" ? "black" : "white";
    const pieceList = this.allPieces(checkSide);
    const canCheck = this.engine.piecesThatCanCheck(pieceList, pos.x, pos.y, piecesToIgnore, positionsToAdd).indexOf(true);
    return canCheck > -1;
  }

  // returns whether the king of a given side is in checkmate
  isCheckMate(side) {
    const king = this.findKing(side);
    let basicCheck = this.engine.activeMovesCaptures(king).length === 0 && this.isInCheck(side);
    if (!basicCheck) return false;
    const otherSide = side === "white" ? "black" : "white";
    let pieces = this.allPieces(otherSide);
    let checks = this.engine.piecesThatCanCheck(pieces, king.pos.x, king.pos.y);
    pieces = pieces.filter((_elem, id) => {
      return checks[id];
    });
    for (let i = 0; i < pieces.length; i++) {
      if (this.isInCheck(otherSide, pieces[i].pos.x, pieces[i].pos.y)) {
        return false;
      } else {
        let stackId;
        let stack = pieces[i].captures.find((elem) => {
          if (elem instanceof Array) {
            stackId = elem.findIndex((elem2) => {
              return elem2.x === king.pos.x && elem2.y === king.pos.y;
            });
            return stackId > -1;
          }
          return false;
        });
        if (!stack || stackId === 0) return true;
        for (let j = 0; j < stackId; j++) {
          if (this.isInCheck(otherSide, stack[j].x, stack[j].y)) return false;
        }
        return true;
      }
    }
    return true;
  }

  // starts the chain of functions requirred to initialize a move action
  // once an active piece is clicke. Uses references to the engine class
  mapMoves(piece) {
    if (piece.side === this.turn) {
      if (piece === this.engine.piece) {
        this.highlightAllMoves();
        this.engine.clearMoveCommand();
      } else {
        this.highlightAllMoves();
        this.engine.clearMoveCommand();
        this.engine.startMoveCommand(piece);
        this.highlightAllMoves();
      }
    } else {
      this.highlightAllMoves();
      this.engine.clearMoveCommand();
    }
    this.draw();
  }

  // completes the initialized move action once the destination is clicked.
  // once again uses references to the engine class
  completeMove(x, y) {
    let oldPos = this.engine.piece.pos;
    this.highlightAllMoves();
    this.updatePosOf(this.engine.completeMoveCommand(x, y), oldPos);
    this.engine.clearMoveCommand();
    if (!this.isInCheck(this.turn)) {
      this.highlightKing(this.turn, false);
      this.checkedPlayer = null;
    }
    this.nextTurn();
    if (this.isInCheck(this.turn)) {
      if (this.isCheckMate(this.turn)) {
        console.log(this.turn.slice(0, 1).toUpperCase() + this.turn.slice(1) + " has been checkmated!");
        setTimeout(init, 5000);
      }
      this.checkedPlayer = this.turn;
      this.highlightKing(this.turn, true);
    }
    this.draw();
  }
}

// initializes the game once the webpage has loaded
function init() {
  window.Game = new GameClass();
  Game.init();
  Game.draw();
}