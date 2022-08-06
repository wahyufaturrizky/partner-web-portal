import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchUsers = async ({ query = {} }) => {
  return client(`/user`, {
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

const useApprovalUsers = ({ query = {}, options } = {}) => {
  return useQuery(["approval-users", query], () => fetchApprovalUsers({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateUser({ options }) {
  return useMutation(
    (updates) =>
      client(`/user`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchUser = async ({ user_id }) => {
  return client(`/user/${user_id}`).then((data) => data);
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
      client(`/user/${user_id}`, {
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
    (ids) =>
      client(`/user/delete`, {
        method: "POST",
        data: ids,
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
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
};
