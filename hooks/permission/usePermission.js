import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPermissions = async ({ query = {} }) => {
  return client(`/permission`, {
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

const fetchApprovalPermissions = async ({ query = {} }) => {
  return client(`/permission/approval`, {
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

const usePermissions = ({ query = {}, options } = {}) => {
  return useQuery(["permissions", query], () => fetchPermissions({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const useApprovalPermissions = ({ query = {}, options } = {}) => {
  return useQuery(["approval-permissions", query], () => fetchApprovalPermissions({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreatePermission({ options }) {
  return useMutation(
    (updates) =>
      client(`/permission`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useFilterListPermissions({ options }) {
  return useMutation(
    (dataFilter) =>
      client(`/permission/filter`, {
        method: "POST",
        data: dataFilter,
      }),
    {
      ...options,
    }
  );
}

const fetchPermission = async ({ permission_id }) => {
  return client(`/permission/${permission_id}`).then((data) => data);
};

const usePermission = ({ permission_id, options = {} }) => {
  return useQuery(["permission", permission_id], () => fetchPermission({ permission_id }), {
    ...options,
  });
};

function useUpdatePermission({ permission_id, options }) {
  return useMutation(
    (updates) =>
      client(`/permission/${permission_id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useApprovePermission({ options }) {
  return useMutation(
    (updates) =>
      client(`/permission/approval`, {
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
      client(`/permission`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const fetchPermissionMenu = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode")
  return client(`/partner-permission/menu`, {
    params: {
      search: "",
      all: 1,
      ...query,
      company_id: companyCode
    },
  }).then((data) => data);
};

const useMenuPermissionLists = ({ query = {}, options } = {}) => {
  return useQuery(["menu", query], () => fetchPermissionMenu({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

export {
  useApprovalPermissions,
  usePermissions,
  usePermission,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  useMenuPermissionLists,
  useFilterListPermissions,
  useApprovePermission,
};
