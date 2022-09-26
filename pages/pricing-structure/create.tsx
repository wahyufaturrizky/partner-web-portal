import usePagination from "@lucasmogari/react-pagination";
import { useCurrenciesInfiniteLists } from "hooks/mdm/country-structure/useCurrencyMDM";
import { useProductList } from "hooks/mdm/product-list/useProductList";
import {
  useCreatePricingStructureDraftList,
  useCreatePricingStructureList,
  useGroupBuyingLists,
  usePricingConfigInfiniteLists,
  usePricingStructureLists,
} from "hooks/pricing-structure/usePricingStructure";
import {
  useSalesOrganizationHirarcy,
  useSalesOrganizationInfiniteLists,
} from "hooks/sales-organization/useSalesOrganization";
import useDebounce from "lib/useDebounce";
import moment from "moment";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  Dropdown,
  DropdownMenuOptionCustome,
  DropdownMenuOptionGroup,
  EmptyState,
  FormInput,
  FormSelect,
  Input,
  Modal,
  Pagination,
  Progress,
  Row,
  Search,
  Spacer,
  Switch,
  Table,
  Text,
  Tooltip,
  Spin,
} from "pink-lava-ui";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";
import { colors } from "utils/color";
import { ICCopy, ICInfo, ICPlus } from "../../assets";
import ArrowLeft from "../../assets/icons/arrow-left.svg";

const CreatePricingStructure: any = () => {
  const paginationProducts = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const paginationProductsSelected = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const paginationProductActive = usePagination({
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
  const [pricingConfigInfiniteList, setPricingConfigInfiniteList] = useState<any>([]);
  const [searchPricingConfigInfinite, setSearchPricingConfigInfinite] = useState("");

  const [searchProduct, setSearchProduct] = useState("");
  const [searchRegion, setSearchRegion] = useState("");

  const [totalRowsCurrenciesInfiniteList, setTotalRowsCurrenciesInfiniteList] = useState(0);
  const [currenciesInfiniteList, setCurrenciesInfiniteList] = useState<any[]>([]);
  const [searchCurrenciesInfinite, setSearchCurrenciesInfinite] = useState("");

  const [totalRowsSalesOrganizationInfiniteList, setTotalRowsSalesOrganizationInfiniteList] =
    useState(0);
  const [salesOrganizationInfiniteList, setSalesOrganizationInfiniteList] = useState<any[]>([]);
  const [searchSalesOrganizationInfinite, setSearchSalesOrganizationInfinite] = useState("");

  const [selectedFilter, setSelectedFilter] = useState([]);

  const [selectedRowKeysProduct, setSelectedRowKeysProduct] = useState([]);
  const [selectedRowKeysProductsSelected, setSelectedRowKeysProductsSelected] = useState([]);
  const [selectedRowKeysRegionSelected, setSelectedRowKeysRegionSelected] = useState([]);
  const [selectedRowKeysCopyFromPriceStructure, setSelectedRowKeysCopyFromPriceStructure] =
    useState([]);

  const [selectedRowTableProductSelected, setSelectedRowTableProductSelected] = useState([]);

  const [productsSelected, setProductsSelected] = useState<any[]>([]);
  const [regionSelected, setRegionSelected] = useState<any[]>([]);

  const [manageByZone, setManageByZone] = useState<any>({
    isShow: false,
    data: null,
  });

  const [percent, setPercent] = useState(0);

  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    register,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      pricing_config: "",
      currency: "",
      manage_by: "",
      distribution_channel: null,
      product_selected: [
        {
          distribution_channel: [
            {
              companyId: "",
              createdAt: "",
              deletedAt: "",
              deletedBy: "",
              modifiedAt: "",
              modifiedBy: "",
              name: "",
              manage_by_zone: false,
              manage_by_zone_detail: {
                zone_type: "",
                internal_region: "",
                region_selected: [
                  {
                    distribution_channel: [
                      {
                        companyId: "",
                        createdAt: "",
                        deletedAt: "",
                        deletedBy: "",
                        modifiedAt: "",
                        modifiedBy: "",
                        name: "",
                        manage_by_zone: false,
                        manage_by_zone_detail: {
                          zone_type: "",
                          internal_region: "",
                          region_selected: [],
                        },
                        is_reference: false,
                        margin_type: "",
                        margin_value: "",
                        cost: "",
                        salesChannelId: "",
                        createdBy: 0,
                        currency: null,
                        level: [
                          {
                            buyingPrice: 0,
                            priceStructureId: 0,
                            groupBuyingPrice: null,
                            id: null,
                            index: null,
                            level: null,
                            nameLevel: "",
                            cost: "",
                            margin_value: "",
                            margin_type: "",
                            is_reference: false,
                          },
                        ],
                      },
                    ],
                    hasVariant: false,
                    id: "",
                    key: "",
                    name: "",
                    productCategoryName: "",
                    status: "",
                  },
                ],
              },
              is_reference: false,
              margin_type: "",
              margin_value: "",
              cost: "",
              salesChannelId: "",
              createdBy: 0,
              currency: null,
              level: [
                {
                  buyingPrice: 0,
                  priceStructureId: 0,
                  groupBuyingPrice: null,
                  id: null,
                  index: null,
                  level: null,
                  nameLevel: "",
                  cost: "",
                  margin_value: "",
                  margin_type: "",
                  is_reference: false,
                },
              ],
            },
          ],
          hasVariant: false,
          id: "",
          key: "",
          name: "",
          productCategoryName: "",
          status: "",
        },
      ],
    },
  });

  const dataWatchManageByZone = useWatch({
    control: control,
    name: `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}`,
  });

  const dataWatchManageByZoneForProductSelected = useWatch({
    control: control,
    name: `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}`,
  });

  const dataWatchManageBy = useWatch({
    control: control,
    name: "manage_by",
  });

  const { mutate: pricingStructure, isLoading: isLoadingPricingStructure } =
    useCreatePricingStructureList({
      options: {
        onSuccess: () => {
          router.back();
        },
      },
    });

  const { mutate: pricingStructureDraft, isLoading: isLoadingPricingStructureDraft } =
    useCreatePricingStructureDraftList({
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
      searchRegion ||
      searchCurrenciesInfinite,
    1000
  );

  const { data: dataGroupBuying, isLoading: isLoadingGroupBuying } = useGroupBuyingLists({
    query: {
      limit: 1000000,
    },
    options: {
      onSuccess: (data: any) => {},
    },
  });

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
              ...element,
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
    isLoading: isLoadingSalesOrganizationHirarcy,
    data: dataSalesOrganizationHirarcy,
    isFetching: isFetchingSalesOrganizationHirarcy,
  } = useSalesOrganizationHirarcy({
    structure_id: dataWatchManageByZone?.manage_by_zone_detail?.zone_type,
    options: {
      onSuccess: () => {},
      select: (data: any) =>
        data.map((dataHirarcy: any) => ({
          ...dataHirarcy,
          key: dataHirarcy.id,
        })),
      enabled:
        !!dataWatchManageByZone?.manage_by_zone &&
        !!dataWatchManageByZone?.manage_by_zone_detail?.zone_type,
    },
    query: {
      limit: 10000,
    },
  });

  const {
    isLoading: isLoadingSalesOrganizationHirarcyFromManageBy,
    data: dataSalesOrganizationHirarcyFromManageBy,
    isFetching: isFetchingSalesOrganizationHirarcyFromManageBy,
  } = useSalesOrganizationHirarcy({
    structure_id: dataWatchManageBy,
    options: {
      onSuccess: () => {},
      select: (data: any) =>
        data.map((dataHirarcy: any) => ({
          ...dataHirarcy,
          key: dataHirarcy.id,
        })),
      enabled: !!dataWatchManageBy,
    },
    query: {
      limit: 10000,
    },
  });

  const { data: pricingStructureLists, isLoading: isLoadingPricingStructureList } =
    usePricingStructureLists({
      options: {
        onSuccess: (data: any) => {
          paginationProductActive.setTotalItems(data.totalRow);
        },
        select: (data: any) =>
          data.rows.map((subData: any) => ({
            ...subData,
            key: subData.id,
            name: subData.proposalNumber,
          })),
      },
      query: {
        search: debounceFetch,
        page: paginationProductActive.page,
        limit: paginationProductActive.itemsPerPage,
        status: "ACTIVE",
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
        setTotalRowsSalesOrganizationInfiniteList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.salesOrganizationStructures?.map((element: any) => {
            return {
              ...element,
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
              ...element,
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

  const onSubmitDraft = (dataDraft: any) =>
    pricingStructureDraft({
      price_structure_config_id: dataDraft.pricing_config,
      currency: dataDraft.currency,
      managed_by: dataDraft.manage_by,
      active_date: moment().format("YYYY-MM-DD"),
      distributions: dataDraft.distribution_channel,
      products: dataDraft.product_selected.map((mapping: any) => mapping.id),
    });

  useEffect(
    () => {
      const checkIfError = () => {
        setModal({ ...modal, open: false });
      };

      if (Object.keys(errors).length) {
        checkIfError();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errors]
  );

  const handleSelectedField = (data: any) => {
    setModal({ ...modal, open: false });
    if (typeForm === "Add Products") {
      let tempProductsSelected: any = [];

      productListData?.data?.map((field: any) => {
        if (rowSelectionProduct.selectedRowKeys.includes(field.key as never)) {
          tempProductsSelected.push(field);

          const rawValue = tempProductsSelected.map((subDataProdSelected: any) => ({
            ...subDataProdSelected,
            distribution_channel: dataSalesOrganizationHirarcyFromManageBy
              ?.filter((filtering: any) => data.distribution_channel.includes(filtering.id))
              .map((distribution_channel_mapped: any) => ({
                ...distribution_channel_mapped,
                level: pricingConfigInfiniteList
                  .find((finding: any) => finding.id === data.pricing_config)
                  .priceStructureLevelings.map((subLevel: any) => ({
                    ...subLevel,
                    nameLevel: dataGroupBuying.rows[subLevel.buyingPrice].name,
                  })),
                currency: currenciesInfiniteList.find(
                  (finding: any) => finding.id === data.currency
                ),
                manage_by: salesOrganizationInfiniteList.find(
                  (finding: any) => finding.id === data.manage_by
                ),
              })),
          }));

          setValue("product_selected", rawValue);

          setProductsSelected(rawValue);

          setSearchProduct("");
        } else {
          const tempRawValue = selectedRowTableProductSelected.map((subDataProdSelected: any) => ({
            ...subDataProdSelected,
            distribution_channel: dataSalesOrganizationHirarcyFromManageBy
              ?.filter((filtering: any) => data.distribution_channel.includes(filtering.id))
              .map((distribution_channel_mapped: any) => ({
                ...distribution_channel_mapped,
                level: pricingConfigInfiniteList
                  .find((finding: any) => finding.id === data.pricing_config)
                  .priceStructureLevelings.map((subLevel: any) => ({
                    ...subLevel,
                    nameLevel: dataGroupBuying.rows[subLevel.buyingPrice].name,
                  })),
                currency: currenciesInfiniteList.find(
                  (finding: any) => finding.id === data.currency
                ),
                manage_by: salesOrganizationInfiniteList.find(
                  (finding: any) => finding.id === data.manage_by
                ),
              })),
          }));

          setValue("product_selected", tempRawValue);

          setProductsSelected(tempRawValue);

          setSearchProduct("");
        }
      });
    } else {
      let tempProductsSelected: any = [];

      pricingStructureLists?.map((field: any) => {
        if (rowSelectionCopyFromPriceStructure.selectedRowKeys.includes(field.key as never)) {
          tempProductsSelected.push(field);

          const rawValue = tempProductsSelected.map((subDataProdSelected: any) => ({
            ...subDataProdSelected,
            distribution_channel: dataSalesOrganizationHirarcyFromManageBy
              ?.filter((filtering: any) => data.distribution_channel.includes(filtering.id))
              .map((distribution_channel_mapped: any) => ({
                ...distribution_channel_mapped,
                level: pricingConfigInfiniteList
                  .find((finding: any) => finding.id === data.pricing_config)
                  .priceStructureLevelings.map((subLevel: any) => ({
                    ...subLevel,
                    nameLevel: dataGroupBuying.rows[subLevel.buyingPrice].name,
                  })),
                currency: currenciesInfiniteList.find(
                  (finding: any) => finding.id === data.currency
                ),
                manage_by: salesOrganizationInfiniteList.find(
                  (finding: any) => finding.id === data.manage_by
                ),
              })),
          }));

          setValue("product_selected", rawValue);

          setProductsSelected(rawValue);

          setSearchProduct("");
        } else {
          const tempRawValue = selectedRowTableProductSelected.map((subDataProdSelected: any) => ({
            ...subDataProdSelected,
            distribution_channel: dataSalesOrganizationHirarcyFromManageBy
              ?.filter((filtering: any) => data.distribution_channel.includes(filtering.id))
              .map((distribution_channel_mapped: any) => ({
                ...distribution_channel_mapped,
                level: pricingConfigInfiniteList
                  .find((finding: any) => finding.id === data.pricing_config)
                  .priceStructureLevelings.map((subLevel: any) => ({
                    ...subLevel,
                    nameLevel: dataGroupBuying.rows[subLevel.buyingPrice].name,
                  })),
                currency: currenciesInfiniteList.find(
                  (finding: any) => finding.id === data.currency
                ),
                manage_by: salesOrganizationInfiniteList.find(
                  (finding: any) => finding.id === data.manage_by
                ),
              })),
          }));

          setValue("product_selected", tempRawValue);

          setProductsSelected(tempRawValue);

          setSearchProduct("");
        }
      });
    }
  };

  useEffect(() => {
    const handleSelectedRegionField = () => {
      let tempRegionSelected: any = [];

      dataSalesOrganizationHirarcy?.map((field: any) => {
        if (
          dataWatchManageByZone?.manage_by_zone_detail?.internal_region.includes(field.id as never)
        ) {
          tempRegionSelected.push(field);

          const rawValue = tempRegionSelected.map((subDataRegionSelected: any) => ({
            ...subDataRegionSelected,
            distribution_channel: dataWatchManageByZoneForProductSelected?.distribution_channel,
          }));

          setValue(
            `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected`,
            rawValue as never
          );

          setRegionSelected(rawValue);

          setSearchRegion("");
        }
      });
    };

    if (dataWatchManageByZone?.manage_by_zone && dataWatchManageByZone?.manage_by_zone_detail) {
      handleSelectedRegionField();
    }
  }, [
    dataWatchManageByZone?.manage_by_zone,
    dataSalesOrganizationHirarcy,
    dataWatchManageByZone?.manage_by_zone_detail.internal_region,
  ]);

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
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const columnsProductsSelected = [
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

  const columnsRegionSelected = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "Region",
      dataIndex: "name",
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
      title: "activeDate",
      dataIndex: "activeDate",
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "name",
      dataIndex: "proposalNumber",
    },
  ];

  const rowSelectionProduct = {
    selectedRowKeys: selectedRowKeysProduct,
    onChange: (selectedRowKeys: any, rowSelected: any) => {
      setSelectedRowKeysProduct(selectedRowKeys);
      setSelectedRowTableProductSelected(rowSelected);
    },
  };

  const rowSelectionProductsSelected = {
    selectedRowKeys: selectedRowKeysProductsSelected,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysProductsSelected(selectedRowKeys);
    },
  };

  const rowSelectionRegionSelected = {
    selectedRowKeys: selectedRowKeysRegionSelected,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysRegionSelected(selectedRowKeys);
    },
  };

  const rowSelectionCopyFromPriceStructure = {
    selectedRowKeys: selectedRowKeysCopyFromPriceStructure,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeysCopyFromPriceStructure(selectedRowKeys);
    },
  };

  const handleRemoveAllSelectedProduct = () => {
    let tempProductsSelected: any = [];

    tempProductsSelected = productsSelected?.filter(
      (field) => !rowSelectionProductsSelected.selectedRowKeys.includes(field.key as never)
    );

    rowSelectionProductsSelected.onChange([]);

    rowSelectionProduct.onChange(
      tempProductsSelected.map((data: any) => data.key),
      tempProductsSelected
    );

    setValue("product_selected", tempProductsSelected);

    setProductsSelected(tempProductsSelected);
  };

  const handleRemoveAllSelectedRegion = () => {
    let tempRegionSelected: any = [];

    tempRegionSelected = regionSelected?.filter(
      (field) => !rowSelectionRegionSelected.selectedRowKeys.includes(field.key as never)
    );

    rowSelectionRegionSelected.onChange([]);

    setValue(
      `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected`,
      tempRegionSelected as never
    );

    setRegionSelected(tempRegionSelected);
  };

  useEffect(() => {
    const increaseProgress = () => {
      let newPercent = percent + 16.666666666666667;

      if (newPercent > 100) {
        newPercent = 100;
      }

      setPercent(parseInt(String(newPercent)));
    };
    increaseProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingCurrenciesInfinite,
    isLoadingGroupBuying,
    isLoadingPricingConfigInfinite,
    isLoadingProductList,
    isLoadingSalesOrganizationInfinite,
  ]);

  const isEmpty = productsSelected.length === 0;

  const isEmptyRegion = regionSelected.length === 0;

  if (manageByZone.isShow) {
    return (
      <>
        {isLoadingPricingConfigInfinite ||
        isLoadingCurrenciesInfinite ||
        isLoadingPricingStructureList ||
        isLoadingGroupBuying ||
        isLoadingProductList ||
        isLoadingSalesOrganizationInfinite ? (
          <Center>
            <Progress type="circle" percent={percent} />
          </Center>
        ) : (
          <Col>
            <Row gap="4px" alignItems="center">
              <ArrowLeft
                style={{ cursor: "pointer" }}
                onClick={() => setManageByZone({ isShow: false, data: null })}
              />
              <Text variant={"h4"}>{manageByZone?.data?.dataDistChannel?.name}</Text>
            </Row>

            <Spacer size={12} />

            <Card padding="20px">
              <Row gap="16px" alignItems="center" justifyContent="space-between">
                <Text>{manageByZone?.data?.recordExpandedRowRenderProductSelected?.name}</Text>
                <Button
                  disabled={isLoadingPricingStructureDraft}
                  size="big"
                  variant={"primary"}
                  onClick={handleSubmit(onSubmitDraft)}
                >
                  {isLoadingPricingStructureDraft ? "Loading..." : "Save"}
                </Button>
              </Row>
            </Card>

            <Spacer size={12} />

            <Card margin="20px" padding="20px">
              <Text color={"blue.dark"} variant={"headingMedium"}>
                Default
              </Text>

              <Spacer size={8} />

              <Text color={"blue.dark"} variant={"headingRegular"}>
                Total Cost
              </Text>

              <Spacer size={8} />

              <Controller
                control={control}
                name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.is_reference`}
                render={({ field: { onChange, value } }) => (
                  <Row alignItems="center" gap="12px">
                    <Switch defaultChecked={value || false} checked={value} onChange={onChange} />
                    <Text>is Reference</Text>
                    <Tooltip
                      title="Data create from manage price structure config"
                      color={"#F4FBFC"}
                    >
                      <ICInfo />
                    </Tooltip>
                  </Row>
                )}
              />

              <Spacer size={24} />

              <Row width="100%" alignItems="center" gap="12px">
                <Col width="40%">
                  <Input
                    type="number"
                    width="100%"
                    label="Cost"
                    defaultValue={getValues(
                      `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.cost`
                    )}
                    height="48px"
                    error={
                      errors?.product_selected?.[
                        manageByZone?.data?.indexExpandedRowRenderProductSelected
                      ]?.distribution_channel?.[manageByZone?.data?.indexDistChannel].cost?.message
                    }
                    required
                    placeholder={`e.g ${manageByZone?.data?.dataDistChannel.currency.currency} 2.000,00`}
                    {...register(
                      `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.cost`
                    )}
                  />
                </Col>

                <Col width="20%">
                  <Controller
                    control={control}
                    name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.margin_type`}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Dropdown
                        error={error?.message}
                        defaultValue={value}
                        label="Margin Type"
                        width="100%"
                        noSearch
                        items={[
                          { id: "Percent", value: "Percent" },
                          { id: "Fix Amount", value: "Fix Amount" },
                        ]}
                        handleChange={(value: any) => {
                          onChange(value);
                        }}
                      />
                    )}
                  />
                </Col>

                <Col width="30%">
                  <Controller
                    control={control}
                    name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.margin_value`}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Label>Margin Value</Label>
                        <Spacer size={3} />
                        <ComponentDistributionChannelMarginType
                          control={control}
                          indexExpandedRowRenderProductSelected={
                            manageByZone?.data?.indexExpandedRowRenderProductSelected
                          }
                          indexDistChannel={manageByZone?.data?.indexDistChannel}
                          onChange={onChange}
                          value={value}
                          status={
                            errors?.product_selected?.[
                              manageByZone?.data?.indexExpandedRowRenderProductSelected
                            ]?.distribution_channel?.[manageByZone?.data?.indexDistChannel]
                              ?.margin_value && "error"
                          }
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>

              <Spacer size={24} />

              {manageByZone?.data?.dataDistChannel.level.map((subLevel: any, indexLevel: any) => {
                return (
                  <Col key={indexLevel}>
                    <Text color={"blue.dark"} variant={"headingRegular"}>
                      {`Level ${indexLevel + 1}`}
                    </Text>

                    <Spacer size={16} />

                    <Controller
                      control={control}
                      name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.level.${indexLevel}.is_reference`}
                      render={({ field: { onChange, value } }) => (
                        <Row alignItems="center" gap="12px">
                          <Switch
                            defaultChecked={value || false}
                            checked={value}
                            onChange={onChange}
                          />
                          <Text>is Reference</Text>
                          <Tooltip
                            title="Data create from manage price structure config"
                            color={"#F4FBFC"}
                          >
                            <ICInfo />
                          </Tooltip>
                        </Row>
                      )}
                    />

                    <Spacer size={16} />

                    <Row width="100%" alignItems="center" gap="12px">
                      <Col width="40%">
                        <Input
                          width="100%"
                          label={subLevel.nameLevel}
                          defaultValue={getValues(
                            `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.level.${indexLevel}.cost`
                          )}
                          height="48px"
                          error={
                            errors?.product_selected?.[
                              manageByZone?.data?.indexExpandedRowRenderProductSelected
                            ]?.distribution_channel?.[manageByZone?.data?.indexDistChannel]
                              ?.level?.[indexLevel]?.cost?.message
                          }
                          required
                          placeholder={`e.g ${manageByZone?.data?.dataDistChannel.currency.currency} 2.000,00`}
                          {...register(
                            `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.level.${indexLevel}.cost`
                          )}
                        />
                      </Col>

                      <Col width="20%">
                        <Controller
                          control={control}
                          name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.level.${indexLevel}.margin_type`}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Dropdown
                              error={error?.message}
                              defaultValue={value}
                              label="Margin Type"
                              width="100%"
                              noSearch
                              items={[
                                { id: "Percent", value: "Percent" },
                                { id: "Fix Amount", value: "Fix Amount" },
                              ]}
                              handleChange={(value: any) => {
                                onChange(value);
                              }}
                            />
                          )}
                        />
                      </Col>

                      <Col width="30%">
                        <Controller
                          control={control}
                          name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.level.${indexLevel}.margin_value`}
                          render={({ field: { onChange, value } }) => (
                            <>
                              <Label>Margin Value</Label>
                              <Spacer size={3} />
                              <ComponentLevelMarginType
                                control={control}
                                indexExpandedRowRenderProductSelected={
                                  manageByZone?.data?.indexExpandedRowRenderProductSelected
                                }
                                indexDistChannel={manageByZone?.data?.indexDistChannel}
                                indexLevel={indexLevel}
                                onChange={onChange}
                                value={value}
                                status={
                                  errors?.product_selected?.[
                                    manageByZone?.data?.indexExpandedRowRenderProductSelected
                                  ]?.distribution_channel?.[manageByZone?.data?.indexDistChannel]
                                    .level?.[indexLevel]?.margin_value?.message && "error"
                                }
                              />
                            </>
                          )}
                        />
                      </Col>
                    </Row>
                  </Col>
                );
              })}
            </Card>

            <Spacer size={12} />

            <Card padding="20px">
              <Text color={"blue.dark"} variant={"headingMedium"}>
                Zone
              </Text>

              <Spacer size={12} />

              <Col width="100%" gap="20px">
                <Row width="100%" gap="20px" noWrap>
                  <Col width={"100%"}>
                    <Controller
                      control={control}
                      name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.zone_type`}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Row alignItems="center" gap="8px">
                            <Col>
                              <Label>Zone Type</Label>
                            </Col>
                            <Col>
                              <Tooltip
                                title="Data create from manage price structure config"
                                color={"#F4FBFC"}
                              >
                                <ICInfo />
                              </Tooltip>
                            </Col>
                          </Row>
                          <Spacer size={3} />
                          <FormSelect
                            defaultValue={value}
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
                    {isLoadingSalesOrganizationHirarcy || isFetchingSalesOrganizationHirarcy ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.internal_region`}
                        render={({ field: { onChange, value }, fieldState: { error } }) => {
                          return (
                            <DropdownMenuOptionCustome
                              label="Internal Region"
                              isAllowClear
                              required
                              error={error?.message}
                              handleChangeValue={(value: string[]) => onChange(value)}
                              valueSelectedItems={value || []}
                              listItems={dataSalesOrganizationHirarcy?.map((data: any) => ({
                                value: data.id,
                                label: data.name,
                              }))}
                            />
                          );
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Card>

            <Spacer size={12} />

            <Card padding="20px">
              <Col width="100%" gap="20px">
                <Row alignItems="center">
                  <Col>
                    <Search
                      width="450px"
                      placeholder="Search Region"
                      onChange={(e: any) => setSearchRegion(e.target.value)}
                    />
                  </Col>
                </Row>

                {isEmptyRegion ? (
                  <EmptyState
                    image={"/icons/empty-state.svg"}
                    title={"No Data"}
                    subtitle={`Fill zone type and internal region`}
                    height={400}
                  />
                ) : (
                  <>
                    <Table
                      title={
                        rowSelectionRegionSelected.selectedRowKeys.length
                          ? () => (
                              <Row gap="8px" alignItems="center" nowrap>
                                <Col>
                                  <Text>{`${rowSelectionRegionSelected.selectedRowKeys.length}/${productsSelected.length} Selected Products`}</Text>
                                </Col>
                                |
                                <Col>
                                  <Text
                                    clickable
                                    onClick={() => handleRemoveAllSelectedRegion()}
                                    color="pink.regular"
                                  >
                                    Remove
                                  </Text>
                                </Col>
                              </Row>
                            )
                          : null
                      }
                      columns={columnsRegionSelected.filter(
                        (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                      )}
                      data={regionSelected}
                      rowSelection={rowSelectionRegionSelected}
                      expandable={{
                        expandedRowRender: (
                          recordExpandedRowRenderRegionSelected: any,
                          indexExpandedRowRenderRegionSelected: any
                        ) => {
                          return (
                            <>
                              {recordExpandedRowRenderRegionSelected.distribution_channel.map(
                                (dataDistChannel: any, indexDistChannel: any) => {
                                  return (
                                    <Card key={indexDistChannel} margin="20px" padding="20px">
                                      <Text color={"blue.dark"} variant={"headingMedium"}>
                                        {dataDistChannel.name}
                                      </Text>

                                      <Spacer size={8} />

                                      <Divider />
                                      <Spacer size={24} />

                                      <Text color={"blue.dark"} variant={"headingRegular"}>
                                        Total Cost
                                      </Text>

                                      <Spacer size={8} />

                                      <Controller
                                        control={control}
                                        name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.is_reference`}
                                        render={({ field: { onChange, value } }) => (
                                          <Row alignItems="center" gap="12px">
                                            <Switch
                                              defaultChecked={value || false}
                                              checked={value}
                                              onChange={onChange}
                                            />
                                            <Text>is Reference</Text>
                                            <Tooltip
                                              title="Data create from manage price structure config"
                                              color={"#F4FBFC"}
                                            >
                                              <ICInfo />
                                            </Tooltip>
                                          </Row>
                                        )}
                                      />

                                      <Spacer size={24} />

                                      <Row width="100%" alignItems="center" gap="12px">
                                        <Col width="40%">
                                          <Input
                                            type="number"
                                            width="100%"
                                            label="Cost"
                                            defaultValue={getValues(
                                              `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.cost`
                                            )}
                                            height="48px"
                                            error={
                                              errors?.product_selected?.[
                                                manageByZone.data
                                                  .indexExpandedRowRenderProductSelected
                                              ]?.distribution_channel?.[
                                                manageByZone.data.indexDistChannel
                                              ]?.manage_by_zone_detail?.region_selected?.[
                                                indexExpandedRowRenderRegionSelected
                                              ].distribution_channel?.[indexDistChannel].cost
                                                ?.message
                                            }
                                            required
                                            placeholder={`e.g ${dataDistChannel.currency.currency} 2.000,00`}
                                            {...register(
                                              `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.cost`
                                            )}
                                          />
                                        </Col>

                                        <Col width="20%">
                                          <Controller
                                            control={control}
                                            name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.margin_type`}
                                            render={({
                                              field: { onChange, value },
                                              fieldState: { error },
                                            }) => (
                                              <Dropdown
                                                error={error?.message}
                                                defaultValue={value}
                                                label="Margin Type"
                                                width="100%"
                                                noSearch
                                                items={[
                                                  { id: "Percent", value: "Percent" },
                                                  { id: "Fix Amount", value: "Fix Amount" },
                                                ]}
                                                handleChange={(value: any) => {
                                                  onChange(value);
                                                }}
                                              />
                                            )}
                                          />
                                        </Col>

                                        <Col width="30%">
                                          <Controller
                                            control={control}
                                            name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.margin_value`}
                                            render={({ field: { onChange, value } }) => (
                                              <>
                                                <Label>Margin Value</Label>
                                                <Spacer size={3} />
                                                <ComponentDistributionChannelMarginTypeManageByZone
                                                  control={control}
                                                  indexExpandedRowRenderProductSelected={
                                                    manageByZone.data
                                                      .indexExpandedRowRenderProductSelected
                                                  }
                                                  indexExpandedRowRenderRegionSelected={
                                                    indexExpandedRowRenderRegionSelected
                                                  }
                                                  indexDistChannelProduct={
                                                    manageByZone?.data?.indexDistChannel
                                                  }
                                                  indexDistChannel={indexDistChannel}
                                                  onChange={onChange}
                                                  value={value}
                                                  status={
                                                    errors?.product_selected?.[
                                                      manageByZone.data
                                                        .indexExpandedRowRenderProductSelected
                                                    ]?.distribution_channel?.[
                                                      manageByZone.data.indexDistChannel
                                                    ]?.manage_by_zone_detail?.region_selected?.[
                                                      indexExpandedRowRenderRegionSelected
                                                    ].distribution_channel?.[indexDistChannel]
                                                      .margin_value && "error"
                                                  }
                                                />
                                              </>
                                            )}
                                          />
                                        </Col>
                                      </Row>

                                      <Spacer size={24} />

                                      {dataDistChannel.level.map(
                                        (subLevel: any, indexLevel: any) => {
                                          return (
                                            <Col key={indexLevel}>
                                              <Text color={"blue.dark"} variant={"headingRegular"}>
                                                {`Level ${indexLevel + 1}`}
                                              </Text>

                                              <Spacer size={16} />

                                              <Controller
                                                control={control}
                                                name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.level.${indexLevel}.is_reference`}
                                                render={({ field: { onChange, value } }) => (
                                                  <Row alignItems="center" gap="12px">
                                                    <Switch
                                                      defaultChecked={value || false}
                                                      checked={value}
                                                      onChange={onChange}
                                                    />
                                                    <Text>is Reference</Text>
                                                    <Tooltip
                                                      title="Data create from manage price structure config"
                                                      color={"#F4FBFC"}
                                                    >
                                                      <ICInfo />
                                                    </Tooltip>
                                                  </Row>
                                                )}
                                              />

                                              <Spacer size={16} />

                                              <Row width="100%" alignItems="center" gap="12px">
                                                <Col width="40%">
                                                  <Input
                                                    width="100%"
                                                    label={subLevel.nameLevel}
                                                    defaultValue={getValues(
                                                      `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.level.${indexLevel}.cost`
                                                    )}
                                                    height="48px"
                                                    error={
                                                      errors?.product_selected?.[
                                                        manageByZone.data
                                                          .indexExpandedRowRenderProductSelected
                                                      ]?.distribution_channel?.[
                                                        manageByZone.data.indexDistChannel
                                                      ]?.manage_by_zone_detail?.region_selected?.[
                                                        indexExpandedRowRenderRegionSelected
                                                      ].distribution_channel?.[indexDistChannel]
                                                        .cost?.message
                                                    }
                                                    required
                                                    placeholder={`e.g ${dataDistChannel.currency.currency} 2.000,00`}
                                                    {...register(
                                                      `product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.level.${indexLevel}.cost`
                                                    )}
                                                  />
                                                </Col>

                                                <Col width="20%">
                                                  <Controller
                                                    control={control}
                                                    name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.level.${indexLevel}.margin_type`}
                                                    render={({
                                                      field: { onChange, value },
                                                      fieldState: { error },
                                                    }) => (
                                                      <Dropdown
                                                        error={error?.message}
                                                        defaultValue={value}
                                                        label="Margin Type"
                                                        width="100%"
                                                        noSearch
                                                        items={[
                                                          { id: "Percent", value: "Percent" },
                                                          { id: "Fix Amount", value: "Fix Amount" },
                                                        ]}
                                                        handleChange={(value: any) => {
                                                          onChange(value);
                                                        }}
                                                      />
                                                    )}
                                                  />
                                                </Col>

                                                <Col width="30%">
                                                  <Controller
                                                    control={control}
                                                    name={`product_selected.${manageByZone?.data?.indexExpandedRowRenderProductSelected}.distribution_channel.${manageByZone?.data?.indexDistChannel}.manage_by_zone_detail.region_selected.${indexExpandedRowRenderRegionSelected}.distribution_channel.${indexDistChannel}.level.${indexLevel}.margin_value`}
                                                    render={({ field: { onChange, value } }) => (
                                                      <>
                                                        <Label>Margin Value</Label>
                                                        <Spacer size={3} />
                                                        <ComponentLevelMarginTypeManageByZone
                                                          control={control}
                                                          indexExpandedRowRenderProductSelected={
                                                            manageByZone?.data
                                                              .indexExpandedRowRenderProductSelected
                                                          }
                                                          indexExpandedRowRenderRegionSelected={
                                                            indexExpandedRowRenderRegionSelected
                                                          }
                                                          indexDistChannelProduct={
                                                            manageByZone?.data.indexDistChannel
                                                          }
                                                          indexDistChannel={indexDistChannel}
                                                          indexLevel={indexLevel}
                                                          onChange={onChange}
                                                          value={value}
                                                          status={
                                                            errors?.product_selected?.[
                                                              manageByZone.data
                                                                .indexExpandedRowRenderProductSelected
                                                            ]?.distribution_channel?.[
                                                              manageByZone.data.indexDistChannel
                                                            ]?.manage_by_zone_detail
                                                              ?.region_selected?.[
                                                              indexExpandedRowRenderRegionSelected
                                                            ].distribution_channel?.[
                                                              indexDistChannel
                                                            ]?.margin_value?.message && "error"
                                                          }
                                                        />
                                                      </>
                                                    )}
                                                  />
                                                </Col>
                                              </Row>
                                            </Col>
                                          );
                                        }
                                      )}
                                    </Card>
                                  );
                                }
                              )}
                            </>
                          );
                        },
                      }}
                    />
                    <Pagination pagination={paginationProductsSelected} />
                  </>
                )}
              </Col>
            </Card>
          </Col>
        )}
      </>
    );
  } else {
    return (
      <>
        {isLoadingPricingConfigInfinite ||
        isLoadingCurrenciesInfinite ||
        isLoadingGroupBuying ||
        isLoadingPricingStructureList ||
        isLoadingProductList ||
        isLoadingSalesOrganizationInfinite ? (
          <Center>
            <Progress type="circle" percent={percent} />
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
                <Button
                  disabled={isLoadingPricingStructureDraft}
                  size="big"
                  variant={"secondary"}
                  onClick={handleSubmit(onSubmitDraft)}
                >
                  {isLoadingPricingStructureDraft ? "Loading..." : "Save as Draft"}
                </Button>
                <Button
                  disabled={isLoadingPricingStructure}
                  size="big"
                  variant={"primary"}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoadingPricingStructure ? "Loading..." : "Submit"}
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
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Row alignItems="center" gap="8px">
                            <Col>
                              <Label>
                                Price Structure Config
                                <span style={{ color: colors.red.regular }}>*</span>
                              </Label>
                            </Col>
                            <Col>
                              <Tooltip
                                title="Data create from manage price structure config"
                                color={"#F4FBFC"}
                              >
                                <ICInfo />
                              </Tooltip>
                            </Col>
                          </Row>
                          <Spacer size={3} />
                          <FormSelect
                            defaultValue={value}
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
                              isFetchingPricingConfigInfinite &&
                              !isFetchingMorePricingConfigInfinite
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
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Label>
                            Currency
                            <span style={{ color: colors.red.regular }}>*</span>
                          </Label>
                          <Spacer size={3} />
                          <FormSelect
                            defaultValue={value}
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
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                          <Label>
                            Manage By
                            <span style={{ color: colors.red.regular }}>*</span>
                          </Label>
                          <Spacer size={3} />
                          <FormSelect
                            defaultValue={value}
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
                    {isLoadingSalesOrganizationHirarcyFromManageBy ||
                    isFetchingSalesOrganizationHirarcyFromManageBy ? (
                      <Spin tip="Loading data..." />
                    ) : (
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
                              handleClickActionLabel={() => window.open("/sales-organization")}
                              isAllowClear
                              required
                              error={error?.message}
                              handleChangeValue={(value: string[]) => onChange(value)}
                              valueSelectedItems={value || []}
                              listItems={dataSalesOrganizationHirarcyFromManageBy?.map(
                                (data: any) => ({
                                  value: data.id,
                                  label: data.name,
                                })
                              )}
                            />
                          );
                        }}
                      />
                    )}
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
                            setModal({
                              open: true,
                              typeForm: "Copy From Price Structure",
                              data: {},
                            })
                          }
                        >
                          <ICCopy /> Copy From Price Stucture Existing
                        </Button>
                      </Col>

                      <Col>
                        <Button
                          size="big"
                          disabled={Object.keys(errors).length}
                          variant={"tertiary"}
                          onClick={() =>
                            setModal({ open: true, typeForm: "Add Products", data: {} })
                          }
                        >
                          <ICPlus /> Add Product
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {isEmpty ? (
                  <EmptyState
                    image={"/icons/empty-state.svg"}
                    title={"No Data"}
                    subtitle={`Press + add Product button to add Product List`}
                    height={400}
                  />
                ) : (
                  <>
                    <Table
                      title={
                        rowSelectionProductsSelected.selectedRowKeys.length
                          ? () => (
                              <Row gap="8px" alignItems="center" nowrap>
                                <Col>
                                  <Text>{`${rowSelectionProductsSelected.selectedRowKeys.length}/${productsSelected.length} Selected Products`}</Text>
                                </Col>
                                |
                                <Col>
                                  <Text
                                    clickable
                                    onClick={() => handleRemoveAllSelectedProduct()}
                                    color="pink.regular"
                                  >
                                    Remove
                                  </Text>
                                </Col>
                              </Row>
                            )
                          : null
                      }
                      loading={isLoadingProductList || isFetchingProductList}
                      columns={columnsProductsSelected.filter(
                        (filtering) =>
                          filtering.dataIndex !== "id" &&
                          filtering.dataIndex !== "key" &&
                          filtering.dataIndex !== "hasVariant" &&
                          filtering.dataIndex !== "productCategoryName" &&
                          filtering.dataIndex !== "status"
                      )}
                      data={productsSelected}
                      rowSelection={rowSelectionProductsSelected}
                      expandable={{
                        expandedRowRender: (
                          recordExpandedRowRenderProductSelected: any,
                          indexExpandedRowRenderProductSelected: any
                        ) => {
                          return (
                            <>
                              {recordExpandedRowRenderProductSelected.distribution_channel.map(
                                (dataDistChannel: any, indexDistChannel: any) => {
                                  return (
                                    <Card key={indexDistChannel} margin="20px" padding="20px">
                                      <Text color={"blue.dark"} variant={"headingMedium"}>
                                        {dataDistChannel.name}
                                      </Text>

                                      <Spacer size={8} />

                                      <Controller
                                        control={control}
                                        name={`product_selected.${indexExpandedRowRenderProductSelected}.distribution_channel.${indexDistChannel}.manage_by_zone`}
                                        render={({ field: { onChange, value } }) => {
                                          return (
                                            <Row alignItems="center" gap="12px">
                                              <Switch
                                                defaultChecked={value || false}
                                                checked={value}
                                                onChange={onChange}
                                              />
                                              <Text>Manage by Zone</Text>
                                            </Row>
                                          );
                                        }}
                                      />

                                      <Spacer size={24} />

                                      <Divider />

                                      {
                                        <ManageZoneComponent
                                          control={control}
                                          regionSelected={regionSelected}
                                          indexExpandedRowRenderProductSelected={
                                            indexExpandedRowRenderProductSelected
                                          }
                                          recordExpandedRowRenderProductSelected={
                                            recordExpandedRowRenderProductSelected
                                          }
                                          indexDistChannel={indexDistChannel}
                                          errors={errors}
                                          dataDistChannel={dataDistChannel}
                                          getValues={getValues}
                                          register={register}
                                          setManageByZone={setManageByZone}
                                          manageByZone={manageByZone}
                                        />
                                      }
                                    </Card>
                                  );
                                }
                              )}
                            </>
                          );
                        },
                      }}
                    />
                    <Pagination pagination={paginationProductsSelected} />
                  </>
                )}
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
              <Button onClick={handleSubmit(handleSelectedField)} variant="primary" size="big">
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
                    (filtering) =>
                      filtering.dataIndex !== "id" &&
                      filtering.dataIndex !== "key" &&
                      filtering.dataIndex !== "activeDate" &&
                      filtering.dataIndex !== "status"
                  )}
                  data={pricingStructureLists}
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
  }
};

const ComponentLevelMarginType = (props: any) => {
  const data = useWatch({
    control: props.control,
    name: `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.level.${props.indexLevel}`,
  });

  return (
    <FormInput
      size={"large"}
      onChange={props.onChange}
      placeholder={`e.g 20`}
      suffix={data?.margin_type === "Percent" ? "%" : undefined}
      defaultValue={props.value}
      style={{ height: 48 }}
      status={props.status}
    />
  );
};

const ComponentLevelMarginTypeManageByZone = (props: any) => {
  const data = useWatch({
    control: props.control,
    name: `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannelProduct}.manage_by_zone_detail.region_selected.${props.indexExpandedRowRenderRegionSelected}.distribution_channel.${props.indexDistChannel}.level.${props.indexLevel}`,
  });

  return (
    <FormInput
      size={"large"}
      onChange={props.onChange}
      placeholder={`e.g 20`}
      suffix={data?.margin_type === "Percent" ? "%" : undefined}
      defaultValue={props.value}
      style={{ height: 48 }}
      status={props.status}
    />
  );
};

const ComponentDistributionChannelMarginType = (props: any) => {
  const data = useWatch({
    control: props.control,
    name: `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}`,
  });

  return (
    <FormInput
      size={"large"}
      onChange={props.onChange}
      placeholder={`e.g 20`}
      suffix={data?.margin_type === "Percent" ? "%" : undefined}
      defaultValue={props.value}
      style={{ height: 48 }}
      status={props.status}
    />
  );
};

const ComponentDistributionChannelMarginTypeManageByZone = (props: any) => {
  const data = useWatch({
    control: props.control,
    name: `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannelProduct}.manage_by_zone_detail.region_selected.${props.indexExpandedRowRenderRegionSelected}.distribution_channel.${props.indexDistChannel}`,
  });

  return (
    <FormInput
      size={"large"}
      onChange={props.onChange}
      placeholder={`e.g 20`}
      suffix={data?.margin_type === "Percent" ? "%" : undefined}
      defaultValue={props.value}
      style={{ height: 48 }}
      status={props.status}
    />
  );
};

const ManageZoneComponent = (props: any) => {
  const data = useWatch({
    control: props.control,
    name: `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}`,
  });

  if (data.manage_by_zone) {
    return (
      <Card
        backgroundColor="#f4fbfc"
        backgroundRepeat="no-repeat"
        backgroundImage="/zone-filled-wave.svg"
        backgroundPosition="bottom"
        padding="20px"
      >
        <Text color={"blue.dark"} variant={"headingMedium"}>
          You can manage modern trade pricing structure by zone.
        </Text>

        <Spacer size={24} />

        <Row alignItems="center" gap="8px">
          <Col>
            <Label>Zone Filled</Label>
          </Col>
          <Col>
            <Tooltip title="Data create from manage price structure config" color={"#F4FBFC"}>
              <ICInfo />
            </Tooltip>
          </Col>
        </Row>

        <Spacer size={24} />

        <Progress
          style={{ height: 16 }}
          percent={parseInt(String(100 / props.regionSelected.length))}
        />

        <Spacer size={24} />

        <Button
          full
          size="big"
          variant={"primary"}
          onClick={() => props.setManageByZone({ isShow: true, data: props })}
        >
          Manage by Zone
        </Button>

        <Spacer size={56} />
      </Card>
    );
  } else {
    return (
      <>
        <Spacer size={24} />

        <Text color={"blue.dark"} variant={"headingRegular"}>
          Total Cost
        </Text>

        <Spacer size={8} />

        <Controller
          control={props.control}
          name={`product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.is_reference`}
          render={({ field: { onChange, value } }) => (
            <Row alignItems="center" gap="12px">
              <Switch defaultChecked={value || false} checked={value} onChange={onChange} />
              <Text>is Reference</Text>
              <Tooltip title="Data create from manage price structure config" color={"#F4FBFC"}>
                <ICInfo />
              </Tooltip>
            </Row>
          )}
        />

        <Spacer size={24} />

        <Row width="100%" alignItems="center" gap="12px">
          <Col width="40%">
            <Input
              type="number"
              width="100%"
              label="Cost"
              defaultValue={props.getValues(
                `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.cost`
              )}
              height="48px"
              error={
                props.errors?.product_selected?.[props.indexExpandedRowRenderProductSelected]
                  ?.distribution_channel?.[props.indexDistChannel].cost?.message
              }
              required
              placeholder={`e.g ${props.dataDistChannel.currency.currency} 2.000,00`}
              {...props.register(
                `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.cost`
              )}
            />
          </Col>

          <Col width="20%">
            <Controller
              control={props.control}
              name={`product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.margin_type`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Dropdown
                  error={error?.message}
                  defaultValue={value}
                  label="Margin Type"
                  width="100%"
                  noSearch
                  items={[
                    { id: "Percent", value: "Percent" },
                    { id: "Fix Amount", value: "Fix Amount" },
                  ]}
                  handleChange={(value: any) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </Col>

          <Col width="30%">
            <Controller
              control={props.control}
              name={`product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.margin_value`}
              render={({ field: { onChange, value } }) => (
                <>
                  <Label>Margin Value</Label>
                  <Spacer size={3} />
                  <ComponentDistributionChannelMarginType
                    control={props.control}
                    indexExpandedRowRenderProductSelected={
                      props.indexExpandedRowRenderProductSelected
                    }
                    indexDistChannel={props.indexDistChannel}
                    onChange={onChange}
                    value={value}
                    status={
                      props.errors?.product_selected?.[props.indexExpandedRowRenderProductSelected]
                        ?.distribution_channel?.[props.indexDistChannel]?.margin_value && "error"
                    }
                  />
                </>
              )}
            />
          </Col>
        </Row>

        <Spacer size={24} />

        {props.dataDistChannel.level.map((subLevel: any, indexLevel: any) => {
          return (
            <Col key={indexLevel}>
              <Text color={"blue.dark"} variant={"headingRegular"}>
                {`Level ${indexLevel + 1}`}
              </Text>

              <Spacer size={16} />

              <Controller
                control={props.control}
                name={`product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.level.${indexLevel}.is_reference`}
                render={({ field: { onChange, value } }) => (
                  <Row alignItems="center" gap="12px">
                    <Switch defaultChecked={value || false} checked={value} onChange={onChange} />
                    <Text>is Reference</Text>
                    <Tooltip
                      title="Data create from manage price structure config"
                      color={"#F4FBFC"}
                    >
                      <ICInfo />
                    </Tooltip>
                  </Row>
                )}
              />

              <Spacer size={16} />

              <Row width="100%" alignItems="center" gap="12px">
                <Col width="40%">
                  <Input
                    width="100%"
                    label={subLevel.nameLevel}
                    defaultValue={props.getValues(
                      `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.level.${indexLevel}.cost`
                    )}
                    height="48px"
                    error={
                      props.errors?.product_selected?.[props.indexExpandedRowRenderProductSelected]
                        ?.distribution_channel?.[props.indexDistChannel]?.level?.[indexLevel]?.cost
                        ?.message
                    }
                    required
                    placeholder={`e.g ${props.dataDistChannel.currency.currency} 2.000,00`}
                    {...props.register(
                      `product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.level.${indexLevel}.cost`
                    )}
                  />
                </Col>

                <Col width="20%">
                  <Controller
                    control={props.control}
                    name={`product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.level.${indexLevel}.margin_type`}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Dropdown
                        error={error?.message}
                        defaultValue={value}
                        label="Margin Type"
                        width="100%"
                        noSearch
                        items={[
                          { id: "Percent", value: "Percent" },
                          { id: "Fix Amount", value: "Fix Amount" },
                        ]}
                        handleChange={(value: any) => {
                          onChange(value);
                        }}
                      />
                    )}
                  />
                </Col>

                <Col width="30%">
                  <Controller
                    control={props.control}
                    name={`product_selected.${props.indexExpandedRowRenderProductSelected}.distribution_channel.${props.indexDistChannel}.level.${indexLevel}.margin_value`}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Label>Margin Value</Label>
                        <Spacer size={3} />
                        <ComponentLevelMarginType
                          control={props.control}
                          indexExpandedRowRenderProductSelected={
                            props.indexExpandedRowRenderProductSelected
                          }
                          indexDistChannel={props.indexDistChannel}
                          indexLevel={indexLevel}
                          onChange={onChange}
                          value={value}
                          status={
                            props.errors?.product_selected?.[
                              props.indexExpandedRowRenderProductSelected
                            ]?.distribution_channel?.[props.indexDistChannel].level?.[indexLevel]
                              ?.margin_value?.message && "error"
                          }
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          );
        })}
      </>
    );
  }
};

const Card = styled.div`
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
  margin: ${(p: any) => (p.margin ? p.margin : "16px")};
  background-image: ${(p: any) => (p.backgroundImage ? `url(${p.backgroundImage})` : undefined)};
  background-color: ${(p: any) => (p.backgroundColor ? p.backgroundColor : "#ffffff")};
  background-repeat: ${(p: any) => (p.backgroundRepeat ? p.backgroundRepeat : undefined)};
  background-position: ${(p: any) => (p.backgroundPosition ? p.backgroundPosition : undefined)};
  background-attachment: ${(p: any) =>
    p.backgroundAttachment ? p.backgroundAttachment : undefined};
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

const Divider = styled.div`
  border: 1px dashed #dddddd;
`;

export default CreatePricingStructure;
