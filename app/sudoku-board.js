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

  remove_candidate(candidate) {
    this.possibilities.delete(candidate);
  }

  set_val(val) {
    this.val = val;
    // this.possibilities = new Set([val]);
    this.possibilities = new Set();
    this.possibilities.add(val);
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

  set_val_in_board(y, x, val) {
    var cell_name = this.board[y][x];
    this.set_val_in_board_by_cell_name(cell_name, val);
  }

  set_val_in_board_by_cell_name(cell_name, val) {
    var cell = this.cells_dict[cell_name];
    cell.set_val(val);
  }

  validate_board() {
    // illegal_cells contains a list with the names of the cells that fail sudoku rules
    function validate_group(cell_list, illegal_cells) {
      var filled_candidates = new Set();
      for (var i = 0; i < cell_list.length; i++) {
        var cell = this.cells_dict[cell_list[i]];
        if (cell.val !== null) {
          if (filled_candidates.has(cell.val)) {
            illegal_cells.push(cell.name);
          } else {
            filled_candidates.add(cell.val);
          }
        }
      }
      return illegal_cells;
    }
    var illegal_cells = [];
    for (var y = 0; y < this.y_cell_list.length; y++) {
      var cell_list = this.y_cell_list[y];
      illegal_cells = validate_group(cell_list, illegal_cells);
    }
    for (var x = 0; y < this.x_cell_list.length; x++) {
      var cell_list = this.x_cell_list[x];
      illegal_cells = validate_group(cell_list, illegal_cells);
    }
    for (var block_num = 0; block_num < this.block_cell_list.length; block_num++) {
      var cell_list = this.block_cell_list[block_num];
      illegal_cells = validate_group(cell_list, illegal_cells);
    }
    return illegal_cells;

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
