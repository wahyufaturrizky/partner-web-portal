import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client, mdmService } from "../../lib/client";

const fetchUsers = async ({ query = {} }) =>
  client(`/partner-user`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);

const fetchApprovalUsers = async ({ query = {} }) =>
  client(`/user/approval`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);

const useUsers = ({ query = {}, options } = {}) =>
  useQuery(["users", query], () => fetchUsers({ query }), {
    keepPreviousData: true,
    ...options,
  });

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

const useUserInfiniteList = ({ query = {}, options }) =>
  useInfiniteQuery(["user/infinite", query], fetchInfiniteUsers, {
    keepPreviousData: true,
    ...options,
  });

const useApprovalUsers = ({ query = {}, options } = {}) =>
  useQuery(["approval-users", query], () => fetchApprovalUsers({ query }), {
    keepPreviousData: true,
    ...options,
  });

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

const fetchUser = async ({ user_id }) => client(`/partner-user/${user_id}`).then((data) => data);

const useUser = ({ user_id, options }) =>
  useQuery(["user", user_id], () => fetchUser({ user_id }), {
    ...options,
  });

const fetchUserPermissions = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode");
  return client(`/partner-user/permission`, {
    params: {
      company_id: companyCode,
      ...query,
    },
  }).then((data) => data);

const useUserPermissions = ({ query = {}, options } = {}) =>
  useQuery(["user-permissions", query], () => fetchUserPermissions({ query }), {
    keepPreviousData: true,
    ...options,
  });
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

const useDeleteUser = ({ options }) =>
  useMutation(
    (ids) =>
      client(`/partner-user`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );

const useUploadFileUserConfig = ({ options }) =>
  useMutation(
    (data) =>
      client(`/partner-user/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );

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
