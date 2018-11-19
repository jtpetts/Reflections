import axios from "axios";

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
  // send to sentry.io
  else console.log("axios.interceptors.response.use: UN-expected error");

  // Do something with response error
  return Promise.reject(error);
});

export default {
  setJwt,
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete
};
