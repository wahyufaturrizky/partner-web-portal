import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchAllSequenceNumber = async ({ query = {} }) => {
  return client(`/sequence`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "DESC",
    //   company_id: "KSNI",
      ...query,
    },
  }).then((data) => data);
};

const useAllSequenceNumber = ({ query = {}, options }) => {
  return useQuery(["sequence-number", query], () => fetchAllSequenceNumber({ query }), {
    ...options,
  });
};

export { useAllSequenceNumber };
