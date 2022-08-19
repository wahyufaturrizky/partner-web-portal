import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchEmployeeListsMDM = async ({ query = {} }) => {
  return mdmService(`/employee-list`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      company_id: "KSNI",
      ...query,
    },
  }).then((data) => data);
};

const useEmployeeListsMDM = ({ query = {}, options }) => {
  return useQuery(["employee-list", query], () => fetchEmployeeListsMDM({ query }), {
    ...options,
  });
};

const fetchEmployeeListMDM = async ({ id }) => {
  return mdmService(`/employee-list/${id}`).then((data) => data);
};

const useEmployeeListMDM = ({ id, options }) => {
  return useQuery(["employee-list", id], () => fetchEmployeeListMDM({ id }), {
    ...options,
  });
};

function useCreateEmployeeListMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/employee-list`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateEmployeeListMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/employee-list/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteEmployeeListMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/employee-list`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileEmployeeListMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/employee-list/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useEmployeeListsMDM,
  useEmployeeListMDM,
  useCreateEmployeeListMDM,
  useUpdateEmployeeListMDM,
  useDeleteEmployeeListMDM,
  useUploadFileEmployeeListMDM,
};
