const details = "refShowDetails";
const zoomIn = "refShowZoomIn";
const zoomOut = "refShowZoomOut";
const hideAt = 3;

function parseKey(key) {
  const countStr = localStorage.getItem(key);
  var count = parseInt(countStr, 10);
  if (!count) count = 0; // when first logging in, the parameter doesn't exist, treat as zero
  return count;
}

function increment(key) {
  localStorage.setItem(key, (parseKey(key) + 1).toString());
}

function isTipActive(key) {
  return parseKey(key) < hideAt;
}

function isDetailsActive() {
  return false;
  //  return isTipActive(details);
}

function countDetailClick() {
  increment(details);
}

function isZoomInActive() {
  return false;
  //  return isTipActive(zoomIn);
}

function countZoomInClick() {
  increment(zoomIn);
}

function isZoomOutActive() {
  return isTipActive(zoomOut);
}

function countZoomOutClick() {
  increment(zoomOut);
}

const mapKey = "mapKey";

function getMapsArray() {
  var foundMaps = localStorage.getItem(mapKey);
  if (!foundMaps) foundMaps = "";
  return foundMaps.split(",");
}

function foundMap(mapId) {
  const maps = getMapsArray();
  const map = maps.find(m => m === mapId);

  if (!map) {
    maps.push(mapId);
    // remove any blank entries and then convert to CSV
    localStorage.setItem(mapKey, maps.filter(m => m).join(","));
  }
}

function countFoundMaps() {
  return getMapsArray().length;
}

export default {
  isDetailsActive,
  countDetailClick,
  isZoomInActive,
  countZoomInClick,
  isZoomOutActive,
  countZoomOutClick,
  foundMap,
  countFoundMaps
};
