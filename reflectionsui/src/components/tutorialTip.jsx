import React from "react";
import PositionableComponent from "./positionableComponent";
import TutorialType from "./identifiers/tutorialType";

import { arrowWidth, arrowHeight, arrowHotX, arrowHotY } from "../config";

class TutorialTip extends PositionableComponent {
  render() {
    const type = this.props.type;

    if (!TutorialType.isTutorialTipActive(type)) return null;

    const point = { x: arrowHotX, y: arrowHotY };
    const style = this.getStyle(this.props.target, point);

    const tutorialStyle = {
      ...style,
      opacity: 0.9,
      zIndex: 99, // put the info panel on top of everything
      pointerEvents: "none", // and allow clicks to go through}
      backgroundImage: `url(${TutorialType.getImage(type)})`,
      width: `${arrowWidth}px`,
      height: `${arrowHeight}px`,
      textAlign: "center",
      color: TutorialType.getTextColor(type)
    };

    const text = TutorialType.getMessage(type);

    return (
      <div style={tutorialStyle} valign="top">
        {text}
      </div>
    );
  }
}

export default TutorialTip;
