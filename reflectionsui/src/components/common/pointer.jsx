import React, { Component } from "react";
import { pointerWidth } from "../../config";
import imagePointer from "../../images/pointer.png";

class Pointer extends Component {
  render() {
    return <img src={imagePointer} alt="pointer" width={pointerWidth} />;
  }
}

export default Pointer;
