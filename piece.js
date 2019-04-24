class ChessPiece {
  constructor(name, posx, posy, forward, color) {
    this._name = name;
    this._x = posx;
    this._y = posy;
    this._forward = forward;
    this._color = color;
    this._turns = 0;
    this._alive = true;
    this._highlight = false;
  }

  get name() {
    return this._name;
  }

  get hasMoved() {
    return this._turns > 0;
  }

  get pos() {
    return {
      x: this._x,
      y: this._y
    };
  }

  get highlight() {
    return this._highlight;
  }

  set highlight(value) {
    this._highlight = value;
  }

  get side() {
    return this._color;
  }

  get active() {
    return this._alive;
  }

  get captures() {
    return this.moves;
  }

  get check() {
    return false;
  }

  click() {
    console.log(this);
    Game.mapMoves(this, this.moves, this.captures);
  }

  moveTo(x, y) {
    this._turns++;
    this._x = x;
    this._y = y;
  }

  die() {
    this._alive = false;
  }

}


class Pawn extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if (side === "black") dir = -1;
    super('Pawn', posx, posy, dir, side);
  }

  get display() {
    if (this._color === "black") return '\u265f';
    if (this._color === "white") return '\u2659';
  }

  get moves() {
    let move = [];


    if ((this._y === 7 && this._color === "black") || (this._y === 2 && this._color === "white")) {
      move.push([{
        x: this._x,
        y: this._y + this._forward
      }, {
        x: this._x,
        y: this._y + this._forward * 2
      }]);
    } else {
      move.push({
        x: this._x,
        y: this._y + this._forward
      });
    }
    return move;
  }

  get captures() {
    let capture = [];
    capture.push({
      x: this._x + 1,
      y: this._y + this._forward
    }, {
      x: this._x - 1,
      y: this._y + this._forward
    });
    return capture;
  }

}

class Knight extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if (side === "black") dir = -1;
    super('Knight', posx, posy, dir, side);
  }

  get display() {
    if (this._color === "black") return '\u265e';
    if (this._color === "white") return '\u2658';
  }

  get moves() {
    return [{
      x: this._x + 2,
      y: this._y + 1
    }, {
      x: this._x + 2,
      y: this._y - 1
    }, {
      x: this._x - 2,
      y: this._y - 1
    }, {
      x: this._x - 2,
      y: this._y + 1
    }, {
      x: this._x + 1,
      y: this._y + 2
    }, {
      x: this._x + 1,
      y: this._y - 2
    }, {
      x: this._x - 1,
      y: this._y - 2
    }, {
      x: this._x - 1,
      y: this._y + 2
    }];
  }
}

class Rook extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if (side === "black") dir = -1;
    super('Rook', posx, posy, dir, side);
  }

  get display() {
    if (this._color === "black") return '\u265c';
    if (this._color === "white") return '\u2656';
  }

  get moves() {
    let move = [];
    for (let i = 1; i <= 4; i++) {
      let dir = {
        x: 0,
        y: 0,
      };
      switch (i) {
        case 1:
          dir.x = 1;
          break;
        case 2:
          dir.x = -1;
          break;
        case 3:
          dir.y = 1;
          break;
        case 4:
          dir.y = -1;
          break;
      }
      let moveStack = [];
      for (let j = 1; j <= 8; j++) {
        moveStack.push({
          x: this._x + j * dir.x,
          y: this._y + j * dir.y
        });
      }
      move.push(moveStack);
    }
    return move;
  }
}

class Bishop extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if (side === "black") dir = -1;
    super('Bishop', posx, posy, dir, side);
  }

  get display() {
    if (this._color === "black") return '\u265d';
    if (this._color === "white") return '\u2657';
  }

  get moves() {
    let move = [];
    for (let i = 1; i <= 4; i++) {
      let dir = {
        x: 0,
        y: 0,
      };
      switch (i) {
        case 1:
          dir.x = 1;
          dir.y = 1;
          break;
        case 2:
          dir.x = 1;
          dir.y = -1;
          break;
        case 3:
          dir.x = -1;
          dir.y = 1;
          break;
        case 4:
          dir.x = -1;
          dir.y = -1;
          break;
      }
      let moveStack = [];
      for (let j = 1; j <= 8; j++) {
        moveStack.push({
          x: this._x + j * dir.x,
          y: this._y + j * dir.y
        });
      }
      move.push(moveStack);
    }
    return move;
  }
}

class Queen extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if (side === "black") dir = -1;
    super('Queen', posx, posy, dir, side);
  }

  get display() {
    if (this._color === "black") return '\u265b';
    if (this._color === "white") return '\u2655';
  }

  get moves() {
    let move = [];
    for (let i = 1; i <= 8; i++) {
      let dir = {
        x: 0,
        y: 0,
      };
      switch (i) {
        case 1:
          dir.x = 1;
          break;
        case 2:
          dir.x = -1;
          break;
        case 3:
          dir.y = 1;
          break;
        case 4:
          dir.y = -1;
          break;
        case 5:
          dir.x = 1;
          dir.y = 1;
          break;
        case 6:
          dir.x = 1;
          dir.y = -1;
          break;
        case 7:
          dir.x = -1;
          dir.y = 1;
          break;
        case 8:
          dir.x = -1;
          dir.y = -1;
          break;
      }
      let moveStack = [];
      for (let j = 1; j <= 8; j++) {
        moveStack.push({
          x: this._x + j * dir.x,
          y: this._y + j * dir.y
        });
      }
      move.push(moveStack);
    }
    return move;
  }

}

class King extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if (side === "black") dir = -1;
    super('King', posx, posy, dir, side);
    this._check = false;
  }

  get display() {
    if (this._color === "black") return '\u265a';
    if (this._color === "white") return '\u2654';
  }

  get check() {
    return this._check;
  }

  get moves() {
    return [{
      x: this._x,
      y: this._y + 1
    }, {
      x: this._x,
      y: this._y - 1
    }, {
      x: this._x + 1,
      y: this._y
    }, {
      x: this._x - 1,
      y: this._y
    }, {
      x: this._x + 1,
      y: this._y + 1
    }, {
      x: this._x + 1,
      y: this._y - 1
    }, {
      x: this._x - 1,
      y: this._y + 1
    }, {
      x: this._x - 1,
      y: this._y - 1
    }];
  }

  set check(value) {
    this._check = value;
  }
}

const PIECES = {
  'Pawn': Pawn,
  'Knight': Knight,
  'Rook': Rook,
  'Bishop': Bishop,
  'Queen': Queen,
  'King': King,
};