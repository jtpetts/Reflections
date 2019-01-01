import React from "react";
import PositionableComponent from "../positionableComponent";
import PointerType from "../identifiers/pointerType";

class Pointer extends PositionableComponent {
  render() {
    const size = this.props.size;

    const ptype = PointerType.identify(
      size,
      this.props.active,
      this.props.type
    );
    const image = PointerType.getImage(ptype);
    const dims = PointerType.getDims(ptype);

    // is there a hotspot loaded yet?
    const hotspot = this.props.hotspot;
    if (!hotspot) return null;

    // positioning the pointer
    const style = this.getStyle(hotspot);

    if (PointerType.isButton(ptype)) {
      const pointerStyle = {
        ...style,
        opacity: 0.9,
        zIndex: 150, // put the info panel on top of everything
        pointerEvents: "auto" // capture clicks!
      };

      return (
        <div
          className="row"
          style={pointerStyle}
          display="block"
          width={`${dims.width}px`}
          height={`${dims.height}px`}
        >
          <button
            className="nakedButton"
            height={`${dims.height}px`}
            onClick={() => this.props.onZoomClick(this.props.hotspot)}
          >
            <img
              src={image}
              alt="pointer"
              width={dims.width}
              height={dims.height}
            />
          </button>
        </div>
      );
    } else {
      const pointerStyle = {
        ...style,
        opacity: 0.9,
        zIndex: 99, // put the info panel on top of everything
        pointerEvents: "none" // and allow clicks to go through
      };

      return (
        <div
          className="row"
          style={pointerStyle}
          display="block"
          width={`${dims.width}px`}
          height={`${dims.height}px`}
        >
          <img
            src={image}
            alt="pointer"
            width={dims.width}
            height={dims.height}
          />
        </div>
      );
    }
  }
}

export default Pointer;
