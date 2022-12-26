/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-shadow */
import axios from 'axios';
// import qs from 'qs';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE, // YOUR_API_URL HERE
  headers: {
    'Content-Type': 'application/json',
  },
  // paramsSerializer: (params) => qs.stringify(params),
});
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
export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete client.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }
};

export default client;

// export async function client(
//   endpoint,
//   {
//     data = {}, method = 'GET', params = {}, headers: customHeaders = {}, ...customConfig
//   } = {},
// ) {
//   const token = localStorage.getItem('token');
//   const apiURL = process.env.NEXT_PUBLIC_API_BASE;

//   const config = {
//     url: `${apiURL}${endpoint}`,
//     method: method || (data ? 'POST' : 'GET'),
//     headers: {
//       'Content-Type': data ? 'application/json' : undefined,
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...customHeaders,
//     },
//     ...customConfig,
//   };

//   if (params) {
//     config.params = params;
//     config.method = 'GET';
//     config.paramsSerializer = (params) => qs.stringify(params, {
//       arrayFormat: 'brackets',
//       encode: true,
//       skipNulls: true,
//     });
//   }

//   if (data) {
//     config.data = toSnakeCase(data);
//   }

//   return axios(config)
//     .then(async (response) => {
//       if (response.status === 401) {
//         localStorage.clear();
//         window.location.assign(window.location);
//         return Promise.reject({ message: 'Please re-authenticate.' });
//       }

//       const { data } = response;
//       return data;
//     })
//     .catch((e) => Promise.reject(e.response.data));
// }
