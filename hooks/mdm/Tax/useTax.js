import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchTaxes = async ({ query = {} }) => mdmService(`/tax`, {
  params: {
    search: "",
    page: 1,
    limit: 10,
    sortBy: "country_id",
    sortOrder: "DESC",
    ...query,
  },
}).then((data) => data);

const useTaxes = ({ query = {}, options }) => useQuery(["tax-list", query], () => fetchTaxes({ query }), {
  ...options,
});

const fetchTax = async ({ query = {} }) => mdmService(`/tax`, {
  params: {
    search: "",
    page: 1,
    limit: 10,
    sortOrder: "DESC",
    ...query,
  },
}).then((data) => data);

const useTax = ({ query = {}, options }) => useQuery(["tax-detail", query], () => fetchTax({ query }), {
  ...options,
});

const fetchInfiniteTaxLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/tax`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "tax_id",
      sortOrder: "ASC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useTaxInfiniteLists = ({ query = {}, options }) => useInfiniteQuery(["tax/infinite", query], fetchInfiniteTaxLists, {
  keepPreviousData: true,
  ...options,
});

const fetchCountryTaxes = async ({ query = {} }) => mdmService(`/tax`, {
  params: {
    search: "",
    page: 1,
    limit: 10,
    sortOrder: "DESC",
    ...query,
  },
}).then((data) => data);

const useCountryTaxes = ({ query = {}, options }) => useQuery(["tax-detail", query], () => fetchCountryTaxes({ query }), {
  ...options,
});

const fetchInfiniteeCountryTaxLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/tax/country/list`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useCountryTaxInfiniteLists = ({ query = {}, options }) => useInfiniteQuery(["tax/country/infinite", query], fetchInfiniteeCountryTaxLists, {
  keepPreviousData: true,
  ...options,
});

function useCreateTax({ options }) {
  return useMutation(
    (data) => mdmService(`/tax-item`, {
      method: "POST",
      data,
    }),
    {
      ...options,
    },
  );
}

function useUpdateTax({ id, taxItem, options }) {
  return useMutation(
    (data) => mdmService(`/tax-item/${id}/${taxItem}`, {
      method: "PUT",
      data,
    }),
    {
      ...options,
    },
  );
}

const useDeletTax = ({ options }) => useMutation(
  (data) => mdmService(`/tax`, {
    method: "DELETE",
    data,
  }),
  {
    ...options,
  },
);

const useUploadFileTax = ({ options }) => useMutation(
  (data) => mdmService(`/tax/upload`, {
    method: "POST",
    data,
  }),
  {
    ...options,
  },
);

const useDeleteTaxItem = ({ options }) => useMutation(
  (data) => mdmService(`/tax-item`, {
    method: "DELETE",
    data,
  }),
  {
    ...options,
  },
);

const useDeleteTaxItemDetail = ({ options }) => useMutation(
  (data) => mdmService(`/tax-item-detail`, {
    method: "DELETE",
    data,
  }),
  {
    ...options,
  },
);

const fetchDetailTaxItem = async ({ id, taxId }) => mdmService(`/tax-item/${taxId}/${id}`).then((data) => data);

const useDetailTaxItem = ({ id, taxId, options }) => useQuery(["tax-item-detail", id], () => fetchDetailTaxItem({ id, taxId }), {
  ...options,
});

export {
  useTaxes,
  useTax,
  useTaxInfiniteLists,
  useCountryTaxes,
  useCountryTaxInfiniteLists,
  useCreateTax,
  useUpdateTax,
  useDeletTax,
  useUploadFileTax,
  useDeleteTaxItem,
  useDetailTaxItem,
  useDeleteTaxItemDetail,
};
