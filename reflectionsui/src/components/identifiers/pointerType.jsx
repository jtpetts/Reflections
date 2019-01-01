import imageGreenPointer from "../../images/pointer green.png";
import imageBluePointer from "../../images/pointer blue.png";
import imageActivePointer from "../../images/pointer active.png";
import imageNamedPointerDetails from "../../images/named pointer details.png";
import imageNamedPointerZoom from "../../images/named pointer zoom.png";
import imageNamedPointerActiveZoom from "../../images/named pointer active zoom.png";
import imageNamedPointerActiveDetails from "../../images/named pointer active details.png";
import {
  pointerWidth,
  pointerHeight,
  pointerHotX,
  pointerHotY,
  namedWidth,
  namedHeight,
  namedHotX,
  namedHotY
} from "../../config";

const plainDetails = "plainDetails";
const plainZoom = "plainZoom";
const plainActive = "plainActive";
const namedDetails = "NamedDetails";
const namedZoom = "NamedZoom";
const namedActiveZoom = "NamedActiveZoom";
const namedActiveDetails = "NamedActiveDetails";

function identify(size, active, type) {
  if (size === "named") {
    return active === "active"
      ? type === "zoom"
        ? namedActiveZoom
        : namedActiveDetails
      : type === "zoom"
      ? namedZoom
      : namedDetails;
  } else {
    return active === "active"
      ? plainActive
      : type === "zoom"
      ? plainZoom
      : plainDetails;
  }
}

function getImage(type) {
  if (type === plainDetails) return imageGreenPointer;
  if (type === plainZoom) return imageBluePointer;
  if (type === plainActive) return imageActivePointer;
  if (type === namedDetails) return imageNamedPointerDetails;
  if (type === namedZoom) return imageNamedPointerZoom;
  if (type === namedActiveZoom) return imageNamedPointerActiveZoom;
  if (type === namedActiveDetails) return imageNamedPointerActiveDetails;

  return imageGreenPointer;
}

function getDims(type) {
  if (
    type === namedDetails ||
    type === namedZoom ||
    type === namedActiveZoom ||
    type === namedActiveDetails
  ) {
    return {
      width: namedWidth,
      height: namedHeight,
      hotX: namedHotX,
      hotY: namedHotY
    };
  }

  // other than named (plain pointer)
  return {
    width: pointerWidth,
    height: pointerHeight,
    hotX: pointerHotX,
    hotY: pointerHotY
  };
}

function isButton(type) {
  return type === namedZoom || type === namedActiveZoom;
}

export default {
  identify,
  getImage,
  getDims,
  isButton
};
