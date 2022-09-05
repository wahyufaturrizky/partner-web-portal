import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchTrasnportations = async ({ query = {} }) => {
  return mdmService(`/transportation-group`, {
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

const useTransportations = ({ query = {}, options }) => {
  return useQuery(["transportations", query], () => fetchTrasnportations({ query }), {
    ...options,
  });
};

const fetchTransportation = async ({ id, companyId }) => {
  return mdmService(`/transportation-group/${companyId}/${id}`).then((data) => data);
};

const useTransportation = ({ id, options }) => {
  return useQuery(["transportation", id], () => fetchTransportation({ id }), {
    ...options,
  });
};

const fetchInfiniteTransportation = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/transportation-group`, {
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

const useTransportationInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["transportation/infinite", query], fetchInfiniteTransportation, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateTransportation({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/transportation`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateTransportation({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/transportation/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteTransportation = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/transportation`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileTransportation = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/transportation/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useTransportations,
  useTransportation,
  useTransportationInfiniteLists,
  useCreateTransportation,
  useUpdateTransportation,
  useDeleteTransportation,
  useUploadFileTransportation,
};
