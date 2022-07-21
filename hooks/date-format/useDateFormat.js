import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchDateFormatLists = async ({ query = {} }) => {
	return client(`/formatting/date`, {
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

const useDateFormatLists = ({ query = {}, options } = {}) => {
	return useQuery(["date", query], () => fetchDateFormatLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useDateFormatLists };
