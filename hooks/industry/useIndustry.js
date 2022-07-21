import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchIndustries = async ({ query = {} }) => {
	return client(`/industry`, {
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

const useIndustries = ({ query = {}, options } = {}) => {
	return useQuery(["industries", query], () => fetchIndustries({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useIndustries };
