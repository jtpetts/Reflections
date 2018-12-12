import React, { Component } from "react";
import { pointerWidth, pointerHeight } from "../../config";
import imageGreenPointer from "../../images/pointer green.png";
import imageBluePointer from "../../images/pointer blue.png";
import imageActivePointer from "../../images/pointer active.png";

class Pointer extends Component {
  render() {
    const image =
      this.props.type === "active"
        ? imageActivePointer
        : this.props.type === "zoom"
        ? imageBluePointer
        : imageGreenPointer;

    return (
      <img
        src={image}
        alt="pointer"
        width={pointerWidth}
        height={pointerHeight}
      />
    );
  }
}

export default Pointer;
