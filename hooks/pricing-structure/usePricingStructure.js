import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client, mdmService } from "../../lib/client";

const fetchPricingStructureLists = async ({ query = {} }) => {
  return client(`/price-structure`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const usePricingStructureLists = ({ query = {}, options } = {}) => {
  return useQuery(["price-structure", query], () => fetchPricingStructureLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchGroupBuyingLists = async ({ query = {} }) => {
  return mdmService(`/group-buying`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "ASC",
      ...query,
    },
  }).then((data) => data);
};

const useGroupBuyingLists = ({ query = {}, options } = {}) => {
  return useQuery(["group-buying", query], () => fetchGroupBuyingLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteGroupBuyingLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/group-buying`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useGroupBuyingInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["group-buying/infinite", query], fetchInfiniteGroupBuyingLists, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchPricingConfigLists = async ({ query = {} }) => {
  return mdmService(`/pricing-config`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "ASC",
      ...query,
    },
  }).then((data) => data);
};

const usePricingConfigLists = ({ query = {}, options } = {}) => {
  return useQuery(["pricing-config", query], () => fetchPricingConfigLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfinitePricingConfigLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/pricing-config`, {
    params: {
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "ASC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const usePricingConfigInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["pricing-config/infinite", query], fetchInfinitePricingConfigLists, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateGroupBuying({ options }) {
  return useMutation(
    (updates) =>
      mdmService(`/group-buying`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useCreatePricingConfig({ options }) {
  return useMutation(
    (updates) =>
      mdmService(`/pricing-config`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useCreatePricingStructureList({ options }) {
  return useMutation(
    (updates) =>
      client(`/price-structure`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useCreatePricingStructureDraftList({ options }) {
  return useMutation(
    (updates) =>
      client(`/price-structure/savedraft`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchPricingStructureList = async ({ partner_config_id }) => {
  return client(`/price-structure/${partner_config_id}`).then((data) => data);
};

const usePricingStructureList = ({ partner_config_id, options }) => {
  return useQuery(
    ["price-structure", partner_config_id],
    () => fetchPricingStructureList({ partner_config_id }),
    {
      ...options,
    }
  );
};

const fetchGroupBuyingList = async ({ group_buying_id }) => {
  return mdmService(`/group-buying/${group_buying_id}`).then((data) => data);
};

const useGroupBuyingList = ({ group_buying_id, options }) => {
  return useQuery(
    ["group-buying", group_buying_id],
    () => fetchGroupBuyingList({ group_buying_id }),
    {
      ...options,
    }
  );
};

const fetchPricingConfigList = async ({ group_buying_id }) => {
  return mdmService(`/pricing-config/${group_buying_id}`).then((data) => data);
};

const usePricingConfigList = ({ pricing_config_id, options }) => {
  return useQuery(
    ["pricing-config", pricing_config_id],
    () => fetchPricingConfigList({ pricing_config_id }),
    {
      ...options,
    }
  );
};

function useUpdatePricingStructureList({ pricingStructureListId, options }) {
  return useMutation(
    (updates) =>
      client(`/price-structure/${pricingStructureListId}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useUpdateGroupBuyingList({ groupBuyingListId, options }) {
  return useMutation(
    (updates) =>
      mdmService(`/group-buying/customer-buying/${groupBuyingListId}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useUpdatePricingConfigList({ pricingConfigListId, options }) {
  return useMutation(
    (updates) =>
      mdmService(`/pricing-config/${pricingConfigListId}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useDeletePricingStructureList = ({ options }) => {
  return useMutation(
    (ids) =>
      client("/price-structure", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useDeleteGroupBuyingList = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService("/group-buying", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useDeletePricingConfigList = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService("/pricing-config", {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

function useValidatePricingStructureInput({ options }) {
  return useMutation(
    (updates) =>
      client(`/price-structure/validate`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

function useApprovePricingStructureList({ options, partner_id }) {
  return useMutation(
    (updates) =>
      client(`/price-structure/approval/${partner_id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useUploadFilePricingStructureMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/price-structure/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  usePricingStructureLists,
  usePricingStructureList,
  useCreatePricingStructureList,
  useCreatePricingStructureDraftList,
  useUpdatePricingStructureList,
  useDeletePricingStructureList,
  useValidatePricingStructureInput,
  useApprovePricingStructureList,
  useUploadFilePricingStructureMDM,
  useGroupBuyingLists,
  useCreateGroupBuying,
  useGroupBuyingList,
  useUpdateGroupBuyingList,
  useDeleteGroupBuyingList,
  useDeletePricingConfigList,
  usePricingConfigLists,
  useCreatePricingConfig,
  usePricingConfigList,
  useUpdatePricingConfigList,
  useGroupBuyingInfiniteLists,
  usePricingConfigInfiniteLists,
};
