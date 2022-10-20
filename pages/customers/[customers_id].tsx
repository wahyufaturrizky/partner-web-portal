import React, { useState } from "react";
import { useRouter } from "next/router";
import CreateCustomers from "../../components/pages/Customers/CreateCustomers";
import { useDetailCustomer } from "../../hooks/mdm/customers/useCustomersMDM";
import { useCustomerGroupsMDM } from "../../hooks/mdm/customers/useCustomersGroupMDM";
import { useDataCountries } from "../../hooks/mdm/country-structure/useCountries";

export default function CustomersDetail() {
  const router = useRouter();
  const { customers_id } = router.query;
  const [search, setSearch] = useState({
    languages: "",
    customerGroup: "",
  });
  const { data: getDataCustomerGroup } = useCustomerGroupsMDM({
    options: { onSuccess: () => {} },
    query: {
      search: search.customerGroup,
    },
  });
  const { data: getDataLanguages } = useDataCountries({
    options: { onSuccess: () => {} },
    query: {
      search: search?.languages,
    },
  });
  const { data: detailCustomer, isLoading: isLoadingCustomer } = useDetailCustomer({
    options: {
      onSuccess: () => {},
    },
    id: customers_id,
  });

  const propsDropdownField = {
    getDataCustomerGroup,
    getDataLanguages,
    detailCustomer,
    isLoadingCustomer,
    setSearchLanguage: () => {},
    setSearchLanguages: (value: string) => setSearch({ ...search, languages: value }),
    setSearchCustomerGroup: (value: string) => setSearch({ ...search, customerGroup: value }),
  };

  return <CreateCustomers isUpdate {...propsDropdownField} />;
}
