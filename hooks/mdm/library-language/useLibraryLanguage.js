import { useQuery } from "react-query";
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

export { useAllLibraryLanguage };
