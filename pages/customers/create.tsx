import { useLanguages } from "hooks/languages/useLanguages";
import { usePostalCodeInfiniteLists } from "hooks/mdm/postal-code/usePostalCode";
import useDebounce from "lib/useDebounce";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CreateCustomers from "../../components/pages/Customers/CreateCustomers";
import { useInfiniteCustomerGroupsLists } from "../../hooks/mdm/customers/useCustomersGroupMDM";

export default function PageCreateCustomer() {
  const router = useRouter();
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

  const methods = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      bank: [],
      customer: {
        name: "",
        is_company: "Company",
        phone: "",
        tax_number: "",
        mobile: "",
        active_status: "ACTIVE",
        ppkp: false,
        website: "",
        email: "",
        language: "",
        customer_group: "",
        external_code: "",
        company_logo: "-",
      },
      contact: [],
      address: [],
      invoicing: {
        credit_limit: 1,
        credit_balance: 1,
        credit_used: 1,
        income_account: "-",
        expense_account: "",
        tax_name: "",
        tax_city: "",
        tax_address: "",
        currency: "",
      },
      purchasing: {
        term_of_payment: "",
      },
      sales: {
        branch: 1,
        salesman: 1,
        term_payment: "1",
        sales_order_blocking: false,
        billing_blocking: false,
        delivery_order_blocking: false,
      },
    },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = methods;

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
    isLoading: isLoadingPostalCode,
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
    isLoadingPostalCode,
    methods,
    control,
    handleSubmit,
    register,
    errors,
    setValue,
    getValues,
    router,
  };

  return <CreateCustomers {...propsDropdownField} />;
}
