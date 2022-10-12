import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchVendorGroups = async ({ query = {} }) => {
  return mdmService(`/vendor/group`, {
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

const useVendorGroups = ({ query = {}, options }) => {
  return useQuery(["vendor-groups", query], () => fetchVendorGroups({ query }), {
    ...options,
  });
};

const fetchInfiniteVendorGroup = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/vendor/group`, {
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

const useVendorGroupInfiniteLists = ({ query = {}, options }) => {
  return useInfiniteQuery(["vendor-group/infinite", query], fetchInfiniteVendorGroup, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchVendorGroup = async ({ id, companyId }) => {
  return mdmService(`/vendor/group/${companyId}/${id}`).then((data) => data);
};

const useVendorGroup = ({ id, companyId, options }) => {
  return useQuery(["vendor-group", id], () => fetchVendorGroup({ id, companyId }), {
    ...options,
  });
};

function useCreateVendorGroup({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/vendor/group`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateVendorGroup({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/vendor/group/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteVendorGroup = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/vendor/group`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadLogo = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService("/vendor/file/upload", {
        method: "POST",
        data,
      }),
    { ...options }
  );
};

export {
  useVendorGroups,
  useVendorGroupInfiniteLists,
  useVendorGroup,
  useCreateVendorGroup,
  useUpdateVendorGroup,
  useDeleteVendorGroup,
  useUploadLogo,
};
