import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchBranchList = async ({ query = {} }) => {
  return mdmService(`/branch`, {
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

const useBranchList = ({ query = {}, options }) => {
  return useQuery(["branch-list", query], () => fetchBranchList({ query }), {
    ...options,
  });
};

const fetchInfiniteBranchList = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/branch`, {
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
  return useInfiniteQuery(["branch/infinite", query], fetchInfiniteBranchList, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchBranchDetail = async ({ id, companyId }) => {
  return mdmService(`/branch/${companyId}/${id}`).then((data) => data);
};

const useBranchDetail = ({ id, companyId, options }) => {
  return useQuery(["branch-detail", id], () => fetchBranchDetail({ id, companyId }), {
    ...options,
  });
};

function useCreateBranch({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/branch`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateBranch({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/branch/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteBranch = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/branch`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileBranch = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/branch/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useBranchList,
  useBranchInfiniteLists,
  useBranchDetail,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
  useUploadFileBranch,
};
