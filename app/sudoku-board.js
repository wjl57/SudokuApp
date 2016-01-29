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
    var rowCells = [[],[],[],[],[],[],[],[],[]];
    var colCells = [[],[],[],[],[],[],[],[],[]];
    var blockCells = [[],[],[],[],[],[],[],[],[]];

    for (var y = 0; y < 9; y++) {
      for (var x = 0; x < 9; x++) {
        blockNum = this.locToBlockNum(y, x);
        var cellInfo = {
          "name": name,
          "y": y,
          "x": x,
          "block": blockNum
        };
        rowCells[y].push(cellInfo);
        colCells[x].push(cellInfo);
        blockCells[blockNum].push(cellInfo);
      }
    }

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
      "toggledKey": false,
      "rowCells": rowCells,
      "colCells": colCells,
      "blockCells": blockCells
    };
  },

  initializeNewBoard(board) {
    var boardState = [];
    var blockNum;
    var name;
    var val;
    var possibilities;
    var cellState;
    var rowCells = [[],[],[],[],[],[],[],[],[]];
    var colCells = [[],[],[],[],[],[],[],[],[]];
    var blockCells = [[],[],[],[],[],[],[],[],[]];

    for (var y = 0; y < 9; y++) {
      boardState.push([]);
      for (var x = 0; x < 9; x++) {
        cellState = {};
        blockNum = this.locToBlockNum(y, x);
        name = "c" + y + x + blockNum;
        val = board[y][x];
        if (val) {
          possibilities = new Set([val]);
          cellState["mutable"] = false;
        } else {
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

    this.setState({
      "boardState": boardState,
    });

    this.recalcValidity();
  },

  componentDidMount: function() {
    this.recalcValidity();
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
          mutable: cellState.mutable,
          possibilities: cellState.possibilities,
          val: cellState.val,
          invalid: cellState.invalid,
          possibilityCallback: this.possibilityCallback,
          valCallback: this.valCallback,
          onClickCallback: this.onClickCallback
        };

        var tdStyle = {
          position: "relative",
          width: "10vmin",
          maxWidth: "20px",
          height: "10vmin",
          maxHeight: "20px",
          textAlign: "center",
          fontSize: "1em",
          borderLeft: (x % 3 == 0) ? "solid medium" : "solid thin",
          borderRight: (x % 3 == 2) ? "solid medium" : "solid thin",
          padding: 0,
          margin: 0
        };

        tds.push(
          <td style={tdStyle}>
            <SudokuCell {...cellProps}/>
          </td>
        );
      }

      var trStyle = {
        borderTop: (y % 3 == 0) ? "solid medium" : "solid thin",
        borderBottom: (y % 3 == 2) ? "solid medium" : "solid thin",
        verticalAlign: "middle"
      };
      rows.push(<tr style={trStyle}>{tds}</tr>);
    }

    var boardProps = {
      style: {
        outline: "none",
        fontFamily: "Roboto Mono"
      },
      tabIndex: 1,
      onKeyDown: this.handleKeyDown
    }
    var tableStyle = {
      borderCollapse: "collapse",
      width: "90vmin",
      maxWidth: "600px",
      minWidth: "400px",
      height: "90vmin",
      maxHeight: "600px",
      minHeight: "400px",
      tableLayout: "fixed",
      verticalAlign: "middle"
    };
    return (
      <div>
        <div id="sudoku-board" {...boardProps}>
          <table style={tableStyle}>
          <tbody>
            {rows}
          </tbody>
          </table>
        </div>
        <button onClick={this.calcPossibilities}>Calculate Possibilities</button>
      </div>
    );
  },

  locToBlockNum: function(y, x) {
    return Math.floor(x/3) + Math.floor(y/3)*3;
  },

  possibilityCallback: function(y, x, candidate) {
    var newBoardState = this.state.boardState;
    var cellState = this.state.boardState[y][x];
    if (cellState.possibilities.has(candidate)) {
      newBoardState[y][x].possibilities.delete(candidate);
    } else {
      newBoardState[y][x].possibilities.add(candidate);
    }
    this.setState({boardState: newBoardState});
  },

  valCallback: function(y, x, candidate) {
    var newBoardState = this.state.boardState;
    var cellState = this.state.boardState[y][x];
    if (cellState.val !== candidate) {
      newBoardState[y][x].val = candidate;
    } else {
      newBoardState[y][x].val = null;
    }
    this.setState({boardState: newBoardState});

    this.recalcValidity();
  },


  onClickCallback: function(y, x, valCallback, possibilityCallback) {
    var cellState = this.state.boardState[y][x];
    // If the cell isn't mutable, don't do anything
    if (!cellState.mutable)
      return;

    var candidate = this.state.candidate;
    if (this.state.toggledKey) {
      valCallback(candidate);
    } else {
      possibilityCallback(candidate);
    }
  },

  handleKeyDown: function(e) {
    var key = e.which;
    console.log("KEY" + key);
    if (key == 65) {
      this.setState({toggledKey: !this.state.toggledKey});
    }
    if (48 <= key && key <= 57) {
      var candidate = key-48;
      this.setState({candidate: candidate});
    }
  },

  calcPossibilities: function() {
    var newBoardState = this.state.boardState;
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        var possibilities = new Set([1,2,3,4,5,6,7,8,9]);
        newBoardState[y][x].possibilities = possibilities;
      }
    }

    var eliminatePosInCells = function(cells) {
      for (var k=0; k<cells.length; k++) {
        var cellInfo = cells[k];
        var cell = newBoardState[cellInfo.y][cellInfo.x];
        var val = cell.val;
        cells.forEach(function(cell) {
          newBoardState[cell.y][cell.x].possibilities.delete(val);
        })
      }
    }

    for (var y=0; y<9; y++) {
      var cells = this.state.rowCells[y];
      eliminatePosInCells(cells);
    }
    for (var x=0; x<9; x++) {
      var cells = this.state.colCells[x];
      eliminatePosInCells(cells);
    }
    for (var block=0; block<9; block++) {
      var cells = this.state.blockCells[block];
      eliminatePosInCells(cells);
    }

    this.setState({boardState: newBoardState});
  },

  getInvalidCells: function(cells) {
    var invalidCells = new Set();
    var candidateDict = {};
    for (var k=0; k<cells.length; k++) {
      var cellInfo = cells[k];
      var cell = this.state.boardState[cellInfo.y][cellInfo.x];
      var val = cell.val;
      if (val !== null) {
        if (!(candidateDict.hasOwnProperty(val))) {
          candidateDict[val] = [];
        }
        candidateDict[val].push(cellInfo);
      }
    }
    for (var val in candidateDict) {
      var len = candidateDict[val].length
      if (len > 1) {
        for (var i=0; i<len; i++) {
          invalidCells.add(candidateDict[val][i]);
        }
      }
    }
    return invalidCells;
  },

  setValidityForCells: function(cells, isInvalid, newBoardState) {
    for (var i=0; i<cells.length; i++) {
      var y = cells[i].y;
      var x = cells[i].x;
      newBoardState[y][x].invalid = isInvalid;
    }
    // return newBoardState;
  },

  recalcValidity: function() {
    var newBoardState = this.state.boardState;

    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].invalid = false;
      }
    }

    var allInvalidCells = new Set();
    for (var y=0; y<9; y++) {
      var cells = this.state.rowCells[y];
      this.setValidityForCells(Array.from(this.getInvalidCells(cells)), true, newBoardState);
    }
    for (var x=0; x<9; x++) {
      var cells = this.state.colCells[x];
      this.setValidityForCells(Array.from(this.getInvalidCells(cells)), true, newBoardState);
    }
    for (var block=0; block<9; block++) {
      var cells = this.state.blockCells[block];
      this.setValidityForCells(Array.from(this.getInvalidCells(cells)), true, newBoardState);
    }

    this.setState({boardState: newBoardState});
  }

});
