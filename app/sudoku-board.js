'use strict';

import React from "react";
import SudokuCell from "./sudoku-cell";
import SudokuControl from "./sudoku-control";

window.m;

export default React.createClass({
  getInitialState: function() {
    window.m = this;
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

        // Set initial state.boardState
        var cellState = JSON.parse(JSON.stringify(cellInfo));
        cellState.invalid = false;
        cellState.mutable = true;
        cellState.val = null;
        cellState.possibilities = new Set();

        boardState[y].push(cellState);
      }
    }

    var candidate = 1;
    return {
      "boardState": boardState,
      "candidate": candidate,
      "toggledKey": true,
      "rowCells": rowCells,
      "colCells": colCells,
      "blockCells": blockCells,
      "freeEdit": true,
      "cleanBoardState": this.stringifyBoardState(boardState),
      savedBoardStates: {},
      savedFreeEdits: []
    };
  },

  stringifyBoardState: function(boardState) {
    var possibilities = [];
    for (var y=0; y<9; y++) {
      possibilities.push([]);
      for (var x=0; x<9; x++) {
        var arrayPossibilities = Array.from(boardState[y][x].possibilities);
        possibilities[y].push(arrayPossibilities);
      }
    }
    var newBoardState = JSON.parse(JSON.stringify(boardState));
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].possibilities = possibilities[y][x];
      }
    }
    return newBoardState;
  },

  loadStringifiedBoardState: function(boardState, freeEdit) {
    var newBoardState = JSON.parse(JSON.stringify(boardState));
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].possibilities = new Set(newBoardState[y][x].possibilities);
      }
    }
    this.setState({
      "boardState": newBoardState,
      "freeEdit": freeEdit
    });
  },

  clearBoard: function() {
    console.log("Clearing board");
    this.loadStringifiedBoardState(this.state.cleanBoardState, true);
  },

  startPuzzle: function() {
    console.log("Starting puzzle");
    var newBoardState = this.state.boardState;
    for (var y = 0; y < 9; y++) {
      for (var x = 0; x < 9; x++) {
        if (newBoardState[y][x].val != null) {
          newBoardState[y][x].mutable = false;
        }
      }
    }

    // this.setState({
    //   boardState: newBoardState,
    //   freeEdit: false
    // });
    this.saveBoardState(0, newBoardState, false)();
  },

  restartPuzzle: function() {
    console.log("Restarting puzzle");
    this.loadBoardState(0)();
  },

  saveBoardState: function(num, newBoardState, newFreeEdit) {
    self = this;
    return function() {
      console.log("Saving board " + num);
      var boardStateToSave = (newBoardState === undefined)
        ? self.stringifyBoardState(self.state.boardState)
        : self.stringifyBoardState(newBoardState);
      var savedBoardStates = self.state.savedBoardStates;
      savedBoardStates[num] = boardStateToSave;

      var freeEdit = (newFreeEdit === undefined) ? self.state.freeEdit : newFreeEdit;
      var savedFreeEdits = self.state.savedFreeEdits;
      savedFreeEdits[num] = freeEdit;
      self.setState({
        "savedBoardStates": savedBoardStates,
        "savedFreeEdits": savedFreeEdits,
        "freeEdit": freeEdit
      });
    };
  },

  loadBoardState: function(num) {
    self = this;
    return function() {
      var savedBoardState = self.state.savedBoardStates[num];
      if (savedBoardState == null) {
        console.log("No puzzle was saved to that slot yet");
        return;
      }
      var freeEdit = self.state.savedFreeEdits[num];
      var boardState = self.loadStringifiedBoardState(savedBoardState, freeEdit);
    };
  },

  loadNewBoard: function(board) {
    console.log("Loading new board");
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
      "freeEdit": false
    });
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
          possibilities: cellState.possibilities ? cellState.possibilities : new Set(),
          val: cellState.val ? cellState.val : null,
          invalid: cellState.invalid,
          possibilityCallback: this.possibilityCallback,
          valCallback: this.valCallback,
          onClickCallback: this.onClickCallback
        };

        var tdStyle = {
          position: "relative",
          width: "9vmin",
          maxWidth: "18px",
          height: "9vmin",
          maxHeight: "18px",
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
      width: "81vmin",
      maxWidth: "540px",
      minWidth: "460px",
      height: "81vmin",
      maxHeight: "540px",
      minHeight: "460px",
      tableLayout: "fixed",
      verticalAlign: "middle"
    };
    var controlTableStyle = {
      borderCollapse: "collapse",
      width: "75vmin",
      maxWidth: "450px",
      minWidth: "345px",
      height: "7.5vmin",
      maxHeight: "60px",
      minHeight: "46px",
      tableLayout: "fixed",
      verticalAlign: "middle",
      fontFamily: "Roboto Mono",
      border: "solid medium",
      margin: 0,
      padding: 0
    };
    var controlTrStyle = {
      height: "100%",
      margin: 0,
      padding: 0
    }

    var controls = [];
    var controlTdStyle = {
      height: "100%",
      margin: 0,
      padding: 0
    }
    for (var candidate=1; candidate<=9; candidate++) {
      var controlProps = {
        text: candidate,
        currentVal: this.state.candidate,
        defaultVal: candidate,
        onCallback: this.onControlCallback,
        color: "#ECD078"
      };
      controls.push(<td style={controlTdStyle}><SudokuControl {...controlProps} /></td>);
    }
    var togglePenProps = {
      text: "Pen",
      currentVal: this.state.toggledKey,
      defaultVal: true,
      onCallback: this.onTogglePenCallback,
      color: "#D95B43"
    }
    // this.onTogglePenCallback has an extra param but it does not matter
    controls.push(<td style={controlTdStyle}><SudokuControl {...togglePenProps} /></td>);
    
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
        <button onClick={this.clearBoard}>Clear Board</button>
        <button onClick={this.startPuzzle}>Start</button>
        <button onClick={this.restartPuzzle}>Restart</button>
        <button onClick={this.saveBoardState(1)}>Save #1</button>
        <button onClick={this.saveBoardState(2)}>Save #2</button>
        <button onClick={this.loadBoardState(1)}>Load #1</button>
        <button onClick={this.loadBoardState(2)}>Load #2</button>
        <div>
          <table style={controlTableStyle}>
            <tbody>
              <tr style={controlTrStyle}>{controls}</tr>
            </tbody>
          </table>
        </div>
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
    console.log("Clicked " + y + " " + x + " " + this.state.freeEdit);
    var candidate = this.state.candidate;
    if (this.state.freeEdit) {
      valCallback(candidate);
      return;
    }

    var cellState = this.state.boardState[y][x];
    // If the cell isn't mutable, don't do anything
    if (!cellState.mutable)
      return;

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
      this.onTogglePenCallback();
    }
    if (48 < key && key <= 57) {
      var candidate = key-48;
      this.onControlCallback(candidate);
    }
  },

  onTogglePenCallback: function() {
    if (!this.state.freeEdit)
      this.setState({toggledKey: !this.state.toggledKey});
  },

  onControlCallback: function(candidate) {
    this.setState({candidate: candidate});
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
      if (val != null) {
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
  },

  recalcValidity: function() {
    var newBoardState = this.state.boardState;

    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].invalid = false;
      }
    }

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
