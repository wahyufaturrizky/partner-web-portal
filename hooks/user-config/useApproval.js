import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPartnerConfigApprovalLists = async ({ query = {} }) => {
  return client(`/partner-approval`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const usePartnerConfigApprovalLists = ({ query = {}, options } = {}) => {
  return useQuery(["partner-approval", query], () => fetchPartnerConfigApprovalLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreatePartnerConfigApprovalList({ options }) {
  return useMutation(
    (updates) =>
      client(`/partner-approval`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchPartnerConfigApprovalList = async ({ partner_config_approval_list_id }) => {
  return client(`/partner-approval/${partner_config_approval_list_id}`).then((data) => data);
};

const usePartnerConfigApprovalList = ({ partner_config_approval_list_id, options }) => {
  return useQuery(
    ["partner-approval", partner_config_approval_list_id],
    () => fetchPartnerConfigApprovalList({ partner_config_approval_list_id }),
    {
      ...options,
    }
  );
};

function useUpdatePartnerConfigApprovalList({ partnerConfigApprovalListId, options }) {
  return useMutation(
    (updates) =>
      client(`/partner-approval/${partnerConfigApprovalListId}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useDeletePartnerConfigApprovalList = ({ options }) => {
  return useMutation(
    (ids) =>
      client("/partner-approval", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export {
  usePartnerConfigApprovalLists,
  usePartnerConfigApprovalList,
  useCreatePartnerConfigApprovalList,
  useUpdatePartnerConfigApprovalList,
  useDeletePartnerConfigApprovalList,
};
