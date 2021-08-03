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

export const listUsers = (param = { page: 0, size: 3 }) => {
  const path = `http://localhost:8080/api/1.0/users?page=${
    param.page || 0
  }&size=${param.size || 3}`;
  return axios.get(path);
};

export const getUser = (username) => {
  return axios.get(`http://localhost:8080/api/1.0/users/${username}`);
};
