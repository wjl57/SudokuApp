'use strict';

import React from "react";
window.g;
export default React.createClass({
  render: function() {
    window.g = this;
    var val = this.props.val;
    return (
      <div>{val ? val : Array.from(this.props.possibilities)}</div>
    );
  },

  remove_candidate(candidate) {
    this.props.remove_candidate(candidate);
  },

  set_val(val) {
    this.val = val;
    this.possibilities = new Set();
    this.possibilities.add(val);
  }
});
