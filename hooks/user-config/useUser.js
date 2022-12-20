import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client, mdmService } from "../../lib/client";

const fetchUsers = async ({ query = {} }) => {
  return client(`/partner-user`, {
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

const fetchApprovalUsers = async ({ query = {} }) => {
  return client(`/user/approval`, {
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

const useUsers = ({ query = {}, options } = {}) => {
  return useQuery(["users", query], () => fetchUsers({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteUsers = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client(`/partner-role`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
    },
  }).then((data) => data);
};

const useUserInfiniteList = ({ query = {}, options }) => {
  return useInfiniteQuery(["user/infinite", query], fetchInfiniteUsers, {
    keepPreviousData: true,
    ...options,
  });
};

const useApprovalUsers = ({ query = {}, options } = {}) => {
  return useQuery(["approval-users", query], () => fetchApprovalUsers({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateUser({ options }) {
  return useMutation(
    (updates) =>
      client(`/partner-user`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchUser = async ({ user_id }) => {
  return client(`/partner-user/${user_id}`).then((data) => data);
};

const useUser = ({ user_id, options }) => {
  return useQuery(["user", user_id], () => fetchUser({ user_id }), {
    ...options,
  });
};

const fetchUserPermissions = async ({ query = {} }) => {
  return client(`/partner-user/permission`, {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useUserPermissions = ({ query = {}, options } = {}) => {
  return useQuery(["user-permissions", query], () => fetchUserPermissions({ query }), {
    keepPreviousData: true,
    ...options,
  });
};
function useApproveUser({ options }) {
  return useMutation(
    (updates) =>
      client(`/user/approval`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useUpdateUser({ user_id, options }) {
  return useMutation(
    (updates) =>
      client(`/partner-user/${user_id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useDeleteUser = ({ options }) => {
  return useMutation(
    (ids) => {
      return client(`/partner-user`, {
        method: "DELETE",
        data: ids,
      });
    },
    {
      ...options,
    }
  );
};

const useUploadFileUserConfig = ({ options }) => {
  return useMutation(
    (data) =>
      client(`/partner-user/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useUsers,
  useApproveUser,
  useApprovalUsers,
  useUser,
  useUserPermissions,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUserInfiniteList,
  useUploadFileUserConfig,
};
