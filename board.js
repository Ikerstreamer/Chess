class Board {
  constructor() {
    this._elem = document.getElementById('chessBoard');
    this._grid = [];
    for (let i = 0; i < 8; i++) {
      this._grid.push([]);
      for (let j = 0; j < 8; j++) {
        this._grid[i].push(this._createCellAt(j + 1, 8 - i));
      }
    }
  }

  cellFromCoord(x, y) {
    return this._grid[8 - y][x - 1];
  }

  coordFromIndex(i, j) {
    return {
      x: j + 1,
      y: 8 - i
    };
  }

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

  spawnPieceAt(name, x, y, side) {
    return new PIECES[name](x, y, side);
  }

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

  highlight(x, y) {
    this.cellFromCoord(x, y).highlight = !this.cellFromCoord(x, y).highlight;
  }

  highlightCheck(side, state) {
    this.findKing(side).check = state;
  }

  move(piece, oldPos) {
    const newPos = piece.pos;
    this._grid[8 - newPos.y][newPos.x - 1] = piece;
    this._grid[8 - oldPos.y][oldPos.x - 1] = this._emptyCell(oldPos.x, oldPos.y);
  }

  allPieces(side) {
    let output = [];
    for (let i = 0; i < this._grid.length; i++) {
      output = output.concat(this._grid[i].filter((elem) => {
        return elem.active && elem.side === side;
      }));
    }
    return output;
  }

  findKing(side) {
    for (let i = 0; i < this._grid.length; i++) {
      let find = this._grid[i].find((elem) => {
        return elem.active && elem.side === side && elem.name === "King";
      });
      if (find) return find;
    }
  }

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