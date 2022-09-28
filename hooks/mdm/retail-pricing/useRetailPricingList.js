import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchRetailPricing = async ({ query = {} }) => {
  return mdmService(`/retail-pricing`, {
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

const useRetailPricingList = ({ query = {}, options }) => {
  return useQuery(["retail-pricing-list", query], () => fetchRetailPricing({ query }), {
    ...options,
  });
};

const fetchRetailPricingDetail = async ({ id, }) => {
  return mdmService(`/retail-pricing/${id}`).then((data) => data);
};

const useRetailPricingDetail = ({ id, options }) => {
  return useQuery(["retail-pricing-detail", id], () => fetchRetailPricingDetail({ id }), {
    ...options,
  });
};

function useCreateRetailPricing({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateRetailPricing({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/retail-pricing/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteRetailPricing = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileRetailPricing = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/retail-pricing/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadImageRetailPricing = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/retail-pricing/image`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUpdateRetailPricingVariantStatus = ({ options }) => {
  return useMutation(
    (data, id) =>
      mdmService(`/retail-pricingvariant/status/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useUploadImageRetailPricing,
  useRetailPricingList,
  useRetailPricingDetail,
  useCreateRetailPricing,
  useUpdateRetailPricing,
  useDeleteRetailPricing,
  useUploadFileRetailPricing,
  useUpdateRetailPricingVariantStatus
};
