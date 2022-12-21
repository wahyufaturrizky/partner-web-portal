import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchNotification = async ({ query = {} }) => {
  return client(`/notification`, {
    params: {
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const useNotification = ({ query = {}, options } = {}) => {
  return useQuery(["notification", query], () => fetchNotification({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

export { useNotification };
