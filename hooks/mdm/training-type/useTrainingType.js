import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchTrainingTypes = async ({ query = {} }) => {
  return mdmService(`/training-type`, {
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

const useTrainingTypes = ({ query = {}, options }) => {
  return useQuery(["training-types", query], () => fetchTrainingTypes({ query }), {
    ...options,
  });
};

const fetchInfiniteeTrainingTypeLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/training-type`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "created_at",
      sortOrder: "DESC",
      company_id: "KSNI",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useTrainingTypeInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["training-type/infinite", query], fetchInfiniteeTrainingTypeLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchTrainingType = async ({ id, companyId }) => {
  return mdmService(`/traning-type/${companyId}/${id}`).then((data) => data);
};

const useTrainingType = ({ id, companyId, options }) => {
  return useQuery(["training-type", id], () => fetchTrainingType({ id, companyId }), {
    ...options,
  });
};

function useCreateTrainingType({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/training-type`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateTrainingType({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/training-type/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteTrainingType = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/training-type`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileTrainingType = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/training-type/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useTrainingTypes,
  useTrainingType,
  useCreateTrainingType,
  useUpdateTrainingType,
  useDeleteTrainingType,
  useUploadFileTrainingType,
  useTrainingTypeInfiniteLists,
};
