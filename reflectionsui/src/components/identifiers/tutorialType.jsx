import imageGreenArrow from "../../images/arrow green.png";
import imageBlueArrow from "../../images/arrow blue.png";
import imageBackArrow from "../../images/arrow back.png";
import localStorageService from "../../services/localStorageService";
import { arrowWidth, arrowHeight, arrowHotX, arrowHotY } from "../../config";

const zoomIn = "zoomIn";
const zoomOut = "zoomOut";
const details = "details";

function getMessage(type) {
  if (type === zoomIn) return "Click to zoom";
  if (type === zoomOut) return "Click to return";
  if (type === details) return "Click for details";

  return "";
}

function getTextColor(type) {
  if (type === zoomIn) return "white";
  if (type === zoomOut) return "white";
  if (type === details) return "black";

  return "black";
}

function getImage(type) {
  if (type === zoomIn) return imageBlueArrow;
  if (type === zoomOut) return imageBlueArrow;
  if (type === details) return imageGreenArrow;

  return imageGreenArrow;
}

function getDims(type) {
  return {
    width: arrowWidth,
    height: arrowHeight,
    hotX: arrowHotX,
    hotY: arrowHotY
  };
}

function isTutorialTipActive(type) {
  if (type === zoomIn) return localStorageService.isZoomInActive();
  if (type === zoomOut) return localStorageService.isZoomOutActive();
  if (type === details) return localStorageService.isDetailsActive();

  return true;
}

export default {
  getMessage,
  getTextColor,
  getImage,
  getDims,
  isTutorialTipActive
};
