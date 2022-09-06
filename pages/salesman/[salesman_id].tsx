import React from 'react'
import ComponentDetailSalesman from '../../components/pages/Salesman/DetailSalesman'
import { useListCustomers } from '../../hooks/mdm/customers/useCustomersMDM'

export default function DetailSalesman() {
  const { data: listCustomers } = useListCustomers({
    options: { onSuccess: () => {} },
    query: {},
  });

  return (
    <ComponentDetailSalesman listCustomers={listCustomers?.rows} />
  )
}

