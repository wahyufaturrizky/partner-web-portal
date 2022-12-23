import { useQuery, useMutation, useInfiniteQuery } from "react-query";
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

const fetchInfiniteProductCategoryList = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/product-category`, {
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

const useProductCategoryInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["product-category/infinite", query], fetchInfiniteProductCategoryList, {
    keepPreviousData: true,
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

const fetchOneProductCategory = async ({ id, company_id }) => {
  return mdmService(`/product-category/${company_id}/${id}`).then((data) => data);
};

const useProductCategory = ({ id, options, company_id }) => {
  return useQuery(["product-category", id], () => fetchOneProductCategory({ id, company_id }), {
    ...options,
  });
};

const useUpdateProductCategory = ({ id, options, company_id }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-category/${company_id}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
};

const fetchCoaList = async ({ query = {}, status }) => {
  const companyCode = localStorage.getItem('companyCode');
  return client(`/coa-list?account_type=${status}`, {
    params: {
      // search: "",
      // page: 1,
      // limit: 10,
      // sortBy: "created_at",
      // sortOrder: "DESC",
      ...query,
      company_code: companyCode
    },
  }).then((data) => data);
};

const useCoaList = ({ query = {}, options, status }) => {
  return useQuery(["coa-list", query], () => fetchCoaList({ query, status }), {
    ...options,
  });
};

const useCoaListReceive = ({ query = {}, options, status }) => {
  return useQuery(["coa-list-receive", query], () => fetchCoaList({ query, status }), {
    ...options,
  });
};

const fetchAllCoaList = async ({ query = {} }) => {
  const companyCode = localStorage.getItem('companyCode');
  return client(`/coa-list`, {
    params: {
      ...query,
      company_code: companyCode
    },
  }).then((data) => data);
};

const useCoaListAll = ({ query = {}, options }) => {
  return useQuery(["coa-list-all", query], () => fetchAllCoaList({ query }), {
    ...options,
  });
};

const useUploadFileProductCategory = ({ options, company_id }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-category/upload?company_id=${company_id}`, {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

export {
  useProductCategoryList,
  useDeleteProductCategory,
  useCreateProductCategory,
  useProductCategory,
  useUpdateProductCategory,
  useCoaList,
  useProductCategoryInfiniteLists,
  useUploadFileProductCategory,
  useCoaListReceive,
  useCoaListAll,
};
