'use strict';

import React from "react";

export default React.createClass({
  // getInitialState: function() {
  //   var val;
  //   var possibilities;
  //   if (this.props.val) {
  //     val = this.props.val;
  //     possibilities = new Set();
  //     possibilities.add(val);
  //   } else {
  //     val = null;
  //     possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  //   }
  //   return {
  //     val: val,
  //     possibilities: possibilities
  //   };
  // },

  render: function() {
    var val = this.props.val;
    return (
      <div>{val ? val : Array.from(this.props.possibilities)}</div>
    );
  },

  remove_candidate(candidate) {
    this.possibilities.delete(candidate);
  },

  set_val(val) {
    this.val = val;
    this.possibilities = new Set();
    this.possibilities.add(val);
  }
});
