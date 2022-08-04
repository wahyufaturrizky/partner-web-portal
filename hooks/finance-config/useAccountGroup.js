import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchAccountGroups = async ({ query = {} }) => {
  return client(`/account-group`, {
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
const fetchAccountGroupParent = async ({ query = {} }) => {
  return client(`/account-group/parent`).then((data) => data);
};

const useAccountGroups = ({ query = {}, options } = {}) => {
  return useQuery(["account-group", query], () => fetchAccountGroups({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const useAccountGroupParent = ({ query = {}, options } = {}) => {
  return useQuery(["account-group-parent", query], () => fetchAccountGroupParent({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateAccountGroup({ options }) {
  return useMutation(
    (updates) =>
      client(`/account-group`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useUpdateAccountGroup({ accountGroupId, options }) {
  return useMutation(
    (updates) =>
      client(`/account-group/${accountGroupId}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useDeleteAccountGroup = ({ options }) => {
  return useMutation(
    (ids) =>
      client("/account-group", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export {
  useAccountGroups,
  useAccountGroupParent,
  useCreateAccountGroup,
  useUpdateAccountGroup,
  useDeleteAccountGroup,
};
