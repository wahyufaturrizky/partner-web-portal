import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchCurrencyLists = async ({ query = {} }) => {
	return client(`/currency`, {
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

const useCurrencyLists = ({ query = {}, options } = {}) => {
	return useQuery(["currency", query], () => fetchCurrencyLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useCurrencyLists };
