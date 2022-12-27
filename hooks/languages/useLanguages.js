import { useQuery, useInfiniteQuery } from "react-query";
import { client, mdmService } from "../../lib/client";

const fetchLanguages = async ({ query = {} }) => {
  return client(`/master/language`, {
    params: {
      search: "",
      limit: 10000,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const useLanguages = ({ query = {}, options } = {}) => {
  return useQuery(["languages", query], () => fetchLanguages({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfinityLanguage = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client(`/master/language`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useLanguagesInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["languages/infinity", query], fetchInfinityLanguage, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfinityLanguageLibrary = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/language`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useLanguageLibraryInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["languages-library/infinity", query], fetchInfinityLanguageLibrary, {
    keepPreviousData: true,
    ...options,
  });
};

export { useLanguages, useLanguagesInfiniteLists, useLanguageLibraryInfiniteLists };
