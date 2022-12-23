import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService, client } from "../../../lib/client";

const fetchVendors = async ({ query = {} }) => {
  return mdmService(`/vendor`, {
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

const useVendors = ({ query = {}, options }) => {
  return useQuery(["vendors", query], () => fetchVendors({ query }), {
    ...options,
  });
};

const fetchInfiniteVendor = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/vendor`, {
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

const useVendorInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["vendor/infinite", query], fetchInfiniteVendor, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchCountryStructureVendor = async ({ id }) => {
  return mdmService(`/vendor/country/structures/${id}`).then((data) => data);
};

const useCountryStructureVendor = ({ id, options }) => {
  return useQuery(["country-structure-vendor"], () => fetchCountryStructureVendor({ id }), {
    ...options,
  });
};

const fetchCountryPostalVendor = async ({ countryId, level }) => {
  return mdmService(`/vendor/country/zip/${countryId}/${level}`).then((data) => data);
};

const useCountryPostalVendor = ({ countryId, level, options }) => {
  return useQuery(["country-postal-vendor"], () => fetchCountryPostalVendor({ countryId, level }), {
    ...options,
  });
};

const fetchCoaVendor = async ({ query = {} }) => {
  const companyCode = localStorage.getItem('companyCode');
  return client(`/coa-list`, {
    params: {
      ...query,
      company_code: companyCode
    },
  }).then((data) => data);
};

const useCoaVendor = ({ options, query = {} }) => {
  return useQuery(["coa-vendor", query], () => fetchCoaVendor({ query }), {
    ...options,
  });
};

const fetchVendor = async ({ id }) => {
  return mdmService(`/vendor/${id}`).then((data) => data);
};

const useVendor = ({ id, options }) => {
  return useQuery(["vendor", id], () => fetchVendor({ id }), {
    ...options,
  });
};

function useCreateVendor({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/vendor`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateVendor({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/vendor/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

function useConvertToCustomer({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/vendor/convert/${id}`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteVendor = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/vendor`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileVendor = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/vendor/file/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useVendors,
  useVendorInfiniteLists,
  useCountryStructureVendor,
  useCountryPostalVendor,
  useCoaVendor,
  useVendor,
  useCreateVendor,
  useUpdateVendor,
  useConvertToCustomer,
  useDeleteVendor,
  useUploadFileVendor,
};
