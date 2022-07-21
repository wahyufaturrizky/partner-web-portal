import { useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchMenuList = async ({ query = {} }) => {
	return client(`/field`, {
		params: {
			search: "",
			page: -11,
			...query,
		},
	}).then((data) => data);
};

const useMenuList = ({ query = {}, options } = {}) => {
	return useQuery(["menu-list", query], () => fetchMenuList({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export { useMenuList };
