'use strict';

import React from "react";

var all_possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
var g;
export default React.createClass({
  getInitialState: function() {
    var val;
    var possibilities;
    if (this.props.val === null) {
      val = null;
      possibilities = JSON.parse(JSON.stringify(all_possibilities));
    } else {
      val = this.set_val(this.props.val);
    }
    // TODO: Pass in block_num and name as props (they don't change)
    var block_num = this.loc_to_block_num(this.props.y, this.props.x);
    return {
      y: this.props.y,
      x: this.props.x,
      block_num: block_num,
      name: "c" + this.props.y + this.props.x + block_num,
      val: this.val,
      possibilities: this.possibilities
    };
  },

  render: function() {
    g = this.state;
    return (
      <div className="SudokuCell">
        {this.state.name}
      </div>
    );
  },

  loc_to_block_num(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  },

  remove_candidate(candidate) {
    this.possibilities.delete(candidate);
  },

  set_val(val) {
    this.val = val;
    // this.possibilities = new Set([val]);
    this.possibilities = new Set();
    this.possibilities.add(val);
  }
});




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
