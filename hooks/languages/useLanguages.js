import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchLanguages = async ({ query = {} }) => {
	return client(`/master/language`, {
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

const useLanguages = ({ query = {}, options } = {}) => {
	return useQuery(["languages", query], () => fetchLanguages({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useLanguages };
