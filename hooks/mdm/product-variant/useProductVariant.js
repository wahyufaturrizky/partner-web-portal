import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProductVariant = async ({ query = {} }) => {
  return mdmService(`/product-variants`, {
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

const useProductVariantList = ({ query = {}, options }) => {
  return useQuery(["product-variant", query], () => fetchProductVariant({ query }), {
    ...options,
  });
};

const fetchInfiniteProductVariantList = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/product-variants`, {
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

const useProductVariantInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["product-variant/infinite", query], fetchInfiniteProductVariantList, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchProductVariantDetail = async ({ id, }) => {
  return mdmService(`/product-variant/${id}`).then((data) => data);
};

const useProductVariantDetail = ({ id, options }) => {
  return useQuery(["product-variant-detail", id], () => fetchProductVariantDetail({ id }), {
    ...options,
  });
};

function useCreateProductVariant({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-variant`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProductVariant({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-variant/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteProductVariant = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-variant`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileProductVariant = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-variant/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadImageProductVariant = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-variant/image`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export { useUploadImageProductVariant, useProductVariantInfiniteLists, useProductVariantList, useProductVariantDetail, useCreateProductVariant, useUpdateProductVariant, useDeleteProductVariant, useUploadFileProductVariant };
