import axios from "axios";
import { setAuthenticated } from "../api/Auth";

const baseApiURL = process.env.REACT_APP_API_ENDPOINT;

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const instanceSetToken = (token = "") => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    window.localStorage.setItem("_token", token);
  } else {
    instance.defaults.headers.common["Authorization"] = "";
  }
};

export const apiGet = async (resource, params) => {
  return await instance
    .get(`${baseApiURL + resource}`, { params: params })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.status === 401) {
          setAuthenticated({});
          window.location.href("/login");
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error?.message);
      }
    });
};

export const apiPost = async (resource, params) => {
  return await instance
    .post(`${baseApiURL + resource}`, params)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.status === 401) {
          setAuthenticated({});
          window.location.href("/login");
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error?.message);
      }
    });
};

export const apiUpdate = async (resource, params) => {
  return await instance
    .put(`${baseApiURL + resource}`, params)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.status === 401) {
          setAuthenticated({});
          window.location.href("/login");
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error?.message);
      }
    });
};

export const apiDelete = async (resource, params) => {
  return instance
    .delete(baseApiURL + resource, {
      data: params
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (error.response.status === 401) {
          setAuthenticated({});
          window.location.href("/login");
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error?.message);
      }
    });
};
