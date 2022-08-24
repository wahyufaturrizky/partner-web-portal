import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchJobPositions = async ({ query = {} }) => {
  return mdmService(`/job-position`, {
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

const useJobPositions = ({ query = {}, options }) => {
  return useQuery(["job-positions", query], () => fetchJobPositions({ query }), {
    ...options,
  });
};

const fetchInfiniteeJobPositions = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/job-position`, {
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

const useJobPositionInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["job-position/infinite", query], fetchInfiniteeJobPositions, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchJobPosition = async ({ id, companyId }) => {
  return mdmService(`/job-position/${companyId}/${id}`).then((data) => data);
};

const useJobPosition = ({ id, companyId, options }) => {
  return useQuery(["job-position", id], () => fetchJobPosition({ id, companyId }), {
    ...options,
  });
};

function useCreateJobPosition({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/job-position`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateJobPosition({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/job-position/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteJobPosition = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/job-position`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileJobPosition = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/job-position/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useJobPositions,
  useJobPosition,
  useCreateJobPosition,
  useUpdateJobPosition,
  useDeleteJobPosition,
  useUploadFileJobPosition,
  useJobPositionInfiniteLists,
};
