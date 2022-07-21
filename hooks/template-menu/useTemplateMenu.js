import { useMutation, useQuery } from "react-query";
import { client } from "../../lib/client";

const fetchTemplateMenu = async ({ query }) => {
	return client("/template/menu", {
		params: {
			...query,
			sortBy: "id",
			sortOrder: "desc",
		},
	}).then((data) => data);
};

const fetchMenuList = async ({ query }) => {
	return client("/template/menu/module", {
		params: { ...query, sortOrder: "desc" },
	}).then((data) => data);
};

const fetchDetailMenu = async ({ id }) => {
	return client(`/template/menu/${id}`).then((data) => data);
};

const useDetailMenu = ({ id, options }) => {
	return useQuery(["detailMenu", id], () => fetchDetailMenu({ id }), {
		keepPreviousData: true,
		...options,
	});
};

const useTemplateMenu = ({ query = {}, options } = {}) => {
	return useQuery(["templateMenus", query], () => fetchTemplateMenu({ query }), {
		keepPreviousData: true,
		...options,
	});
};

const useUpdateTemplateMenu = ({ id, options }) => {
	return useMutation(
		(payload) =>
			client(`/template/menu/${id}`, {
				method: "PUT",
				data: payload,
			}),
		{ ...options }
	);
};

const useMenuList = ({ query = {}, options } = {}) => {
	return useQuery(["menuList", query], () => fetchMenuList({ query }), {
		keepPreviousData: true,
		...options,
	});
};

const useCreateTemplateMenu = ({ options }) => {
	return useMutation(
		(payload) =>
			client("/template/menu", {
				method: "POST",
				data: payload,
			}),
		{ ...options }
	);
};

const useDeleteTemplateMenu = ({ options }) => {
	return useMutation(
		(ids) =>
			client("/template/menu/delete", {
				method: "POST",
				data: ids,
			}),
		{ ...options }
	);
};

export {
	fetchTemplateMenu,
	useTemplateMenu,
	useDeleteTemplateMenu,
	useMenuList,
	useCreateTemplateMenu,
	useDetailMenu,
	useUpdateTemplateMenu,
};
