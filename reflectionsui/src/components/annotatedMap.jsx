import React, { Component } from "react";
import Pointer from "./common/pointer";
import Info from "./info";
import TutorialTip from "./tutorialTip";
import Images from "../services/imageService";
import { mapWidth } from "../config";

class annotatedMap extends Component {
  computeDistance(x1, y1, x2, y2) {
    return Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
  }

  findClosestHotspot(inX, inY) {
    var closestDist = 10000;
    var closestHotspot;

    const rect = this.refs.image.getBoundingClientRect();
    const hotSpotToImageRatio = rect.width / mapWidth;

    this.props.map.hotSpots.forEach(hotspot => {
      var dist = this.computeDistance(
        hotspot.x * hotSpotToImageRatio,
        hotspot.y * hotSpotToImageRatio,
        inX,
        inY
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestHotspot = hotspot;
      }
    });

    if (closestDist < 100) return closestHotspot;
    return null;
  }

  handleMouseClick = event => {
    // put up the info message if there is a close enough hotspot
    // clear the info if there is not
    const rect = this.refs.image.getBoundingClientRect();
    const imageCorner = {
      x: rect.x ? rect.x : rect.left, // browser compatibility, IE doesn't have x,y
      y: rect.y ? rect.y : rect.top
    };

    const closestHotspot = this.findClosestHotspot(
      event.clientX - imageCorner.x,
      event.clientY - imageCorner.y
    );

    this.props.onHotSpotClick(closestHotspot);
  };

  render() {
    const imageFilename = this.props.map ? this.props.map.imageFilename : "";
    const image = Images.get(imageFilename);

    const showAnnotations =
      this.props.isAnnotationOn &&
      this.props.map.hotSpots &&
      this.props.imageDim > 25;

    const selectedHotSpot = this.props.selectedHotSpot;

    return (
      <div className="fixedx">
        <img
          ref="image"
          src={image}
          alt={"Map"}
          style={{
            maxWidth: `${mapWidth * 2}px`,
            width: "100%",
            height: "auto"
          }}
          onClick={this.handleMouseClick}
        />
        <Info
          onZoomClick={this.props.onZoomClick}
          hotspot={selectedHotSpot}
          imageWidth={this.props.imageDim}
        />
        {showAnnotations &&
          this.props.map.hotSpots.map(
            h =>
              (!selectedHotSpot ||
                (selectedHotSpot && selectedHotSpot !== h)) && (
                <Pointer
                  type={h.zoomId ? "zoom" : "info"}
                  size="named"
                  key={h._id}
                  hotspot={h}
                  onZoomClick={this.props.onZoomClick}
                />
              )
          )}
        {showAnnotations &&
          this.props.map.hotSpots.map(h => (
            <TutorialTip
              key={h._id}
              type={h.zoomId ? "zoomIn" : "details"}
              target={h}
            />
          ))}
      </div>
    );
  }
}

export default annotatedMap;
