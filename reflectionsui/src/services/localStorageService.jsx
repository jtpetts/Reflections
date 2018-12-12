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
  return isTipActive(details);
}

function countDetailClick() {
  increment(details);
}

function isZoomInActive() {
  return isTipActive(zoomIn);
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

export default {
  isDetailsActive,
  countDetailClick,
  isZoomInActive,
  countZoomInClick,
  isZoomOutActive,
  countZoomOutClick
};
