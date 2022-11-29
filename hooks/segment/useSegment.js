import { useInfiniteQuery, useQuery } from "react-query";
import { client, client3 } from "../../lib/client";

const fetchSegments = async ({ query = {} }) => {
  return client3(`/sector`, {
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

const useSegments = ({ query = {}, options } = {}) => {
  return useQuery(["sectors", query], () => fetchSegments({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteSegment = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client3(`/sector`, {
    params: {
      search: searchQuery,
      limit: 20,
      page: pageParam,
      sortBy: "name",
      sortOrder: "ASC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useSegmentInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["sector/infinite", query], fetchInfiniteSegment, {
    keepPreviousData: true,
    ...options,
  });
};

export { useSegments, useSegmentInfiniteLists };
