import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPartnerConfigPermissionLists = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode");
  return client(`/partner-permission`, {
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

const usePartnerConfigPermissionLists = ({ query = {}, options } = {}) => {
  return useQuery(
    ["partner-permission", query],
    () => fetchPartnerConfigPermissionLists({ query }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

function useCreatePartnerConfigPermissionList({ options }) {
  return useMutation(
    (updates) =>
      client(`/partner-permission`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchPartnerConfigPermissionList = async ({ partner_config_menu_list_id }) => {
  const companyCode = localStorage.getItem("companyCode");
  return client(`/partner-permission/${partner_config_menu_list_id}/${companyCode}`).then((data) => data);
};

const usePartnerConfigPermissionList = ({ partner_config_menu_list_id, options }) => {
  return useQuery(
    ["partner-permission", partner_config_menu_list_id],
    () => fetchPartnerConfigPermissionList({ partner_config_menu_list_id }),
    {
      ...options,
    }
  );
};

function useUpdatePartnerConfigPermissionList({ partnerConfigPermissionListId, options }) {
  const companyCode = localStorage.getItem("companyCode");
  return useMutation(
    (updates) =>
      client(`/partner-permission/${partnerConfigPermissionListId}`, {
        method: "PUT",
        data: { ...updates, company_id: companyCode },
      }),
    {
      ...options,
    }
  );
}

const useDeletePartnerConfigPermissionList = ({ options }) => {
  return useMutation(
    (ids) =>
      client("/partner-permission", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export {
  usePartnerConfigPermissionLists,
  usePartnerConfigPermissionList,
  useCreatePartnerConfigPermissionList,
  useUpdatePartnerConfigPermissionList,
  useDeletePartnerConfigPermissionList,
};
