import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProductsGroup = async ({ query = {} }) => {
  return mdmService(`/product-group`, {
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

const useProductsGroup = ({ query = {}, options }) => {
  return useQuery(["products-group", query], () => fetchProductsGroup({ query }), {
    ...options,
  });
};

const fetchProductGroup = async ({ id, companyId }) => {
  return mdmService(`/product-group/${companyId}/${id}`).then((data) => data);
};

const useProductGroup = ({ id, companyId, options }) => {
  return useQuery(["product-group", id], () => fetchProductGroup({ id, companyId }), {
    ...options,
  });
};

function useFilterProductGroup({ pagingationParam: { page = 1, limit = 10 }, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-group/filter-product?page=${page}&limit=${limit}`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useCreateProductGroup({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-group`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProductGroup({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-group/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteProductGroup = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-group`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileProductGroup = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-group/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useProductsGroup,
  useProductGroup,
  useFilterProductGroup,
  useCreateProductGroup,
  useUpdateProductGroup,
  useDeleteProductGroup,
  useUploadFileProductGroup,
};
