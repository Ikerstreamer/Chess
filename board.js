class Board {
  constructor() {
    //contructor for the board class defining all its private variable and populating its grid instance
    this._elem = document.getElementById('chessBoard');
    this._grid = [];
    for (let i = 0; i < 8; i++) {
      this._grid.push([]);
      for (let j = 0; j < 8; j++) {
        this._grid[i].push(this._createCellAt(j + 1, 8 - i));
      }
    }
  }

  // returns a reference to the piece or empty cell found at [x, y]
  cellFromCoord(x, y) {
    return this._grid[8 - y][x - 1];
  }

  // given a 2d array index of [i, j] returns a mapped [x, y]
  coordFromIndex(i, j) {
    return {
      x: j + 1,
      y: 8 - i
    };
  }

  // creates a new empty cell at a given [x, y]
  _emptyCell(x, y) {
    let obj = {
      x: x,
      y: y,
      display: '',
      click: () => {
        console.log(obj);
      },
      active: false,
      highlight: false
    };
    return obj;
  }

  // spawns in a given named piece at a given [x, y] with a derfined side
  spawnPieceAt(name, x, y, side) {
    return new PIECES[name](x, y, side);
  }

  // creates the correct starting cell at a given [x, y]
  _createCellAt(x, y) {
    if (y === 7) {
      //spawns black pawns
      return new Pawn(x, y, "black");
    }
    if (y === 2) {
      //spawns white pawns
      return new Pawn(x, y, "white");
    }
    let order = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];
    if (y === 1) {
      return new PIECES[order[x - 1]](x, y, "white");
    }
    if (y === 8) {
      return new PIECES[order[x - 1]](x, y, "black");
    }
    return this._emptyCell(x, y);
  }

  // set the piece at the position defined by [x, y] to be highlighted on the next draw iteration
  highlight(x, y) {
    this.cellFromCoord(x, y).highlight = !this.cellFromCoord(x, y).highlight;
  }

  // set the king of a given side to be highlighted on the next draw iteration
  highlightCheck(side, state) {
    this.findKing(side).check = state;
  }

  // updates the position of a given piece, deleting dual instances if need be
  move(piece, oldPos) {
    const newPos = piece.pos;
    this._grid[8 - newPos.y][newPos.x - 1] = piece;
    this._grid[8 - oldPos.y][oldPos.x - 1] = this._emptyCell(oldPos.x, oldPos.y);
  }

  // returns an array of references to all pieces of a given side
  allPieces(side) {
    let output = [];
    for (let i = 0; i < this._grid.length; i++) {
      output = output.concat(this._grid[i].filter((elem) => {
        return elem.active && elem.side === side;
      }));
    }
    return output;
  }

  // retruns a reference to the King class of a given side as it is found in the private grid instance
  findKing(side) {
    for (let i = 0; i < this._grid.length; i++) {
      let find = this._grid[i].find((elem) => {
        return elem.active && elem.side === side && elem.name === "King";
      });
      if (find) return find;
    }
  }

  // initializes the table to a starting chess board
  init() {
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid[i].length; j++) {
        let cell = this._elem.rows[i].cells[j];
        let color = (j + i + 1 % 2) % 2 ? "white" : "#49332d";
        cell.style.backgroundColor = color;
        cell.style.color = "black";
      }
    }
  }

  // redraws the table from the private updated grid instance
  draw() {
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid[i].length; j++) {
        let cell = this._elem.rows[i].cells[j];
        let piece = this._grid[i][j];
        cell.getElementsByClassName("pieceDisplay")[0].textContent = piece.display;
        cell.onclick = () => {
          piece.click();
        };
        if (piece.highlight || piece.check) {
          cell.getElementsByClassName("highlight")[0].style.visibility = "visible";
          if (piece.check) {
            cell.getElementsByClassName("highlight")[0].style.backgroundColor = "rgba(255, 75, 75, 0.45)";
          } else {
            cell.getElementsByClassName("highlight")[0].style.backgroundColor = "";
            cell.onclick = () => {
              Game.completeMove(this.coordFromIndex(i, j).x, this.coordFromIndex(i, j).y);
            };
          }
        } else cell.getElementsByClassName("highlight")[0].style.visibility = "hidden";
        cell.style.cursor = "default";
        if ((piece.active && piece.side === Game.turn) || piece.highlight) {
          cell.style.cursor = "pointer";
        }

      }
    }
  }

}