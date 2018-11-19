import imageTwoCities from "../images/TwoCities.jpg";
import imageRiverside from "../images/Riverside.jpg";
import imageWoodvine from "../images/Woodvine.jpg";

const imageList = [
  { imageFilename: "TwoCities.jpg", image: imageTwoCities },
  { imageFilename: "Riverside.jpg", image: imageRiverside },
  { imageFilename: "Woodvine.jpg", image: imageWoodvine }
];

function get(imageFilename) {
  const image = imageList.find(i => i.imageFilename === imageFilename);
  if (image) return image.image;
  else return null;
}

function getImages() {
  return imageList;
}

export default { get, getImages };