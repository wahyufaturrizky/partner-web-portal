import { useMutation, useQuery } from "react-query";
import { mdmService } from "../../lib/client";

const fetchCountries = async ({ query = {} }) => {
	return mdmService(`/country`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "id",
			sortOrder: "ASC",
			...query,
		},
	}).then((data) => data);
};

const useCountries = ({ query = {}, options } = {}) => {
	return useQuery(["country", query], () => fetchCountries({ query }), {
		keepPreviousData: true,
		...options,
	});
};


const useMDMUploadFileCountry = ({ options }) => {
	return useMutation((data) =>
		mdmService('/country/upload', {
			method: 'POST',
			data
		}),
		{ ...options }
	)
}


const useDeleteCountry = ({ options }) => {
	return useMutation(
		(ids) =>
			mdmService("/country", {
				method: "DELETE",
				data: ids,
			}),
		{ ...options }
	);
};


export { useCountries, useDeleteCountry, useMDMUploadFileCountry };
