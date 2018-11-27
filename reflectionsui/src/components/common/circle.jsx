import React, { Component } from "react";
import { bloopWidth, bloopHeight } from "../../config";

class Circle extends Component {
  render() {
    var circleStyle = {
      backgroundColor: "#0aa34f",
      borderRadius: "50%",
      position: "absolute",
      left: this.props.left,
      top: this.props.top,
      width: bloopWidth,
      height: bloopHeight,
      opacity: 0.3,
      pointerEvents: "none",
      display: this.props.display
    };

    return <div style={circleStyle} />;
  }
}

export default Circle;
