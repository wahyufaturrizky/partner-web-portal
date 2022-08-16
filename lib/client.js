import axios from "axios";
import { toCamelCase, toSnakeCase } from "./caseConverter";
import qs from "qs";
import toast from "react-hot-toast";

export async function client(
  endpoint,
  { data, method = "GET", params, headers: customHeaders, skipSnakeCase, ...customConfig } = {}
) {
  let token = localStorage.getItem("token");
  let apiURL = process.env.NEXT_PUBLIC_API_BASE;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method ? method : data ? "POST" : "GET",
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
    ...customConfig,
  };

  if (params) {
    config.params = params;
    config.method = "GET";
    config.paramsSerializer = (params) => {
      return qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
        skipNulls: true,
      });
    };
  }

  if (data && !skipSnakeCase) {
    config.data = toSnakeCase(data);
  } else {
    config.data = data;
  }

  return axios(config)
    .then(async (response) => {
      const data = await toCamelCase(response.data.data);
      return data;
    })
    .catch((e) => {
      if (!endpoint.includes("auth")) {
        const errors = e?.response?.data?.errors;
        const errorMessage = e?.response?.data?.message;
        const errorMessageArray = errors ? errors?.[0]?.message : "Something went wrong";
        toast.error(errorMessage ? errorMessage : errorMessageArray);
      }
      return Promise.reject(e.response);
    });
}

export async function client2(
  endpoint,
  { data, method = "GET", params, headers: customHeaders, ...customConfig } = {}
) {
  let token = localStorage.getItem("token");
  let apiURL = process.env.NEXT_PUBLIC_API_MDM_BASE;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method ? method : data ? "POST" : "GET",
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
    ...customConfig,
  };

  if (params) {
    config.params = params;
    config.method = "GET";
    config.paramsSerializer = (params) => {
      return qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
        skipNulls: true,
      });
    };
  }

  if (data) {
    config.data = toSnakeCase(data);
  }

  return axios(config)
    .then(async (response) => {
      const data = await toCamelCase(response.data.data);
      return data;
    })
    .catch((e) => {
      if (!endpoint.includes("auth")) {
        toast.error(e.response.data.message);
      }
      return Promise.reject(e.response);
    });
}

export async function mdmService(
  endpoint,
  { data, method = "GET", params, headers: customHeaders, skipSnakeCase, ...customConfig } = {}
) {
  let token = localStorage.getItem("token");
  let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method ? method : data ? "POST" : "GET",
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
    ...customConfig,
  };

  if (params) {
    config.params = params;
    config.method = "GET";
    config.paramsSerializer = (params) => {
      return qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
        skipNulls: true,
      });
    };
  }

  if (data && !skipSnakeCase) {
    config.data = toSnakeCase(data);
  } else {
    config.data = data;
  }

  return axios(config)
    .then(async (response) => {
      const data = await toCamelCase(response.data.data);
      return data;
    })
    .catch((e) => {
      if (!endpoint.includes("auth")) {
        toast.error(e.response.data.message);
      }
      return Promise.reject(e.response);
    });
}

export function mdmDownloadService(endpoint, { params }) {
  let token = localStorage.getItem("token");
  let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

  return axios({
    method: "GET",
    url: `${apiURL}${endpoint}`,
    responseType: "blob",
    params,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

export async function client3(
  endpoint,
  { data, method = "GET", params, headers: customHeaders, ...customConfig } = {}
) {
  let token = localStorage.getItem("token");
  let apiURL = process.env.NEXT_PUBLIC_API_BASE4;

  const config = {
    url: `${apiURL}${endpoint}`,
    method: method ? method : data ? "POST" : "GET",
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
    ...customConfig,
  };

  if (params) {
    config.params = params;
    config.method = "GET";
    config.paramsSerializer = (params) => {
      return qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
        skipNulls: true,
      });
    };
  }

  if (data) {
    config.data = toSnakeCase(data);
  }

  return axios(config)
    .then(async (response) => {
      const data = await toCamelCase(response.data.data);
      return data;
    })
    .catch((e) => {
      if (!endpoint.includes("auth")) {
        toast.error(e.response.data.message);
      }
      return Promise.reject(e.response);
    });
}