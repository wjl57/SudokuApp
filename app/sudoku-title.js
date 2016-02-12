import React from "react";

export default React.createClass({
  render: function() {
    var s = "Sudoku";
    var level = this.props.level;
    var levelString = "";
    if (level) {
      switch(level) {
        case 1:
          levelString = "Easy";
          break;
        case 2:
          levelString = "Medium";
          break;
        case 3:
          levelString = "Hard";
          break;
        case 4:
          levelString = "Evil";
          break;
      }

      s += ": " + levelString;
    }
    if (this.props.puzzleNum) {
      s += " " + this.props.puzzleNum;
    }
    return (
      <h2>{s}</h2>
    );
  },
});
