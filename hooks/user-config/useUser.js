import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client } from "../../lib/client";

const fetchUsers = async ({ query = {} }) => {
  return mdmService(`/user`, {
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
      mdmService(`/user`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchUser = async ({ user_id }) => {
  return mdmService(`/user/${user_id}`).then((data) => data);
};

const useUser = ({ user_id, options }) => {
  return useQuery(["user", user_id], () => fetchUser({ user_id }), {
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
      mdmService(`/user/${user_id}`, {
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
      console.log(ids);
      return mdmService(`/user/delete`, {
        method: "POST",
        data: ids,
      });
    },
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
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUserInfiniteList
};
