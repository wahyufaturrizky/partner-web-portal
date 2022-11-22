import React, { useEffect, useState } from 'react'
import { Spacer, Table, Text, Row, Pagination, Col, FormSelect, Spin, Input } from 'pink-lava-ui'
import { lang } from 'lang';
import usePagination from '@lucasmogari/react-pagination';
import ModalVendorList from 'components/elements/Modal/ModalVendorList';
import { useTaxInfiniteLists } from 'hooks/mdm/Tax/useTax';
import useDebounce from 'lib/useDebounce';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

export default function Purchasing({ control, setValue, register } : any) {
  const t = localStorage.getItem("lan") || "en-US";

  const [showVendor, setShowVendor] = useState({
    show: false,
    selectedRowKeyMenu: [],
  });

  const [selectedVendor, setSelectedVendor] = useState([])
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 5,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const columns = [
    {
      title: lang[t].productList.create.table.vendor,
      dataIndex: "name",
    },
    {
      title: lang[t].productList.create.table.validUntil,
      dataIndex: "validUntil",
    }
  ]

    // Tax State
  const [listTax, setListTax] = useState([]);
  const [listTaxTemp, setListTaxTemp] = useState([]);
  const [listTaxName, setListTaxName] = useState([]);
  const [listTaxNameTemp, setListTaxNameTemp] = useState([]);
  const [searchTax, setSearchTax] = useState("");
  const debounceSearchTax = useDebounce(searchTax, 1000);
  const [totalRowsTax, setTotalRowsTax] = useState(0);

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
              label: element?.country?.name,
              value: element?.countryId,
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

  useEffect(() => {
    setValue("tax.tax_vendors", showVendor.selectedRowKeyMenu)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVendor])

  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">{lang[t].productList.create.field.purchasing.sourceOfSupply}</Text>
      <Spacer size={20} />
      <Table
        loading={false}
        columns={columns}
        data={selectedVendor}
      />
      <Pagination pagination={pagination} />
      <Spacer size={21} />
      <Text
        clickable
        variant="button"
        color="pink.regular"
        onClick={()=> setShowVendor({
          ...showVendor,
          show: true,
        })}
      >
        View Product Vendor Assignment &gt;
      </Text>
      <Spacer size={32} />
      <Text variant="headingMedium" color="blue.darker">Purchasing Tax</Text>
      <Spacer size={20} />
      <Row width={"100%"} gap={"20px"} noWrap>
          <Controller
            control={control}
            defaultValue={""}
            name="tax.tax_country_id"
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
                    <CustomFormSelect
                      defaultValue={value ? value : undefined}
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
            name="tax.tax_name"
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <Col width={"50%"}>
                <Text variant="headingRegular">Tax Name</Text>
                <Spacer size={5} />
                <CustomFormSelect
                  defaultValue={value ? value : undefined}
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

                    setValue("tax.tax_type", filterTaxName[0]?.taxType ?? "");
                    setValue("tax.tax_code", filterTaxName[0]?.taxCode ?? "");
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

        <Row width={"100%"} gap={"20px"} noWrap>
          <Col width={"50%"}>
            <Input
              width="50%"
              label="Tax Type"
              height="48px"
              defaultValue={""}
              placeholder={""}
              disabled={true}
              {...register("tax.tax_type")}
            />
          </Col>
          <Col width={"50%"}>
            <Input
              width="50%"
              label="Tax Code"
              height="48px"
              defaultValue={""}
              placeholder={""}
              disabled={true}
              {...register("tax.tax_code")}
            />
          </Col>
        </Row>

      <ModalVendorList 
        show={showVendor.show} 
        onAddMenu={(vendors: any, keys: any) => {
          setSelectedVendor(vendors)
          setShowVendor({
            show: false,
            selectedRowKeyMenu: keys,
          });
        }}
        onCancel={() => {
          setShowVendor({
            ...showVendor,
            show: false,
          });
        }}
        selectedRowKeys={showVendor.selectedRowKeyMenu}
      />
    </div>
  )
}

const CustomFormSelect = styled(FormSelect)`
  
  .ant-select-selection-placeholder {
    line-height: 48px !important;
  }

  .ant-select-selection-search-input {
    height: 48px !important;
  }

  .ant-select-selector {
    height: 48px !important;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;