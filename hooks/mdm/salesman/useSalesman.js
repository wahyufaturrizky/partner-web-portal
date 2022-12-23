import { mdmService } from "lib/client";
import { useMutation, useQuery } from "react-query";

const fetchListSalesman = async ({ query, company_id }) => {
  const companyCode = localStorage.getItem('companyCode');
  return mdmService(`/salesman`, {
    params: {
      company: companyCode,
      sortOrder: "ASC",
      limit: 10,
      page: 1,
      ...query,
    },
  }).then((data) => data);
};

const fetchCountTabItems = async ({ company_id }) => {
  return mdmService("/salesman/count/stats", {
    params: { company: company_id },
  }).then((data) => data);
};

const fetchDetailSalesman = async ({ id }) => {
  return mdmService(`/salesman/${id}`).then((data) => data);
};

const useFetchListSalesman = ({ query, options, company_id }) => {
  return useQuery(["list-salesman", query], () => fetchListSalesman({ query, company_id }), {
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

const fetchSalesmanCustomerDetails = async ({ query }) => {
  return mdmService(`/salesman/customer/details`, {
    params: {
      page: 1,
      limit: 10,
      sortBy: "branch",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const useFetchSalesmanCustomerDetail = ({ query, options }) => {
  return useQuery(
    ["salesman-customer-detail", query],
    () => fetchSalesmanCustomerDetails({ query }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
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

const useApprovalSalesman = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService("/salesman/approval", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

const useFetchCountTabItems = ({ query, options, company_id }) => {
  return useQuery(["count-tab-items", query], () => fetchCountTabItems({ query, company_id }), {
    keepPreviousData: true,
    ...options,
  });
};

export {
  useFetchCountTabItems,
  useUploadDocumentSalesman,
  useUpdateSalesman,
  useFetchListSalesman,
  useFetchDetailSalesman,
  useFetchSalesmanCustomerDetail,
  useApprovalSalesman,
};
