import { useInfiniteQuery, useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchCities = async ({ query = {} }) => {
  return client(`/master/city`, {
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

const useCities = ({ query = {}, options } = {}) => {
  return useQuery(["city", query], () => fetchCities({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteeCityLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/master/city`, {
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

const useCityInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["master/city/infinite", query], fetchInfiniteeCityLists, {
    keepPreviousData: true,
    ...options,
  });
};

export { useCities, useCityInfiniteLists };
