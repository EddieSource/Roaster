import axios from "axios";

export const signup = (user) => {
  return axios.post("http://localhost:8080/api/1.0/users", user);
};

export const login = (user) => {
  return axios.post("http://localhost:8080/api/1.0/login", {}, { auth: user });
};

export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
  if (isLoggedIn) {
    axios.defaults.headers.common["Authorization"] = `Basic ${btoa(
      username + ":" + password
    )}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
