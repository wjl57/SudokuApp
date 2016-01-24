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
      itemToRender = (this.props.possibilities.size != 0) ?  Array.from(this.props.possibilities) : "\u00a0";
    }

    return (
      <div onClick={this.onClick}>{itemToRender}</div>
    );
  },

  setVal: function(candidate) {
    this.props.setValCallback(self.props.y, self.props.x, candidate);
  },

  removeCandidate: function(candidate) {
    this.props.removeCandidateCallback(self.props.y, self.props.x, candidate);
  },

  addCandidate: function(candidate) {
    this.props.addCandidateCallback(self.props.y, self.props.x, candidate);
  },

  onClick: function() {
    self = this;
    this.props.onClickCallback(self.props.y, self.props.x,
      self.setVal, self.removeCandidate, self.addCandidate);
  }
});
