import { useQuery } from "react-query";
import { mdmService } from "../../../lib/client";
import dummyExchange from "./dummy";

const fetchExchangeRates = async ({ query = {} }) => {
  // base url is will change if already yet
  return mdmService(`/profit-center`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => dummyExchange[0].data);
};

const useExchangeRates = ({ query = {}, options }) => {
  // base url is will change if already yet
  return useQuery(["profit-list", query], () => fetchExchangeRates({ query }), {
    ...options,
  });
};

export { useExchangeRates };
