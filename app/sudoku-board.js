'use strict';

import React from "react";
import SudokuCell from "./sudoku-cell";
import SudokuControl from "./sudoku-control";
import SudokuTitle from "./sudoku-title";
import SudokuPreference from "./sudoku-preference";
import SudokuStepsLog from "./sudoku-steps-log"

import Dropdown from "react-dropdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import '../css/my-style.css';
import '../css/dropdown-style.css';
// import '../css/bootstrap-theme.css';
import '../css/bootstrap.css';

var classNames = require('classnames');
var _ = require('lodash/core');

window.m;
window.g;

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
        name = "c" + y + x + blockNum;
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
      "puzzleNum": 0,
      "level": 0,
      "savedBoardStates": {},
      "savedMetadata": [],
      "levelSelected": { value: 1, label: 'Easy'},
      "preferences": {
        "highlightingEnabled": true
      }
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

  loadStringifiedBoardState: function(boardState, metadata) {
    var newBoardState = JSON.parse(JSON.stringify(boardState));
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].possibilities = new Set(newBoardState[y][x].possibilities);
      }
    }
    this.setState({
      "boardState": newBoardState,
      "freeEdit": metadata["freeEdit"],
      "puzzleNum": metadata["puzzleNum"],
      "level": metadata["level"]
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
        if (newBoardState[y][x].val !== null) {
          newBoardState[y][x].mutable = false;
        }
      }
    }

    this.saveBoardState(0, newBoardState, false)();
  },

  restartPuzzle: function() {
    console.log("Restarting puzzle");
    this.loadSavedBoardState(0)();
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
      var savedMetadata = self.state.savedMetadata;
      var metadata = {
        "freeEdit": self.state.freeEdit,
        "puzzleNum": self.state.puzzleNum,
        "level": self.state.level
      };
      savedMetadata[num] = metadata;
      self.setState({
        "savedBoardStates": savedBoardStates,
        "savedMetadata": savedMetadata,
        "freeEdit": freeEdit
      });
    };
  },

  loadSavedBoardState: function(num) {
    self = this;
    return function() {
      var savedBoardState = self.state.savedBoardStates[num];
      if (savedBoardState == null) {
        console.log("No puzzle was saved to that slot yet");
        return;
      }
      var metadata = self.state.savedMetadata[num];
      var boardState = self.loadStringifiedBoardState(savedBoardState, metadata);
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

    this.saveBoardState(0, boardState, false)();
    this.setState({
      "boardState": boardState
    });
  },

  generateNewPuzzle: function() {
    self = this;
    console.log("Generating a puzzle");
    fetch('/api/newPuzzle', {
    	method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "level": self.state.levelSelected.value,
        "puzzleNum": this.refs['puzzleNumInput'].value
      })
    }).then(function(response) {
    	return response.json();
    }).then(function(resp) {
      self.setState({"puzzleNum": resp.puzzleNum});
      self.setState({"level": self.state.levelSelected.value});
      self.loadNewBoard(resp.puzzle);
    }).catch(function(err) {
      console.log("Error loading new board");
    });
  },

  getBoard: function() {
    var board = [];
    for (var y=0; y<9; y++) {
      board.push([]);
      for (var x=0; x<9; x++) {
        board[y].push(self.state.boardState[y][x].val);
      }
    }
    return board;
  },

  loadBoard: function(board) {
    var newBoardState = this.state.boardState;
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].val = board[y][x];
      }
    }
    this.setState({
      "boardState": newBoardState
    });
  },

  loadPossibilities: function(possibilities) {
    var newBoardState = this.state.boardState;
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        newBoardState[y][x].possibilities = new Set(possibilities[y][x]);
      }
    }
    this.setState({
      "boardState": newBoardState
    });
  },

  isBoardValid: function() {
    for (var y=0; y<9; y++) {
      for (var x=0; x<9; x++) {
        if (this.state.boardState[y][x].invalid) {
          console.log(y + " " + x + this.state.boardState[y][x].invalid);
          return false;
        }
      }
    }
    return true;
  },

  solveStep: function() {
    self = this;
    if (!self.isBoardValid()) {
      console.log("Invalid board. Won't solve step.");
      return;
    }
    fetch('/api/sudoku/solveStep', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "board": self.getBoard()
      })
    }).then(function(response) {
      return response.json();
    }).then(function(resp) {
      var success = resp.success;
      if (!success) {
        console.log("No solution found.");
        return;
      }
      var board = resp.board;
      var lastStep = resp.steps_log[resp.steps_log.length - 1];
      var possibilities = JSON.parse(lastStep.possibilities);
      self.setState({
        "currentStep": lastStep,
        "stepsLog": resp.steps_log
      });
      self.loadBoard(board);
      self.loadPossibilities(possibilities);
      console.log(resp);
    }).catch(function(err) {
      console.log("Error solving puzzle");
    });
  },

  solveCell: function() {
    self = this;
    if (!self.isBoardValid()) {
      console.log("Invalid board. Won't solve cell.");
      return;
    }
    fetch('/api/sudoku/solveCell', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "board": self.getBoard()
      })
    }).then(function(response) {
      return response.json();
    }).then(function(resp) {
      var success = resp.success;
      if (!success) {
        console.log("No solution found.");
        return;
      }
      var board = resp.board;
      var lastStep = resp.steps_log[resp.steps_log.length - 1];
      var possibilities = JSON.parse(lastStep.possibilities);
      self.setState({
        "currentStep": lastStep,
        "stepsLog": resp.steps_log
      });
      self.loadBoard(board);
      self.loadPossibilities(possibilities);
      console.log(resp);
    }).catch(function(err) {
      console.log("Error solving puzzle");
    });
  },

  solvePuzzle: function() {
    self = this;
    if (!self.isBoardValid()) {
      console.log("Invalid board. Won't solve.");
      return;
    }
    fetch('/api/sudoku/solvePuzzle', {
    	method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "board": self.getBoard()
      })
    }).then(function(response) {
    	return response.json();
    }).then(function(resp) {
      var success = resp.success;
      if (!success) {
        console.log("Couldn't solve puzzle");
        return;
      }
      var board = resp.board;
      var lastStep = resp.steps_log[resp.steps_log.length - 1];
      var possibilities = JSON.parse(lastStep.possibilities);
      self.setState({
        "currentStep": lastStep,
        "stepsLog": resp.steps_log
      });
      self.loadBoard(board);
      console.log(resp);
    }).catch(function(err) {
      console.log("Error solving puzzle");
    });
  },

  onlevelSelect: function(option) {
    console.log('You selected ', option.label);
    this.setState({"levelSelected": option});
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
          onClickCallback: this.onClickCallback,
          highlightingEnabled: this.state.preferences.highlightingEnabled
        };

        var tdStyle = {
          position: "relative",
          width: "8vmin",
          maxWidth: "16px",
          height: "8vmin",
          maxHeight: "16px",
          textAlign: "center",
          fontSize: "1em",
          borderLeft: (x % 3 === 0) ? "solid medium" : "solid thin",
          borderRight: (x % 3 === 2) ? "solid medium" : "solid thin",
          padding: 0,
          margin: 0
        };

        tds.push(
          <td style={tdStyle}>
            <SudokuCell ref={cellProps.name} {...cellProps}/>
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

    var containerProps = {
      style: {
        outline: "none",
        fontFamily: "Roboto Mono"
      },
      tabIndex: 1,
      onKeyDown: this.handleKeyDown,
      className: classNames('sudoku-primarybar', 'col-sm-8')
    }

    var centerStyle = {
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      width: "100%"
    }

    var tableStyle = _.extend({
      borderCollapse: "collapse",
      width: "72vmin",
      maxWidth: "480px",
      minWidth: "460px",
      height: "72vmin",
      maxHeight: "480px",
      minHeight: "460px",
      tableLayout: "fixed",
      verticalAlign: "middle"
    }, centerStyle);

    var controlTableStyle = _.extend({
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
      padding: 0
    }, centerStyle);

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

    const levelOptions = [
      { value: 1, label: 'Easy' },
      { value: 2, label: 'Medium' },
      { value: 3, label: 'Hard' },
      { value: 4, label: 'Evil' },
    ]

    var mainSudokuClass = classNames('sudoku-main', 'col-sm-8');
    var sidebarClass = classNames('sudoku-sidebar', 'col-sm-4');

    return (
      <div className="container-fluid">
        <div className="row">
          <div {...containerProps}>
            <SudokuTitle level={this.state.level} puzzleNum={this.state.puzzleNum}/>
            <div id="sudoku-board">
              <table style={tableStyle}>
              <tbody>
                {rows}
              </tbody>
              </table>
            </div>
            <br/>
            <div id="sudoku-candidates">
              <table style={controlTableStyle}>
                <tbody>
                  <tr style={controlTrStyle}>{controls}</tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={sidebarClass}>
            <div className="row">
              <div className="col-sm-12">
                  <Tabs>
                    <TabList>
                      <Tab>Instructions</Tab>
                      <Tab>Shortcuts</Tab>
                      <Tab>Preferences</Tab>
                    </TabList>
                    <TabPanel>
                      <h4>Getting a new puzzle</h4>
                      <ol>
                        <li>Select a difficulty level from the dropdown</li>
                        <li>Click "New Puzzle"</li>
                      </ol>
                      <h4>Playing Sudoku</h4>
                      <ul>
                        <li>Select a candidate from under the puzzle</li>
                        <li>Click the desired cell in the puzzle</li>
                        <li>To clear the cell, click the cell again</li>
                        <li>To note possiblities instead, deselect "Pen"</li>
                      </ul>
                      <h4>Using the solver</h4>
                      <ul>
                        <li>Input the puzzle then click "Start"</li>
                        <li>Click "Solve" to solve the puzzle fully</li>
                        <li>Click "Solve Step" to solve a single cell</li>
                        <li>Click "Calculate Possibilities" to show all
                          possibilities based on the current puzzle state</li>
                      </ul>
                    </TabPanel>
                    <TabPanel>
                      <h4>List of Keyboard shortcuts</h4>
                      <ul>
                        <li>New Puzzle (N)</li>
                        <li>Toggle a candidate (# keys)</li>
                        <li>Highlight a candidate (double press # keys)</li>
                        <li>Toggle "Pen" (A)</li>
                        <li>Solve Step (S)</li>
                        <li>Calculate Possibilities (C)</li>
                      </ul>
                    </TabPanel>
                    <TabPanel>
                      <SudokuPreference
                        isChecked={!this.state.preferences["highlightingEnabled"]}
                        onTogglePreference={this.togglePreference("highlightingEnabled")}
                        preferenceText={"Pen and paper mode"}
                      />

                    </TabPanel>
                  </Tabs>
              </div>
            </div>
            <div id="sudoku-controls">
              <div className="row">
                <div className="col-sm-12">
                  <button onClick={this.solvePuzzle}>Solve</button>
                  <button onClick={this.solveCell}>Solve Cell</button>
                  <button onClick={this.calcPossibilities}>Calculate Possibilities</button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button onClick={this.generateNewPuzzle}>New Puzzle</button>
                  <button onClick={this.clearBoard}>Clear Board</button>
                  <button onClick={this.startPuzzle}>Start</button>
                  <button onClick={this.restartPuzzle}>Restart</button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button onClick={this.saveBoardState(1)}>Save #1</button>
                  <button onClick={this.saveBoardState(2)}>Save #2</button>
                  <button onClick={this.loadSavedBoardState(1)}>Load #1</button>
                  <button onClick={this.loadSavedBoardState(2)}>Load #2</button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <Dropdown options={levelOptions} onChange={this.onlevelSelect} value={this.state.levelSelected} placeholder="Difficulty" />
                </div>
                <div className="col-sm-8">
                  <input ref="puzzleNumInput" type="text" defaultValue="" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <textarea readOnly
                    style={{width: "100%"}}
                    value={this.state.currentStep != null ? this.state.currentStep.description : "sample"}>
                  </textarea>
                  <SudokuStepsLog stepsLog={this.state.stepsLog} />
                </div>
              </div>
            </div>
          </div>
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

  togglePreference: function(preferenceName) {
    var self = this;
    return function() {
      var newPreferences = self.state.preferences;
      newPreferences[preferenceName] = !newPreferences[preferenceName];
      self.setState({
        "preferences": newPreferences
      });
    }
  },

  handleKeyDown: function(e) {
    var key = e.which;
    console.log("KEY" + key);
    if (key == 65) {
      this.onTogglePenCallback();
    }
    else if (48 < key && key <= 57) {
      var candidate = key-48;
      this.onControlCallback(candidate);
    }
    else if (key == 83) {
      this.solveCell();
    }
    else if (key == 67) {
      this.calcPossibilities();
    }
    else if (key == 78) {
      this.generateNewPuzzle();
    }

  },

  onTogglePenCallback: function() {
    if (!this.state.freeEdit)
      this.setState({toggledKey: !this.state.toggledKey});
  },

  onControlCallback: function(candidate) {
    if (this.state.candidate === candidate) {
      for (var y=0; y<9; y++) {
        for (var x=0; x<9; x++) {
          var val = this.state.boardState[y][x].val;
          if (val === candidate) {
            this.refs[this.state.boardState[y][x].name].highlightTemporarily();
          }
        }
      }
    }
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
