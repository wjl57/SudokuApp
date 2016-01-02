'use strict';

var SudokuCell = function(y, x) {
  var y = y;
  var x = x;
  var block_num = this.loc_to_block_num(y, x);

  var loc_to_block_num = function(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  };
}




// class sudoku-cell {
//   constructor(y, x) {
//     this.y = y;
//     this.x = x;
//     this.block_num = loc_to_block_num(y, x);
//   }
// }

// export class Token {
//   constructor(p) {
//     this.type = p.type
//     this.value = p.value
//     this.start = p.start
//     this.end = p.end
//     if (p.options.locations)
//       this.loc = new SourceLocation(p, p.startLoc, p.endLoc)
//     if (p.options.ranges)
//       this.range = [p.start, p.end]
//   }
// }
