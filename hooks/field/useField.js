import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchFields = async ({ query = {} }) => {
	return client(`/field`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "id",
			sortOrder: "asc",
			...query,
		},
	}).then((data) => data);
};

const useFields = ({ query = {}, options } = {}) => {
	return useQuery(["fields", query], () => fetchFields({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreateField({ options }) {
	return useMutation(
		(updates) =>
			client(`/field`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchField = async ({ field_id }) => {
	return client(`/field/${field_id}`).then((data) => data);
};

const useField = () => {
	return useQuery(["field", field_id], () => fetchField({ field_id }));
};

function useUpdateField({ fieldId, options }) {
	return useMutation(
		(updates) =>
			client(`/field/${fieldId}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeleteField = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/field`, {
				method: "DELETE",
				data: ids,
			}),
		{
			...options,
		}
	);
};

export { useFields, useField, useCreateField, useUpdateField, useDeleteField };
