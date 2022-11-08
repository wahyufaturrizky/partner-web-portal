import { useInfiniteQuery, useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchCalculations = async ({ query = {} }) => {
  return client(`/calculation`, {
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

const useCalculations = ({ query = {}, options } = {}) => {
  return useQuery(["calculations", query], () => fetchCalculations({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteeCalculationLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client(`calculation`, {
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

const useCalculationInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["master/calculation/infinite", query], fetchInfiniteeCalculationLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchCalculationModules = async ({ query = {} }) => {
  return client(`/calculation/module`, {
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

const useCalculationModules = ({ query = {}, options } = {}) => {
  return useQuery(["calculation-modules", query], () => fetchCalculationModules({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

export { useCalculations, useCalculationInfiniteLists, useCalculationModules };
