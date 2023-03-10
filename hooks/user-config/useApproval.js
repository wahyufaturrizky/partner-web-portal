import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPartnerConfigApprovalLists = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode");
  return client(`/partner-approval`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      company_id: companyCode,
      ...query,
    },
  }).then((data) => data);
};

const usePartnerConfigApprovalLists = ({ query = {}, options } = {}) => useQuery(["partner-approval", query], () => fetchPartnerConfigApprovalLists({ query }), {
  keepPreviousData: true,
  ...options,
});

function useCreatePartnerConfigApprovalList({ options }) {
  return useMutation(
    (updates) => client(`/partner-approval`, {
      method: "POST",
      data: updates,
    }),
    {
      ...options,
    },
  );
}

const fetchPartnerConfigApprovalList = async ({ partner_config_approval_list_id, company_id }) => client(`/partner-approval/${company_id}/${partner_config_approval_list_id}`).then(
  (data) => data,
);

const usePartnerConfigApprovalList = ({ partner_config_approval_list_id, company_id, options }) => useQuery(
  ["partner-approval", partner_config_approval_list_id],
  () => fetchPartnerConfigApprovalList({ partner_config_approval_list_id, company_id }),
  {
    ...options,
  },
);

function useUpdatePartnerConfigApprovalList({ partnerConfigApprovalListId, options }) {
  return useMutation(
    (updates) => client(`/partner-approval/${partnerConfigApprovalListId}`, {
      method: "PUT",
      data: updates,
    }),
    {
      ...options,
    },
  );
}

const useDeletePartnerConfigApprovalList = ({ options }) => useMutation(
  (ids) => client("/partner-approval", {
    method: "DELETE",
    data: ids,
  }),
  {
    ...options,
  },
);

const fetchPartnerUserApprovalList = async ({ company_id, role_id }) => client(`/partner-approval/users/${company_id}/${role_id}`).then((data) => data);

const usePartnerUserApprovalList = ({ company_id, role_id, options }) => useQuery(
  ["partner-approval"],
  () => fetchPartnerUserApprovalList({ company_id, role_id }),
  {
    ...options,
  },
);

export {
  usePartnerConfigApprovalLists,
  usePartnerConfigApprovalList,
  useCreatePartnerConfigApprovalList,
  useUpdatePartnerConfigApprovalList,
  useDeletePartnerConfigApprovalList,
  usePartnerUserApprovalList,
};
