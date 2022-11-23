import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchAllSequenceNumber = async ({ query = {} }) => {
  return client(`/sequence`, {
    params: {
      search: "",
      page: 1,
      limit: 10,
      sortBy: "company.name",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useAllSequenceNumber = ({ query = {}, options }) => {
  return useQuery(["sequence-number", query], () => fetchAllSequenceNumber({ query }), {
    ...options,
  });
};

// const fetchParentSequenceNumber = async ({ query = {}, branch_id }) => {
//   return client(`/sequence`, {
//     params: {
//       search: "",
//       page: 1,
//       limit: 10,
//       sortBy: "created_at",
//       sortOrder: "DESC",
//       company_id: 1,
//       branch_id: branch_id,
//       ...query,
//     },
//   }).then((data) => data);
// };

// const useParentSequenceNumber = ({ query = {}, options, branch_id }) => {
//   return useQuery(
//     ["parent-sequence-number", query],
//     () => fetchParentSequenceNumber({ query, branch_id }),
//     {
//       ...options,
//     }
//   );
// };

const fetchSequenceNumber = async ({ query = {}, id }) => {
  // return client(`/sequence/list?parent_id=${id}`).then((data) => data);
  return client(`/sequence/list?parent_id=${id}`, {
    params: {
      ...query,
    },
  }).then((data) => data);
};

const useSequenceNumber = ({ id, options, query }) => {
  return useQuery(["sequence", id, query], () => fetchSequenceNumber({ query, id }), {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateSequenceNumber({ options }) {
  return useMutation(
    (updates) =>
      client(`/sequence`, {
        method: "POST",
        data: updates,
      }),
    {
      ...options,
    }
  );
}

const useUpdateSequenceNumber = ({ id, options }) => {
  return useMutation(
    (data) =>
      client(`/sequence/${id}`, {
        method: "PUT",
        data,
      }),
    { ...options }
  );
};

export {
  useAllSequenceNumber,
  useCreateSequenceNumber,
  useSequenceNumber,
  // useParentSequenceNumber,
  useUpdateSequenceNumber,
};
