import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchUOM = async ({ query = {} }) => {
  return mdmService(`/uom`, {
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

const useUOMList = ({ query = {}, options }) => {
  return useQuery(["uom-list", query], () => fetchUOM({ query }), {
    ...options,
  });
};

const fetchInfiniteUOMLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/uom`, {
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

const useUOMInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["uom/infinite", query], fetchInfiniteUOMLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchUOMDetail = async ({ id, companyId }) => {
  return mdmService(`/uom/${companyId}/${id}`).then((data) => data);
};

const useUOMDetail = ({ id, companyId, options }) => {
  return useQuery(["uom-detail", id], () => fetchUOMDetail({ id, companyId }), {
    ...options,
  });
};

function useCreateUOM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateUOM({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletUOM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/uom`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileUOM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/uom/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useUOMList,
  useUOMInfiniteLists,
  useUOMDetail,
  useCreateUOM,
  useUpdateUOM,
  useDeletUOM,
  useUploadFileUOM,
};
