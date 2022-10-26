import { useLanguages } from "hooks/languages/useLanguages";
import { usePostalCodeInfiniteLists } from "hooks/mdm/postal-code/usePostalCode";
import useDebounce from "lib/useDebounce";
import { useState } from "react";
import CreateCustomers from "../../components/pages/Customers/CreateCustomers";
import { useInfiniteCustomerGroupsLists } from "../../hooks/mdm/customers/useCustomersGroupMDM";

export default function PageCreateCustomer() {
  const [search, setSearch] = useState({
    languages: "",
    customerGroup: "",
  });

  const [postalCodeList, setPostalCodeList] = useState<any[]>([]);
  const [totalRowsPostalCodeList, setTotalRowsPostalCodeList] = useState(0);
  const [searchPostalCode, setSearchPostalCode] = useState("");

  const [customerGroupsList, setListCustomerGroupsList] = useState<any[]>([]);
  const [totalRowsCustomerGroupsList, setTotalRowsCustomerGroupsList] = useState(0);

  const debounceFetchLanguages = useDebounce(search.languages, 1000);
  const debounceFetchCustomerGroup = useDebounce(search.customerGroup, 1000);
  const debounceFetchPostalCode = useDebounce(searchPostalCode, 1000);

  const { data: getDataLanguages, isLoading: isLoadingLanguages } = useLanguages({
    options: { onSuccess: () => {} },
    query: {
      search: debounceFetchLanguages,
    },
  });

  const {
    isFetching: isFetchingPostalCode,
    isFetchingNextPage: isFetchingMorePostalCode,
    hasNextPage: hasNextPagePostalCode,
    fetchNextPage: fetchNextPagePostalCode,
  } = usePostalCodeInfiniteLists({
    query: {
      search: debounceFetchPostalCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsPostalCodeList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.codeText,
              label: element.code,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setPostalCodeList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (postalCodeList.length < totalRowsPostalCodeList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingCustomerGroupsLists,
    isFetchingNextPage: isFetchingMoreCustomerGroupsLists,
    hasNextPage: hasNextPageCustomerGroupsLists,
    fetchNextPage: fetchNextPageCustomerGroupsLists,
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
    isFetchingCustomerGroupsLists,
    isFetchingMoreCustomerGroupsLists,
    hasNextPageCustomerGroupsLists,
    fetchNextPageCustomerGroupsLists,
    customerGroupsList,
    setSearchLanguage: () => {},
    setSearchLanguages: (value: string) => setSearch({ ...search, languages: value }),
    setSearchCustomerGroup: (value: string) => setSearch({ ...search, customerGroup: value }),
    isFetchingPostalCode,
    isFetchingMorePostalCode,
    hasNextPagePostalCode,
    fetchNextPagePostalCode,
    postalCodeList,
    setSearchPostalCode,
  };

  return <CreateCustomers {...propsDropdownField} />;
}
