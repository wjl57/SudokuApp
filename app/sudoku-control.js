'use strict';

import React from "react";
export default React.createClass({
  render: function() {
    var currentVal = this.props.currentVal;
    var controlStyle = {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
    if (this.props.defaultVal === currentVal) {
        controlStyle.backgroundColor = "orange";
    }
    return (
      <div style={controlStyle} onClick={this.onClick}>
        {this.props.text}
      </div>
    );
  },

  onClick: function() {
    this.props.onCallback(this.props.defaultVal);
  }
});
