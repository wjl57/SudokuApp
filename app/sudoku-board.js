'use strict';

import React from "react";
import SudokuCell from "./sudoku-cell";

export default React.createClass({
  getInitialState: function() {
    console.log("B " + JSON.stringify(this.props.board));
    var board_state = [];
    var block_num;
    var name;
    var val;
    var possibilities;
    var cell_state;

    for (var y = 0; y < 9; y++) {
      board_state.push([]);
      for (var x = 0; x < 9; x++) {
        cell_state = {};
        block_num = this.loc_to_block_num(y, x);
        name = "c" + y + x + block_num;
        val = this.props.board[y][x];
        if (val) {
          possibilities = new Set([val]);
          cell_state["mutable"] = false;
        } else {
          possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          cell_state["mutable"] = true;
        }
        cell_state["block_num"] = block_num;
        cell_state["name"] = name;
        cell_state["val"] = val;
        cell_state["possibilities"] = possibilities;
        board_state[y].push(cell_state);
      }
    }
    // console.log(board_state);
    return {"board_state": board_state};
  },

  render: function() {
    var rows = [];
    var cell_state;
    for (var y = 0; y < 9; y++) {
      var tds = [];
      for (var x = 0; x < 9; x++) {
        cell_state = this.state.board_state[y][x];
        var cell_props = {
          y: cell_state.y,
          x: cell_state.x,
          block: cell_state.block_num,
          name: cell_state.name
        }
        tds.push(
          <td>
            <SudokuCell {...cell_props}/>
          </td>
        );
      }
      var tr = React.createElement("tr", null, tds);
      rows.push(tr);
    }
    return (
      <div>
        <table>
        <tbody>
          {rows}
        </tbody>
        </table>
      </div>
    );
  },

  loc_to_block_num(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  },
});
