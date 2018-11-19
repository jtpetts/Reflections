import httpService from "./httpService";
import env from "../env";

function getApiUrl() {
  return `${env.reflectionsApiUrl()}maps/`;
}

async function get(mapId, hotSpotId) {
  try {
    return (await httpService.get(
      `${getApiUrl()}${mapId}/hotSpots/${hotSpotId}`
    )).data;
  } catch (ex) {}
}

async function save(mapId, hotSpot) {
  try {
    await httpService.post(`${getApiUrl()}${mapId}/hotSpots/`, hotSpot);
  } catch (ex) {}
}

export default { get, save };
