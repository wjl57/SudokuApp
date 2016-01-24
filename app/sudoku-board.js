'use strict';

import React from "react";
import SudokuCell from "./sudoku-cell";
window.m;

export default React.createClass({
  getInitialState: function() {
    window.m = this;
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
          // possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          possibilities = new Set([]);
          cell_state["mutable"] = true;
        }
        cell_state["y"] = y;
        cell_state["x"] = x;
        cell_state["block"] = block_num;
        cell_state["name"] = name;
        cell_state["val"] = val;
        cell_state["possibilities"] = possibilities;
        board_state[y].push(cell_state);
      }
    }

    var candidate = 1;
    return {
      "board_state": board_state,
      "candidate": candidate,
      "toggledKey": false
    };
  },

  render: function() {
    var rows = [];
    var cell_state;

    for (var y = 0; y < 9; y++) {
      var tds = [];
      for (var x = 0; x < 9; x++) {
        cell_state = this.state.board_state[y][x];

        var cell_props = {
          y: y,
          x: x,
          block: cell_state.block,
          name: cell_state.name,
          possibilities: cell_state.possibilities,
          val: cell_state.val,
          remove_candidate_callback: this.remove_candidate_callback,
          add_candidate_callback: this.add_candidate_callback,
          set_val_callback: this.set_val_callback,
          on_click_callback: this.on_click_callback
        };

        var tdStyle = {
          height: "1.4em",
          width: "1.4em",
          textAlign: "center",
          padding: 0,
          borderLeft: (x % 3 == 0) ? "solid medium" : "solid thin",
          borderRight: (x % 3 == 2) ? "solid medium" : "solid thin"
        };

        tds.push(
          <td style={tdStyle}>
            <SudokuCell {...cell_props}/>
          </td>
        );
      }

      var trStyle = {
        borderTop: (y % 3 == 0) ? "solid medium" : "solid thin",
        borderBottom: (y % 3 == 2) ? "solid medium" : "solid thin"
      };
      rows.push(<tr style={trStyle}>{tds}</tr>);
    }

    var boardProps = {
      style: {outline: "none"},
      tabIndex: 1,
      onKeyDown: this.handleKeyDown
    }
    var tableStyle = {
      borderCollapse: "collapse"
    };
    return (
      <div id="sudoku-board" {...boardProps}>
        <table style={tableStyle}>
        <tbody>
          {rows}
        </tbody>
        </table>
      </div>
    );
  },

  loc_to_block_num: function(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  },

  set_val_callback: function(y, x, candidate) {
    console.log("SET val: " + y + " " + x + " " + candidate);
  },

  remove_candidate_callback: function(y, x, candidate) {
    console.log("REM candidate: " + y + " " + x + " " + candidate);
    var newBoardState = this.state.board_state;
    newBoardState[y][x].possibilities.delete(candidate);
    this.setState({board_state: newBoardState});
  },

  add_candidate_callback: function(y, x, candidate) {
    console.log("ADD candidate: " + y + " " + x + " " + candidate);
    var newBoardState = this.state.board_state;
    newBoardState[y][x].possibilities.add(candidate);
    this.setState({board_state: newBoardState});
  },

  on_click_callback: function(y, x, set_val_callback, remove_candidate_callback, add_candidate_callback) {
    var cell_state = this.state.board_state[y][x];
    // If the cell isn't mutable, don't do anything
    if (!cell_state.mutable)
      return;
    if (cell_state.possibilities.has(this.state.candidate)) {
      remove_candidate_callback(this.state.candidate);
    } else {
      add_candidate_callback(this.state.candidate);
    }
    // set_val_callback(4);
  },

  handleKeyDown: function(e) {
    var key = e.which;
    if (key == 65) {
      setState({toggledKey: !this.state.toggledKey});
    }
    if (49 <= key && key <= 57) {
      var candidate = key-48;
      this.setState({candidate: candidate});
    }

  }

});
