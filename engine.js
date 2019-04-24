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

  _mapActiveMove(piece) {
    let moves;
    if (piece.name === "King") {
      moves = this._calculatePossibleCastle(piece.side).concat(this._calculateMoves(piece).filter((elem) => {
        return !Game.isInCheck(piece.side, elem.x, elem.y);
      }));
    } else moves = this._calculateMoves(piece);
    moves = moves.filter((elem) => {
      return !Game.isInCheck(piece.side, false, false, [piece], [elem]);
    });
    return moves;
  }

  _mapActiveCapture(piece) {
    let captures;
    if (piece.name === "King") {
      captures = this._calculateCaptures(piece).filter((elem) => {
        return !Game.isInCheck(piece.side, elem.x, elem.y);
      });
    } else captures = this._calculateCaptures(piece);
    captures = captures.filter((elem) => {
      return !Game.isInCheck(piece.side, false, false, [piece], [elem]);
    });
    return captures;
  }

  _calculateMoves(piece, ignore, add) {
    const moves = piece.moves;
    if (ignore === undefined) ignore = [];
    if (add === undefined) add = [];
    let movesOut = [];
    for (let i = 0; i < moves.length; i++) {
      if (moves[i] instanceof Array) {
        const stack = moves[i].filter((elem) => {
          return elem.y <= 8 && elem.y >= 1 && elem.x >= 1 && elem.x <= 8;
        });
        let end = stack.findIndex((elem) => {
          const canBeIgnored = ignore.find((elem2) => {
            return elem2 === Game.pieceAt(elem.x, elem.y);
          });
          const isAddedPiece = add.find((elem2) => {
            return elem2.x === elem.x && elem2.y === elem.y;
          });
          return (!canBeIgnored && Game.pieceAt(elem.x, elem.y).active) || isAddedPiece;
        });
        if (end === -1) end = stack.length;
        movesOut = movesOut.concat(stack.slice(0, end));
      } else {
        if (!(moves[i].y <= 8 && moves[i].y >= 1 && moves[i].x <= 8 && moves[i].x >= 1)) continue;
        if (!ignore.find((elem) => {
            return elem === Game.pieceAt(moves[i].x, moves[i].y);
          })) {
          if (Game.pieceAt(moves[i].x, moves[i].y).active) continue;
          if (add.find((elem) => {
              return elem.x === moves[i].x && elem.y === moves[i].y;
            })) continue;
        }
        movesOut.push(moves[i]);
      }
    }
    return movesOut;
  }

  _calculateCaptures(piece, ignore, add) {
    const captures = piece.captures;
    const side = piece.side;
    if (ignore === undefined) ignore = [];
    if (add === undefined) add = [];
    let capturesOut = [];
    for (let i = 0; i < captures.length; i++) {
      if (captures[i] instanceof Array) {
        const stack = captures[i].filter((elem) => {
          return elem.y <= 8 && elem.y >= 1 && elem.x >= 1 && elem.x <= 8;
        });
        const capture = stack.find((elem) => {
          const canBeIgnored = ignore && ignore.find((elem2) => {
            return elem2 === Game.pieceAt(elem.x, elem.y);
          });
          const isAddedPiece = add.find((elem2) => {
            return elem2.x === elem.x && elem2.y === elem.y;
          });
          return (!canBeIgnored && Game.pieceAt(elem.x, elem.y).active) || isAddedPiece;
        });
        if (capture !== undefined && Game.pieceAt(capture.x, capture.y).side !== side) {
          capturesOut.push(capture);
        }
      } else {
        if (!(captures[i].y <= 8 && captures[i].y >= 1 && captures[i].x >= 1 && captures[i].x <= 8)) continue;
        if (Game.pieceAt(captures[i].x, captures[i].y).side === side) continue;
        if (!ignore.find((elem) => {
            return elem === Game.pieceAt(captures[i].x, captures[i].y);
          })) {
          if (!Game.pieceAt(captures[i].x, captures[i].y).active) continue;
          if (!add.find((elem) => {
              return elem.x === captures[i].x && elem.y === captures[i].y;
            })) continue;
        }
        capturesOut.push(captures[i]);
        capturesOut[capturesOut.length - 1].target = Game.pieceAt(captures[i].x, captures[i].y);
      }
    }
    return capturesOut;
  }

  activeMovesCaptures(piece) {
    return this._mapActiveMove(piece).concat(this._mapActiveCapture(piece));
  }

  possibleMovesCaptures(piece, ignore, add) {
    return this._calculateMoves(piece, ignore, add).concat(this._calculateCaptures(piece, ignore, add));
  }

  piecesThatCanCheck(pieces, x, y, ignore, add) {
    let moves = [];
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].name === "Pawn") {
        moves.push(pieces[i].captures.filter((elem) => {
          return elem.x === x && elem.y === y;
        }));
      } else {
        moves.push(this.possibleMovesCaptures(pieces[i], ignore, add).filter((elem) => {
          return elem.x === x && elem.y === y;
        }));
      }
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

  startMoveCommand(piece) {
    if (this._moveInProgress) {
      this._moveInProgress = false;
      this._movingPiece = null;
    } else {
      this._moveInProgress = true;
      this._movingPiece = piece;
    }
    this._possibleMoves = this._mapActiveMove(piece);
    this._possibleCaptures = this._mapActiveCapture(piece);
    return this._moveInProgress;
  }

  completeMoveCommand(x, y) {
    if (this._movingPiece.name === "King" && Game.pieceAt(x, y).name === "Rook" && Game.pieceAt(x, y).side === this._movingPiece.side) this._completeCastle(x, y);
    else this._movingPiece.moveTo(x, y);

    return this._movingPiece;
  }
}