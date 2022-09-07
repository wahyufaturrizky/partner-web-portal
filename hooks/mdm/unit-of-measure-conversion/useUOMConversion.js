import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchUOMConversions = async ({ query = {} }) => {
  return mdmService(`/uom-category`, {
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

const useUOMConversions = ({ query = {}, options }) => {
  return useQuery(["uom-categories", query], () => fetchUOMConversions({ query }), {
    ...options,
  });
};

const fetchUOMConversion = async ({ id, companyId }) => {
  return mdmService(`/uom-category/${companyId}/${id}`).then((data) => data);
};

const useUOMConversion = ({ id, options }) => {
  return useQuery(["uom-category", id], () => fetchUOMConversion({ id }), {
    ...options,
  });
};

const fetchInfiniteUOMConversionLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/uom-category`, {
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

const useUOMConversionInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["uom-category/infinite", query], fetchInfiniteUOMConversionLists, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateUOMConversion({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom-category`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateUOMConversion({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom-category/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletUOMConversion = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/uom-category`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileUOMConversion = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/uom-category/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useUOMConversions,
  useUOMConversion,
  useUOMConversionInfiniteLists,
  useCreateUOMConversion,
  useUpdateUOMConversion,
  useDeletUOMConversion,
  useUploadFileUOMConversion,
};
