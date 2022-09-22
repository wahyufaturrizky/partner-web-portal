import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchProductCategory = async ({ query = {} }) => {
  return mdmService(`/product-category`, {
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

const useProductCategoryList = ({ query = {}, options }) => {
  return useQuery(["product-list", query], () => fetchProductCategory({ query }), {
    ...options,
  });
};

const useDeleteProductCategory = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/product-category`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

export { useProductCategoryList, useDeleteProductCategory };