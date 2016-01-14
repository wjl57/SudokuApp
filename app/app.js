import React from "react";
import ReactDOM from "react-dom";
import Greeting from "./greeting";
import SudokuCell from "./sudoku-cell";
import SudokuBoard from "./sudoku-board";


ReactDOM.render(
  <Greeting name="World"/>,
  document.getElementById('content')
);

ReactDOM.render(
  <SudokuBoard />,
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
