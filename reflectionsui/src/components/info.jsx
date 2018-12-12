import React from "react";
import PositionableComponent from "./positionableComponent";
import {
  pointerWidth,
  pointerHeight,
  pointerHotX,
  pointerHotY
} from "../config";
import Pointer from "./common/pointer";

class Info extends PositionableComponent {
  render() {
    const hotspot = this.props.hotspot;
    if (!hotspot) return null;

    // positioning the pointer
    const point = { x: pointerHotX, y: pointerHotY };
    const style = this.getStyle(hotspot, point);

    const pointerStyle = {
      ...style,
      opacity: 0.9,
      zIndex: 199, // put the info panel on top of everything
      pointerEvents: "none" // and allow clicks to go through}
    };

    // position the text block
    const minWidth = 200;
    const target = {
      x: hotspot.x + minWidth > 320 ? 320 - minWidth : hotspot.x,
      y: hotspot.y
    };
    const style2 = this.getStyle(target, { x: 0, y: 0 });

    const textStyle = {
      ...style2,
      opacity: 0.85,
      zIndex: 199, // put the info panel on top of everything
      pointerEvents: "none" // and allow clicks to go through}
    };

    return (
      <React.Fragment>
        <div
          className="row"
          style={pointerStyle}
          display="block"
          width={`${pointerWidth}px`}
          height={`${pointerHeight}px`}
        >
          <Pointer type="active" />
        </div>

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
                  color: "black"
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
                {hotspot.zoomName ? (
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn btn-primary lowerSpacing"
                        style={{ pointerEvents: "auto" }}
                        onClick={() =>
                          this.props.onZoomClick(this.props.hotspot)
                        }
                      >
                        Zoom
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Info;
