import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchPurchaseOrganizationsMDM = async ({ query = {} }) => {
  return mdmService(`/purchase-organization`, {
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

const usePurchaseOrganizationsMDM = ({ query = {}, options }) => {
  return useQuery(
    ["purchase-organization", query],
    () => fetchPurchaseOrganizationsMDM({ query }),
    {
      ...options,
    }
  );
};

const fetchPurchaseOrganizationMDM = async ({ id }) => {
  return mdmService(`/purchase-organization/${id}`).then((data) => data);
};

const usePurchaseOrganizationMDM = ({ id, options }) => {
  return useQuery(["purchase-organization", id], () => fetchPurchaseOrganizationMDM({ id }), {
    ...options,
  });
};

const fetchParentPurchaseOrganizationMDM = async ({ id }) => {
  return mdmService(`/purchase-organization/parent/${id}`).then((data) => data);
};

const useParentPurchaseOrganizationMDM = ({ id, options }) => {
  return useQuery(["purchase-organization", id], () => fetchParentPurchaseOrganizationMDM({ id }), {
    ...options,
  });
};

function useCreatePurchaseOrganizationMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/purchase-organization`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdatePurchaseOrganizationMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/purchase-organization/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletePurchaseOrganizationMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/purchase-organization`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFilePurchaseOrganizationMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/purchase-organization/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  usePurchaseOrganizationsMDM,
  usePurchaseOrganizationMDM,
  useCreatePurchaseOrganizationMDM,
  useUpdatePurchaseOrganizationMDM,
  useDeletePurchaseOrganizationMDM,
  useUploadFilePurchaseOrganizationMDM,
  useParentPurchaseOrganizationMDM,
};
