import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client, client3, mdmService } from "../../../lib/client";

const fetchBranchList = async ({ query = {} }) => {
  return mdmService(`/branch`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "branch_id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useBranchList = ({ query = {}, options = {} }) => {
  return useQuery(["branch-list", query], () => fetchBranchList({ query }), {
    ...options,
  });
};

const fetchBranchParent = async ({ query = {} }) => {
  return mdmService(`/branch/parent`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "branch_id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useBranchParent = ({ query = {}, options }) => {
  return useQuery(["branch-parent", query], () => fetchBranchParent({ query }), {
    ...options,
  });
};

const fetchBranchGroupList = async ({ query = {} }) => {
  return mdmService(`/branch/parent`, {
    params: {
      is_group: true,
      ...query,
    },
  }).then((data) => data);
};

const useBranchGroupList = ({ query = {}, options = {} }) => {
  return useQuery(["branch-list-parent", query], () => fetchBranchGroupList({ query }), {
    ...options,
  });
};

const fetchInfiniteBranchList = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1]?.search || "";
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

const useBranchInfiniteLists = ({ query = {}, options = {} }) => {
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

// before working calendar hooks made, it will be used from here so it will not conflict with others
// this needs to be readjust later

// calendar
const fetchInfiniteCalendarList = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/working-calendar`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "calendar_name",
      sortOrder: "ASC",
      ...queryKey[1],
    },
  }).then(async (data) => data);
};

const useCalendarInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["Calendar/infinite", query], fetchInfiniteCalendarList, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchCalendarDetail = async ({ id }) => {
  return mdmService(`/working-calendar/${id}`).then((data) => data);
};

const useCalendarDetail = ({ id, options, enabled }) => {
  return useQuery(["calendar-detail", id], () => fetchCalendarDetail({ id }), {
    keepPreviousData: true,
    enabled,
    ...options,
  });
};

// timezone
const fetchInfiniteTimezoneList = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client3(`/master/timezone`, {
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

const useTimezoneInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["timezone/infinite", query], fetchInfiniteTimezoneList, {
    keepPreviousData: true,
    ...options,
  });
};

export {
  useBranchList,
  useBranchParent,
  useBranchGroupList,
  useBranchInfiniteLists,
  useBranchDetail,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
  useUploadFileBranch,
  // calendar needs to delete later
  useCalendarDetail,
  useCalendarInfiniteLists,
  useTimezoneInfiniteLists,
};
