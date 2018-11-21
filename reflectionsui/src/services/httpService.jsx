import axios from "axios";
import { toast } from "react-toastify";
import logger from "./logService";

function setJwt(authToken) {
  axios.defaults.headers.common["x-auth-token"] = authToken;
}

//axios.defaults.baseURL = process.env.REACT_APP_REFLECTIONS_API;

// Add a response interceptor
axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  console.log("axios interceptor", error);
  console.log("axios interceptor reponse", error.response);

  if (expectedError)
    console.log("axios.interceptors.response.use: EXPECTED error");
  else {
    logger.log(error);
    toast.error("Error!");
  }

  return Promise.reject(error); // return control to the catch block
});

export default {
  setJwt,
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete
};
