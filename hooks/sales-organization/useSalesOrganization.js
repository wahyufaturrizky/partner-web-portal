import axios from "axios";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { mdmService } from "../../lib/client";

let token;
let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

const fetchSalesOrganization = async ({ queryKey }) => {
  return mdmService(`/sales-org/${queryKey[1]}`, {}).then((data) => data);
};

const useSalesOrganization = ({ options, company_code } = {}) => {
  return useQuery(
    ["sales-organization", company_code], fetchSalesOrganization,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: false,
      ...options,
    }
  );
};

const fetchInfiniteeSalesOrganizationLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/sales-org/${queryKey[1].company_code}`, {
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

const useSalesOrganizationInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["sales-org/infinite", query], fetchInfiniteeSalesOrganizationLists, {
    keepPreviousData: true,
    ...options,
  });
};

const useUpdateSalesOrganization = ({ company_code, options }) => {
  return useMutation(
    (data) =>
      mdmService(`/sales-org/${company_code}`, {
        method: "PUT",
        data,
      }),
    { ...options }
  );
};

const useCreateSalesOrganization = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/sales-org`, {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

const useCreateSalesOrganizationHirarcy = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/sales-org/hirarcy`, {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

const useGenerateTemplate = async ({ query }) => {
  return await axios
    .get(apiURL + "v1/country/template/generate", {
      params: query,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      var data = new Blob([response], { type: "text/csv" });
      var csvURL = window.URL.createObjectURL(data);
      tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", "filename.csv");
      tempLink.click();
    });
};

const fetchSalesOrganizationHirarcy = async ({ structure_id }) => {
  return mdmService(`/sales-org/hirarcy/${structure_id}`, {}).then((data) => data);
};

const useSalesOrganizationHirarcy = ({ options, structure_id } = {}) => {
  return useQuery(
    ["sales-organization-hirarcy", structure_id],
    () => fetchSalesOrganizationHirarcy({ structure_id }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

export {
  useSalesOrganizationInfiniteLists,
  useCreateSalesOrganizationHirarcy,
  useCreateSalesOrganization,
  useSalesOrganizationHirarcy,
  useSalesOrganization,
  useUpdateSalesOrganization,
  useGenerateTemplate,
};
