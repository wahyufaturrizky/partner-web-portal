import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";
import { mdmService } from "../../lib/client";

const fetchCompanyList = async ({ query = {} }) => {
  return client(`/hermes/company`, {
    params: {
      account_id: 0,
      search: "",
      limit: 10,
      page: 1,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useCompanyList = ({ query = {}, options } = {}) => {
  return useQuery(["company-list", query], () => fetchCompanyList({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

function useStatusCompany({ companyId, status, options }) {
  console.log(companyId, "Company ID");
  return useMutation(
    (payload) =>
      client(`/hermes/company/${companyId}/${status}`, {
        method: "PUT",
        // params: {
        //     id: companyId,
        //     active: status
        // },
      }),
    {
      ...options,
    }
  );
}

// list Date Format

const fetchDateFormatLists = async ({ query = {} }) => {
  return client(`/formatting/date`, {
    params: {
      // search: "",
      // limit: 10,
      // page: 1,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useDateFormatLists = ({ query = {}, options } = {}) => {
  return useQuery(["date", query], () => fetchDateFormatLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

// List Number Format

const fetchNumberFormatLists = async ({ query = {} }) => {
  return client(`/formatting/number`, {
    params: {
      // search: "",
      // limit: 10,
      // page: 1,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useNumberFormatLists = ({ query = {}, options } = {}) => {
  return useQuery(["number", query], () => fetchNumberFormatLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

// List CoA

const fetchListCoa = async ({ query = {} }) => {
  return client(`/coa`, {
    params: {
      // search: "",
      // limit: 10,
      // page: 1,
      sortBy: "id",
      sortOrder: "asc",
      ...query,
    },
  }).then((data) => data);
};

const useCoa = ({ query = {}, options } = {}) => {
  return useQuery(["coa-list", query], () => fetchListCoa({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

// List Currency

const fetchCurrenciesMDM = async ({ query = {} }) => {
	return mdmService(`/currency`, {
		params: {
			// search: "",
			// page: 1,
			// limit: 10,
			sortBy: "created_at",
			sortOrder: "DESC",
			...query,
		},
	}).then((data) => data);
};

const useCurrenciesMDM = ({ query = {}, options }) => {
	return useQuery(["currencies", query], () => fetchCurrenciesMDM({ query }), {
		...options,
	});
};

// List Menu Design

const fetchMenuDesignLists = async ({ query = {} }) => {
  return client(`/menu/design`, {
    params: {
    //   search: "",
    //   limit: 10,
    //   page: 1,
      sortBy: "created_at",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useMenuDesignLists = ({ query = {}, options } = {}) => {
  return useQuery(["menu/design", query], () => fetchMenuDesignLists({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

// List Country

const fetchCountries = async ({ query = {} }) => {
	return mdmService(`/country`, {
		params: {
			search: "",
			// limit: 10,
			// page: 1,
			sortBy: "id",
			sortOrder: "ASC",
			...query,
		},
	}).then((data) => data);
};

const useCountries = ({ query = {}, options } = {}) => {
	return useQuery(["country", query], () => fetchCountries({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export {
  useCompanyList,
  useStatusCompany,
  useDateFormatLists,
  useNumberFormatLists,
  useCoa,
  useCurrenciesMDM,
  useMenuDesignLists,
  useCountries
};
