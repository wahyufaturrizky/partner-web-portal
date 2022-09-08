import { useQuery, useMutation } from "react-query";
import {mdmser, mdmService} from 'lib/client'

const fetchSalesmanDivision = async ({query = {}}) => {
  return mdmService('/sales-division', {
    params: {
      company: 'KSNI',
      sortOrder: 'ASC',
      ...query
  }}).then(data => data)
}

const useFetchSalesmanDivision = ({ query, options }) => {
  return useQuery(['salesman-division', query], () => fetchSalesmanDivision({ query }), {
    keepPreviousData: true,
    ...options
  })
}

const useDeleteSalesmanDivision = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService('/sales-division', {
        method: 'DELETE',
        data
      }),
      { ...options }
  )
}

export { useFetchSalesmanDivision, useDeleteSalesmanDivision }