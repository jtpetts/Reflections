import jwtDecode from "jwt-decode";
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

async function logout() {
  localStorage.removeItem(itemName);
}

function getCurrentJwt() {
  return localStorage.getItem(itemName);
}

function getCurrentUser() {
  try {
    return jwtDecode(getCurrentJwt());
  } catch (ex) {
    return null; // null means anonymous login
  }
}

export default {
  login,
  logout,
  getCurrentJwt,
  getCurrentUser
};
