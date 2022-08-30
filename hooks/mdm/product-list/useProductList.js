import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProduct = async ({ query = {} }) => {
  return mdmService(`/products`, {
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

const useProductList = ({ query = {}, options }) => {
  return useQuery(["product-list", query], () => fetchProduct({ query }), {
    ...options,
  });
};

const fetchProductDetail = async ({ id, }) => {
  return mdmService(`/product/${id}`).then((data) => data);
};

const useProductDetail = ({ id, options }) => {
  return useQuery(["product-detail", id], () => fetchProductDetail({ id }), {
    ...options,
  });
};

function useCreateProduct({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProduct({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteProduct = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileProduct = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export { useProductList, useProductDetail, useCreateProduct, useUpdateProduct, useDeleteProduct, useUploadFileProduct };
