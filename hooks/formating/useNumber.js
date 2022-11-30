import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchNumberFormatLists = async ({ query = {} }) => {
	const companyCode = localStorage.getItem("companyCode")
	return client(`/formatting/number`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "id",
			sortOrder: "DESC",
			...query,
			company_id: companyCode
		},
	}).then((data) => data);
};

const useNumberFormatLists = ({ query = {}, options } = {}) => {
	return useQuery(["number", query], () => fetchNumberFormatLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useNumberFormatLists };
