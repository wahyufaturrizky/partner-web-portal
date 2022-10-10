import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchAllLibraryLanguage = async ({ query = {} }) => {
  return mdmService(`/language`, {
    params: {
      search: "",
      page: 1,
      limit: 20,
      sortBy: "name",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useAllLibraryLanguage = ({ query = {}, options }) => {
  return useQuery(["language-list", query], () => fetchAllLibraryLanguage({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchLibraryLanguageDetail = async ({ id }) => {
  return mdmService(`/language/${id}`).then((data) => data);
};

const useLibraryLanguageDetail = ({ id, options }) => {
  return useQuery(["language-detail", query], () => fetchLibraryLanguageDetail({ id }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteLibraryLanguage = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/language`, {
    params: {
      search: searchQuery,
      limit: 20,
      page: pageParam,
      sortBy: "name",
      sortOrder: "ASC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useInfiniteLibraryLanguage = ({ query = {}, options }) => {
  return useInfiniteQuery(["language/infinite", query], fetchInfiniteLibraryLanguage, {
    keepPreviousData: true,
    ...options,
  });
};

function useCreateLibraryLanguage({ options }) {
  return useMutation(
    (data) => {
      console.log(data, "<<<data yang di push");
      return mdmService(`/language`, {
        method: "POST",
        headers: "Content-Type: multipart/form-data;",
        data,
      });
    },
    {
      ...options,
    }
  );
}

function useUpdateLibraryLanguage({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/language/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeleteLibraryLanguage = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/language`, {
        method: "DELETE",
        data,
      }),
    {
      ...options,
    }
  );
};

const useUploadLibraryLanguage = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/language/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useAllLibraryLanguage,
  useLibraryLanguageDetail,
  useInfiniteLibraryLanguage,
  useCreateLibraryLanguage,
  useUpdateLibraryLanguage,
  useDeleteLibraryLanguage,
  useUploadLibraryLanguage,
};
