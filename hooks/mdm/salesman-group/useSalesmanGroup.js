import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchSalesmanGroups = async ({ query = {} }) => {
  return mdmService(`/salesman-group`, {
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

const useSalesmanGroups = ({ query = {}, options }) => {
  return useQuery(["salesman-groups", query], () => fetchSalesmanGroups({ query }), {
    ...options,
  });
};

const fetchSalesmanGroup = async ({ id, companyId }) => {
  return mdmService(`/salesman-group/${companyId}/${id}`).then((data) => data);
};

const useSalesmanGroup = ({ id, companyId, options }) => {
  return useQuery(["salesman-group", id], () => fetchSalesmanGroup({ id, companyId }), {
    ...options,
  });
};

function useCreateSalesmanGroup({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/salesman-group`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateSalesmanGroup({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/salesman-group/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteSalesmanGroup = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/salesman-group`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileSalesmanGroup = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/salesman-group/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useSalesmanGroups,
  useSalesmanGroup,
  useCreateSalesmanGroup,
  useUpdateSalesmanGroup,
  useDeleteSalesmanGroup,
  useUploadFileSalesmanGroup,
};
