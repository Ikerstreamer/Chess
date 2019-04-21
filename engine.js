class Engine {
  constructor() {
    this._movingPiece = null;
    this._moveInProgress = false;
    this._possibleMoves = [];
    this._possibleCaptures = [];
  }

  get moves() {
    return this._possibleMoves;
  }

  get piece() {
    return this._movingPiece;
  }

  get captures() {
    return this._possibleCaptures;
  }

  _clearMoves() {
    this._possibleMoves = [];
  }

  _clearCaptures() {
    this._possibleCaptures = [];
  }

  _calculatePossibleCastle(side) {
    const king = Game.findKing(side);
    if (king.hasMoved || Game.isInCheck(side)) return [];
    return Game.allPieces(side).filter((elem) => {
      return elem.name === "Rook" && !elem.hasMoved;
    }).filter((elem) => {
      const dir = (king.pos.x - elem.pos.x) / Math.abs(king.pos.x - elem.pos.x);
      for (let i = elem.pos.x + dir; i !== king.pos.x; i += dir) {
        if (Game.pieceAt(i, king.pos.y).active || Game.isInCheck(side, i, king.pos.y)) return false;
      }
      return true;
    }).map((elem) => {
      return {
        x: elem.pos.x,
        y: elem.pos.y
      };
    });
  }

  _completeCastle(x, y) {
    const king = this._movingPiece;
    const dir = (x - king.pos.x) / Math.abs(x - king.pos.x);
    const rook = Game.pieceAt(x, y);
    rook.moveTo(king.pos.x + dir, y);
    Game.updatePosOf(rook, {
      x: x,
      y: y
    });
    king.moveTo(king.pos.x + 2 * dir, king.pos.y);
  }

  _calculateMoves(moves, side, king, ignore) {
    let movesOut = [];
    if (king) movesOut = this._calculatePossibleCastle(side);
    for (let i = 0; i < moves.length; i++) {
      if (moves[i] instanceof Array) {
        const stack = moves[i].filter((elem) => {
          return elem.y <= 8 && elem.y >= 1 && elem.x >= 1 && elem.x <= 8;
        });
        let end = stack.findIndex((elem) => {
          let kingCheck = ignore && Game.pieceAt(elem.x, elem.y).name === "King" && Game.pieceAt(elem.x, elem.y).side !== side;
          return Game.pieceAt(elem.x, elem.y).active && !kingCheck;
        });
        if (end === -1) end = stack.length;
        movesOut = movesOut.concat(stack.slice(0, end));
      } else {
        const onBoard = moves[i].y <= 8 && moves[i].y >= 1 && moves[i].x <= 8 && moves[i].x >= 1;
        if (onBoard && !Game.pieceAt(moves[i].x, moves[i].y).active) {
          if ((king && Game.isInCheck(side, moves[i].x, moves[i].y))) continue;
          movesOut.push(moves[i]);
        }
      }
    }
    return movesOut;
  }

  _calculateCaptures(captures, side, king) {
    let capturesOut = [];
    for (let i = 0; i < captures.length; i++) {
      if (captures[i] instanceof Array) {
        const stack = captures[i].filter((elem) => {
          return elem.y <= 8 && elem.y >= 1 && elem.x >= 1 && elem.x <= 8;
        });
        const capture = stack.find((elem) => {
          return Game.pieceAt(elem.x, elem.y).active;
        });
        if (capture !== undefined && Game.pieceAt(capture.x, capture.y).side !== side) {
          capturesOut.push(capture);
        }
      } else {
        const onBoard = captures[i].y <= 8 && captures[i].y >= 1 && captures[i].x >= 1 && captures[i].x <= 8;
        if (onBoard && Game.pieceAt(captures[i].x, captures[i].y).active && Game.pieceAt(captures[i].x, captures[i].y).side !== side) {
          if (king && Game.isInCheck(side, captures[i].x, captures[i].y)) continue;
          capturesOut.push(captures[i]);
          capturesOut[capturesOut.length - 1].target = Game.pieceAt(captures[i].x, captures[i].y);
        }
      }
    }
    return capturesOut;
  }

  possibleMovesCaptures(moves, captures, side, king, ignore) {
    return this._calculateMoves(moves, side, king, ignore).concat(this._calculateCaptures(captures, side, king));
  }

  piecesThatCanCheck(pieces, x, y) {
    let moves = [];
    for (let i = 0; i < pieces.length; i++) {
      moves.push(this.possibleMovesCaptures(pieces[i].moves, pieces[i].captures, pieces[i].side, false, true).filter((elem) => {
        return elem.x === x && elem.y === y;
      }));
    }
    return moves.map((elem) => {
      return elem.length > 0;
    });
  }

  clearMoveCommand() {
    this._moveInProgress = false;
    this._movingPiece = null;
    this._clearMoves();
    this._clearCaptures();
  }

  startMoveCommand(piece, moves, captures) {
    if (this._moveInProgress) {
      this._moveInProgress = false;
      this._movingPiece = null;
    } else {
      this._moveInProgress = true;
      this._movingPiece = piece;
    }
    this._possibleMoves = this._calculateMoves(moves, piece.side, piece.name === "King");
    this._possibleCaptures = this._calculateCaptures(captures, piece.side, piece.name === "King");
    return this._moveInProgress;
  }

  completeMoveCommand(x, y) {
    if (this._movingPiece.name === "King" && Game.pieceAt(x, y).name === "Rook" && Game.pieceAt(x, y).side === this._movingPiece.side) this._completeCastle(x, y);
    else this._movingPiece.moveTo(x, y);
    return this._movingPiece;
  }
}