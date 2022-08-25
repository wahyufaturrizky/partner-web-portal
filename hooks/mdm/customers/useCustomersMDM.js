import { useQuery } from 'react-query'
import { mdmService } from "../../../lib/client";

const fetchListCustomers = async ({ query = {} }) => {
  return mdmService('/customer', {
    params: {
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((response) => response)
}

const useListCustomers = ({ options, query = {} }) => {
  return useQuery(["customer-list", query], () => fetchListCustomers({ query }), {
    keepPreviousData: true,
    ...options,
  });
}

export { useListCustomers }