import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPartnerConfigRoleList = async ({ query = {} }) => {
	return client(`/partner-role`, {
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

const usePartnerConfigRoleList = ({ query = {}, options } = {}) => {
	return useQuery(["partner-role", query], () => fetchPartnerConfigRoleList({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreatePartnerConfigRole({ options }) {
	return useMutation(
		(updates) =>
			client(`/partner-role`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchPartnerConfigRole = async ({ role_id }) => {
	return client(`/partner-role/${role_id}`).then((data) => data);
};

const usePartnerConfigRole = ({ role_id, options }) => {
	return useQuery(["partner-role", role_id], () => fetchPartnerConfigRole({ role_id }), {
		keepPreviousData: true,
		...options,
	});
};

function useUpdatePartnerConfigRole({ role_id, options }) {
	return useMutation(
		(updates) =>
			client(`/partner-role/${role_id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeletePartnerConfigRole = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/partner-role/delete`, {
				method: "POST",
				data: ids,
			}),
		{
			...options,
		}
	);
};

const fetchPermissionMenu = async ({ query = {} }) => {
	return client(`/partner-permission/menu`, {
		params: {
			search: "",
			all: 1,
			...query,
		},
	}).then((data) => data);
};

const usePartnerConfigMenuPermissionLists = ({ query = {}, options } = {}) => {
	return useQuery(["menu", query], () => fetchPermissionMenu({ query }), {
		keepPreviousData: true,
		...options,
	});
};

export {
	usePartnerConfigRoleList,
	usePartnerConfigRole,
	useCreatePartnerConfigRole,
	useUpdatePartnerConfigRole,
	useDeletePartnerConfigRole,
	usePartnerConfigMenuPermissionLists,
};
