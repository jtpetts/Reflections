import { Component } from "react";

class PositionableComponent extends Component {
  getStyle = (target, point) => {
    const left = target.x - point.x;
    const top = target.y - point.y;

    // console.log(`target  x:${target.x}  y:${target.y}`);
    // console.log("point", point);
    // console.log("left", left);
    // console.log("top", top);

    const positioningStyle = {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      margin: "0 0 0 0"
    };

    return positioningStyle;
  };
}

export default PositionableComponent;
