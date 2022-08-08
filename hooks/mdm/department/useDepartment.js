import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchDepartments = async ({ query = {} }) => {
  return mdmService(`/department`, {
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

const useDepartments = ({ query = {}, options }) => {
  return useQuery(["departments", query], () => fetchDepartments({ query }), {
    ...options,
  });
};

const fetchDepartment = async ({ id, companyId }) => {
  return mdmService(`/department/${companyId}/${id}`).then((data) => data);
};

const useDepartment = ({ id, companyId, options }) => {
  return useQuery(["department", id], () => fetchDepartment({ id, companyId }), {
    ...options,
  });
};

function useCreateDepartment({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/department`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateDepartment({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/department/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteDepartment = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/department`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileDepartment = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/department/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useDepartments,
  useDepartment,
  useUpdateDepartment,
  useCreateDepartment,
  useDeleteDepartment,
  useUploadFileDepartment,
};
