import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchSectors = async ({ query = {} }) => {
	return client(`/sector`, {
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

const useSectors = ({ query = {}, options } = {}) => {
	return useQuery(["sectors", query], () => fetchSectors({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useSectors };
