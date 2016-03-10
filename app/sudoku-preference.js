'use strict';

import React from "react";
export default React.createClass({
  render: function() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.props.isChcked}
          onChange={this.onToggle}
        />
        {this.props.preferenceText}
      </label>
    );
  },

  onToggle: function() {
    this.props.onTogglePreference();
  }
});
