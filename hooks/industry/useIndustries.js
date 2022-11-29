import { useInfiniteQuery, useQuery } from "react-query";
import { client, client3 } from "../../lib/client";

const fetchIndustries = async ({ query = {} }) => {
  return client3(`/industry`, {
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

const useIndustries = ({ query = {}, options } = {}) => {
  return useQuery(["industries", query], () => fetchIndustries({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteIndustry = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client3(`/industry`, {
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

const useInfiniteIndustry = ({ query = {}, options }) => {
  return useInfiniteQuery(["industry/infinite", query], fetchInfiniteIndustry, {
    keepPreviousData: true,
    ...options,
  });
};

export { useIndustries, useInfiniteIndustry };
