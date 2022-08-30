import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Button,
  Input,
  FormSelect,
  Accordion,
  Table,
  Pagination,
  Spin,
} from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  useUpdateProductGroup,
  useProductGroup,
  useFilterProductGroup,
  useDeleteProductGroup,
} from "../../hooks/mdm/product-group/useProductGroup";
import { useProductBrandInfiniteLists } from "../../hooks/mdm/product-brand/useProductBrandMDM";
import { queryClient } from "../_app";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "../../lib/useDebounce";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";

const getFilterOption = (group: any) => {
  switch (group) {
    case "PRICE":
      return { label: "Sales Price", value: "PRICE" };
    case "CATEGORY":
      return { label: "Product Category", value: "CATEGORY" };
    case "BRAND":
      return { label: "Product Brand", value: "BRAND" };

    default:
      return [];
  }
};

const itemDefaultValue = [
  { id: 0, group: "", condition: "", value_from: "0", value_to: "0", values: "0" },
];

const ProductGroupCreate = () => {
  const router = useRouter();
  const { product_group_id } = router.query;

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSuccessGetAllData, setIsSuccessGetAllData] = useState(false);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [groupingOption, setGroupingOption] = useState([
    { label: "Sales Price", value: "PRICE" },
    { label: "Product Category", value: "CATEGORY" },
    { label: "Product Brand", value: "BRAND" },
  ]);
  const [minValue, setMinValue] = useState("0");
  const debounceMin = useDebounce(minValue, 1000);
  const [maxValue, setMaxValue] = useState("0");
  const debounceMax = useDebounce(maxValue, 1000);
  const [searchProductBrand, setSearchProductBrand] = useState("");
  const debounceSearchProductBrand = useDebounce(searchProductBrand, 1000);
  const [totalRowsProductBrand, setTotalRowsProductBrand] = useState(0);
  const [listProductBrand, setListProductBrand] = useState([]);
  const [removeList, setRemoveList] = useState<any[]>([]);

  const initialRender = useRef(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: itemDefaultValue,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const itemsWatch = useWatch({
    name: "items",
    control,
  });

  const {
    isFetching: isFetchingProductBrand,
    isFetchingNextPage: isFetchingMoreProductBrand,
    hasNextPage: hasNextPageProductBrand,
    fetchNextPage: fetchNextPageProductBrand,
  } = useProductBrandInfiniteLists({
    query: {
      search: debounceSearchProductBrand,
      company: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductBrand(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.brand,
              value: element.id,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListProductBrand(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listProductBrand.length < totalRowsProductBrand) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: updateProductGroup, isLoading: isLoadingUpdateProductGroup } =
    useUpdateProductGroup({
      id: product_group_id,
      companyId: "KSNI",
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["products-group"]);
        },
      },
    });

  const { mutate: deleteProductGroup, isLoading: isLoadingDeleteProductGroup } =
    useDeleteProductGroup({
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["products-group"]);
          setShowDeleteModal(false);
          router.back();
        },
      },
    });

  const { mutate: filterProduct, isLoading: isLoadingFilterProduct } = useFilterProductGroup({
    pagingationParam: {
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.totalRow);

        const mappedFilterProduct = data?.rows?.map((item: any) => {
          return {
            id: item.id,
            key: item.id,
            productName: item.name,
            productCategory: item.productCategoryName,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/product/${item.id}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        setFilteredProduct(mappedFilterProduct);
      },
    },
  });

  const {
    data: productGroupData,
    isLoading: isLoadingProductGroup,
    isFetching: isFetchingProductGroup,
  } = useProductGroup({
    id: product_group_id,
    companyId: "KSNI",
    options: {
      retry: true,
      onSuccess: (data: any) => {
        pagination.setTotalItems(data?.products?.totalRow);

        const mappedFilterProduct = data?.products?.rows?.map((item: any) => {
          return {
            id: item.id,
            key: item.id,
            productName: item.name,
            productCategory: item.productCategoryName,
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/product/${item.id}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        const mappedItemProduct = data?.items?.map((item: any) => {
          return {
            id: item.id,
            group: item.group,
            condition: item.condition,
            value_from: item.valueFrom,
            value_to: item.valueTo,
            values: item.values,
          };
        });

        setValue("items", mappedItemProduct);
        setFilteredProduct(mappedFilterProduct);
      },
    },
  });

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      title: "Product Category Name",
      dataIndex: "productCategory",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      remove_items: removeList,
    };
    updateProductGroup(formData);
  };

  useEffect(() => {
    if ((!isLoadingProductGroup || !isFetchingProductGroup) && !isFetchingProductBrand) {
      setIsSuccessGetAllData(true);
    }
  }, [isLoadingProductGroup, isFetchingProductGroup, isFetchingProductBrand]);

  useEffect(() => {
    // console.log("triggered", pagination);
  }, [pagination.fromItem, pagination.itemsPerPage]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const mapFilterProduct = itemsWatch.map((item: any) => {
      return {
        group: item.group,
        condition: item.condition,
        value_from: item.value_from === "" ? "0" : item.value_from,
        value_to: item.value_to === "" ? "0" : item.value_to,
        values: "0",
      };
    });

    const requestBody: any = {
      company_id: "KSNI",
      items: mapFilterProduct,
    };

    filterProduct(requestBody);
  }, [debounceMin, debounceMax]);

  if ((isLoadingProductGroup || isFetchingProductGroup) && !isSuccessGetAllData)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px" alignItems={"center"}>
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{productGroupData?.name}</Text>
        </Row>

        <Spacer size={20} />

        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row gap="16px">
              <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
              <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                {isLoadingUpdateProductGroup ? "Loading..." : "Save"}
              </Button>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General</Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <Col width="100%">
                  <Input
                    width="100%"
                    label="Product Group Name"
                    height="40px"
                    placeholder={"e.g Wafer 1K"}
                    defaultValue={productGroupData?.name}
                    {...register("name", { required: true })}
                  />
                  {errors?.name?.type === "required" && (
                    <Text variant="alert" color={"red.regular"}>
                      This field is required
                    </Text>
                  )}
                </Col>
              </Row>

              {fields.map((item, index) => {
                return (
                  <Col key={index}>
                    <Spacer size={20} />

                    {index > 0 && (
                      <>
                        <Separator />

                        <Spacer size={10} />

                        <div>
                          <Text variant={"subtitle1"} inline color={"blue.regular"}>
                            Grouping {index + 1}
                          </Text>
                          {"  "}|{"  "}
                          <Text
                            variant={"subtitle1"}
                            clickable
                            inline
                            color={"pink.regular"}
                            onClick={() => {
                              if (item.id !== 0) {
                                setRemoveList((prevList: any) => {
                                  return [...prevList, { id: item.id }];
                                });
                              }
                              remove(index);
                              setGroupingOption((prevList: any) => {
                                return [...prevList, getFilterOption(itemsWatch[index]?.group)];
                              });
                            }}
                          >
                            Delete
                          </Text>
                        </div>
                        <Spacer size={10} />
                      </>
                    )}

                    <div style={{ display: "flex" }}>
                      <Controller
                        control={control}
                        name={`items.${index}.group`}
                        rules={{ required: true }}
                        render={({ field: { onChange }, formState: { errors } }) => (
                          <Col width={"100%"}>
                            <Label>Grouping Based On</Label>
                            <Spacer size={3} />
                            <FormSelect
                              defaultValue={item?.group}
                              style={{ width: "100%" }}
                              size={"large"}
                              placeholder={"Select"}
                              borderColor={"#AAAAAA"}
                              arrowColor={"#000"}
                              items={groupingOption}
                              onChange={(value: any) => {
                                // filterProduct()
                                onChange(value);
                                const mapFilterProduct = itemsWatch.map((el: any, elIndex: any) => {
                                  if (index === elIndex) {
                                    return {
                                      group: value,
                                      condition: value === "PRICE" ? "BETWEEN" : "",
                                      value_from: "0",
                                      value_to: "0",
                                      values: "0",
                                    };
                                  } else {
                                    return el;
                                  }
                                });

                                setMinValue("0");
                                setMaxValue("0");

                                const requestBody: any = {
                                  company_id: "KSNI",
                                  items: mapFilterProduct,
                                };

                                filterProduct(requestBody);
                              }}
                            />
                            {errors?.items?.[index]?.group?.type === "required" && (
                              <Text variant="alert" color={"red.regular"}>
                                This field is required
                              </Text>
                            )}
                          </Col>
                        )}
                      />

                      <Spacer size={20} />

                      {(itemsWatch[index]?.group === "PRICE" ||
                        itemsWatch[index]?.group === "") && (
                        <Controller
                          control={control}
                          rules={{ required: true }}
                          name={`items.${index}.condition`}
                          render={({ field: { onChange }, formState: { errors } }) => (
                            <Col width="100%">
                              <Label>Condition</Label>
                              <Spacer size={3} />
                              <FormSelect
                                defaultValue={item?.condition}
                                style={{ width: "100%" }}
                                size={"large"}
                                placeholder={"Select"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
                                items={[
                                  { label: "Is Between", value: "BETWEEN" },
                                  { label: "Greater Than", value: "GT" },
                                  { label: "Is Set", value: "EQ" },
                                ]}
                                onChange={(value: any) => {
                                  onChange(value);

                                  const mapFilterProduct = itemsWatch.map(
                                    (el: any, elIndex: any) => {
                                      if (index === elIndex) {
                                        return {
                                          group: el.group,
                                          condition: value,
                                          value_from: "0",
                                          value_to: "0",
                                          values: "0",
                                        };
                                      } else {
                                        return el;
                                      }
                                    }
                                  );

                                  const requestBody: any = {
                                    company_id: "KSNI",
                                    items: mapFilterProduct,
                                  };

                                  filterProduct(requestBody);
                                }}
                              />
                              {errors?.items?.[index]?.condition?.type === "required" && (
                                <Text variant="alert" color={"red.regular"}>
                                  This field is required
                                </Text>
                              )}
                            </Col>
                          )}
                        />
                      )}

                      {itemsWatch[index]?.group === "CATEGORY" && (
                        <Controller
                          control={control}
                          name={`items.${index}.values`}
                          shouldUnregister={true}
                          rules={{
                            required: true,
                            validate: {
                              isNull: (value: any) => value !== "0",
                            },
                          }}
                          render={({ field: { onChange }, formState: { errors } }) => (
                            <Col width="100%">
                              <Label>Product Category Name</Label>
                              <Spacer size={3} />
                              <FormSelect
                                defaultValue={item?.values}
                                style={{ width: "100%" }}
                                size={"large"}
                                placeholder={"Select"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
                                items={[]}
                                onChange={(value: any) => {
                                  onChange(value);
                                }}
                              />
                              {errors?.items?.[index]?.values?.type === "isNull" && (
                                <Text variant="alert" color={"red.regular"}>
                                  This field is required
                                </Text>
                              )}
                            </Col>
                          )}
                        />
                      )}

                      {itemsWatch[index]?.group === "BRAND" && (
                        <Controller
                          control={control}
                          name={`items.${index}.values`}
                          rules={{
                            required: true,
                            validate: {
                              isNull: (value: any) => value !== "0",
                            },
                          }}
                          shouldUnregister={true}
                          render={({ field: { onChange }, formState: { errors } }) => (
                            <Col width="100%">
                              <Label>Product Brand Name</Label>
                              <Spacer size={3} />
                              <FormSelect
                                defaultValue={parseInt(item?.values)}
                                style={{ width: "100%" }}
                                size={"large"}
                                placeholder={"Select"}
                                borderColor={"#AAAAAA"}
                                arrowColor={"#000"}
                                withSearch
                                isLoading={isFetchingProductBrand}
                                isLoadingMore={isFetchingMoreProductBrand}
                                fetchMore={() => {
                                  if (hasNextPageProductBrand) {
                                    fetchNextPageProductBrand();
                                  }
                                }}
                                items={
                                  isFetchingProductBrand && !isFetchingMoreProductBrand
                                    ? []
                                    : listProductBrand
                                }
                                onChange={(value: any) => {
                                  onChange(value?.toString());

                                  const mapFilterProduct = itemsWatch.map(
                                    (el: any, elIndex: any) => {
                                      if (index === elIndex) {
                                        return {
                                          group: el.group,
                                          condition: el.condition,
                                          value_from: "0",
                                          value_to: "0",
                                          values: value?.toString(),
                                        };
                                      } else {
                                        return el;
                                      }
                                    }
                                  );

                                  const requestBody: any = {
                                    company_id: "KSNI",
                                    items: mapFilterProduct,
                                  };

                                  filterProduct(requestBody);
                                }}
                                onSearch={(value: any) => {
                                  setSearchProductBrand(value);
                                }}
                              />
                              {errors?.items?.[index]?.values?.type === "isNull" && (
                                <Text variant="alert" color={"red.regular"}>
                                  This field is required
                                </Text>
                              )}
                            </Col>
                          )}
                        />
                      )}
                    </div>

                    {(itemsWatch[index]?.condition === "GT" ||
                      itemsWatch[index]?.condition === "EQ") &&
                      itemsWatch[index]?.group === "PRICE" && (
                        <Input
                          width="100%"
                          label="Price"
                          height="40px"
                          defaultValue={item?.value_from}
                          placeholder={"e.g 1000"}
                          {...register(`items.${index}.value_from`, {
                            shouldUnregister: true,
                            onChange: (e: any) => {
                              setMinValue(e.target.value);
                            },
                          })}
                        />
                      )}

                    {itemsWatch[index]?.condition === "BETWEEN" &&
                      itemsWatch[index]?.group === "PRICE" && (
                        <>
                          <Row width="100%" noWrap>
                            <Input
                              width="100%"
                              label="Min"
                              height="40px"
                              defaultValue={item?.value_from}
                              placeholder={"e.g 1000"}
                              {...register(`items.${index}.value_from`, {
                                shouldUnregister: true,
                                onChange: (e: any) => {
                                  setMinValue(e.target.value);
                                },
                              })}
                            />

                            <Spacer size={20} />

                            <Input
                              width="100%"
                              label="Max"
                              height="40px"
                              defaultValue={item?.value_to}
                              placeholder={"e.g 1000"}
                              {...register(`items.${index}.value_to`, {
                                onChange: (e: any) => {
                                  setMaxValue(e.target.value);
                                },
                              })}
                            />
                          </Row>
                        </>
                      )}
                  </Col>
                );
              })}

              <Spacer size={10} />

              {itemsWatch[0]?.group !== "" && itemsWatch.length !== 3 && (
                <Text
                  onClick={() => {
                    const filterGroupingOption = groupingOption.filter(
                      (item: any) => !itemsWatch.some((element) => element.group === item.value)
                    );
                    setGroupingOption(filterGroupingOption);

                    append({
                      id: 0,
                      group: "",
                      condition: filterGroupingOption[0]?.value === "PRICE" ? "BETWEEN" : "",
                      value_from: "0",
                      value_to: "0",
                      values: "0",
                    });
                  }}
                  clickable
                  variant="headingSmall"
                  color="pink.regular"
                >
                  + Add More Grouping
                </Text>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Result Samples</Accordion.Header>
            <Accordion.Body>
              <Table loading={isLoadingFilterProduct} columns={columns} data={filteredProduct} />
              <Pagination pagination={pagination} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

      {showDeleteModal && (
        <ModalDeleteConfirmation
          totalSelected={1}
          itemTitle={productGroupData?.name}
          visible={showDeleteModal}
          isLoading={isLoadingDeleteProductGroup}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => deleteProductGroup({ ids: [product_group_id], company_id: "KSNI" })}
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ProductGroupCreate;
