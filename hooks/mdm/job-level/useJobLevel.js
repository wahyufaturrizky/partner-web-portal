import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchJobLevels = async ({ query = {} }) => {
  return mdmService(`/job-level`, {
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

const useJobLevels = ({ query = {}, options }) => {
  return useQuery(["job-levels", query], () => fetchJobLevels({ query }), {
    ...options,
  });
};

const fetchJobLevel = async ({ id, companyId }) => {
  return mdmService(`/job-level/${companyId}/${id}`).then((data) => data);
};

const useJobLevel = ({ id, companyId, options }) => {
  return useQuery(["job-level", id], () => fetchJobLevel({ id, companyId }), {
    ...options,
  });
};

function useCreateJobLevel({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/job-level`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateJobLevel({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/job-level/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteJobLevel = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/job-level`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileJobLevel = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/job-level/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useJobLevels,
  useJobLevel,
  useCreateJobLevel,
  useUpdateJobLevel,
  useDeleteJobLevel,
  useUploadFileJobLevel,
};
