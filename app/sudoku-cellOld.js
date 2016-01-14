// 'use strict';
//
// import React from "react";
//
// var all_possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
//
// export default React.createClass({
//   getInitialState: function() {
//     if (!this.props.val || this.props.val === null) {
//       this.val = null;
//       this.possibilities = JSON.parse(JSON.stringify(all_possibilities));
//     } else {
//       this.val = this.set_val(this.props.val);
//     }
//     // TODO: Pass in block_num and name as props (they don't change)
//     var block_num = this.loc_to_block_num(this.props.y, this.props.x);
//     return {
//       y: this.props.y,
//       x: this.props.x,
//       block_num: block_num,
//       name: "c" + this.props.y + this.props.x + block_num,
//       val: this.val,
//       possibilities: this.possibilities
//     };
//   },
//
//   render: function() {
//     return (
//       <div>
//         {this.state.name} {this.state.val} {this.state.possibilities}
//       </div>
//     );
//   },
//
//   loc_to_block_num(y, x) {
//     return Math.floor(x/3) + Math.floor(y/3)*3;
//   },
//
//   remove_candidate(candidate) {
//     this.possibilities.delete(candidate);
//   },
//
//   set_val(val) {
//     this.val = val;
//     // this.possibilities = new Set([val]);
//     this.possibilities = new Set();
//     this.possibilities.add(val);
//   }
// });
