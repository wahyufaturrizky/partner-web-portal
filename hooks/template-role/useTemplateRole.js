import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchTemplateRoleLists = async ({ query = {} }) => {
	return client(`/template/role`, {
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

const useTemplateRoleLists = ({ query = {}, options } = {}) => {
	return useQuery(["template-role", query], () => fetchTemplateRoleLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreateTemplateRoleList({ options }) {
	return useMutation(
		(updates) =>
			client(`/template/role`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchTemplateRoleList = async ({ template_role_list_id }) => {
	return client(`/template/role/${template_role_list_id}`).then((data) => data);
};

const useTemplateRoleList = ({ template_role_list_id, options }) => {
	return useQuery(
		["template-role", template_role_list_id],
		() => fetchTemplateRoleList({ template_role_list_id }),
		{
			...options,
		}
	);
};

function useUpdateTemplateRoleList({ templateRoleListId, options }) {
	return useMutation(
		(updates) =>
			client(`/template/role/${templateRoleListId}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeleteTemplateRoleList = ({ options }) => {
	return useMutation(
		(ids) =>
			client("/template/role", {
				method: "DELETE",
				data: ids,
			}),
		{
			...options,
		}
	);
};

export {
	useTemplateRoleLists,
	useTemplateRoleList,
	useCreateTemplateRoleList,
	useUpdateTemplateRoleList,
	useDeleteTemplateRoleList,
};
