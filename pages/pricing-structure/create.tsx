import usePagination from "@lucasmogari/react-pagination";
import { useChannelsMDM } from "hooks/mdm/channel/useChannelMDM";
import { useCurrenciesInfiniteLists } from "hooks/mdm/country-structure/useCurrencyMDM";
import { useProductList } from "hooks/mdm/product-list/useProductList";
import {
  useCreatePricingStructureDraftList,
  useCreatePricingStructureList,
  usePricingConfigInfiniteLists,
} from "hooks/pricing-structure/usePricingStructure";
import { useSalesOrganizationInfiniteLists } from "hooks/sales-organization/useSalesOrganization";
import useDebounce from "lib/useDebounce";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  DropdownMenuOptionCustome,
  FormSelect,
  Row,
  Search,
  Spacer,
  Spin,
  Text,
  Modal,
  DropdownMenuOptionGroup,
  Table,
  Pagination,
} from "pink-lava-ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { colors } from "utils/color";
import { ICPlus, ICCopy } from "../../assets";

const CreatePricingStructure: any = () => {
  const paginationProducts = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const paginateCopyFromPriceStructure = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [modal, setModal] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });
  const { open, data, typeForm } = modal;

  const [totalRowsPricingConfigInfiniteList, setTotalRowsPricingConfigInfiniteList] = useState(0);
  const [pricingConfigInfiniteList, setPricingConfigInfiniteList] = useState<any[]>([]);
  const [searchPricingConfigInfinite, setSearchPricingConfigInfinite] = useState("");

  const [searchProduct, setSearchProduct] = useState("");

  const [totalRowsCurrenciesInfiniteList, setTotalRowsCurrenciesInfiniteList] = useState(0);
  const [currenciesInfiniteList, setCurrenciesInfiniteList] = useState<any[]>([]);
  const [searchCurrenciesInfinite, setSearchCurrenciesInfinite] = useState("");

  const [totalRowsSalesOrganizationInfiniteList, setTotalRowsSalesOrganizationInfiniteList] =
    useState(0);
  const [salesOrganizationInfiniteList, setSalesOrganizationInfiniteList] = useState<any[]>([]);
  const [searchSalesOrganizationInfinite, setSearchSalesOrganizationInfinite] = useState("");

  const [selectedFilter, setSelectedFilter] = useState([]);

  const [selectedRowKeysProduct, setSelectedRowKeysProduct] = useState([]);
  const [selectedRowKeysCopyFromPriceStructure, setSelectedRowKeysCopyFromPriceStructure] =
    useState([]);

  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      pricing_config: "",
      currency: "",
      manage_by: "",
      distribution_channel: null,
    },
  });

  const { mutate: pricingStructure } = useCreatePricingStructureList({
    options: {
      onSuccess: () => {
        router.back();
      },
    },
  });

  const { mutate: pricingStructureDraft } = useCreatePricingStructureDraftList({
    options: {
      onSuccess: () => {
        router.back();
      },
    },
  });

  const debounceFetch = useDebounce(
    searchPricingConfigInfinite ||
      searchProduct ||
      searchSalesOrganizationInfinite ||
      searchCurrenciesInfinite,
    1000
  );

  const {
    isFetching: isFetchingPricingConfigInfinite,
    isFetchingNextPage: isFetchingMorePricingConfigInfinite,
    hasNextPage: hasNextPagePricingConfigInfinite,
    fetchNextPage: fetchNextPagePricingConfigInfinite,
    isLoading: isLoadingPricingConfigInfinite,
  } = usePricingConfigInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsPricingConfigInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setPricingConfigInfiniteList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (pricingConfigInfiniteList.length < totalRowsPricingConfigInfiniteList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    data: productListData,
    isLoading: isLoadingProductList,
    isFetching: isFetchingProductList,
  } = useProductList({
    query: {
      search: debounceFetch,
      page: paginationProducts.page,
      limit: paginationProducts.itemsPerPage,
      company_id: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        paginationProducts.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.productId,
            id: element.productId,
            name: element.name,
            status: element.status,
            productCategoryName: element.productCategoryName,
            hasVariant: element.hasVariant,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/product-list/${element.productId}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const {
    data: channelsMDMData,
    isLoading: isLoadingChannelsMDM,
    isFetching: isFetchingChannelsMDM,
  } = useChannelsMDM({
    query: {
      search: debounceFetch,
      limit: 10000,
    },
    options: {
      onSuccess: (data: any) => {},
    },
  });

  const {
    isFetching: isFetchingSalesOrganizationInfinite,
    isFetchingNextPage: isFetchingMoreSalesOrganizationInfinite,
    hasNextPage: hasNextPageSalesOrganizationInfinite,
    fetchNextPage: fetchNextPageSalesOrganizationInfinite,
    isLoading: isLoadingSalesOrganizationInfinite,
  } = useSalesOrganizationInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
      company_code: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        console.log("@data", data);

        setTotalRowsSalesOrganizationInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.salesOrganizationStructures?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setSalesOrganizationInfiniteList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (salesOrganizationInfiniteList.length < totalRowsSalesOrganizationInfiniteList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingCurrenciesInfinite,
    isFetchingNextPage: isFetchingMoreCurrenciesInfinite,
    hasNextPage: hasNextPageCurrenciesInfinite,
    fetchNextPage: fetchNextPageCurrenciesInfinite,
    isLoading: isLoadingCurrenciesInfinite,
  } = useCurrenciesInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCurrenciesInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: `${element.currency} - ${element.currencyName}`,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCurrenciesInfiniteList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (currenciesInfiniteList.length < totalRowsCurrenciesInfiniteList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const onSubmit = (data: any) => {
    pricingStructure(data);
  };

  const onSubmitDraft = (data: any) => {
    pricingStructureDraft(data);
  };

  const handleSelectedField = () => {
    if (typeForm === "Add Products") {
    } else {
    }
  };

  const listFilterProducts = [
    {
      label: "All",
      list: [
        {
          label: "All",
          value: "All",
        },
      ],
    },
    {
      label: "By Category",
      list: [
        {
          label: "FG / Wafer",
          value: "FG / Wafer",
        },
        {
          label: "FG / Instant Noodle",
          value: "FG / Instant Noodle",
        },
        {
          label: "FG / Confection",
          value: "FG / Confection",
        },
      ],
    },
  ];

  const columnsProduct = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "hasVariant",
      dataIndex: "hasVariant",
    },
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Product Category",
      dataIndex: "productCategoryName",
    },
  ];

  const columnsCopyFromPriceStructure = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "name",
      dataIndex: "name",
    },
  ];

  const rowSelectionProduct = {
    selectedRowKeys: selectedRowKeysProduct,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysProduct(selectedRowKeys);
    },
  };

  const rowSelectionCopyFromPriceStructure = {
    selectedRowKeys: selectedRowKeysCopyFromPriceStructure,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysCopyFromPriceStructure(selectedRowKeys);
    },
  };

  return (
    <>
      {isLoadingPricingConfigInfinite ||
      isLoadingCurrenciesInfinite ||
      isLoadingChannelsMDM ||
      isFetchingChannelsMDM ||
      isLoadingProductList ||
      isFetchingProductList ||
      isLoadingSalesOrganizationInfinite ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Row gap="4px">
            <Text variant={"h4"}>Create Pricing Structure Proposal</Text>
          </Row>

          <Spacer size={12} />

          <Card padding="20px">
            <Row gap="16px" justifyContent="flex-end">
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button size="big" variant={"secondary"} onClick={handleSubmit(onSubmitDraft)}>
                Save as Draft
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </Row>
          </Card>

          <Spacer size={12} />

          <Card padding="20px">
            <Text color={"blue.dark"} variant={"headingMedium"}>
              Pricing Structure
            </Text>

            <Spacer size={12} />

            <Col width="100%" gap="20px">
              <Row width="100%" gap="20px" noWrap>
                <Col width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter pricing config.",
                      },
                    }}
                    name="pricing_config"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Price Structure Config
                          <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          error={error?.message}
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingPricingConfigInfinite}
                          isLoadingMore={isFetchingMorePricingConfigInfinite}
                          fetchMore={() => {
                            if (hasNextPagePricingConfigInfinite) {
                              fetchNextPagePricingConfigInfinite();
                            }
                          }}
                          items={
                            isFetchingPricingConfigInfinite && !isFetchingMorePricingConfigInfinite
                              ? []
                              : pricingConfigInfiniteList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchPricingConfigInfinite(value);
                          }}
                        />
                      </>
                    )}
                  />
                </Col>
                <Spacer size={10} />

                <Col width="100%">
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter currency.",
                      },
                    }}
                    name="currency"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Currency
                          <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          error={error?.message}
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingCurrenciesInfinite}
                          isLoadingMore={isFetchingMoreCurrenciesInfinite}
                          fetchMore={() => {
                            if (hasNextPageCurrenciesInfinite) {
                              fetchNextPageCurrenciesInfinite();
                            }
                          }}
                          items={
                            isFetchingCurrenciesInfinite && !isFetchingCurrenciesInfinite
                              ? []
                              : currenciesInfiniteList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchCurrenciesInfinite(value);
                          }}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>

              <Row width="100%" gap="20px" noWrap>
                <Col width={"100%"}>
                  <Controller
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Manage By.",
                      },
                    }}
                    name="manage_by"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Manage By
                          <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          error={error?.message}
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingSalesOrganizationInfinite}
                          isLoadingMore={isFetchingMoreSalesOrganizationInfinite}
                          fetchMore={() => {
                            if (hasNextPageSalesOrganizationInfinite) {
                              fetchNextPageSalesOrganizationInfinite();
                            }
                          }}
                          items={
                            isFetchingSalesOrganizationInfinite &&
                            !isFetchingMoreSalesOrganizationInfinite
                              ? []
                              : salesOrganizationInfiniteList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchSalesOrganizationInfinite(value);
                          }}
                        />
                      </>
                    )}
                  />
                </Col>
                <Spacer size={10} />

                <Col width="100%">
                  <Controller
                    control={control}
                    name="distribution_channel"
                    rules={{
                      required: {
                        value: true,
                        message: "Please enter Distribution Channel.",
                      },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => {
                      return (
                        <DropdownMenuOptionCustome
                          label="Distribution Channel"
                          actionLabel="Add New Distribution Channel"
                          isShowActionLabel
                          handleClickActionLabel={() => window.open("/channel")}
                          isAllowClear
                          required
                          error={error?.message}
                          handleChangeValue={(value: string[]) => onChange(value)}
                          valueSelectedItems={value || []}
                          listItems={channelsMDMData?.rows?.map(
                            ({
                              name,
                              salesChannelId,
                            }: {
                              name: string;
                              salesChannelId: string;
                            }) => {
                              return { value: salesChannelId, label: name };
                            }
                          )}
                        />
                      );
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Card>

          <Spacer size={12} />

          <Card padding="20px">
            <Text color={"blue.dark"} variant={"headingMedium"}>
              Products
            </Text>

            <Spacer size={12} />

            <Col width="100%" gap="20px">
              <Row justifyContent="space-between" alignItems="center">
                <Col>
                  <Search
                    width="450px"
                    placeholder="Search Products"
                    onChange={(e: any) => setSearchProduct(e.target.value)}
                  />
                </Col>

                <Col>
                  <Row gap="14px" justifyContent="space-between" alignItems="center">
                    <Col>
                      <Button
                        size="big"
                        variant={"tertiary"}
                        onClick={() =>
                          setModal({ open: true, typeForm: "Copy From Price Structure", data: {} })
                        }
                      >
                        <ICCopy /> Copy From Price Stucture Existing
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        size="big"
                        variant={"tertiary"}
                        onClick={() => setModal({ open: true, typeForm: "Add Products", data: {} })}
                      >
                        <ICPlus /> Add Product
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Card>
        </Col>
      )}

      <Modal
        width={"80%"}
        visible={open}
        onCancel={() => {
          setSearchProduct("");
          setModal({ ...modal, open: false });
        }}
        title={typeForm}
        centered
        afterClose={() => {
          setSearchProduct("");
        }}
        closable={true}
        footer={
          <div
            style={{
              display: "flex",
              marginBottom: "12px",
              marginRight: "12px",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <Button
              onClick={() => {
                setSearchProduct("");
                setModal({ ...modal, open: false });
              }}
              variant="tertiary"
              size="big"
            >
              Cancel
            </Button>
            <Button onClick={handleSelectedField} variant="primary" size="big">
              {typeForm === "Add Products" ? "Add" : "Copy"}
            </Button>
          </div>
        }
        content={
          typeForm === "Add Products" ? (
            <>
              <Spacer size={20} />
              <Row alignItems="flex-end" justifyContent="space-between">
                <Search
                  width="380px"
                  placeholder="Search Product, Product Category, Variant"
                  onChange={(e: any) => setSearchProduct(e.target.value)}
                />
                <DropdownMenuOptionGroup
                  label="Filter"
                  handleChangeValue={(e: any) => setSelectedFilter(e)}
                  isShowClearFilter
                  listItems={listFilterProducts}
                />
              </Row>
              <Spacer size={10} />
              <Table
                loading={isLoadingProductList || isFetchingProductList}
                columns={columnsProduct.filter(
                  (filtering) =>
                    filtering.dataIndex !== "id" &&
                    filtering.dataIndex !== "key" &&
                    filtering.dataIndex !== "hasVariant" &&
                    filtering.dataIndex !== "status"
                )}
                data={productListData?.data}
                rowSelection={rowSelectionProduct}
              />
              <Pagination pagination={paginationProducts} />
              <Spacer size={14} />
            </>
          ) : (
            <>
              <Spacer size={20} />
              <Row alignItems="flex-end" justifyContent="space-between">
                <Search
                  width="380px"
                  placeholder="Search Product Name, Variant"
                  onChange={(e: any) => setSearchProduct(e.target.value)}
                />
              </Row>
              <Spacer size={10} />
              <Table
                columns={columnsCopyFromPriceStructure.filter(
                  (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                )}
                data={[]}
                rowSelection={rowSelectionCopyFromPriceStructure}
              />
              <Pagination pagination={paginateCopyFromPriceStructure} />
              <Spacer size={14} />
            </>
          )
        }
      />
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default CreatePricingStructure;
