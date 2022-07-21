import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchCurrencyFormatLists = async ({ query = {} }) => {
	return client(`/formatting/currency`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "id",
			sortOrder: "DESC",
			...query,
		},
	}).then((data) => data);
};

const useCurrencyFormatLists = ({ query = {}, options } = {}) => {
	return useQuery(["currency", query], () => fetchCurrencyFormatLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useCurrencyFormatLists };
