import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchTemplateCoaLists = async ({ query = {} }) => {
	return client(`/coa`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "created_at",
			sortOrder: "DESC",
			...query,
		},
	}).then((data) => data);
};

const useTemplateCoaLists = ({ query = {}, options } = {}) => {
	return useQuery(["template-coa", query], () => fetchTemplateCoaLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useTemplateCoaLists };
