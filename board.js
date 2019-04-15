class Board {
  constructor() {
    this._elem = document.getElementById('chessBoard');
    this._grid = [];
      for(let i = 0; i < 8; i++){
      this._grid.push([]);
      for(let j = 0; j < 8; j++){
        this._grid[i].push(this._createCell( 8 - j,  8 - i));
      }
    }
  }

  cellFromCoord(x, y){
    return this._grid[8 - y][8 - x];
  }

  _createCell(x, y) {
    if(y === 7){
      //spawns black pawns
      return new Pawn(x, y, "black");
    }
    if(y === 2) {
      //spawns white pawns
      return new Pawn(x, y, "white");
    }
    let order = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];
    if(y === 1){
      return new PIECES[order[x - 1]](x, y, "white");
    }
    if(y === 8){
      return new PIECES[order[x - 1]](x, y, "black");
    }

    return {
      display: '',
      onclick: () => {},
      active: false
    };
  }

  init() {
    for(let i = 0; i < this._grid.length; i++){
      for(let j = 0; j < this._grid[i].length; j++){
        let cell = this._elem.rows[i].cells[j];
        let color = (j + i + 1 % 2) % 2 ? "white" : "#49332d";
        cell.style.backgroundColor = color;
        cell.style.color = "black";
      }
    }
  }

  draw(){
    for(let i = 0; i < this._grid.length; i++){
      for(let j = 0; j < this._grid[i].length; j++){
        let cell = this._elem.rows[i].cells[j];
        cell.innerHTML = this._grid[i][j].display;
        cell.onclick = () => {this._grid[i][j].click();};
        if (this._grid[i][j].active) cell.style.cursor = "pointer";
        else cell.style.cursor = "defualt";
      }
    }
  }

}
