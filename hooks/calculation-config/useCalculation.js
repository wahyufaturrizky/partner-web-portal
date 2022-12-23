import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { client, mdmService } from "../../lib/client";

const fetchCalculations = async ({ query = {} }) => client(`/calculation`, {
  params: {
    search: "",
    limit: 10000,
    page: 1,
    sortBy: "id",
    sortOrder: "asc",
    ...query,
  },
}).then((data) => data);

const useCalculations = ({ query = {}, options } = {}) => useQuery(["calculations", query], () => fetchCalculations({ query }), {
  keepPreviousData: true,
  ...options,
});

const fetchInfiniteeCalculationLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client(`calculation`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "desc",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useCalculationInfiniteLists = ({ query = {}, options }) => useInfiniteQuery(["master/calculation/infinite", query], fetchInfiniteeCalculationLists, {
  keepPreviousData: true,
  ...options,
});

const fetchCalculationModules = async ({ query = {} }) => client(`/calculation/module`, {
  params: {
    search: "",
    // limit: 10000,
    page: 1,
    sortBy: "id",
    sortOrder: "asc",
    ...query,
  },
}).then((data) => data);

const useCalculationModules = ({ query = {}, options } = {}) => useQuery(["calculation-modules", query], () => fetchCalculationModules({ query }), {
  keepPreviousData: true,
  ...options,
});

function useCreateCalculation({ options }) {
  return useMutation(
    (data) => client(`/calculation`, {
      method: "POST",
      data,
    }),
    {
      ...options,
    },
  );
}

function useSubmitCalculation({ options }) {
  return useMutation(
    (data) => client(`/calculation/submit`, {
      method: "POST",
      data,
    }),
    {
      ...options,
    },
  );
}

function useUpdateCalculation({ id, options }) {
  return useMutation(
    (data) => client(`/calculation/${id}`, {
      method: "PUT",
      data,
    }),
    {
      ...options,
    },
  );
}

const useDeleteCalculation = ({ options }) => useMutation(
  (data) => client(`/calculation`, {
    method: "DELETE",
    data,
  }),
  {
    ...options,
  },
);

const useUploadFileCalculation = ({ options }) => useMutation(
  (data) => client(`/calculation/upload`, {
    method: "POST",
    data,
  }),
  {
    ...options,
  },
);

export {
  useCalculations,
  useCalculationInfiniteLists,
  useCalculationModules,
  useCreateCalculation,
  useDeleteCalculation,
  useUpdateCalculation,
  useUploadFileCalculation,
  useSubmitCalculation,
};
