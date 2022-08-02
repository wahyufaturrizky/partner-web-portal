import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchBusinessProcesses = async ({ query = {} }) => {
  return client(`/bprocess`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useBusinessProcesses = ({ query = {}, options }) => {
  return useQuery(["bprocesses", query], () => fetchBusinessProcesses({ query }), {
    ...options,
  });
};

const fetchBusinessProcess = async ({ id }) => {
  return client(`/bprocess/${id}`).then((data) => data);
};

const useBusinessProcess = ({ id, options }) => {
  return useQuery(["bprocess", id], () => fetchBusinessProcess({ id }), {
    ...options,
  });
};

function useCreateBusinessProcess({ options }) {
  return useMutation(
    (data) =>
      client(`/bprocess`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateBusinessProcess({ id, options }) {
  return useMutation(
    (updates) =>
      client(`/bprocess/${id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useUpdateBPAssosiation({ id, options }) {
  return useMutation(
    (data) =>
      client(`/bprocess/association/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteBusinessProcess = ({ options }) => {
  return useMutation(
    (ids) =>
      client(`/bprocess`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export {
  useBusinessProcesses,
  useBusinessProcess,
  useCreateBusinessProcess,
  useUpdateBusinessProcess,
  useUpdateBPAssosiation,
  useDeleteBusinessProcess,
};
