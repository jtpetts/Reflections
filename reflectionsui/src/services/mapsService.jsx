import httpService from "./httpService";
import env from "../env";

function getApiUrl() {
  return `${env.reflectionsApiUrl()}maps/`;
}

async function getMap(id) {
  return (await httpService.get(`${getApiUrl()}${id}`)).data;
}

async function getMapByName(name) {
  return (await httpService.get(`${getApiUrl()}/name/${name}`)).data;
}

async function getMaps() {
  return (await httpService.get(`${getApiUrl()}`)).data;
}

async function save(map) {
  if (map._id) return (await httpService.put(getApiUrl(), map)).data;
  else return (await httpService.post(getApiUrl(), map)).data;
}

async function deleteMap(id) {
  await httpService.delete(`${getApiUrl()}${id}`);
}

export default { getMap, getMaps, save, deleteMap, getMapByName };
