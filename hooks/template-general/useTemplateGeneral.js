import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchTemplateGenerals = async ({ query = {} }) => {
	return client(`/general-template`, {
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

const useTemplateGenerals = ({ query = {}, options } = {}) => {
	return useQuery(["template-role", query], () => fetchTemplateGenerals({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreateTemplateGeneral({ options }) {
	return useMutation(
		(updates) =>
			client(`/general-template`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchTemplateGeneral = async ({ template_general_id }) => {
	return client(`/general-template/${template_general_id}`).then((data) => data);
};

const useTemplateGeneral = ({ template_general_id, options }) => {
	return useQuery(
		["template-role", template_general_id],
		() => fetchTemplateGeneral({ template_general_id }),
		{
			...options,
		}
	);
};

function useUpdateTemplateGeneral({ template_general_id, options }) {
	return useMutation(
		(updates) =>
			client(`/general-template/${template_general_id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeleteTemplateGeneral = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/general-template/${ids.id.join(",")}`, {
				method: "DELETE",
			}),
		{
			...options,
		}
	);
};

export {
	useTemplateGenerals,
	useTemplateGeneral,
	useCreateTemplateGeneral,
	useUpdateTemplateGeneral,
	useDeleteTemplateGeneral,
};
