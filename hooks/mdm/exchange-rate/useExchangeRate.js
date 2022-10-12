import { useMutation, useQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchExchangeRates = async ({ query = {} }) => {
  return mdmService(`/exchange-rate`, {
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

const useExchangeRates = ({ query = {}, options }) => {
  return useQuery(["exchange-rate-list", query], () => fetchExchangeRates({ query }), {
    ...options,
  });
};

const useUploadFileExchangeRate = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/exchange-rate/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};
export { useExchangeRates, useUploadFileExchangeRate };
