import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchTermOfPayments = async ({ query = {} }) => {
  return mdmService(`/top`, {
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

const useTermOfPayments = ({ query = {}, options }) => {
  return useQuery(["top-list", query], () => fetchTermOfPayments({ query }), {
    ...options,
  });
};

const fetchInfiniteTermOfPayments = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/top`, {
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

const useTopInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["top/infinite", query], fetchInfiniteTermOfPayments, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchTermOfPayment = async ({ id, companyId }) => {
  return mdmService(`/top/${companyId}/${id}`).then((data) => data);
};

const useTermOfPayment = ({ id, companyId, options }) => {
  return useQuery(["top-detail", id], () => fetchTermOfPayment({ id, companyId }), {
    ...options,
  });
};

const fetchTopForm = async () => {
  return mdmService(`/top/form`).then((data) => data);
};

const useTopForm = ({ options }) => {
  return useQuery(["top-form"], () => fetchTopForm(), {
    ...options,
  });
};

function useCreateTermOfPayment({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/top`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateTermOfPayment({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/top/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteTermOfPayment = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/top`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileTermOfPayment = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/top/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useTermOfPayments,
  useTermOfPayment,
  useTopInfiniteLists,
  useTopForm,
  useCreateTermOfPayment,
  useUpdateTermOfPayment,
  useDeleteTermOfPayment,
  useUploadFileTermOfPayment,
};
