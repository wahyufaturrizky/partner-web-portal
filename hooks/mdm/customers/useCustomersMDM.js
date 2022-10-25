import { useMutation, useQuery, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchListCustomers = async ({ query = {} }) => {
  return mdmService("/customer", {
    params: {
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((response) => response);
};

const fetchDetailCustomer = async ({ id }) => {
  return mdmService(`/customer/${id}`).then((data) => data);
};

const useUploadLogoCompany = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService("/customer/upload", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

const useUploadStorePhotoAddress = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService("/customer/address/upload", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

const useDetailCustomer = ({ id, options }) => {
  return useQuery(["customer-detail", id], () => fetchDetailCustomer({ id }), {
    ...options,
  });
};

const useListCustomers = ({ options, query = {} }) => {
  return useQuery(["customer-list", query], () => fetchListCustomers({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteCustomer = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/customer`, {
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

const useCustomerInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["customer/infinite", query], fetchInfiniteCustomer, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateCustomers({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/customer`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useConvertToVendor({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/customer/convert/${id}`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteCustomers = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/customer`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

function useUpdateCustomer({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/customer/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

export {
  useListCustomers,
  useCustomerInfiniteLists,
  useCreateCustomers,
  useUpdateCustomer,
  useDeleteCustomers,
  useDetailCustomer,
  useUploadLogoCompany,
  useConvertToVendor,
  useUploadStorePhotoAddress,
};
