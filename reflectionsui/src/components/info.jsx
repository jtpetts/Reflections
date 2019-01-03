import React from "react";
import PositionableComponent from "./positionableComponent";
import Pointer from "./common/pointer";
import { pointerHeight, mapWidth } from "../config";

class Info extends PositionableComponent {
  render() {
    const hotspot = this.props.hotspot;
    if (!hotspot) return null;

    // position the text block
    const minWidth = mapWidth * 0.5;
    const imageWidth = mapWidth;
    const target = {
      x: hotspot.x + minWidth > imageWidth ? imageWidth - minWidth : hotspot.x,
      y: hotspot.y
    };

    // compute the height of the pointer as a percentage
    const ratio = this.props.imageWidth / mapWidth;
    target.y += pointerHeight / ratio;

    const style = this.getStyle(target);

    const textStyle = {
      ...style,
      opacity: 0.85,
      zIndex: 199, // put the info panel on top of everything
      pointerEvents: "none" // and allow clicks to go through}
    };

    return (
      <React.Fragment>
        <Pointer
          type={this.props.hotspot.zoomId ? "zoom" : "info"}
          active="active"
          size="named"
          hotspot={this.props.hotspot}
          onZoomClick={this.props.onZoomClick}
        />

        <div
          className="row"
          style={textStyle}
          pointerEvents="none"
          display="block"
        >
          <div className="row noMargin">
            <div className="col noPadding">
              <div
                className="container"
                style={{
                  backgroundColor: "ivory",
                  color: "black",
                  minWidth: minWidth
                }}
              >
                <div className="row">
                  <div className="col">
                    <b>{hotspot.name}</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p>{hotspot.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Info;
