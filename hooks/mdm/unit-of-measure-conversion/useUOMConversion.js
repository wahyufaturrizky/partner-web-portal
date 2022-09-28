import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchUOMConversions = async ({ query = {} }) => {
  return mdmService(`/uom-conversion`, {
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

const useUOMConversions = ({ query = {}, options }) => {
  return useQuery(["uom-conversions", query], () => fetchUOMConversions({ query }), {
    ...options,
  });
};

const fetchUOMConversion = async ({ id, companyId, query = {} }) => {
  return mdmService(`/uom-conversion/${companyId}/${id}`, {
    params: { ...query },
  }).then((data) => data);
};

const useUOMConversion = ({ id, companyId, query, options }) => {
  return useQuery(
    ["uom-conversion", id, companyId, query],
    () => fetchUOMConversion({ id, companyId, query }),
    {
      ...options,
    }
  );
};

const fetchInfiniteUOMConversionLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/uom-conversion`, {
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

const useUOMConversionInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["uom-conversion/infinite", query], fetchInfiniteUOMConversionLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchUOMConversionsLevel = async ({ query = {} }) => {
  return mdmService(`/uom-conversion-level`, {
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

const useUOMConversionsLevel = ({ query = {}, options }) => {
  return useQuery(["uom-conversions-level", query], () => fetchUOMConversionsLevel({ query }), {
    ...options,
  });
};

const fetchInfiniteUOMLevelConversionLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/uom-conversion-level`, {
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

const useUOMConversionLevelInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["uom-conversion-level/infinite", query], fetchInfiniteUOMLevelConversionLists, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateUOMConversion({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom-conversion`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useCreateUOMLevelConversion({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom-conversion-level`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateUOMConversion({ id, companyId, options }) {
  return useMutation(
    (data) =>
      mdmService(`/uom-conversion/${companyId}/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletUOMConversion = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/uom-conversion`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useDeletUOMLevelConversion = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/uom-conversion-level`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileUOMConversion = ({ query = {}, options }) => {
  return useMutation(
    (data) =>
      mdmService(
        `/uom-conversion/upload?with_data=${query.with_data}&company_id=${query.company_id}`,
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
  useUOMConversions,
  useUOMConversion,
  useUOMConversionInfiniteLists,
  useCreateUOMConversion,
  useUpdateUOMConversion,
  useDeletUOMConversion,
  useUploadFileUOMConversion,
  useUOMConversionLevelInfiniteLists,
  useUOMConversionsLevel,
  useCreateUOMLevelConversion,
  useDeletUOMLevelConversion
};
