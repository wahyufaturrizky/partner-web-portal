import { useQuery, useMutation } from "react-query";
import { client } from "../../lib/client";

const fetchCompanyList = async ({ query = {} }) => {
	return client(`/hermes/company`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "id",
			sortOrder: "DESC",
			...query,
		},
	}).then((data) => data);
};

const useCompanyList = ({ query = {}, options } = {}) => {
	return useQuery(["company-list", query], () => fetchCompanyList({ query }), {
		keepPreviousData: true,
		...options,
	});
};

function useStatusCompany({ companyId, status, options }) {
    console.log(companyId, 'Company ID')
	return useMutation(
		(payload) =>
			client(`/hermes/company/${companyId}/${status}`, {
				method: "PUT",
				// params: {
                //     id: companyId,
                //     active: status
                // },
			}),
		{
			...options,
		}
	);
}


export { useCompanyList, useStatusCompany };
