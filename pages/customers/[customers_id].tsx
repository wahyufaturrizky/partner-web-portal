import React from 'react'
import CreateCustomers from '../../components/pages/Customers/CreateCustomers'
import { useDetailCustomer } from '../../hooks/mdm/customers/useCustomersMDM';
import { useRouter } from 'next/router'

export default function CustomersDetail() {
  const router = useRouter()
  const { customers_id } = router.query

  const { data } = useDetailCustomer({
    options: {
      onSuccess: () => alert('fetching detail customer success!')
    },
    id: customers_id
  })

  return <CreateCustomers detailCustomer={data} isUpdate />
}
