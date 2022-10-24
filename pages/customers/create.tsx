import React, { useState } from "react";
import CreateCustomers from "../../components/pages/Customers/CreateCustomers";
import { useCustomerGroupsMDM } from "../../hooks/mdm/customers/useCustomersGroupMDM";
import { useDataCountries } from "../../hooks/mdm/country-structure/useCountries";
import { useLanguages } from "hooks/languages/useLanguages";
import useDebounce from "lib/useDebounce";

export default function PageCreateCustomer() {
  const [search, setSearch] = useState({
    languages: "",
    customerGroup: "",
  });

  const debounceFetchLanguages = useDebounce(search.languages, 1000);
  const debounceFetchCustomerGroup = useDebounce(search.customerGroup, 1000);

  const { data: getDataCustomerGroup } = useCustomerGroupsMDM({
    options: { onSuccess: () => {} },
    query: {
      search: debounceFetchCustomerGroup,
    },
  });
  const { data: getDataLanguages, isLoading: isLoadingLanguages } = useLanguages({
    options: { onSuccess: () => {} },
    query: {
      search: debounceFetchLanguages,
    },
  });

  const propsDropdownField = {
    getDataCustomerGroup,
    getDataLanguages,
    isLoadingLanguages,
    setSearchLanguage: () => {},
    setSearchLanguages: (value: string) => setSearch({ ...search, languages: value }),
    setSearchCustomerGroup: (value: string) => setSearch({ ...search, customerGroup: value }),
  };

  return <CreateCustomers {...propsDropdownField} />;
}
