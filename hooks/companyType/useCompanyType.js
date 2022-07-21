import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchCompanyTypes = async ({ query = {} }) => {
	return client(`/master/partnertype`, {
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

const useCompanyTypes = ({ query = {}, options } = {}) => {
	return useQuery(["company-type", query], () => fetchCompanyTypes({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useCompanyTypes };
