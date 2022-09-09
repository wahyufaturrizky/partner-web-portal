import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchTaxes = async ({ query = {} }) => {
  return mdmService(`/tax`, {
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

const useTaxes = ({ query = {}, options }) => {
  return useQuery(["tax-list", query], () => fetchTaxes({ query }), {
    ...options,
  });
};

const fetchTax = async ({ id, countryId }) => {
  return mdmService(`/tax/${countryId}/${id}`).then((data) => data);
};

const useTax = ({ id, countryId, options }) => {
  return useQuery(["tax-detail", id], () => fetchTax({ id, countryId }), {
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

const useUploadFileTax = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/tax/upload`, {
        method: "POST",
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
  useCreateTax,
  useUpdateTax,
  useDeletTax,
  useUploadFileTax,
};
