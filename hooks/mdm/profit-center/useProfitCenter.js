import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService, mdmService2 } from "../../../lib/client";

const fetchProfitCenters = async ({ query = {} }) => {
  return mdmService(`/profit-center`, {
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

const useProfitCenters = ({ query = {}, options }) => {
  return useQuery(["profit-list", query], () => fetchProfitCenters({ query }), {
    ...options,
  });
};

const fetchProfitCenter = async ({ id, companyId }) => {
  return mdmService(`/profit-center/${companyId}/${id}`).then((data) => data);
};

const useDetailProfitCenter = ({ id, companyId, options }) => {
  return useQuery(["profit-detail", id], () => fetchProfitCenter({ id, companyId }), {
    ...options,
  });
};

function useCreateProfitCenter({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/profit-center`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProfitCenter({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/profit-center/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteProfitCenter = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/profit-center`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileProfitCenter = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/profit-center/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useProfitCenters,
  useDetailProfitCenter,
  useCreateProfitCenter,
  useUpdateProfitCenter,
  useDeleteProfitCenter,
  useUploadFileProfitCenter,
};
