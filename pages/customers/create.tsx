import React, { useState } from 'react'
import CreateCustomers from '../../components/pages/Customers/CreateCustomers';
import { useCustomerGroupsMDM } from '../../hooks/mdm/customers/useCustomersGroupMDM'
import { useDataCountries } from '../../hooks/mdm/country-structure/useCountries';

export default function PageCreateCustomer() {
  const [search, setSearch] = useState({
    languages: '',
    customerGroup: ''
  })
  const { data: getDataCustomerGroup } = useCustomerGroupsMDM({
    options: { onSuccess: () => {} },
    query: {
      search: search.customerGroup
    }
  })
  const { data: getDataLanguages } = useDataCountries({
    options: { onSuccess: () => {} },
    query: {
      search: search?.languages
    }
  })

  const propsDropdownField = {
    getDataCustomerGroup,
    getDataLanguages,
    setSearchLanguage: () => {},
    setSearchLanguages: (value: string) =>
      setSearch({ ...search, languages: value }),
    setSearchCustomerGroup: (value: string) =>
      setSearch({ ...search, customerGroup: value })
  }

  return <CreateCustomers {...propsDropdownField}  />
}