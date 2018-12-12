import React from "react";
import Pointer from "./common/pointer";
import PositionableComponent from "./positionableComponent";
import {
  pointerWidth,
  pointerHeight,
  pointerHotX,
  pointerHotY
} from "../config";

class VisibleHotSpot extends PositionableComponent {
  render() {
    const point = { x: pointerHotX, y: pointerHotY };
    const style = this.getStyle(this.props.hotspot, point);

    const pointerStyle = {
      ...style,
      opacity: 0.9,
      zIndex: 99, // put the info panel on top of everything
      pointerEvents: "none" // and allow clicks to go through}
    };

    return (
      <div
        className="row"
        width={`${pointerWidth}px`}
        height={`${pointerHeight}px`}
        display="block"
        style={pointerStyle}
      >
        <Pointer type={this.props.hotspot.zoomId ? "zoom" : "info"} />
      </div>
    );
  }
}

export default VisibleHotSpot;
