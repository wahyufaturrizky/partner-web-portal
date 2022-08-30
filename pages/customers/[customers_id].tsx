import React from 'react'
import CreateCustomers from '../../components/pages/Customers/CreateCustomers'
import { useDetailCustomer } from '../../hooks/mdm/customers/useCustomersMDM';

export default function CustomersDetail() {
  const { data } = useDetailCustomer({
    options: {
      onSuccess: () => {}
    },
    id: 'MCS-0000003'
  })

  return <CreateCustomers detailCustomer={data} isUpdate />
}
