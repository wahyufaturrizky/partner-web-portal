import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchDataCountries = async ({ query = {} }) => {
  return mdmService("/country", {
    params: {
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useCreateCountries = ({ options = {} }) => {
  return useMutation(
    (data) =>
      mdmService("/country", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

const fetchInfiniteeCountryLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/country`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useCountryInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["country/infinite", query], fetchInfiniteeCountryLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteeProvinceLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/province`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useProvinceInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["province/infinite", query], fetchInfiniteeProvinceLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteeDistrictLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/district`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useDistrictInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["district/infinite", query], fetchInfiniteeDistrictLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchDetailCountry = async ({ country_id }) => {
  return mdmService(`/country/${country_id}`).then((data) => data);
};

const fetchCountryStructure = async ({ structure_id, query }) => {
  return mdmService(`/country/structure/${structure_id}`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useFetchCountriesStructure = ({ structure_id, query, options }) => {
  return useQuery(["countries-structure-mdm", structure_id, query], () => {
    fetchCountryStructure({ structure_id, query }), { ...options };
  });
};

const useFetchDetailCountry = ({ country_id, options }) => {
  return useQuery(["country-structure"], () => fetchDetailCountry({ country_id }), {
    ...options,
  });
};

const useUpdateCountry = ({ country_id, options }) => {
  return useMutation(
    (payload) =>
      mdmService(`country/${country_id}`, {
        method: "PUT",
        data: payload,
      }),
    { ...options }
  );
};

const useDataCountries = ({ query = {}, options }) => {
  return useQuery(["country-strucure", query], () => fetchDataCountries({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const useDeleteDataCountries = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService("/country", {
        method: "DELETE",
        data: ids,
      }),
    { ...options }
  );
};

const useUploadFileCountries = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService("/country/upload", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

export {
  useDataCountries,
  useDeleteDataCountries,
  useUploadFileCountries,
  useCreateCountries,
  useFetchDetailCountry,
  useUpdateCountry,
  useFetchCountriesStructure,
  useCountryInfiniteLists,
  useProvinceInfiniteLists,
  useDistrictInfiniteLists,
};
