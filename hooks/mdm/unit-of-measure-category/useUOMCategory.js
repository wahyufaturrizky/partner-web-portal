import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchUOMCategories = async ({ query = {} }) => {
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

const useUOMCategories = ({ query = {}, options }) => {
  return useQuery(["uom-categories", query], () => fetchUOMCategories({ query }), {
    ...options,
  });
};

const fetchUOMCategory = async ({ id, companyId }) => {
  return mdmService(`/uom-category/${companyId}/${id}`).then((data) => data);
};

const useUOMCategory = ({ id, options }) => {
  return useQuery(["uom-category", id], () => fetchUOMCategory({ id }), {
    ...options,
  });
};

const fetchInfiniteUOMCategoryLists = async ({ pageParam = 1, queryKey }) => {
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

const useUOMCategoryInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["uom-category/infinite", query], fetchInfiniteUOMCategoryLists, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateUOMCategory({ options }) {
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

function useUpdateUOMCategory({ id, companyId, options }) {
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

const useDeletUOMCategory = ({ options }) => {
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

const useUploadFileUOMCategory = ({ options }) => {
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
  useUOMCategories,
  useUOMCategory,
  useUOMCategoryInfiniteLists,
  useCreateUOMCategory,
  useUpdateUOMCategory,
  useDeletUOMCategory,
  useUploadFileUOMCategory,
};
