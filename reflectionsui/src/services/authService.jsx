import HttpService from "./httpService";
import env from "../env";

const itemName = "authtoken";
HttpService.setJwt(getCurrentJwt());

// posts a login and then stores in local storage
async function login(user, password) {
  const credentials = {
    email: user,
    password: password
  };

  const { data: token } = await HttpService.post(
    `${env.reflectionsApiUrl()}auth`,
    credentials
  );
  localStorage.setItem(itemName, token);

  HttpService.setJwt(token);
}

function getCurrentJwt() {
  return localStorage.getItem(itemName);
}

export default {
  login,
  getCurrentJwt
};
