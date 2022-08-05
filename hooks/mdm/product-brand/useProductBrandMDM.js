import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProductBrandsMDM = async ({ query = {} }) => {
  return mdmService(`/product-brand`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      company: "KSNI",
      ...query,
    },
  }).then((data) => data);
};

const useProductBrandsMDM = ({ query = {}, options }) => {
  return useQuery(["product-brand", query], () => fetchProductBrandsMDM({ query }), {
    ...options,
  });
};

const fetchProductBrandMDM = async ({ id }) => {
  return mdmService(`/product-brand/${id}`).then((data) => data);
};

const useProductBrandMDM = ({ id, options }) => {
  return useQuery(["product-brand", id], () => fetchProductBrandMDM({ id }), {
    ...options,
  });
};

const fetchParentProductBrandMDM = async ({ id }) => {
  return mdmService(`product-brand/parent/${id}`).then((data) => data);
};

const useParentProductBrandMDM = ({ id, options }) => {
  return useQuery(["product-brand", id], () => fetchParentProductBrandMDM({ id }), {
    ...options,
  });
};

function useCreateProductBrandMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-brand`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProductBrandMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-brand/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteProductBrandMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/product-brand`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileProductBrandMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-brand/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useProductBrandsMDM,
  useProductBrandMDM,
  useCreateProductBrandMDM,
  useUpdateProductBrandMDM,
  useDeleteProductBrandMDM,
  useUploadFileProductBrandMDM,
  useParentProductBrandMDM,
};
