import { useQuery } from "react-query";
import { mdmClient } from "../../../lib/mdmClient";

const fetchMdmCurrency = async ({ query = {} }) => {
	return mdmClient(`/currency`, {
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

const useMdmCurrency = ({ query = {}, options } = {}) => {
	return useQuery(["mdm-currency", query], () => fetchMdmCurrency({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useMdmCurrency };
