import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchPartnerConfigLists = async ({ query = {} }) => {
	return client(`/partner`, {
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

const usePartnerConfigLists = ({ query = {}, options } = {}) => {
	return useQuery(["partner-config-list", query], () => fetchPartnerConfigLists({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useCreatePartnerConfigList({ options }) {
	return useMutation(
		(updates) =>
			client(`/partner`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

function useCreatePartnerConfigDraftList({ options }) {
	return useMutation(
		(updates) =>
			client(`/partner/savedraft`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const fetchPartnerConfigList = async ({ partner_config_id }) => {
	return client(`/partner/${partner_config_id}`).then((data) => data);
};

const usePartnerConfigList = ({ partner_config_id, options }) => {
	return useQuery(
		["partner-config-list", partner_config_id],
		() => fetchPartnerConfigList({ partner_config_id }),
		{
			...options,
		}
	);
};

function useUpdatePartnerConfigList({ partnerConfigListId, options }) {
	return useMutation(
		(updates) =>
			client(`/partner/${partnerConfigListId}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

const useDeletePartnerConfigList = ({ options }) => {
	return useMutation(
		(ids) =>
			client("/partner/delete", {
				method: "POST",
				data: ids,
			}),
		{
			...options,
		}
	);
};

function useValidatePartnerConfigInput({ options }) {
	return useMutation(
		(updates) =>
			client(`/partner/validate`, {
				method: "POST",
				data: updates,
			}),
		{
			...options,
		}
	);
}

function useApprovePartnerConfigList({ options, partner_id }) {
	return useMutation(
		(updates) =>
			client(`/partner/approval/${partner_id}`, {
				method: "PUT",
				data: updates,
			}),
		{
			...options,
		}
	);
}

export {
	usePartnerConfigLists,
	usePartnerConfigList,
	useCreatePartnerConfigList,
	useCreatePartnerConfigDraftList,
	useUpdatePartnerConfigList,
	useDeletePartnerConfigList,
	useValidatePartnerConfigInput,
	useApprovePartnerConfigList,
};
