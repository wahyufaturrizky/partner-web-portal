import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProductVariant = async ({ query = {} }) => {
  return mdmService(`/product-variant-variants`, {
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
  return useQuery(["product-variant-list", query], () => fetchProductVariant({ query }), {
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

export { useUploadImageProductVariant, useProductVariantList, useProductVariantDetail, useCreateProductVariant, useUpdateProductVariant, useDeleteProductVariant, useUploadFileProductVariant };
