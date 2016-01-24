'use strict';

import React from "react";
import SudokuCell from "./sudoku-cell";
window.m;

export default React.createClass({
  getInitialState: function() {
    window.m = this;
    console.log("B " + JSON.stringify(this.props.board));
    var boardState = [];
    var blockNum;
    var name;
    var val;
    var possibilities;
    var cellState;

    for (var y = 0; y < 9; y++) {
      boardState.push([]);
      for (var x = 0; x < 9; x++) {
        cellState = {};
        blockNum = this.locToBlockNum(y, x);
        name = "c" + y + x + blockNum;
        val = this.props.board[y][x];
        if (val) {
          possibilities = new Set([val]);
          cellState["mutable"] = false;
        } else {
          // possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          possibilities = new Set([]);
          cellState["mutable"] = true;
        }
        cellState["y"] = y;
        cellState["x"] = x;
        cellState["block"] = blockNum;
        cellState["name"] = name;
        cellState["val"] = val;
        cellState["possibilities"] = possibilities;
        boardState[y].push(cellState);
      }
    }

    var candidate = 1;
    return {
      "boardState": boardState,
      "candidate": candidate,
      "toggledKey": false
    };
  },

  render: function() {
    var rows = [];
    var cellState;

    for (var y = 0; y < 9; y++) {
      var tds = [];
      for (var x = 0; x < 9; x++) {
        cellState = this.state.boardState[y][x];

        var cellProps = {
          y: y,
          x: x,
          block: cellState.block,
          name: cellState.name,
          possibilities: cellState.possibilities,
          val: cellState.val,
          removeCandidateCallback: this.removeCandidateCallback,
          addCandidateCallback: this.addCandidateCallback,
          setValCallback: this.setValCallback,
          onClickCallback: this.onClickCallback
        };

        var tdStyle = {
          position: "relative",
          width: "10vmin",
          height: "10vmin",
          textAlign: "center",
          // paddingBottom: "10%",
          borderLeft: (x % 3 == 0) ? "solid medium" : "solid thin",
          borderRight: (x % 3 == 2) ? "solid medium" : "solid thin"
        };

        tds.push(
          <td style={tdStyle}>
            <SudokuCell {...cellProps}/>
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
      borderCollapse: "collapse",
      width: "90%",
      tableLayout: "fixed"
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

  locToBlockNum: function(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  },

  setValCallback: function(y, x, candidate) {
    console.log("SET val: " + y + " " + x + " " + candidate);
  },

  removeCandidateCallback: function(y, x, candidate) {
    console.log("REM candidate: " + y + " " + x + " " + candidate);
    var newBoardState = this.state.boardState;
    newBoardState[y][x].possibilities.delete(candidate);
    this.setState({boardState: newBoardState});
  },

  addCandidateCallback: function(y, x, candidate) {
    console.log("ADD candidate: " + y + " " + x + " " + candidate);
    var newBoardState = this.state.boardState;
    newBoardState[y][x].possibilities.add(candidate);
    this.setState({boardState: newBoardState});
  },

  onClickCallback: function(y, x, setValCallback, removeCandidateCallback, addCandidateCallback) {
    var cellState = this.state.boardState[y][x];
    // If the cell isn't mutable, don't do anything
    if (!cellState.mutable)
      return;
    if (cellState.possibilities.has(this.state.candidate)) {
      removeCandidateCallback(this.state.candidate);
    } else {
      addCandidateCallback(this.state.candidate);
    }
    // setValCallback(4);
  },

  handleKeyDown: function(e) {
    var key = e.which;
    console.log("KEY" + key);
    if (key == 65) {
      this.setState({toggledKey: !this.state.toggledKey});
    }
    if (49 <= key && key <= 57) {
      var candidate = key-48;
      this.setState({candidate: candidate});
    }

  }

});
