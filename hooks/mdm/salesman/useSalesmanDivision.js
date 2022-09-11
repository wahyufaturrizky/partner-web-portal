import { useQuery, useMutation } from "react-query";
import {mdmService} from 'lib/client'

const fetchSalesmanDivision = async ({query = {}}) => {
  return mdmService('/sales-division', {
    params: {
      company: 'KSNI',
      sortOrder: 'DESC',
      ...query
  }}).then(data => data)
}

const useFetchSalesmanDivision = ({ query, options }) => {
  return useQuery(['salesman-division', query], () => fetchSalesmanDivision({ query }), {
    keepPreviousData: true,
    ...options
  })
}

const fetchDetailSalesman = async ({ id }) => {
  return mdmService(`/sales-division/${id}`).then(data => data)
}

const useFetchDetailSalesman = ({ id, options }) => {
  return useQuery(['salesman-detail', id], () => fetchDetailSalesman({ id }), {
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

const useCreateSalesmanDivision = ({ options }) => {
  return useMutation(
    (data) =>
      mdmService('/sales-division', {
        method: 'POST',
        data
      }),
    { ...options }
  )
}

const useUpdateSalesmanDivision = ({ id, options }) => {
  return useMutation((data) =>
    mdmService(`/sales-division/${id}`, {
      method: 'PUT',
      data
    }), { ...options }
  )
}

export {
  useUpdateSalesmanDivision,
  useFetchDetailSalesman,
  useFetchSalesmanDivision,
  useDeleteSalesmanDivision,
  useCreateSalesmanDivision
}