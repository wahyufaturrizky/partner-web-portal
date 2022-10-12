import React, { useState } from "react";
import { Col, Row, Spacer, Text, Button, FormSelect, Table, Input, Spin } from "pink-lava-ui";
import { ICPlusWhite, ICDelete, ICEdit } from "assets";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import ModalAddBankAccounts from "components/elements/Modal/ModalAddBankAccounts";
import { useCoaVendor } from "hooks/mdm/vendor/useVendor";
import { useCurrenciesInfiniteLists } from "hooks/mdm/country-structure/useCurrencyMDM";
import { useTaxInfiniteLists } from "hooks/mdm/Tax/useTax";
import useDebounce from "lib/useDebounce";
import styled from "styled-components";

const Invoicing = () => {
  const { register, control, setValue } = useFormContext();

  const { fields, append, remove, update }: any = useFieldArray({
    control,
    name: "invoicing.banks",
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
  const [listTaxTemp, setListTaxTemp] = useState([]);
  const [listTaxName, setListTaxName] = useState([]);
  const [listTaxNameTemp, setListTaxNameTemp] = useState([]);
  const [searchTax, setSearchTax] = useState("");
  const debounceSearchTax = useDebounce(searchTax, 1000);

  // Coa API
  const {
    data: coaData,
    isLoading: isLoadingCoa,
    isFetching: isFetchingCoa,
  } = useCoaVendor({
    query: {
      company_code: "KSNI",
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

  // Tax API
  const {
    data: taxData,
    isLoading: isLoadingTax,
    isFetching: isFetchingTax,
    isFetchingNextPage: isFetchingMoreTax,
    hasNextPage: hasNextTax,
    fetchNextPage: fetchNextPageTax,
  } = useTaxInfiniteLists({
    query: {
      search: debounceSearchTax,
      sortOrder: "DESC",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsTax(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.country.name,
              value: element.countryId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListTax(flattenArray);
        setListTaxTemp(data?.pages[0]?.rows ?? []);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listTax.length < totalRowsTax) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
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
          Account Payable
        </Text>

        <Spacer size={20} />

        <Controller
          control={control}
          defaultValue={""}
          name="invoicing.reconciliation_account"
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
          Payment Method
        </Text>

        <Spacer size={20} />

        <Controller
          control={control}
          defaultValue={""}
          name="invoicing.payment_method"
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <>
              <Text variant="headingRegular">Select Payment Method</Text>
              <Spacer size={5} />
              <FormSelect
                defaultValue={value}
                style={{ width: "50%" }}
                size={"large"}
                placeholder={"Select"}
                borderColor={"#AAAAAA"}
                arrowColor={"#000"}
                withSearch={false}
                isLoading={false}
                isLoadingMore={false}
                fetchMore={() => {}}
                items={[
                  { label: "Bank Transfer", value: "bank" },
                  { label: "Bank Transfer Foreign", value: "bank_foreign" },
                  { label: "Cash", value: "cash" },
                  { label: "Check", value: "check" },
                ]}
                onChange={(value: any) => {
                  onChange(value);
                }}
              />
            </>
          )}
        />

        <Spacer size={20} />

        <Text variant="headingMedium" color={"blue.dark"}>
          Tax
        </Text>

        <Spacer size={20} />

        <Row width={"100%"} gap={"10px"} noWrap>
          <Controller
            control={control}
            defaultValue={""}
            name="invoicing.tax_country"
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <Col width={"50%"}>
                {isLoadingTax ? (
                  <Center>
                    <Spin tip="" />
                  </Center>
                ) : (
                  <>
                    <Text variant="headingRegular">Tax Country</Text>
                    <Spacer size={5} />
                    <FormSelect
                      defaultValue={value}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      withSearch
                      isLoading={isFetchingTax}
                      isLoadingMore={isFetchingMoreTax}
                      fetchMore={() => {
                        if (hasNextTax) {
                          fetchNextPageTax();
                        }
                      }}
                      items={isFetchingTax && !isFetchingMoreTax ? [] : listTax}
                      onChange={(value: any) => {
                        onChange(value);
                        // Filter berdasarkan tax country yang dipilih
                        const filterTaxName: any = listTaxTemp?.filter(
                          (el: any) => el.countryId === value
                        );

                        const mappedTaxName = filterTaxName[0]?.taxItems?.map((el: any) => {
                          return {
                            label: el.taxName,
                            value: el.taxItemId,
                          };
                        });

                        setListTaxNameTemp(filterTaxName[0]?.taxItems ?? []);
                        setListTaxName(mappedTaxName ?? []);
                      }}
                      onSearch={(value: any) => {
                        setSearchTax(value);
                      }}
                    />
                  </>
                )}
              </Col>
            )}
          />

          <Controller
            control={control}
            defaultValue={""}
            name="invoicing.tax_name"
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <Col width={"50%"}>
                <Text variant="headingRegular">Tax Name</Text>
                <Spacer size={5} />
                <FormSelect
                  defaultValue={value}
                  style={{ width: "100%" }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={false}
                  isLoadingMore={false}
                  fetchMore={() => {}}
                  items={listTaxName}
                  onChange={(value: any) => {
                    onChange(value);

                    // Filter berdasarkan tax name  yang dipilih
                    const filterTaxName: any = listTaxNameTemp?.filter(
                      (el: any) => el.taxItemId === value
                    );

                    setValue("invoicing.tax_type", filterTaxName[0]?.taxType ?? "");
                    setValue("invoicing.tax_code", filterTaxName[0]?.taxCode ?? "");
                  }}
                  onSearch={(value: any) => {
                    // const filterData = taxData?.filter(
                    //   (text: any) => text.label.indexOf(value) > -1
                    // );
                    // setSalesOrgList(filterData);
                  }}
                />
              </Col>
            )}
          />
        </Row>

        <Spacer size={20} />

        <Row width={"100%"} gap={"10px"} noWrap>
          <Col width={"50%"}>
            <Input
              width="50%"
              label="Tax Type"
              height="40px"
              defaultValue={""}
              placeholder={""}
              {...register("invoicing.tax_type")}
            />
          </Col>
          <Col width={"50%"}>
            <Input
              width="50%"
              label="Tax Code"
              height="40px"
              defaultValue={""}
              placeholder={""}
              {...register("invoicing.tax_code")}
            />
          </Col>
        </Row>

        <Spacer size={20} />

        <Row width={"50%"}>
          <Input
            width="50%"
            label="Tax Address"
            height="40px"
            defaultValue={""}
            placeholder={"e.g Jalan Soekarno Hatta No. 1"}
            {...register("invoicing.tax_address")}
          />
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
        <ModalAddBankAccounts
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
