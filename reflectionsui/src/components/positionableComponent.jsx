import { Component } from "react";
import { mapWidth } from "../config";

class PositionableComponent extends Component {
  getStyle = target => {
    const positioningStyle = {
      position: "absolute",
      left: `${target.x / (mapWidth / 100)}%`,
      top: `${target.y / (mapWidth / 100)}%`,
      margin: "0 0 0 0"
    };

    return positioningStyle;
  };
}

export default PositionableComponent;
