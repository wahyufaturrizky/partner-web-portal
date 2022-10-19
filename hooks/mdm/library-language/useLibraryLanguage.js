import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { mdmService } from "../../../lib/client";

/**
 *  THIS IS FOR THE DROPDOWN ON LIBRARY LANGUAGE
 */

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
      mdmService(`/language-library/import`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

/**
 *  THIS IS FOR THE INDEX AND DETAILS ON LIBRARY LANGUAGE
 */

const fetchAllLibraryLanguageModule = async ({ query = {} }) => {
  return mdmService(`/language-library`, {
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

const useAllLibraryLanguageModule = ({ query = {}, options }) => {
  return useQuery(["language-module-list", query], () => fetchAllLibraryLanguageModule({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchInfiniteLibraryLanguageModule = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return mdmService(`/language-library`, {
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

const useInfiniteLibraryLanguageModule = ({ query = {}, options }) => {
  return useInfiniteQuery(["language-module/infinite", query], fetchInfiniteLibraryLanguageModule, {
    keepPreviousData: true,
    ...options,
  });
};

const fetchLibraryLanguageModuleDetail = async ({ code, query = {} }) => {
  return mdmService(`/language-library/${code}?search=${query?.search}`).then((data) => data);
};

const useLibraryLanguageModuleDetail = ({ code, query = {}, options }) => {
  return useQuery(
    ["language-module-detail", query],
    () => fetchLibraryLanguageModuleDetail({ code, query }),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

const fetchLibraryLanguageModuleRefType = async ({ refType, code, query = {} }) => {
  return mdmService(`/language-library/${refType}?code=${code}&search=${query?.search}`).then(
    (data) => data
  );
};

const useLibraryLanguageModuleRefType = ({ refType, code, query = {}, options }) => {
  return useQuery(
    ["language-module-refType-detail", query, refType],
    () => fetchLibraryLanguageModuleRefType({ refType, code, query }),
    {
      keepPreviousData: true,
      enabled: refType !== "",
      ...options,
    }
  );
};

const fetchTranslationData = async ({ refTypeId, typeId, code, query = {} }) => {
  return mdmService(
    `/language-library/translation?code=${code}&type_id=${typeId}&ref_type_id=${refTypeId}&search=${query?.search}`
  ).then((data) => data);
};

const useTranslationData = ({ refTypeId, typeId, code, query = {}, options }) => {
  return useQuery(
    ["language-module-refType-detail", query, refTypeId, typeId],
    () => fetchTranslationData({ refTypeId, typeId, code, query }),
    {
      keepPreviousData: true,
      enabled: true,
      ...options,
    }
  );
};

function useSaveLibraryLanguageTranslation({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/language-library/translation`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}
export {
  // dropdown on library language
  useAllLibraryLanguage,
  useLibraryLanguageDetail,
  useInfiniteLibraryLanguage,
  useCreateLibraryLanguage,
  useUpdateLibraryLanguage,
  useDeleteLibraryLanguage,
  useUploadLibraryLanguage,
  // module library
  useAllLibraryLanguageModule,
  useInfiniteLibraryLanguageModule,
  useLibraryLanguageModuleDetail,
  useLibraryLanguageModuleRefType,
  useTranslationData,
  useSaveLibraryLanguageTranslation,
};
