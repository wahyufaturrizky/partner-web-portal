import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchCities = async ({ query = {} }) => {
	return client(`/master/city`, {
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

const useCities = ({ query = {}, options } = {}) => {
	return useQuery(["city", query], () => fetchCities({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useCities };
