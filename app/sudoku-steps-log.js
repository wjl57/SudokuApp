'use strict';

import React from "react";
import '../css/my-style.css';

export default React.createClass({

  render: function() {
    var stepsLog = this.props.stepsLog;
    if (!stepsLog)
      return <div></div>;
    var stationComponents = this.props.stepsLog.map(function(step) {
        return <li>{step.description}</li>;
    });
    return (<ul>{stationComponents}</ul>);
  },
});
