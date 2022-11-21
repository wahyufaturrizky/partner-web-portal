import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Table,
  Button,
  Spacer,
  Row,
  Col,
  FormSelect,
  Text,
  Switch,
  Search,
  Pagination,
  Input,
  Spin,
  FormInput
} from "pink-lava-ui";

import { arrayMove } from "@dnd-kit/sortable";
import { useUOMInfiniteLists } from "../../../../hooks/mdm/unit-of-measure/useUOM";
import useDebounce from "../../../../lib/useDebounce";
import { Controller, useFormState, useWatch } from "react-hook-form";
import _ from "lodash";
import usePagination from "@lucasmogari/react-pagination";
import ProductOptionsCreate from "./ProductOptionsCreate";
import ProductOptions from "./ProductOptions";
import { useRouter } from "next/router";
import { useUpdateProductVariantStatus } from "hooks/mdm/product-list/useProductList";
import {
  useUOMConversion,
  useUOMConversionInfiniteLists,
} from "hooks/mdm/unit-of-measure-conversion/useUOMConversion";
import DraggableTable from "components/pages/Products/fragments/DraggableTable";
import { lang } from "lang";

export default function Detail(props: any) {
  const t = localStorage.getItem("lan") || "en-US";
  // lang[t].companyList.companyName
  const {
    variantsForm,
    control,
    watch,
    setValue,
    productForm,
    register,
    isUpdate,
    fieldsProductVariants,
    isCreateProductVariant,
    updateProductVariants,
    isLoadingProduct,
  } = props;

  const columsVariant = [
    {
      title: lang[t].productList.create.table.variantName,
      dataIndex: "name",
    },
    {
      title: lang[t].productList.create.table.cost,
      dataIndex: "cost",
    },
    {
      title: lang[t].productList.create.table.price,
      dataIndex: "price",
    },
    {
      title: lang[t].productList.create.table.SKU,
      dataIndex: "sku",
    },
    {
      title: lang[t].productList.create.table.barcode,
      dataIndex: "barcode",
    },
    {
      title: lang[t].productList.create.table.active,
      dataIndex: "active",
    },
    {
      title: lang[t].productList.create.table.action,
      dataIndex: "action",
    },
  ];

  const [totalRowsUomTemplate, setTotalRowsUomTemplate] = useState(0);
  const [searchUomTemplate, setSearchUomTemplate] = useState("");
  const debounceFetchUomTemplate = useDebounce(searchUomTemplate, 1000);
  const [listUomTemplate, setListUomTemplate] = useState<any[]>([]);
  const [isConversionChanged, setIsConversionChanged] = useState(false)

  const {
    isFetching: isFetchingUomTemplate,
    isFetchingNextPage: isFetchingMoreUomTemplate,
    hasNextPage: hasNextUomTemplate,
    fetchNextPage: fetchNextPageUomTemplate,
  } = useUOMInfiniteLists({
    query: {
      search: debounceFetchUomTemplate,
      limit: 10,
      company_id: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsUomTemplate(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.uomId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListUomTemplate(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomTemplate.length < totalRowsUomTemplate) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const [totalRowsUomConversion, setTotalRowsUomConversion] = useState(0);
  const [searchUomConversion, setSearchUomConversion] = useState("");
  const debounceFetchUomConversion = useDebounce(searchUomConversion, 1000);
  const [listUomConversion, setListUomConversion] = useState<any[]>([]);

  const {
    isFetching: isFetchingUomConversion,
    isFetchingNextPage: isFetchingMoreUomConversion,
    hasNextPage: hasNextUomConversion,
    fetchNextPage: fetchNextPageUomConversion,
  } = useUOMConversionInfiniteLists({
    query: {
      search: debounceFetchUomConversion,
      limit: 10,
      company_id: "KSNI",
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsUomConversion(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.conversionId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListUomConversion(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listUomConversion.length < totalRowsUomConversion) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: deleteProductList } = useUpdateProductVariantStatus({ options: {} });

  const [searchVariant, setSearchVariant] = useState("");
  let variantsData = variantsForm?.map((variant: any, index: number) => {
    return {
      name: variant.name,
      cost: variant.cost,
      price: variant.price,
      sku: variant.sku,
      barcode: variant.barcode,
      active: isUpdate ? (
        <Switch
          defaultChecked={variant.status === "active"}
          checked={variant.status === "active"}
          onChange={(value: any) => {
            deleteProductList({ status: value ? "active" : "inactive", id: variant.id });
            updateProductVariants(index, { ...variant, status: value ? "active" : "inacitve" });
          }}
        />
      ) : (
        <Switch
          defaultChecked={variant.status === "active"}
          checked={variant.status === "active"}
          onChange={(value: any) => {
            updateProductVariants(index, { ...variant, status: value ? "active" : "inacitve" });
          }}
        />
      ),
      action: (
        <Button
          size="small"
          onClick={() => {
            window.open(`/product-variant/${variant.id}`, "_blank");
          }}
          disabled={!isUpdate}
          variant="tertiary"
        >
          {lang[t].productList.list.button.detail}
        </Button>
      ),
    };
  });

  const paginationVariant = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: variantsData?.length,
  });
  const page = paginationVariant?.page;
  let paginateVariant =
    variantsData?.slice(
      paginationVariant.itemsPerPage * (page - 1),
      paginationVariant.itemsPerPage * page
    ) || [];
  paginateVariant = paginateVariant.filter((variant) =>
    variant.name.toLowerCase().includes(searchVariant.toLowerCase())
  );

  const detailForm = useWatch({
    control,
  });

  const {
    data: UomData,
    isLoading: isLoadingUom,
    isFetching: isFetchingUom,
  } = useUOMConversion({
    id: detailForm.base_uom?.id || detailForm.base_uom?.uom_id,
    companyId: "KSNI",
    query: {
      page: 1,
      limit: 10000,
    },
    options: {
      enabled: !!detailForm.base_uom?.id || !!detailForm.base_uom?.uom_id,
      onSuccess: (data: any) => {
        if(isConversionChanged){
          setValue("uom", data?.mappedData);
        }
      },
      select: (data: any) => {
        const listUom: any = [];
        const mappedUomConversion: any = [];
        const mappedData: any = [];

        data?.uomConversionItem?.rows?.map((uomConversion: any, index: any) => {
          mappedData.push({
            id: uomConversion.id,
            key: uomConversion.id,
            conversionNumber: uomConversion.conversionNumber,
            baseUom: data?.baseUom?.name,
            qty: uomConversion.qty,
            index: index,
            uomConversionItemId: uomConversion?.uomConversionId
          });

          listUom.push({
            value: uomConversion.uom?.name,
            id: uomConversion?.uomId,
            conversionNumber: uomConversion.conversionNumber,
          });

          mappedUomConversion.push({
            uomId: uomConversion.uom?.uomId,
            id: uomConversion.id,
            qty: uomConversion.qty,
            conversion_number: uomConversion.conversionNumber,
            uomConversionItemId: uomConversion?.uomConversionId,
            baseUom: data?.baseUom?.name,
            uomName: uomConversion?.uom?.name
          });
        });
        return {
          baseUom: data?.baseUom,
          mappedData: mappedData,
          listUom: listUom,
          mappedUomConversion: mappedUomConversion,
        };
      },
    },
  });

  const onHandleDrag = (activeId: any, overId: any) => {
    const uom = detailForm?.uom;
    const uomIds = uom.map(({ key }: { key: any }) => key);
    const oldIndex = uomIds?.indexOf(activeId);
    const newIndex = uomIds?.indexOf(overId);
    const changeSequenceTermList: any = arrayMove(uom, oldIndex, newIndex).map((el: any, index) => {
      return {
        ...el,
        index,
      };
    });

    setValue("uom", changeSequenceTermList);
  };

  const onHandleAdd = () => {
    const uom = detailForm?.uom?.map((uom) => uom);
    uom.push({
      id: self?.crypto?.randomUUID(),
      key: self?.crypto?.randomUUID(),
      conversionNumber: "",
      baseUom: UomData?.baseUom?.name,
      qty: "",
      index: uom?.length,
    });
    setValue("uom", uom);
  };

  if (isLoadingProduct) {
    <Spin tip="Loading data?..." />;
  }

  return (
    <div>
      <Row gap="20px" width="100%" noWrap>
      <Controller
          control={control}
          name="base_uom.uom_id"
          defaultValue={detailForm.base_uom?.uom_id || detailForm.base_uom?.id}
          render={({ field: { onChange } }) => (
            <Col width="100%">
              <span>
                <Label style={{ display: "inline" }}>{lang[t].productList.create.field.detail.uomConversionName}</Label> <span></span>
              </span>

              <Spacer size={3} />
              <CustomFormSelect
                defaultValue={detailForm.base_uom?.name}
                style={{ width: "100%", height: "48px" }}
                size={"large"}
                placeholder={"Select"}
                borderColor={"#AAAAAA"}
                arrowColor={"#000"}
                withSearch
                isLoading={isFetchingUomConversion}
                isLoadingMore={isFetchingMoreUomConversion}
                fetchMore={() => {
                  if (hasNextUomConversion) {
                    fetchNextPageUomConversion();
                  }
                }}
                items={
                  isFetchingUomConversion || isFetchingMoreUomConversion ? [] : listUomConversion
                }
                onChange={(value: any) => {
                  setIsConversionChanged(true)
                  onChange(value);
                }}
                onSearch={(value: any) => {
                  setSearchUomConversion(value);
                }}
              />
            </Col>
          )}
        />
        <Controller
          control={control}
          name="purchase_uom.uom_id"
          defaultValue={detailForm.purchase_uom?.uom_id}
          render={({ field: { onChange } }) => (
            <Col width="100%">
              <span>
                <Label style={{ display: "inline" }}>{lang[t].productList.create.field.detail.purchaseOfUnitMeasure}</Label> <span></span>
              </span>

              <Spacer size={3} />
              <CustomFormSelect
                defaultValue={detailForm?.purchase_uom?.name}
                style={{ width: "100%", height: "48px" }}
                size={"large"}
                placeholder={"Select"}
                borderColor={"#AAAAAA"}
                arrowColor={"#000"}
                withSearch
                isLoading={isFetchingUomTemplate}
                isLoadingMore={isFetchingMoreUomTemplate}
                fetchMore={() => {
                  if (hasNextUomTemplate) {
                    fetchNextPageUomTemplate();
                  }
                }}
                items={isFetchingUomTemplate || isFetchingMoreUomTemplate ? [] : listUomTemplate}
                onChange={(value: any) => {
                  onChange(value);
                }}
                onSearch={(value: any) => {
                  setSearchUomTemplate(value);
                }}
              />
            </Col>
          )}
        />
      </Row>

      <Spacer size={38} />

      <Col gap="6px">
        <Text variant="body1">{lang[t].productList.create.field.detail.useUnitOfMeasureLeveling}</Text>
        <Controller
          control={control}
          name="use_unit_leveling"
          defaultValue={detailForm?.use_unit_leveling}
          render={({ field: { onChange } }) => (
            <Switch
              defaultChecked={detailForm?.use_unit_leveling}
              checked={detailForm?.use_unit_leveling}
              onChange={(value: any) => {
                onChange(value);
              }}
            />
          )}
        />
      </Col>

        <div style={{display: detailForm?.use_unit_leveling ? 'block' : 'none'}}>
          <Spacer size={20} />
          <Button
            variant="primary"
            size="big"
            onClick={onHandleAdd}
          >
            + {lang[t].productList.list.button.addNew}
          </Button>
          <Spacer size={20} />
          <DraggableTable
            control={control}
            conversionList={detailForm?.uom || []}
            uom={UomData?.listUom || []}
            onDrag={onHandleDrag}
            setValue={setValue}
            onSelectUom={(data: any, newUom: any, indexData: any) => {
              const uomConversation = UomData?.mappedUomConversion;
              const uomData = uomConversation.find((uom) => uom.uomId === newUom);
              const newData = {
                id: data.id,
                key: data.key,
                conversionNumber: uomData.conversion_number,
                baseUom: data.baseUom,
                qty: uomData.qty,
                index: data?.index,
                levelId: data?.levelId,
                uomName: uomData?.uomName
              };

              const uom = detailForm?.uom;
              const changeUom: any = uom.map((el: any, index) => {
                if (index === indexData) {
                  return newData;
                } else {
                  return {
                    ...el,
                    index,
                  };
                }
              });

              setValue("uom", changeUom);
            }}
            onDelete={(data: any) => {
              const filterUomList = detailForm?.uom?.filter((uom: any) => uom.id !== data.id);

              const mappedUomList = filterUomList.map((el, index) => {
                return {
                  ...el,
                  index,
                };
              });

              setValue("uom", mappedUomList);
            }}
            isLoading={false}
          />
        </div>

      <Spacer size={20} />

      <Row gap="20px">
        <Col width="48%">
          <Col width={"100%"}>
            <Text variant="headingRegular">
              {lang[t].productList.create.field.detail.packagingSize}
            </Text>
            <Spacer size={3} />
            <Controller
              control={control}
              shouldUnregister={true}
              name="packaging_size"
              render={({ field: { onChange, value }, formState: { errors } }) => (
                <>
                  <CustomFormInput
                    size={"large"}
                    label="Packaging size"
                    placeholder={"e.g 12 x 8 ib"}
                    value={value}
                    onChange={(e: any) => {
                      onChange(e.target.value);
                    }}
                  />
                </>
              )}
            />
          </Col>
          <Spacer size={20} />
          <Col width={"100%"}>
            <Text variant="headingRegular">
              {lang[t].productList.create.field.detail.costOfProduct}
            </Text>
            <Spacer size={3} />
            <Controller
              control={control}
              shouldUnregister={true}
              name="cost_of_product"
              render={({ field: { onChange, value }, formState: { errors } }) => (
                <>
                  <CustomFormInput
                    size={"large"}
                    label="Cost of Product"
                    placeholder={"e.g 5000"}
                    value={value}
                    prefix={"Rp"}
                    onChange={(e: any) => {
                      onChange(e.target.value);
                    }}
                  />
                </>
              )}
            />
          </Col>
        </Col>
        <Col width="48%" justifyContent="flex-end">
          <Col width={"100%"}>
            <Text variant="headingRegular">
              {lang[t].productList.create.field.detail.salesPrice}
            </Text>
            <Spacer size={3} />
            <Controller
              control={control}
              shouldUnregister={true}
              name="sales_price"
              render={({ field: { onChange, value }, formState: { errors } }) => (
                <>
                  <CustomFormInput
                    size={"large"}
                    label="Sales Price"
                    placeholder={"e.g Rp 50.000"}
                    prefix={"Rp"}
                    value={value}
                    onChange={(e: any) => {
                      onChange(e.target.value);
                    }}
                  />
                </>
              )}
            />
          </Col>
        </Col>
      </Row>

      {!isCreateProductVariant && (
        <>
          <Spacer size={42} />
          <Divider />
          <Spacer size={39} />
          <Col>
            {isUpdate ? (
              <ProductOptions control={control} />
            ) : (
              <ProductOptionsCreate control={control} setValue={setValue} watch={watch} />
            )}
          </Col>
          <Spacer size={48} />

          <Col>
            <Text variant="headingMedium" color="blue.darker">
              {lang[t].productList.create.field.detail.variant}
            </Text>
            <Spacer size={26} />
            <Search
              placeholder={lang[t].productList.create.field.detail.searchBarVariant}
              onChange={(e: any) => setSearchVariant(e.target.value)}
              width="360px"
              height="48px"
            />
            <Spacer size={16} />
            <Table columns={columsVariant} data={paginateVariant} width="100%" />
            {variantsData?.length > 5 && <Pagination pagination={paginationVariant} />}
          </Col>
        </>
      )}

      {/* <ModalManageDataEdit /> */}
    </div>
  );
}

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

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
`;

const Divider = styled.div`
  border: 1px dashed #dddddd;
`;

const CustomFormInput = styled(FormInput)`

  && {
    height: 48px !important;
    border: 1px solid #AAAAAA;
  }
`