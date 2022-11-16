import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

// Get All
const fetchPostalCodes = async ({ query = {} }) => {
  return mdmService(`/postal-code`, {
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

const fetchInfiniteePostalCodeLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/postal-code`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "ASC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const usePostalCodeInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["postal-code/infinite", query], fetchInfiniteePostalCodeLists, {
    keepPreviousData: true,
    ...options,
  });
};

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
      mdmService(`/postal-code`, {
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
      mdmService(`/postal-code/${postalCode_id}`, {
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
      mdmService(`/postal-code`, {
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
  return mdmService(`/country`, {
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
  return mdmService(`/postal-code/country/structures/${country}`).then((data) => data);
};

const useCountryStructures = ({ country, options }) => {
  return useQuery(["country", country], () => fetchCountryStructures({ country }), {
    ...options,
  });
};

const useUploadFilePostalCodesMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/postal-code/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const fetchCountryFilter = async ({ query = {} }) => {
  return mdmService(`/postal-code/country/filter/`, {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const usePostalCodesFilter = ({ query = {}, options } = {}) => {
  return useQuery(["postal-code-filter", query], () => fetchCountryFilter({ query }), {
    keepPreviousData: true,
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
  usePostalCodeInfiniteLists,
  useUploadFilePostalCodesMDM,
  usePostalCodesFilter,
};
