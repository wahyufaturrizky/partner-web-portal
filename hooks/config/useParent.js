import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchParents = async ({ query = {} }) => {
	return client(`/parent`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "id",
			sortOrder: "asc",
			...query,
		},
	}).then((data) => data);
};

const useParents = ({ query = {}, options } = {}) => {
	return useQuery(["configs", query], () => fetchParents({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useParents };
