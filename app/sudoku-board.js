'use strict';

import React from "react";

export default React.createClass({
  getInitialState: function() {
    this.props.board
    if (!this.props.val || this.props.val === null) {
      this.val = null;
      this.possibilities = JSON.parse(JSON.stringify(all_possibilities));
    } else {
      this.val = this.set_val(this.props.val);
    }
    // TODO: Pass in block_num and name as props (they don't change)
    var block_num = this.loc_to_block_num(this.props.y, this.props.x);
    return {
      y: this.props.y,
      x: this.props.x,
      block_num: block_num,
      name: "c" + this.props.y + this.props.x + block_num,
      val: this.val,
      possibilities: this.possibilities
    };
  },

  render: function() {
    return (
      <div>
        {this.state.name} {this.state.val} {this.state.possibilities}
      </div>
    );
  }
});
