import { useQuery, useMutation } from "react-query";
import { mdmService } from "../../../lib/client";

const fetchChannelsMDM = async ({ query = {} }) => {
	return mdmService(`/sales-channel`, {
		params: {
			search: "",
			page: 1,
			limit: 10,
			sortBy: "created_at",
			sortOrder: "DESC",
			...query,
		},
	}).then((data) => data);
};

const useChannelsMDM = ({ query = {}, options }) => {
	return useQuery(["sales-channel", query], () => fetchChannelsMDM({ query }), {
		...options,
	});
};

const fetchChannelMDM = async ({ id }) => {
	return mdmService(`/sales-channel/${id}`).then((data) => data);
};

const useChannelMDM = ({ id, options }) => {
	return useQuery(["sales-channel", id], () => fetchChannelMDM({ id }), {
		...options,
	});
};

function useCreateChannelMDM({ options }) {
	return useMutation(
		(data) =>
			mdmService(`/sales-channel`, {
				method: "POST",
				data,
			}),
		{
			...options,
		}
	);
}

function useUpdateChannelMDM({ id, options }) {
	return useMutation(
		(data) =>
			mdmService(`/sales-channel/${id}`, {
				method: "PUT",
				data,
			}),
		{
			...options,
		}
	);
}

const useDeleteChannelMDM = ({ options }) => {
	return useMutation(
		(ids) =>
			mdmService(`/sales-channel`, {
				method: "DELETE",
				data: ids,
			}),
		{
			...options,
		}
	);
};

const useUploadFileChannelMDM = ({ options }) => {
	return useMutation(
		(data) =>
			mdmService(`/sales-channel/upload`, {
				method: "POST",
				data,
			}),
		{
			...options,
		}
	);
};

export {
	useChannelsMDM,
	useChannelMDM,
	useCreateChannelMDM,
	useUpdateChannelMDM,
	useDeleteChannelMDM,
	useUploadFileChannelMDM,
};
