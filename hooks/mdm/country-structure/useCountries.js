import { useQuery, useMutation } from 'react-query'
import { mdmService } from '../../../lib/client'

const fetchDataCountries = async ({ query = {}}) => {
    return mdmService('/country', {
        params: {
            limit: 10,
            page: 1,
            sortBy: "id",
            sortOrder: "asc",
            ...query
        }
    }).then(data => data)
}

const useCreateCountries = ({options = {}}) => {
    return useMutation(
        (data) =>
            mdmService('/country',  {
                method: 'POST',
                data
            }),
            {...options}
    )
}

const fetchDetailCountry = async ({ country_id }) => {
    return mdmService(`/country/${country_id}`).then(data => data)
}

const fetchCountryStructure = ({ structure_id, query }) => {
   return mdmService(`/country/structure/${structure_id}`, {
		params: {
			search: "",
			limit: 10,
			page: 1,
			sortBy: "created_at",
			sortOrder: "DESC",
			...query,
		},
	}).then((data) => data);
}

const useFetchCountriesStructure = ({ structure_id, query, options }) => {
    return useQuery(['countries-structure-mdm', structure_id, query], () => {
        fetchCountryStructure({ structure_id, query }),
        { ...options }
    })
}

const useFetchDetailCountry = ({ country_id, options }) => {
    return useQuery(["country-structure"], () => fetchDetailCountry({country_id}), {
        ...options
    })
}

const useUpdateCountry = ({ country_id, options }) => {
    return useMutation(
        payload =>
            mdmService(`/country/${country_id}`, {
                method: 'POST',
                data: payload
            }),
            { ...options }
    )
}

const useDataCountries = ({ query = {}, options }) => {
    return useQuery(['country-strucure', query], () => fetchDataCountries({ query }), {
        keepPreviousData: true,
        ...options
    })
}

const useDeleteDataCountries = ({ options }) => {
    return useMutation(
        ids =>
        mdmService('/country', {
            method: 'DELETE',
            data: ids
        }),
        { ...options }
    )
}

const useUploadFileCountries = ({ options }) => {
    return useMutation(
        (data) =>
            mdmService('/country/upload',{
                method: 'POST',
                data
            }),
            { ...options }
    )
}

export { useDataCountries, useDeleteDataCountries, useUploadFileCountries, useCreateCountries, useFetchDetailCountry, useUpdateCountry, useFetchCountriesStructure }