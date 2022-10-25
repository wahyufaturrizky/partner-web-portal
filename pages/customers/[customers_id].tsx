import { useLanguages } from "hooks/languages/useLanguages";
import useDebounce from "lib/useDebounce";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateCustomers from "../../components/pages/Customers/CreateCustomers";
import { useDataCountries } from "../../hooks/mdm/country-structure/useCountries";
import { useInfiniteCustomerGroupsLists } from "../../hooks/mdm/customers/useCustomersGroupMDM";
import { useDetailCustomer } from "../../hooks/mdm/customers/useCustomersMDM";

export default function CustomersDetail() {
  const router = useRouter();
  const { customers_id } = router.query;
  const [search, setSearch] = useState({
    languages: "",
    customerGroup: "",
  });

  const [customerGroupsList, setListCustomerGroupsList] = useState<any[]>([]);
  const [totalRowsCustomerGroupsList, setTotalRowsCustomerGroupsList] = useState(0);

  const debounceFetchLanguages = useDebounce(search.languages, 1000);
  const debounceFetchCustomerGroup = useDebounce(search.customerGroup, 1000);

  const { data: getDataLanguages, isLoading: isLoadingLanguages } = useLanguages({
    options: { onSuccess: () => {} },
    query: {
      search: debounceFetchLanguages,
    },
  });
  const { data: detailCustomer, isLoading: isLoadingCustomer } = useDetailCustomer({
    options: {
      onSuccess: () => {},
    },
    id: customers_id,
  });

  const {
    isFetching: isFetchingCustomerGroupsLists,
    isFetchingNextPage: isFetchingMoreCustomerGroupsLists,
    hasNextPage: hasNextPageCustomerGroupsLists,
    fetchNextPage: fetchNextPageCustomerGroupsLists,
    isLoading: isLoadingCustomerGroupsLists,
  } = useInfiniteCustomerGroupsLists({
    query: {
      search: debounceFetchCustomerGroup,
      company: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCustomerGroupsList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListCustomerGroupsList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (customerGroupsList.length < totalRowsCustomerGroupsList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const propsDropdownField = {
    getDataLanguages,
    isLoadingLanguages,
    detailCustomer,
    isLoadingCustomer,
    isFetchingCustomerGroupsLists,
    isFetchingMoreCustomerGroupsLists,
    hasNextPageCustomerGroupsLists,
    fetchNextPageCustomerGroupsLists,
    customerGroupsList,
    isLoadingCustomerGroupsLists,
    setSearchLanguage: () => {},
    setSearchLanguages: (value: string) => setSearch({ ...search, languages: value }),
    setSearchCustomerGroup: (value: string) => setSearch({ ...search, customerGroup: value }),
  };

  return <CreateCustomers isUpdate {...propsDropdownField} />;
}
