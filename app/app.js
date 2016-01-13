import React from "react";
import ReactDOM from "react-dom";
import Greeting from "./greeting";
import SudokuCell from "./sudoku-cell"

ReactDOM.render(
  <Greeting name="World"/>,
  document.getElementById('content')
);
// ReactDOM.render(
//   <Greeting name="Worlds"/>,
//   document.getElementById('sudokucell')
// );
ReactDOM.render(
  <SudokuCell y={0} x={7} val={8}/>,
  document.getElementById('sudokucell')
);
