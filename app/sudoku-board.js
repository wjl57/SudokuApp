'use strict';

var all_possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

class SudokuCell {
  constructor(y, x, val) {
    this.y = y;
    this.x = x;
    this.block_num = this.loc_to_block_num(y, x);
    this.name = "c" + this.y + this.x + this.block_num;
    if (val === null) {
      this.val = null;
      this.possibilities = JSON.parse(JSON.stringify(all_possibilities));
    } else {
      this.set_val(val);
    }
  }

  set_val(val) {
    this.val = val;
    this.possibilities = new Set([val]);
  }

  loc_to_block_num(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  }
}

class SudokuBoard {
  constructor(board) {
    var nestedList = [[], [], [], [], [], [], [], [], []];
    this.board = JSON.parse(JSON.stringify(nestedList));
    this.cells_dict = {};
    this.y_cell_list = JSON.parse(JSON.stringify(nestedList));
    this.x_cell_list = JSON.parse(JSON.stringify(nestedList));
    this.block_cell_list = JSON.parse(JSON.stringify(nestedList));

    if (!board) {
      for (var y=0; y<9; y++) {
        for (var x=0; x<9; x++) {
          var cell = new SudokuCell(y, x);
          this.board[y].push(cell.name);
          this.y_cell_list[cell.y].push(cell.name);
          this.x_cell_list[cell.x].push(cell.name);
          this.block_cell_list[cell.block_num].push(cell.name);
        }
      }
      // console.log("board" + this.board);
      // console.log("y " + this.y_cell_list);
      // console.log("x " + this.x_cell_list);
      // console.log("block " + this.block_cell_list);
    } else {

    }
  }


}

let b = new SudokuBoard();
// console.log(all_possibilities);
// all_possibilities.add(1);
// console.log(all_possibilities);
// all_possibilities.add(15);
// console.log(all_possibilities);
// all_possibilities.delete(15);
// console.log(all_possibilities);
//
// console.log(all_possibilities.has(1));
// console.log(all_possibilities.has(15));

// var board = [];
// var cells_dict = {};
// for (var y=0; y<9; y++) {
//   board.push([]);
//   for (var x=0; x<9; x++) {
//     var cell = new SudokuCell(y, x);
//     board[y].push(cell.name);
//   }
// }
// console.log(board);
