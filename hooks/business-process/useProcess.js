import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client } from "../../lib/client";

const fetchProcessLists = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode")
  return client(`/process`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
      company_id: companyCode
    },
  }).then((data) => data);
};

const useProcessLists = ({ query = {}, options } = {}) => {
  return useQuery(["process", query], () => fetchProcessLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateProcessList({ options }) {
  const companyCode = localStorage.getItem("companyCode")
  return useMutation(
    (updates) =>
      client(`/process`, {
        method: "POST",
        data: {...updates, company_id: companyCode},
      }),
    {
      ...options,
    }
  );
}

const fetchProcessList = async ({ process_list_id }) => {
  const companyCode = localStorage.getItem("companyCode")
  return client(`/process/${process_list_id}/${companyCode}`).then((data) => data);
};

const useProcessList = ({ process_list_id, options }) => {
  return useQuery(["process", process_list_id], () => fetchProcessList({ process_list_id }), {
    ...options,
  });
};

function useUpdateProcessList({ processListId, options }) {
  const companyCode = localStorage.getItem("companyCode")
  return useMutation(
    (updates) =>
      client(`/process/${processListId}`, {
        method: "PUT",
        data: {...updates, company_id: companyCode},
      }),
    {
      ...options,
    }
  );
}

const useDeleteProcessList = ({ options }) => {
  return useMutation(
    (ids) => {
      const companyCode = localStorage.getItem("companyCode")
      client("/process/delete/", {
        method: "POST",
        data: { ...ids, company_id: companyCode },
      }),
      {
        ...options,
      }
    }
  );
};

const fetchInfiniteProcessLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  const companyCode = localStorage.getItem("companyCode")
  return client(`/process`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "created_at",
      sortOrder: "DESC",
      company_id: companyCode
    },
  }).then((data) => data);
};

const useProcessInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["process/infinite", query], fetchInfiniteProcessLists, {
    keepPreviousData: true,
    ...options,
  });
};

export {
  useProcessLists,
  useProcessList,
  useCreateProcessList,
  useUpdateProcessList,
  useDeleteProcessList,
  useProcessInfiniteLists,
};
