import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPricingStructureLists = async ({ query = {} }) => {
  return client(`/pricing-structure`, {
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
  return useQuery(["pricing-structure", query], () => fetchPricingStructureLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreatePricingStructureList({ options }) {
  return useMutation(
    (updates) =>
      client(`/pricing-structure`, {
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
      client(`/pricing-structure/savedraft`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const fetchPricingStructureList = async ({ partner_config_id }) => {
  return client(`/pricing-structure/${partner_config_id}`).then((data) => data);
};

const usePricingStructureList = ({ partner_config_id, options }) => {
  return useQuery(
    ["pricing-structure", partner_config_id],
    () => fetchPricingStructureList({ partner_config_id }),
    {
      ...options,
    }
  );
};

function useUpdatePricingStructureList({ PricingStructureListId, options }) {
  return useMutation(
    (updates) =>
      client(`/pricing-structure/${PricingStructureListId}`, {
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
      client("/pricing-structure/delete", {
        method: "POST",
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
      client(`/pricing-structure/validate`, {
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
      client(`/pricing-structure/approval/${partner_id}`, {
        method: "PUT",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

export {
  usePricingStructureLists,
  usePricingStructureList,
  useCreatePricingStructureList,
  useCreatePricingStructureDraftList,
  useUpdatePricingStructureList,
  useDeletePricingStructureList,
  useValidatePricingStructureInput,
  useApprovePricingStructureList,
};
