import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchMenuLists = async ({ query = {} }) => {
	return client(`/menu`, {
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

const useMenuLists = ({ query = {}, options } = {}) => {
	return useQuery(["menu", query], () => fetchMenuLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreateMenuList({ options }) {
	return useMutation(
		(updates) =>
			client(`/menu`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchMenuList = async ({ menu_list_id }) => {
	return client(`/menu/${menu_list_id}`).then((data) => data);
};

const useMenuList = ({ menu_list_id, options }) => {
	return useQuery(["menu", menu_list_id], () => fetchMenuList({ menu_list_id }), {
		...options,
	});
};

function useUpdateMenuList({ menuListId, options }) {
	return useMutation(
		(updates) =>
			client(`/menu/${menuListId}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeleteMenuList = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/menu/delete`, {
				method: "POST",
				data: ids,
			}),
		{
			...options,
		}
	);
};

export { useMenuLists, useMenuList, useCreateMenuList, useUpdateMenuList, useDeleteMenuList };
