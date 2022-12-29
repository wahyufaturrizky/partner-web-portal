import React, { useState } from "react";
import {
  Col,
  Row,
  Spacer,
  Text,
  Button,
  FormSelect,
  Table,
  Input,
  Spin,
  FormSelectCustom,
  Dropdown,
} from "pink-lava-ui";
import { ICPlusWhite, ICDelete, ICEdit } from "assets";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import ModalAddBankAccounts from "components/elements/Modal/ModalAddBankAccounts";
import { useCoaVendor } from "hooks/mdm/vendor/useVendor";
import { useCurrenciesInfiniteLists } from "hooks/mdm/country-structure/useCurrencyMDM";
import { useTaxInfiniteLists } from "hooks/mdm/Tax/useTax";
import useDebounce from "lib/useDebounce";
import styled from "styled-components";
import { useCoaList } from "hooks/mdm/product-category/useProductCategory";
import ModalAddBankAccountCustomer from "components/elements/Modal/ModalAddBankAccountsCustomer";

const Invoicing = ({ formType }) => {
  const { register, control, setValue } = useFormContext();
  const companyCode = localStorage.getItem("companyCode");

  const { fields, append, remove, update }: any = useFieldArray({
    control,
    name: "bank",
  });

  const [showFormBank, setShowFormBank] = useState<any>({
    type: "",
    open: false,
    data: {},
    index: 0,
  });

  // Coa State
  const [listCoa, setListCoa] = useState([]);

  // Currency State
  const [totalRowsCurrency, setTotalRowsCurrency] = useState(0);
  const [listCurrency, setListCurrency] = useState([]);
  const [searchCurrency, setSearchCurrency] = useState("");
  const debounceSearchCurrency = useDebounce(searchCurrency, 1000);

  // Tax State
  const [totalRowsTax, setTotalRowsTax] = useState(0);
  const [listTax, setListTax] = useState([]);
  const [searchTax, setSearchTax] = useState("");
  const debounceSearchTax = useDebounce(searchTax, 1000);

  const listFakeTaxCity = [
    { value: "DIY Yogyakarta", id: "yogyakarta" },
    { value: "Jakarta", id: "jakarta" },
    { value: "Lampung", id: "lampung" },
    { value: "Bandung", id: "bandung" },
  ];

  // Coa API
  const {
    data: coaData,
    isLoading: isLoadingCoa,
    isFetching: isFetchingCoa,
  } = useCoaVendor({
    query: {
      company_code: companyCode,
      account_type: "payable",
    },
    options: {
      onSuccess: (data: any) => {
        setListCoa(data);
        // pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            label: element.accountName,
            value: element.accountCode,
          };
        });

        return mappedData ?? [];
      },
    },
  });

  // Currency API
  const {
    isLoading: isLoadingCurrency,
    isFetching: isFetchingCurrency,
    isFetchingNextPage: isFetchingMoreCurrency,
    hasNextPage: hasNextCurrency,
    fetchNextPage: fetchNextPageCurrency,
  } = useCurrenciesInfiniteLists({
    query: {
      search: debounceSearchCurrency,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCurrency(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: `${element.currency} - ${element.currencyName}`,
              value: element.id,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListCurrency(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listCurrency.length < totalRowsCurrency) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { data: coaListReceivable, isLoading: isLoadingCoaListReceivable } = useCoaList({
    status: "receivable",
    options: {
      onSuccess: () => {},
    },
  });

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_: any, record: any, index: any) => {
        return (
          <Row gap="16px" alignItems="center" nowrap>
            <Col>
              <ICEdit
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowFormBank({
                    type: "edit",
                    open: true,
                    data: record,
                    index,
                  });
                }}
              />
            </Col>
            <Col>
              <ICDelete
                style={{ cursor: "pointer" }}
                onClick={() => {
                  remove(index);
                }}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Bank Name",
      dataIndex: "bank",
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
    },
  ];

  return (
    <>
      <Col>
        <Text variant="headingMedium" color={"blue.dark"}>
          Account Receiveable
        </Text>

        <Row gap="16px" width="100%">
          <Col width="48%">
            <Input
              label="Credit Limit"
              width="100%"
              type="number"
              height="50px"
              placeholder={"Rp 5.000.000"}
              {...register("invoicing.credit_limit")}
            />
            <Spacer size={10} />
            <Input
              label="Credit Used"
              width="100%"
              placeholder={"Rp 5.000.000"}
              height="50px"
              disabled
              {...register("invoicing.credit_used")}
            />
          </Col>
          <Col width="48%">
            <Input
              label="Credit Balance"
              width="100%"
              placeholder={"Rp 5.000.000"}
              height="50px"
              disabled
              {...register("invoicing.credit_balance")}
            />
            <Spacer size={10} />
            <Controller
              control={control}
              name="invoicing.income_account"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  label="Income Account"
                  noSearch
                  loading={isLoadingCoaListReceivable}
                  defaultValue={value}
                  width="100%"
                  actionLabel="Add New Income Account"
                  isShowActionLabel
                  handleChange={onChange}
                  items={coaListReceivable?.rows?.map((data) => ({
                    id: data.accountName,
                    value: data.accountName,
                  }))}
                />
              )}
            />
          </Col>
        </Row>

        <Text variant="headingMedium" color={"blue.dark"}>
          Account Payable
        </Text>

        <Spacer size={20} />

        <Controller
          control={control}
          defaultValue={""}
          name="invoicing.expense_account"
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <>
              {isLoadingCoa ? (
                <Center>
                  <Spin tip="" />
                </Center>
              ) : (
                <>
                  <Text variant="headingRegular">Reconciliation Account</Text>
                  <Spacer size={5} />
                  <FormSelect
                    defaultValue={value}
                    style={{ width: "50%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingCoa}
                    isLoadingMore={false}
                    fetchMore={() => {}}
                    items={listCoa}
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                    onSearch={(value: any) => {
                      const filterData = coaData?.filter(
                        (text: any) => text.label.indexOf(value) > -1
                      );
                      setListCoa(filterData);
                    }}
                  />
                </>
              )}
            </>
          )}
        />

        <Spacer size={20} />

        <Text variant="headingMedium" color={"blue.dark"}>
          Bank Account
        </Text>

        <Spacer size={10} />

        <Row width={"220px"}>
          <Button
            size="big"
            onClick={() => {
              setShowFormBank({ type: "add", open: true, data: {} });
            }}
          >
            <ICPlusWhite />
            Add Bank Account
          </Button>
        </Row>

        <Spacer size={20} />

        <Table columns={columns} data={fields ?? []} />

        <Spacer size={20} />

        <Text variant="headingMedium" color={"blue.dark"}>
          Tax
        </Text>

        <Spacer size={20} />

        <Row width={"100%"} gap={"10px"} noWrap>
          <Col width="48%">
            <Input
              label="Tax Name"
              width="100%"
              height="48px"
              placeholder="e.g Tax Items"
              {...register("invoicing.tax_name")}
            />
            <Spacer size={20} />
          </Col>
          <Row gap="16px" width="100%">
            <Col width="48%">
              <Controller
                control={control}
                name="invoicing.tax_city"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    label="Tax City"
                    width="100%"
                    defaultValue={value}
                    actionLabel="Add New Tax City"
                    isShowActionLabel
                    items={listFakeTaxCity}
                    handleClickActionLabel={() => {}}
                    handleChange={onChange}
                  />
                )}
              />
            </Col>
            <Col width="48%">
              <Input
                label="Tax Address"
                width="100%"
                placeholder="e.g Jalan Soekarano Hatta No.1"
                height="48px"
                {...register("invoicing.tax_address")}
              />
            </Col>
          </Row>
        </Row>

        <Spacer size={20} />

        <Text variant="headingMedium" color={"blue.dark"}>
          Currency
        </Text>

        <Spacer size={20} />

        <Controller
          control={control}
          defaultValue={""}
          name="invoicing.currency"
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <>
              {isLoadingCurrency ? (
                <Center>
                  <Spin tip="" />
                </Center>
              ) : (
                <>
                  <Text variant="headingRegular">Currency Code</Text>
                  <Spacer size={5} />
                  <FormSelect
                    defaultValue={value}
                    style={{ width: "50%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingCurrency}
                    isLoadingMore={isFetchingMoreCurrency}
                    fetchMore={() => {
                      if (hasNextCurrency) {
                        fetchNextPageCurrency();
                      }
                    }}
                    items={isFetchingCurrency && !isFetchingMoreCurrency ? [] : listCurrency}
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                    onSearch={(value: any) => {
                      setSearchCurrency(value);
                    }}
                  />
                </>
              )}
            </>
          )}
        />
      </Col>

      {showFormBank.open && (
        <ModalAddBankAccountCustomer
          visible={showFormBank.open}
          onCancel={() => {
            setShowFormBank({ type: "", open: false, data: {} });
          }}
          bankData={showFormBank.data}
          onSaveBank={(bankObject: any) => {
            switch (showFormBank.type) {
              case "add":
                append({ ...bankObject, key: fields.length });
                setShowFormBank({ type: "", open: false, data: {}, index: 0 });
                break;
              case "edit":
                update(showFormBank.index, bankObject);
                setShowFormBank({ type: "", open: false, data: {}, index: 0 });
                break;
              default:
                break;
            }
          }}
        />
      )}
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Invoicing;
