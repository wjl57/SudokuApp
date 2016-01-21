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

// for (var i = 0; i < 3; i++) {
//   ReactDOM.render(
//     <SudokuCell y={0} x={7} block={2} name={"c0" + i.toString() + "2"} val={i+4}/>,
//     document.getElementById('sudokucell' + i)
//   );
// }
//
ReactDOM.render(
  <SudokuCell y={0} x={7} block={2} name={"c072"}/>,
  document.getElementById('sudokucell')
);
