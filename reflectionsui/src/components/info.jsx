import React, { Component } from "react";
import {
  pointerWidth,
  pointerHeight,
  pointerHotX,
  pointerHotY
} from "../config";
import Pointer from "./common/pointer";

class Info extends Component {
  state = {};
  render() {
    const hotspot = this.props.hotspot;

    if (this.props.hotspot) {
      const left = this.props.hotspot.x + this.props.offset.x - pointerHotX;
      const top = this.props.hotspot.y + this.props.offset.y - pointerHotY;

      const positioningStyle = {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        opacity: 0.7,
        zIndex: 99, // put the info panel on top of everything
        pointerEvents: "none" // and allow clicks to go through
      };

      return (
        <React.Fragment>
          <table style={positioningStyle} pointerEvents="none" display="block">
            <tbody>
              <tr>
                <td
                  width={`${pointerWidth}px`}
                  height={`${pointerHeight}px`}
                  valign="top"
                >
                  <Pointer />
                </td>
              </tr>
              <tr>
                <td>
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
                            className="btn btn-primary"
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
                </td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      );
    } else return <React.Fragment />;
  }
}

export default Info;
