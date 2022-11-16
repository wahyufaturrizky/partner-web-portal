import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchEmployeeListsMDM = async ({ query = {} }) => {
  return mdmService(`/employee`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useEmployeeListsMDM = ({ query = {}, options }) => {
  return useQuery(["employee", query], () => fetchEmployeeListsMDM({ query }), {
    ...options,
  });
};

const fetchInfiniteeEmployeeLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/employee`, {
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

const useEmployeeInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["employee/infinite", query], fetchInfiniteeEmployeeLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteeBranchLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/branch-list`, {
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

const useBranchInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["branch-list/infinite", query], fetchInfiniteeBranchLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteeReportToLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/employee/reportto`, {
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

const useReportToInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["reportto-list/infinite", query], fetchInfiniteeReportToLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchEmployeeListMDM = async ({ id }) => {
  return mdmService(`/employee/${id}`).then((data) => data);
};

const useEmployeeListMDM = ({ id, options }) => {
  return useQuery(["employee", id], () => fetchEmployeeListMDM({ id }), {
    ...options,
  });
};

const fetchCountryStructureListMDM = async ({ id }) => {
  return mdmService(`/employee/country/structures/${id}`).then((data) => data);
};

const useCountryStructureListMDM = ({ id, options }) => {
  return useQuery(["employee/country/structures", id], () => fetchCountryStructureListMDM({ id }), {
    ...options,
  });
};

function useCreateEmployeeListMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/employee`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateEmployeeListMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/employee/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteEmployeeListMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/employee`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileEmployeeListMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/employee/file/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFilePhotoEmployeeMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/employee/file/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useEmployeeListsMDM,
  useEmployeeListMDM,
  useCreateEmployeeListMDM,
  useUpdateEmployeeListMDM,
  useDeleteEmployeeListMDM,
  useUploadFileEmployeeListMDM,
  useEmployeeInfiniteLists,
  useBranchInfiniteLists,
  useUploadFilePhotoEmployeeMDM,
  useReportToInfiniteLists,
  useCountryStructureListMDM,
};
