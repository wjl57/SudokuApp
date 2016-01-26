import React from "react";
import ReactDOM from "react-dom";
import Greeting from "./greeting";
import SudokuCell from "./sudoku-cell";
import SudokuBoard from "./sudoku-board";


ReactDOM.render(
  <Greeting name="World"/>,
  document.getElementById('content')
);

var board = [
    [4, null, 2, null, 3, 1, 7, 6, null],
    [null, 6, null, null, 8, 7, null, null, null],
    [null, null, null, null, 4, null, 1, null, null],
    [8, 9, null, null, null, 2, 6, null, 3],
    [3, null, 5, null, null, null, 4, null, 1],
    [1, null, 6, 3, null, null, null, 8, 5],
    [null, null, 8, null, 9, null, null, null, null],
    [null, null, null, 4, 2, null, null, 5, null],
    [null, 4, 9, 7, 5, null, 3, null, 6]
];

ReactDOM.render(
  <SudokuBoard board={board}/>,
  document.getElementById('sudokuboard')
);

var ps = new Set([1,3,4,5,7,9]);
ReactDOM.render(
  <SudokuCell possibilities={ps}/>,
  document.getElementById('sudokucell')
);
