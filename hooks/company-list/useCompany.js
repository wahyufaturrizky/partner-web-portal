import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { client, client3, mdmService } from "../../lib/client";

// Start Company

const fetchCompanyList = async ({ query = {} }) => client(`/hermes/company`, {
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

const useCompanyList = ({ query = {}, options } = {}) => useQuery(["company-list", query], () => fetchCompanyList({ query }), {
  keepPreviousData: true,
  ...options,
});

const fetchInfiniteCompanyLists = async ({ pageParam = 1, queryKey }) => {
  const searchQuery = queryKey[1].search;
  return client(`/hermes/company`, {
    params: {
      account_id: 0,
      search: searchQuery,
      limit: 10,
      page: pageParam,
      sortBy: "id",
      sortOrder: "DESC",
      ...queryKey[1],
    },
  }).then((data) => data);
};

const useCompanyInfiniteLists = ({ query = {}, options }) => useInfiniteQuery(["company/infinite", query], fetchInfiniteCompanyLists, {
  keepPreviousData: true,
  ...options,
});

const fetchCompany = async ({ id }) => {
  if (id) {
    return client(`/hermes/company/${id}`).then((data) => data);
  }
  return false;
};

const useCompany = ({ id, options }) => useQuery(["company", id], () => fetchCompany({ id }), {
  ...options,
});

function useStatusCompany({ companyId, status, options }) {
  return useMutation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    (payload) => client(`/hermes/company/${companyId}/${status}`, {
      method: "PUT",
      // params: {
      //     id: companyId,
      //     active: status
      // },
    }),
    {
      ...options,
    },
  );
}

function useCreateCompany({ options }) {
  return useMutation(
    (updates) => client(`/hermes/company`, {
      method: "POST",
      data: updates,
    }),
    {
      ...options,
    },
  );
}

function useUpdateCompany({ id, options }) {
  return useMutation(
    (updates) => client(`/hermes/company/${id}`, {
      method: "PUT",
      data: updates,
    }),
    {
      ...options,
    },
  );
}

const useUploadLogoCompany = ({ options }) => useMutation(
  (data) => client(`/hermes/company/upload`, {
    method: "POST",
    data,
  }),
  {
    ...options,
  },
);

const useDeleteCompany = ({ options }) => useMutation(
  (ids) => client(`/hermes/company`, {
    method: "DELETE",
    data: ids,
  }),
  {
    ...options,
  },
);

// End Company

// list Date Format

const fetchDateFormatLists = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode");
  return client(`/formatting/date`, {
    params: {
      // search: "",
      // limit: 10,
      // page: 1,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
      company_id: companyCode,
    },
  }).then((data) => data);
};

const useDateFormatLists = ({ query = {}, options } = {}) => useQuery(["date", query], () => fetchDateFormatLists({ query }), {
  keepPreviousData: true,
  ...options,
});

// List Number Format

const fetchNumberFormatLists = async ({ query = {} }) => {
  const companyCode = localStorage.getItem("companyCode");
  return client(`/formatting/number`, {
    params: {
      // search: "",
      // limit: 10,
      // page: 1,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
      company_id: companyCode,
    },
  }).then((data) => data);
};

const useNumberFormatLists = ({ query = {}, options } = {}) => useQuery(["number", query], () => fetchNumberFormatLists({ query }), {
  keepPreviousData: true,
  ...options,
});

// List CoA

const fetchListCoa = async ({ query = {} }) => client(`/coa`, {
  params: {
    search: "",
    // limit: 10,
    // page: 1,
    sortBy: "id",
    sortOrder: "asc",
    ...query,
  },
}).then((data) => data);

const useCoa = ({ query = {}, options } = {}) => useQuery(["coa-list", query], () => fetchListCoa({ query }), {
  keepPreviousData: true,
  ...options,
});

// List Currency

const fetchCurrenciesMDM = async ({ query = {} }) => mdmService(`/currency`, {
  params: {
    search: "",
    // page: 1,
    // limit: 10,
    sortBy: "created_at",
    sortOrder: "DESC",
    ...query,
  },
}).then((data) => data);

const useCurrenciesMDM = ({ query = {}, options }) => useQuery(["currencies", query], () => fetchCurrenciesMDM({ query }), {
  ...options,
});

// List Menu Design

const fetchMenuDesignLists = async ({ query = {} }) => client(`/menu/design`, {
  params: {
    //   search: "",
    //   limit: 10,
    //   page: 1,
    sortBy: "created_at",
    sortOrder: "DESC",
    ...query,
  },
}).then((data) => data);

const useMenuDesignLists = ({ query = {}, options } = {}) => useQuery(["menu/design", query], () => fetchMenuDesignLists({ query }), {
  keepPreviousData: true,
  ...options,
});

// List Country

const fetchCountries = async ({ query = {} }) => mdmService(`/country`, {
  params: {
    search: "",
    // limit: 10,
    // page: 1,
    sortBy: "id",
    sortOrder: "ASC",
    ...query,
  },
}).then((data) => data);

const useCountries = ({ query = {}, options } = {}) => useQuery(["country", query], () => fetchCountries({ query }), {
  keepPreviousData: true,
  ...options,
});

const fetchTimezone = async ({ query = {} }) => client3(`/master/timezone`, {
  params: {
    search: "",
    limit: 10000,
    page: 1,
    sortBy: "id",
    sortOrder: "asc",
    ...query,
  },
}).then((data) => data);

const useTimezones = ({ query = {}, options } = {}) => useQuery(["timezone", query], () => fetchTimezone({ query }), {
  keepPreviousData: true,
  ...options,
});

export {
  useCompanyList,
  useCompanyInfiniteLists,
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
  useTimezones,
};
