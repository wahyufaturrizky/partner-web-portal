import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchRolePermissions = async ({ query = {} }) => {
  return client(`/role-permission`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const fetchApprovalRolePermissions = async ({ query = {} }) => {
  return client(`/role-permission/approval`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const useRolePermissions = ({ query = {}, options } = {}) => {
  return useQuery(["role-permissions", query], () => fetchRolePermissions({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const useApprovalRolePermissions = ({ query = {}, options } = {}) => {
  return useQuery(
    ["approval-role-permissions", query],
    () => fetchApprovalRolePermissions({ query }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

function useCreatePermission({ options }) {
  return useMutation(
    (updates) =>
      client(`/role-permission`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchPermission = async ({ role_id }) => {
  return client(`/role-permission/${role_id}`).then((data) => data);
};

const useRole = ({ role_id, options }) => {
  return useQuery(["role-permission", role_id], () => fetchPermission({ role_id }), {
    keepPreviousData: true,
    ...options,
  });
};

function useUpdateRole({ role_id, options }) {
  return useMutation(
    (updates) =>
      client(`/role-permission/${role_id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useApproveRolePermission({ options }) {
  return useMutation(
    (updates) =>
      client(`/role-permission/approval`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useDeletePermission = ({ options }) => {
  return useMutation(
    (ids) =>
      client(`/role-permission/delete`, {
        method: "POST",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export {
  useApprovalRolePermissions,
  useApproveRolePermission,
  useRolePermissions,
  useRole,
  useCreatePermission,
  useUpdateRole,
  useDeletePermission,
};
