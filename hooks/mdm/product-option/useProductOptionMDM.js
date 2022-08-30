import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProductOptionsMDM = async ({ query = {} }) => {
  return mdmService(`/product-option`, {
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

const useProductOptionsMDM = ({ query = {}, options }) => {
  return useQuery(["product-option", query], () => fetchProductOptionsMDM({ query }), {
    ...options,
  });
};

const fetchInfiniteProductOptionsLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/product-option`, {
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

const useProductOptionsInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["product-options/infinite", query], fetchInfiniteProductOptionsLists, {
    keepPreviousData: true,
    ...options,
  });
};


const fetchProductOptionMDM = async ({ id }) => {
  return mdmService(`/product-option/${id}`).then((data) => data);
};

const useProductOptionMDM = ({ id, options }) => {
  return useQuery(["product-option", id], () => fetchProductOptionMDM({ id }), {
    ...options,
  });
};

function useCreateProductOptionMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-option`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useCreateProductOptionItemMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-option/item`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProductOptionMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-option/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateProductOptionItemMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/product-option/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteProductOptionMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/product-option`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useDeleteProductOptionItemMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/product-option/item`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileProductOptionMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/product-option/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useProductOptionsMDM,
  useProductOptionMDM,
  useProductOptionsInfiniteLists,
  useCreateProductOptionMDM,
  useUpdateProductOptionMDM,
  useDeleteProductOptionMDM,
  useUploadFileProductOptionMDM,
  useCreateProductOptionItemMDM,
  useDeleteProductOptionItemMDM,
  useUpdateProductOptionItemMDM,
};
