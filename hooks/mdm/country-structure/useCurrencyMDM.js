import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchCurrenciesMDM = async ({ query = {} }) => {
  return mdmService(`/currency`, {
    params: {
      search: "",
      page: 1,
      limit: 10000,
      sortBy: "id",
      sortOrder: "DESC",
      ...query,
    },
  }).then((data) => data);
};

const useCurrenciesMDM = ({ query = {}, options }) => {
  return useQuery(["currencies-mdm", query], () => fetchCurrenciesMDM({ query }), {
    keepPreviousData: true,
    ...options,
  });
};

const fetchCurrencyMDM = async ({ id }) => {
  return mdmService(`/currency/${id}`).then((data) => data);
};

const useCurrencyMDM = ({ id, options }) => {
  return useQuery(["currency", id], () => fetchCurrencyMDM({ id }), {
    ...options,
  });
};

function useCreateCurrencyMDM({ options }) {
  return useMutation(
    (data) =>
      mdmService(`/currency`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
}

function useUpdateCurrencyMDM({ id, options }) {
  return useMutation(
    (data) =>
      mdmService(`/currency/${id}`, {
        method: "PUT",
        data,
      }),
    {
      ...options,
    }
  );
}

const useDeletCurrencyMDM = ({ options }) => {
  return useMutation(
    (ids) =>
      mdmService(`/currency`, {
        method: "DELETE",
        data: ids,
      }),
    {
      ...options,
    }
  );
};

const useUploadFileCurrencyMDM = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService(`/currency/upload`, {
        method: "POST",
        data,
      }),
    {
      ...options,
    }
  );
};

export {
  useCurrenciesMDM,
  useCurrencyMDM,
  useCreateCurrencyMDM,
  useUpdateCurrencyMDM,
  useDeletCurrencyMDM,
  useUploadFileCurrencyMDM,
};
