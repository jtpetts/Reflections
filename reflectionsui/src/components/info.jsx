import React, { Component } from "react";
import Circle from "./common/circle";
import { circleRadius } from "../config";

class Info extends Component {
  state = {};
  render() {
    const hotspot = this.props.hotspot;

    if (this.props.hotspot) {
      const left = this.props.hotspot.x + this.props.offset.x - circleRadius;
      const top = this.props.hotspot.y + this.props.offset.y - circleRadius;

      const positioningStyle = {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        border: "1px solid red"
      };

      // position: "absolute",
      // left: `${this.props.left}px`,
      // top: `${this.props.top}px`,

      return (
        <React.Fragment>
          <div className="NoPointer" style={positioningStyle}>
            <Circle />
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#0aa34f",
                borderRadius: "50%",
                width: circleRadius * 2,
                height: circleRadius * 2,
                opacity: 0.3,
                pointerEvents: "none"
              }}
            />
            <label className="Info">{hotspot.name}</label>
            {hotspot.zoomName ? (
              <button
                onClick={() => this.props.onZoomClick(this.props.hotspot)}
              >
                Zoom
              </button>
            ) : (
              ""
            )}
            <br />
            <label className="Info">{hotspot.description}</label>
          </div>
        </React.Fragment>
      );
    } else return <React.Fragment />;
  }
}

// document.getElementById("endTimeLabel").style.display = 'none';
// document.getElementById("endTimeLabel").style.display = 'block';
// document.getElementById("endTimeLabel").style.display = 'inline';

export default Info;
