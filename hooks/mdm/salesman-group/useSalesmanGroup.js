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

const fetchSalesmanGroup = async ({ id }) => {
  return mdmService(`/salesman-group/${id}`).then((data) => data);
};

const useSalesmanGroup = ({ id, options }) => {
  return useQuery(["salesman-group"], () => fetchSalesmanGroup({ id }), {
    ...options,
  });
};

const fetchSalesmanGroupParent = async ({ id, companyId }) => {
  return mdmService(`/salesman-group/parent/${id}/${companyId}`).then((data) => data);
};

const useSalesmanGroupParent = ({ dataId: { id, companyId }, options }) => {
  return useQuery(["salesman-group-parent"], () => fetchSalesmanGroupParent({ id, companyId }), {
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

function useUpdateSalesmanGroup({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/salesman-group/${id}`, {
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
  useSalesmanGroupParent,
  useCreateSalesmanGroup,
  useUpdateSalesmanGroup,
  useDeleteSalesmanGroup,
  useUploadFileSalesmanGroup,
};
