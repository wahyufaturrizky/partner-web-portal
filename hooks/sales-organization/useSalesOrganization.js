import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { mdmService } from "../../lib/client";

let token;
let apiURL = process.env.NEXT_PUBLIC_API_BASE3;

if (typeof window !== "undefined") {
	token = localStorage.getItem("token");
}

const fetchSalesOrganization = async ({ company_code }) => {
	return mdmService(`/sales-org/${company_code}`, {}).then((data) => data);
};

const useSalesOrganization = ({  options, company_code } = {}) => {
	return useQuery(["sales-organization", company_code], () => fetchSalesOrganization({ company_code }), {
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		retry: false,
		...options,
	});
};

const useUpdateSalesOrganization = ({ company_code, options }) => {
	return useMutation(
		(data) =>
			mdmService(`/sales-org/${company_code}`, {
				method: "PUT",
				data,
			}),
		{ ...options }
	);
};

const useCreateSalesOrganizationHirarcy = ({ options }) => {
	return useMutation(
		(data) =>
			mdmService(`/sales-org/hirarcy`, {
				method: "POST",
				data,
			}),
		{ ...options }
	);
};

const useGenerateTemplate = async ({ query }) => {
	return await axios
		.get(apiURL + "v1/country/template/generate", {
			params: query,
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/json",
			},
		})
		.then((response) => {
			var data = new Blob([response], {type: 'text/csv'});
			var csvURL = window.URL.createObjectURL(data);
			tempLink = document.createElement('a');
			tempLink.href = csvURL;
			tempLink.setAttribute('download', 'filename.csv');
			tempLink.click();
		})
};

const fetchSalesOrganizationHirarcy = async ({ structure_id }) => {
	return mdmService(`/sales-org/hirarcy/${structure_id}`, {}).then((data) => data);
};

const useSalesOrganizationHirarcy = ({  options, structure_id } = {}) => {
	return useQuery(["sales-organization-hirarcy", structure_id], () => fetchSalesOrganizationHirarcy({ structure_id }), {
		keepPreviousData: true,
		...options,
	});
};

export { useCreateSalesOrganizationHirarcy, useSalesOrganizationHirarcy, useSalesOrganization, useUpdateSalesOrganization, useGenerateTemplate };
