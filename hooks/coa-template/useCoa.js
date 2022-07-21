import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchListCoa = async ({ query = {} }) => {
	return client(`/coa`, {
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

const fetchDetailCoa = async ({ coa_id, query }) => {
	return client(`/coa/detail/${coa_id}`, {
		data: {
			page: 1,
			search: "lancar",
			limit: 10,
			sortBy: "account_name",
			sortOrder: "DESC",
			...query,
		},
		method: "PUT",
		skipSnakeCase: true,
	}).then((data) => data);
};

const useCoa = ({ query = {}, options } = {}) => {
	return useQuery(["coa-list", query], () => fetchListCoa({ query }), {
		keepPreviousData: true,
		...options,
	});
};

const useDetailCoa = ({ coa_id, options, query } = {}) => {
	return useQuery(["coa-detail", coa_id, query], () => fetchDetailCoa({ coa_id, query }), {
		keepPreviousData: true,
		...options,
	});
};

const fetchCoaCodeValidation = async ({ query = {} }) => {
	return client(`/coa/check`, {
		params: {
			...query,
		},
	}).then((data) => data);
};

const useValidateAccountCode = ({ options, query } = {}) => {
	return useQuery(["coa-detail", query.code], () => fetchCoaCodeValidation({ query }), {
		keepPreviousData: true,
		...options,
	});
};

const fetchFilterAccountCoa = async ({ query = {} }) => {
	return client(`/coa/filter`, {
		params: {
			...query,
		},
	}).then((data) => data);
};

const useFilterAccountCoa = ({ options, query } = {}) => {
	return useQuery(["filter-coa", query], () => fetchFilterAccountCoa({ query }), {
		keepPreviousData: true,
		...options,
	});
};

const useDeleteCoa = ({ options }) => {
	return useMutation(
		(ids) =>
			client(`/coa/delete`, {
				method: "POST",
				data: ids,
			}),
		{
			...options,
		}
	);
};

const useCreateCoa = ({ options }) => {
	return useMutation(
		(payload) =>
			client(`/coa`, {
				method: "POST",
				data: payload,
			}),
		{
			...options,
		}
	);
};

const useUpdateCoa = ({ options, coa_id }) => {
	return useMutation(
		(payload) =>
			client(`/coa/${coa_id}`, {
				method: "PUT",
				data: payload,
			}),
		{
			...options,
		}
	);
};

export {
	useCoa,
	useDetailCoa,
	useDeleteCoa,
	useCreateCoa,
	useUpdateCoa,
	useValidateAccountCode,
	useFilterAccountCoa,
};
