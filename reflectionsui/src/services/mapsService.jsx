import httpService from "./httpService";
import env from "../env";

function getApiUrl() {
  return `${env.reflectionsApiUrl()}maps/`;
}

async function getMap(id) {
  try {
    return (await httpService.get(`${getApiUrl()}${id}`)).data;
  } catch (ex) {}
}

async function getMapByName(name) {
  try {
    return (await httpService.get(`${getApiUrl()}/name/${name}`)).data;
  } catch (ex) {
    console.log("get map by name ex", ex);
  }
}

async function getMaps() {
  try {
    return (await httpService.get(`${getApiUrl()}`)).data;
  } catch (ex) {}
}

async function save(map) {
  try {
    if (map._id) return (await httpService.put(getApiUrl(), map)).data;
    else return (await httpService.post(getApiUrl(), map)).data;
  } catch (ex) {}
}

async function deleteMap(id) {
  try {
    await httpService.delete(`${getApiUrl()}${id}`);
  } catch (ex) {}
}

export default { getMap, getMaps, save, deleteMap, getMapByName };
