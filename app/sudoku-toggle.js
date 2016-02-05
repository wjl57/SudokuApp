'use strict';

import React from "react";
export default React.createClass({
  render: function() {
    var currentVal = this.props.toggledKey;
    var controlStyle = {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
    if (this.props.toggledKey === true) {
        controlStyle.backgroundColor = "orange";
    }
    return (
      <div style={controlStyle} onClick={this.props.toggleCallback}>
        {this.props.text}
      </div>
    );
  }
});
