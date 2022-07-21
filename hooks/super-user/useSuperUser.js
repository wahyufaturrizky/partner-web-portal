import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchSuperUsers = async ({ query = {} }) => {
	return client(`/user`, {
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

const fetchApprovalSuperUsers = async ({ query = {} }) => {
	return client(`/user/approval`, {
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

const useSuperUsers = ({ query = {}, options } = {}) => {
	return useQuery(["super-users", query], () => fetchSuperUsers({ query }), {
		keepPreviousData: true,
		...options,
	});
};

const useApprovalSuperUsers = ({ query = {}, options } = {}) => {
	return useQuery(["approval-super-users", query], () => fetchApprovalSuperUsers({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreateSuperUser({ options }) {
	return useMutation(
		(updates) =>
			client(`/user`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchSuperUser = async ({ super_user_id }) => {
	return client(`/user/${super_user_id}`).then((data) => data);
};

const useSuperUser = ({ super_user_id, options }) => {
	return useQuery(["super-user", super_user_id], () => fetchSuperUser({ super_user_id }), {
		...options,
	});
};

function useApproveSuperUser({ options }) {
	return useMutation(
		(updates) =>
			client(`/user/approval`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

function useUpdateSuperUser({ super_user_id, options }) {
	return useMutation(
		(updates) =>
			client(`/user/${super_user_id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeleteSuperUser = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/user/delete`, {
				method: "POST",
				data: ids,
			}),
		{
			...options,
		}
	);
};

export {
	useSuperUsers,
	useApproveSuperUser,
	useApprovalSuperUsers,
	useSuperUser,
	useCreateSuperUser,
	useUpdateSuperUser,
	useDeleteSuperUser,
};
