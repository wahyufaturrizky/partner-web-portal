import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

// Fetch All Approval

const fetchTemplateApprovalLists = async ({ query = {} }) => {
	return client(`/template/approval`, {
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

const useTemplateApprovalLists = ({ query = {}, options } = {}) => {
	return useQuery(["template-approval", query], () => fetchTemplateApprovalLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

// Fetch One Approval

const fetchOneApproval = async ({ id }) => {
	return client(`/template/approval/${id}`).then((data) => data);
};

const useTemplateApproval = ({ id, options }) => {
	return useQuery(["template-approval", id], () => fetchOneApproval({ id }), {
		keepPreviousData: true,
		...options,
	});
};

// POST Create Approval

function useCreateTemplateApproval({ options }) {
	return useMutation(
		(updates) =>
			client(`/template/approval`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

// POST Update Approval

function useUpdateTemplateApproval({ approval_id, options }) {
	return useMutation(
		(updates) =>
			client(`/template/approval/${approval_id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

// DELETE Approval

const useDeleteTemplateApproval = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/template/approval`, {
				method: "DELETE",
				data: ids,
			}),
		{
			...options,
		}
	);
};

// Query Filter

const fetchFilterOptionApproval = async ({ id, filter = "", query = {} }) => {
	return client(`/template/approval/option/${id}/${filter}`, {
		params: {
			...query,
		},
	}).then((data) => data);
};

const useFilterOptionApproval = ({ id, filter, options, query = {} } = {}) => {
	return useQuery(
		["filter-template-approval", query],
		() => fetchFilterOptionApproval({ id, filter, query }),
		{
			keepPreviousData: true,
			...options,
		}
	);
};

export {
	useTemplateApprovalLists,
	useTemplateApproval,
	useCreateTemplateApproval,
	useDeleteTemplateApproval,
	useUpdateTemplateApproval,
	useFilterOptionApproval,
};
