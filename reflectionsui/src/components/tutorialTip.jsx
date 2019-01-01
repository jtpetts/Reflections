import React from "react";
import PositionableComponent from "./positionableComponent";
import TutorialType from "./identifiers/tutorialType";

class TutorialTip extends PositionableComponent {
  render() {
    const type = this.props.type;

    if (!TutorialType.isTutorialTipActive(type)) return null;
    const dims = TutorialType.getDims(type);

    const point = { x: dims.hotX, y: dims.hotY };
    const style = this.getStyle(this.props.target, point);

    const tutorialStyle = {
      ...style,
      opacity: 0.9,
      zIndex: 99, // put the info panel on top of everything
      pointerEvents: "none", // and allow clicks to go through}
      backgroundImage: `url(${TutorialType.getImage(type)})`,
      width: `${dims.width}px`,
      height: `${dims.height}px`,
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
