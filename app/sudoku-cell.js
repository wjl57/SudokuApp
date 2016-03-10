'use strict';

import React from "react";
import '../css/my-style.css';
var classNames = require('classnames');

window.g;
export default React.createClass({
  getInitialState: function() {
    return {
      "highlighted": false
    };
  },

  render: function() {
    window.g = this;
    var val = this.props.val;
    var itemToRender;
    var itemClass = classNames({
      "temp-highlight": this.props.highlightingEnabled && this.state.highlighted
    });

    if (val) {
      itemToRender = val;
      var itemStyle = {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5em"
      };
      if (this.props.mutable) {
        itemStyle.color = "#1287A8";
      } else {
        itemStyle.fontWeight = "bold";
      }
      if (this.props.highlightingEnabled && this.props.invalid) {
        itemStyle.backgroundColor = "#C02F1D";
      }
      return (
        <div className={itemClass} onClick={this.onClick} style={itemStyle}>
          {itemToRender}
        </div>
      );
    } else {
      var tdStyle = {
        textAlign: "center",
        fontSize: "0.6em",
        color: "#a0a0a0",
        height: "100%"
      };
      var trStyle = {
        verticalAlign: "middle",
        width: "100%"
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
        itemToRender.push(<tr style={trStyle}>{tds}</tr>);
      }
    }

    var tableStyle = {
      // display: "block",
      width: "100%",
      height: "100%",
      border: 0,
      borderCollapse: "none",
      padding: 0,
      margin: 0
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
    this.highlightTemporarily();
  },

  highlightTemporarily: function() {
    this.setState({
      "highlighted": true
    });
    var self = this;
    setTimeout(function() {
      self.setState({
        "highlighted": false
      })
    }, 700);
  }
});
