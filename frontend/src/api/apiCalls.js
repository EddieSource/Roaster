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

export const updateUser = (userId, body) => {
  return axios.put("http://localhost:8080/api/1.0/users/" + userId, body);
};

export const postRoast = (roast) => {
  return axios.post("http://localhost:8080/api/1.0/roasts", roast);
};

export const loadRoasts = (username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/roasts`
    : "/api/1.0/roasts";
  return axios.get(
    "http://localhost:8080" + basePath + "?page=0&size=5&sort=id,desc"
  );
};

export const loadOldRoasts = (roastId, username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/roasts`
    : "/api/1.0/roasts";
  const path = `${basePath}/${roastId}?direction=before&page=0&size=5&sort=id,desc`;
  return axios.get("http://localhost:8080" + path);
};

export const loadNewRoasts = (roastId, username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/roasts`
    : "/api/1.0/roasts";
  const path = `${basePath}/${roastId}?direction=after&sort=id,desc`;
  return axios.get("http://localhost:8080" + path);
};

export const loadNewRoastCount = (roastId, username) => {
  const basePath = username
    ? `/api/1.0/users/${username}/roasts`
    : "/api/1.0/roasts";
  const path = `${basePath}/${roastId}?direction=after&count=true`;
  return axios.get("http://localhost:8080" + path);
};

export const postRoastFile = (file) => {
  return axios.post("http://localhost:8080/api/1.0/roasts/upload", file);
};

export const deleteRoast = (roastId) => {
  return axios.delete("http://localhost:8080/api/1.0/roasts/" + roastId);
};
