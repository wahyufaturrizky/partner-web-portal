import { useQuery, useMutation } from "react-query";
import { client, client3 } from "../../lib/client";
import { mdmService } from "../../lib/client";

// Start Company

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

const fetchCompany = async ({ id }) => {
  return client(`/hermes/company/${id}`).then((data) => data);
};

const useCompany = ({ id, options }) => {
  return useQuery(["company", id], () => fetchCompany({ id }), {
    ...options,
  });
};

function useStatusCompany({ companyId, status, options }) {
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

function useCreateCompany({ options }) {
	return useMutation(
		(updates) =>
			client(`/hermes/company`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

function useUpdateCompany({ id, options }) {
	return useMutation(
		(updates) =>
			client(`/hermes/company/${id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useUploadLogoCompany = ({ options }) => {
  return useMutation(
    (data) =>
      client(`/hermes/company/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

const useDeleteCompany = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/hermes/company`, {
				method: "DELETE",
				data: ids,
			}),
		{
			...options,
		}
	);
};

// End Company

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
      search: "",
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
			search: "",
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

const fetchTimezone = async ({ query = {} }) => {
	return client3(`/master/timezone`, {
		params: {
			search: "",
			limit: 10000,
			page: 1,
			sortBy: "id",
			sortOrder: "asc",
			...query,
		},
	}).then((data) => data);
};

const useTimezones = ({ query = {}, options } = {}) => {
	return useQuery(["timezone", query], () => fetchTimezone({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export {
  useCompanyList,
  useCompany,
  useStatusCompany,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  useUploadLogoCompany,
  useDateFormatLists,
  useNumberFormatLists,
  useCoa,
  useCurrenciesMDM,
  useMenuDesignLists,
  useCountries,
  useTimezones
};
