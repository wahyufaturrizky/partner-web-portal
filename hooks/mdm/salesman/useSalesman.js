import { mdmService } from "lib/client";
import { useMutation, useQuery } from "react-query";

const fetchListSalesman = async ({ query }) => {
  return mdmService(`/salesman`, {
    params: {
      company: "KSNI",
      sortOrder: "DESC",
      limit: 10,
      page: 1,
      ...query,
    },
  }).then((data) => data);
};

const fetchDetailSalesman = async ({ id }) => {
  return mdmService(`/salesman/${id}`).then((data) => data);
};

const useFetchListSalesman = ({ query, options }) => {
  return useQuery(["list-salesman", query], () => fetchListSalesman({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const useFetchDetailSalesman = ({ id, options }) => {
  return useQuery(["detail-salesman", id], () => fetchDetailSalesman({ id }), {
    keepPreviousData: true,
    ...options,
  });
};

const useUpdateSalesman = ({ id, options }) => {
  return useMutation(
    (data) =>
      mdmService(`/salesman/${id}`, {
        method: "PUT",
        data,
      }),
    { ...options }
  );
};

const useUploadDocumentSalesman = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService("/salesman/upload", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

export {
  useUploadDocumentSalesman,
  useUpdateSalesman,
  useFetchListSalesman,
  useFetchDetailSalesman,
};
