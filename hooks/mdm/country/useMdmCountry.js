import { useMutation, useQuery } from "react-query";
import { mdmClient } from "../../../lib/mdmClient";
import {mdmService} from '../../../lib/client'

const useMdmCreateCountry = ({ options }) => {
	return useMutation(
		(payload) =>
			mdmClient(`/country`, {
				method: "POST",
				data: payload,
			}),
		{
			...options,
		}
	);
};


const useMdmUpdateCountry = ({ country_id, options }) => {
	return useMutation(
		(payload) =>
			mdmClient(`/country/${country_id}`, {
				method: "PUT",
				data: payload,
			}),
		{
			...options,
		}
	);
};

const fetchCountry = async ({ country_id }) => {
	return mdmClient(`/country/${country_id}`).then((data) => data);
};

const useMdmCountry = ({ country_id, options = {} }) => {
	return useQuery(["mdm-country", country_id], () => fetchCountry({ country_id }), {
		...options,
	});
};

const fetchCountryStructure = async ({ structure_id, query }) => {
	return mdmClient(`/country/structure/${structure_id}`, {
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

const useMdmCountryStructure = ({ structure_id, options = {}, query }) => {
	return useQuery(
		["mdm-country", structure_id, query],
		() => fetchCountryStructure({ structure_id, query }),
		{
			...options,
		}
	);
};

export {
	useMdmCreateCountry,
	useMdmCountry,
	useMdmCountryStructure,
	useMdmUpdateCountry,
	useMDMUploadFileCountry
};
