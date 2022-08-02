import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchConfigs = async ({ query = {} }) => {
	return client(`/module`, {
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

const useConfigs = ({ query = {}, options } = {}) => {
	return useQuery(["configs", query], () => fetchConfigs({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreateConfig({ options }) {
	return useMutation(
		(updates) =>
			client(`/module`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchConfig = async ({ config_id }) => {
	return client(`/module/${config_id}`).then((data) => data);
};

const useConfig = ({ config_id, options = {} }) => {
	return useQuery(["config", config_id], () => fetchConfig({ config_id }), { ...options });
};

function useUpdateConfig({ config_id, options }) {
	return useMutation(
		(updates) =>
			client(`/module/${config_id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeleteConfig = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/module`, {
				method: "DELETE",
				data: ids,
			}),
		{
			...options,
		}
	);
};

export { useConfigs, useConfig, useCreateConfig, useUpdateConfig, useDeleteConfig };
