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
      <div onClick={this.on_click}>{itemToRender}</div>
    );
  },

  set_val: function(candidate) {
    this.props.set_val_callback(self.props.y, self.props.x, candidate);
  },

  remove_candidate: function(candidate) {
    this.props.remove_candidate_callback(self.props.y, self.props.x, candidate);
  },

  add_candidate: function(candidate) {
    this.props.add_candidate_callback(self.props.y, self.props.x, candidate);
  },

  on_click: function() {
    self = this;
    this.props.on_click_callback(self.props.y, self.props.x,
      self.set_val, self.remove_candidate, self.add_candidate);
  }
});
