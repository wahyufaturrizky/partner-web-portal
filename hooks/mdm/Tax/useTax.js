import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchTaxes = async ({ query = {} }) => {
  return mdmService(`/tax`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "country_id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useTaxes = ({ query = {}, options }) => {
  return useQuery(["tax-list", query], () => fetchTaxes({ query }), {
    ...options,
  });
};

const fetchTax = async ({ query = {} }) => {
  return mdmService(`/tax`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useTax = ({ query = {}, options }) => {
  return useQuery(["tax-detail", query], () => fetchTax({ query }), {
    ...options,
  });
};

const fetchInfiniteTaxLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/tax`, {
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

const useTaxInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["tax/infinite", query], fetchInfiniteTaxLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchCountryTaxes = async ({ query = {} }) => {
  return mdmService(`/tax`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useCountryTaxes = ({ query = {}, options }) => {
  return useQuery(["tax-detail", query], () => fetchCountryTaxes({ query }), {
    ...options,
  });
};

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

const useCountryTaxInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["tax/country/infinite", query], fetchInfiniteeCountryTaxLists, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateTax({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/tax`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateTax({ id, countryId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/tax/${countryId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletTax = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/tax`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileTax = ({ query: {}, options }) => {
  return useMutation(
    (data) =>
      mdmService(`/tax/upload`, {
        method: "POST",
        params: {
          ...query,
        },
        data,
      }),
    {
      ...options,
    }
  );
};

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
};
