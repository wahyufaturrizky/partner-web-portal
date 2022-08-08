import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchCustomerGroupsMDM = async ({ query = {} }) => {
  return mdmService(`customer-group`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      company: "KSNI",
      ...query,
    },
  }).then((data) => data);
};

const useCustomerGroupsMDM = ({ query = {}, options }) => {
  return useQuery(["customer-group", query], () => fetchCustomerGroupsMDM({ query }), {
    ...options,
  });
};

const fetchCustomerGroupMDM = async ({ id }) => {
  return mdmService(`customer-group/${id}`).then((data) => data);
};

const useCustomerGroupMDM = ({ id, options }) => {
  return useQuery(["customer-group", id], () => fetchCustomerGroupMDM({ id }), {
    ...options,
  });
};

const fetchParentCustomerGroupMDM = async ({ id }) => {
  return mdmService(`customer-group/parent/${id}`).then((data) => data);
};

const useParentCustomerGroupMDM = ({ id, options }) => {
  return useQuery(["customer-group", id], () => fetchParentCustomerGroupMDM({ id }), {
    ...options,
  });
};

function useCreateCustomerGroupMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`customer-group`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateCustomerGroupMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`customer-group/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteCustomerGroupMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`customer-group`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileCustomerGroupMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`customer-group/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useCustomerGroupsMDM,
  useCustomerGroupMDM,
  useCreateCustomerGroupMDM,
  useUpdateCustomerGroupMDM,
  useDeleteCustomerGroupMDM,
  useUploadFileCustomerGroupMDM,
  useParentCustomerGroupMDM,
};
