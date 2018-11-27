import imageTwoCities from "../images/TwoCities.jpg";
import imageRiverside from "../images/Riverside.jpg";
import imageWoodvine from "../images/Woodvine.jpg";
import imageMagmaPaths from "../images/MagmaPaths.jpg";
import imageMarais from "../images/Marais.jpg";
import imageSuburbs from "../images/Suburbs.jpg";
import imageBelowWarehouse from "../images/BelowWarehouse.jpg";
import imageArena from "../images/Arena.jpg";
import imageMoonWizardsPrison from "../images/MoonWizardsPrison.jpg";
import imageKaufen from "../images/Kaufen.jpg";
import imageMoonGarden from "../images/MoonGarden.jpg";
import imageThroneRoom from "../images/ThroneRoom.jpg";
import imageCursedForest from "../images/CursedForest.jpg";
import imageEiserune from "../images/Eiserune.jpg";
import imageUnderMountain from "../images/UnderMountain.jpg";

const imageList = [
  { imageFilename: "TwoCities.jpg", image: imageTwoCities },
  { imageFilename: "Riverside.jpg", image: imageRiverside },
  { imageFilename: "Woodvine.jpg", image: imageWoodvine },
  { imageFilename: "MagmaPaths.jpg", image: imageMagmaPaths },
  { imageFilename: "Marais.jpg", image: imageMarais },
  { imageFilename: "Suburbs.jpg", image: imageSuburbs },
  { imageFilename: "BelowWarehouse.jpg", image: imageBelowWarehouse },
  { imageFilename: "Arena.jpg", image: imageArena },
  { imageFilename: "MoonWizardsPrison.jpg", image: imageMoonWizardsPrison },
  { imageFilename: "Kaufen.jpg", image: imageKaufen },
  { imageFilename: "MoonGarden.jpg", image: imageMoonGarden },
  { imageFilename: "ThroneRoom.jpg", image: imageThroneRoom },
  { imageFilename: "CursedForest.jpg", image: imageCursedForest },
  { imageFilename: "Eiserune.jpg", image: imageEiserune },
  { imageFilename: "UnderMountain.jpg", image: imageUnderMountain }
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
