'use strict';

import React from "react";
export default React.createClass({
  render: function() {
    var currentVal = this.props.currentVal;
    var controlStyle = {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "solid thin"
    };
    if (this.props.defaultVal === currentVal) {
        controlStyle.backgroundColor = this.props.color;
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
