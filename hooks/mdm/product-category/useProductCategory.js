import { useQuery, useMutation } from "react-query";
import { mdmService, client } from "../../../lib/client";

const fetchProductCategory = async ({ query = {} }) => {
  return mdmService(`/product-category`, {
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

const useProductCategoryList = ({ query = {}, options }) => {
  return useQuery(["product-list", query], () => fetchProductCategory({ query }), {
    ...options,
  });
};

const useDeleteProductCategory = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/product-category`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useCreateProductCategory = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-category`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const fetchOneProductCategory = async ({ id }) => {
  return mdmService(`/product-category/KSNI/${id}`).then((data) => data);
};

const useProductCategory = ({ id, options }) => {
  return useQuery(["product-category", id], () => fetchOneProductCategory({ id }), {
    ...options,
  });
};

const useUpdateProductCategory = ({ id, options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-category/KSNI/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
};

const fetchCoaList = async ({ query = {}, status }) => {
  console.log(status, 'status on fetch')
  return client(`/coa-list?company_code=KSNI&account_type=${status}`, {
    params: {
      // search: "",
      // page: 1,
      // limit: 10,
      // sortBy: "created_at",
      // sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useCoaList = ({ query = {}, options, status }) => {
  return useQuery(["coa-list", query], () => fetchCoaList({ query, status }), {
    ...options,
  });
};

export {
  useProductCategoryList,
  useDeleteProductCategory,
  useCreateProductCategory,
  useProductCategory,
  useUpdateProductCategory,
  useCoaList
};
