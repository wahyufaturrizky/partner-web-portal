import { useQuery, useMutation } from "react-query";
import { mdmClient } from "../../../lib/client";

// Get All
const fetchPostalCodes = async ({ query = {} }) => {
  return mdmClient(`/postal-code`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const usePostalCodes = ({ query = {}, options } = {}) => {
  return useQuery(["postal-code", query], () => fetchPostalCodes({ query }), {
    keepPreviousData: true,
    ...options,
  });
};
// End of Get All

// Get One
const fetchPostalCode = async ({ postalCode_id }) => {
  return client(`/field/${postalCode_id}`).then((data) => data);
};

const usePostalCode = () => {
  return useQuery(["postal-code", postalCode_id], () => fetchPostalCode({ postalCode_id }));
};
// End of Get One

// Create
function useCreatePostalCode({ options }) {
  return useMutation(
    (updates) =>
      mdmClient(`/postal-code`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

// Update
function useUpdatePostalCode({ postalCode_id, options }) {
  return useMutation(
    (updates) =>
      mdmClient(`/postal-code/${postalCode_id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

// Delete
const useDeletePostalCode = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmClient(`/postal-code`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

// Find All Countries
const fetchCountries = async ({ query = {} }) => {
  return mdmClient(`/country`, {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useCountries = ({ query = {}, options } = {}) => {
  return useQuery(["countries", query], () => fetchCountries({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchCountryStructures = async ({ country }) => {
  return mdmClient(`/postal-code/country/structures/${country}`).then((data) => data);
};

const useCountryStructures = ({ country, options }) => {
  return useQuery(["country", country], () => fetchCountryStructures({ country }), {
    ...options,
  });
};

export {
  usePostalCodes,
  usePostalCode,
  useCreatePostalCode,
  useUpdatePostalCode,
  useDeletePostalCode,
  useCountries,
  useCountryStructures,
};
