'use strict';

import React from "react";

export default React.createClass({
  getInitialState: function() {
    var val;
    var possibilities;
    if (this.props.val) {
      val = this.props.val;
      possibilities = new Set();
      possibilities.add(val);
    } else {
      val = null;
      possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
    console.log("VAL " + val);
    console.log("POS " + Array.from(possibilities));
    return {
      val: val,
      possibilities: possibilities
    };
  },

  render: function() {
    console.log("name " + this.props.name);
    console.log("val " + this.state.val);
    console.log("possibilities " + Array.from(this.state.possibilities));

    return (
      <div>
        <div>{this.props.name}</div>
        <div>{this.state.val}</div>
        <div>{Array.from(this.state.possibilities)}</div>
      </div>
      //   {this.props.name} {this.state.val} {this.state.possibilities}
      // </div>
    );
  },

  remove_candidate(candidate) {
    this.possibilities.delete(candidate);
  },

  set_val(val) {
    this.val = val;
    // this.possibilities = new Set([val]);
    this.possibilities = new Set();
    this.possibilities.add(val);
  }
});
