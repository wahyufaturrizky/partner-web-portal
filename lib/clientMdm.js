/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-shadow */
import axios from 'axios';
// import qs from 'qs';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE3, // YOUR_API_URL HERE
  headers: {
    'Content-Type': 'application/json',
  },
  // paramsSerializer: (params) => qs.stringify(params),
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
);
client.interceptors.response.use(
  (res) => {
    if (res.status === 401) {
      localStorage.clear();
      window.location.assign(window.location);
      return Promise.reject({ message: 'Please re-authenticate.' });
    }
    return res.data;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      window.location.assign(window.location);
    }
    return Promise.reject(err);
  },
);

export default client;
