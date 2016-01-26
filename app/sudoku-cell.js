'use strict';

import React from "react";
window.g;
export default React.createClass({
  render: function() {
    window.g = this;
    var val = this.props.val;
    var itemToRender;
    if (val) {
      itemToRender = val;
    } else {
      // "\u00a0" is a non-breaking space
      // itemToRender = (this.props.possibilities.size != 0) ?  Array.from(this.props.possibilities) : "\u00a0";

      var tdStyle = {
        textAlign: "center"
      };
      itemToRender = [];
      var ps = this.props.possibilities;
      for (var j=0; j<3; j++) {
        var tds = [];
        for (var i=0; i<3; i++) {
          var candidate = 3*j + i + 1;
          var item = (ps && ps.has(candidate)) ? candidate : "\u00a0";
          tds.push(<td style={tdStyle}>{item}</td>)
        }
        itemToRender.push(<tr>{tds}</tr>);
      }
      // console.log("render " + itemToRender);
    }

    var tableStyle = {
      // display: "block",
      width: "100%",
      height: "100%",
      border: 0,
      borderCollapse: "collapse"
    };
    return (
      <div onClick={this.onClick}>
        <table style={tableStyle}>
          <tbody>
            {itemToRender}
          </tbody>
        </table>
      </div>
    );
  },

  valCallback: function(candidate) {
    this.props.valCallback(self.props.y, self.props.x, candidate);
  },

  possibilityCallback: function(candidate) {
    this.props.possibilityCallback(self.props.y, self.props.x, candidate);
  },

  onClick: function() {
    self = this;
    this.props.onClickCallback(self.props.y, self.props.x,
      self.valCallback, self.possibilityCallback);
  }
});
