import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchTimezone = async ({ query = {} }) => {
	return client(`/master/timezone`, {
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

const useTimezone = ({ query = {}, options } = {}) => {
	return useQuery(["timezone", query], () => fetchTimezone({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useTimezone };
