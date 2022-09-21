import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchCostCenters = async ({ query = {} }) => {
  return mdmService(`/cost-center`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "company_id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useCostCenters = ({ query = {}, options }) => {
  return useQuery(["cost-centers", query], () => fetchCostCenters({ query }), {
    ...options,
  });
};

const fetchCostCenter = async ({ id, companyId, query = {} }) => {
  return mdmService(`/cost-center/${companyId}/${id}`, {
    params: { ...query },
  }).then((data) => data);
};

const useCostCenter = ({ id, companyId, query, options }) => {
  return useQuery(
    ["cost-center", id, companyId, query],
    () => fetchCostCenter({ id, companyId, query }),
    {
      ...options,
    }
  );
};

const fetchInfiniteCostCenterLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/cost-center`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useCostCenterInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["cost-center/infinite", query], fetchInfiniteCostCenterLists, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateCostCenter({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/cost-center`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateCostCenter({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/cost-center/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletCostCenter = ({ options }) => {
  return useMutation(
    (data) => {
      console.log(data, "<<<di delete");
      mdmService(`/cost-center`, {
        method: "DELETE",
        data,
      });
    },
    {
      ...options,
    }
  );
};

const useUploadFileCostCenter = ({ query = {}, options }) => {
  return useMutation(
    (data) =>
      mdmService(
        `/cost-center/upload?with_data=${query.with_data}&company_id=${query.company_id}`,
        {
          method: "POST",
          data,
        }
      ),
    {
      ...options,
    }
  );
};

export {
  useCostCenters,
  useCostCenter,
  useCostCenterInfiniteLists,
  useCreateCostCenter,
  useUpdateCostCenter,
  useDeletCostCenter,
  useUploadFileCostCenter,
};
