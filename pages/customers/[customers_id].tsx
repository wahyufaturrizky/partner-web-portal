import { useLanguages } from "hooks/languages/useLanguages";
import { usePostalCodeInfiniteLists } from "hooks/mdm/postal-code/usePostalCode";
import useDebounce from "lib/useDebounce";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CreateCustomers from "../../components/pages/Customers/CreateCustomers";
import { useInfiniteCustomerGroupsLists } from "../../hooks/mdm/customers/useCustomersGroupMDM";
import { useDetailCustomer } from "../../hooks/mdm/customers/useCustomersMDM";

export default function CustomersDetail() {
  const router = useRouter();
  const { customers_id } = router.query;
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
        id: "",
        is_company: "Company",
        phone: "",
        tax_number: "",
        mobile: "",
        active_status: "",
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
        id: "",
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
        id: "",
      },
      sales: {
        id: "",
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
    options: {
      onSuccess: () => {},
    },
    query: {
      search: debounceFetchLanguages,
    },
  });
  const { data: detailCustomer, isLoading: isLoadingCustomer } = useDetailCustomer({
    options: {
      onSuccess: (dataCustomerDetail: any) => {
        setValue(
          "bank",
          dataCustomerDetail?.customerBanks.map((data: any) => ({
            key: data.id,
            id: data.id,
            bank_name: data.bankName,
            account_number: data.accountNumber,
            account_name: data.accountName,
          }))
        );

        setValue("customer.name", dataCustomerDetail.name);
        setValue("customer.is_company", dataCustomerDetail.isCompany ? "Company" : "Individu");
        setValue("customer.phone", dataCustomerDetail.phone);
        setValue("customer.tax_number", dataCustomerDetail.taxNumber);
        setValue("customer.mobile", dataCustomerDetail.mobile);
        setValue("customer.active_status", dataCustomerDetail.activeStatus);
        setValue("customer.ppkp", dataCustomerDetail.ppkp);
        setValue("customer.website", dataCustomerDetail.website);
        setValue("customer.email", dataCustomerDetail.email);
        setValue("customer.language", dataCustomerDetail.language);
        setValue("customer.customer_group", dataCustomerDetail.customerGroup);
        setValue("customer.external_code", dataCustomerDetail.externalCode);
        setValue("customer.company_logo", dataCustomerDetail.companyLogo);
        setValue("customer.id", dataCustomerDetail.id);

        setValue(
          "contact",
          dataCustomerDetail?.customerContacts.map((data: any) => ({
            name: data?.name,
            id: data?.id,
            role: data?.role,
            email: data?.email,
            tittle: data?.tittle,
            nik: data?.nik,
            mobile: data?.mobile,
          }))
        );

        setValue(
          "address",
          dataCustomerDetail?.customerAddresses.map((data: any) => ({
            id: data.id,
            is_primary: data.isPrimary,
            address_type: data.addressType,
            street: data.street,
            country: data.country,
            postal_code: data.postalCode,
            longtitude: data.longtitude,
            latitude: data.latitude,
            image: data.image,
            imageUrl: data.imageUrl,
          }))
        );

        setValue("invoicing.credit_limit", dataCustomerDetail.customerInvoicing?.creditLimit);
        setValue("invoicing.credit_balance", dataCustomerDetail.customerInvoicing?.creditBalance);
        setValue("invoicing.credit_used", dataCustomerDetail.customerInvoicing?.creditUsed);
        setValue("invoicing.income_account", dataCustomerDetail.customerInvoicing?.incomeAccount);
        setValue("invoicing.expense_account", dataCustomerDetail.customerInvoicing?.expenseAccount);
        setValue("invoicing.tax_name", dataCustomerDetail.customerInvoicing?.taxName);
        setValue("invoicing.tax_city", dataCustomerDetail.customerInvoicing?.taxCity);
        setValue("invoicing.tax_address", dataCustomerDetail.customerInvoicing?.taxAddress);
        setValue("invoicing.currency", dataCustomerDetail.customerInvoicing?.currency);
        setValue("invoicing.id", dataCustomerDetail.customerInvoicing?.id);

        setValue(
          "purchasing.term_of_payment",
          dataCustomerDetail.customerPurchasing?.termOfPayment
        );
        setValue("purchasing.id", dataCustomerDetail.customerPurchasing?.id);

        setValue("sales.branch", dataCustomerDetail.customerSales?.branch);
        setValue("sales.id", dataCustomerDetail.customerSales?.id);
        setValue("sales.salesman", dataCustomerDetail.customerSales?.salesman);
        setValue("sales.term_payment", dataCustomerDetail.customerSales?.termPayment);
        setValue(
          "sales.sales_order_blocking",
          dataCustomerDetail.customerSales?.salesOrderBlocking
        );
        setValue("sales.billing_blocking", dataCustomerDetail.customerSales?.billingBlocking);
        setValue(
          "sales.delivery_order_blocking",
          dataCustomerDetail.customerSales?.deliveryOrderBlocking
        );
      },
    },
    id: customers_id,
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
    type:"edit"
  };

  return <CreateCustomers isUpdate {...propsDropdownField} />;
}
