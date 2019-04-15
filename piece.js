class ChessPiece {
  constructor(name, posx, posy, forward, color) {
    this._name = name;
    this._x = posx;
    this._y = posy;
    this._forward = forward;
    this._color = color;
    this._alive = true;
    this._highlight = false;
  }

  get name(){
    return this._name;
  }

  get pos(){
    return {
      x: this._x,
      y: this._y
    };
  }

  get active(){
    return this._alive;
  }

  moveTo(x, y) {
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
    if(side === "white") dir = -1;
    super('Pawn', posx, posy, dir, side);
  }

  get display(){
    if(this._color === "black") return '\u265f';
    if(this._color === "white") return '\u2659';
  }

  click() {
    let move = [];
    let capture = [];
    move.push({ 
      x: this._x,
      y: this._y + this._forward
    });

    if ((this._y === 2 && this._color === "black") || (this._y === 7 && this._color === "white")) {
      move.push({
        x: this._x + 1,
        y: this._y += this._forward * 2
      });
    }
    capture.push({
      x: this._x + 1,
      y: this._y + this._forward
    }, {
      x: this._x - 1,
      y: this._y + this._forward
    });
    Game.mapMoves(this,  move, capture);
  }
  
}

class Knight extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if(side === "black") dir = -1;
    super('Knight', posx, posy, dir, side);
  }

  get display(){
    if(this._color === "black") return '\u265e';
    if(this._color === "white") return '\u2658';
  }

  click() {

  }

}

class Rook extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if(side === "black") dir = -1;
    super('Rook', posx, posy, dir, side);
  }

  get display(){
    if(this._color === "black") return '\u265c';
    if(this._color === "white") return '\u2656';
  }

  click() {

  }

}

class Bishop extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if(side === "black") dir = -1;
    super('Bishop', posx, posy, dir, side);
  }

  get display() {
    if(this._color === "black") return '\u265d';
    if(this._color === "white") return '\u2657';
  }

  click() {

  }

}

class Queen extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if(side === "black") dir = -1;
    super('Queen', posx, posy, dir, side);
  }

  get display(){
    if(this._color === "black") return '\u265b';
    if(this._color === "white") return '\u2655';
  }

  click() {

  }

}

class King extends ChessPiece {
  constructor(posx, posy, side) {
    let dir = 1;
    if(side === "black") dir = -1;
    super('King', posx, posy, dir, side);
  }

  get display(){
    if(this._color === "black") return '\u265a';
    if(this._color === "white") return '\u2654';
  }

  click() {

  }

}

const PIECES = {
  'Pawn' : Pawn,
  'Knight' : Knight,
  'Rook' : Rook,
  'Bishop' : Bishop,
  'Queen' : Queen,
  'King' : King,
}
