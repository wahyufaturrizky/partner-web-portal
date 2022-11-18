import React, { useState, useRef, useEffect } from "react";
import { Text, Col, Row, Spacer, Input, FormSelect } from "pink-lava-ui";
import { Controller, useFieldArray } from "react-hook-form";
import styled from "styled-components";
import { useProductBrandInfiniteLists } from "../../../hooks/mdm/product-brand/useProductBrandMDM";
import useDebounce from "../../../lib/useDebounce";
import { useProductCategoryInfiniteLists } from "hooks/mdm/product-category/useProductCategory";

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

const ConditionalField = ({
  register,
  control,
  setValue,
  itemsWatch,
  filterProduct,
  setIsFetchingBrand,
  removeList,
  type,
  groupingBasedOnLable,
  conditionLable,
  minLable,
  maxLable,
  addMoreGroupingLable,
  groupingLable,
}: any) => {
  const [groupingOption, setGroupingOption] = useState([
    { label: "Sales Price", value: "PRICE" },
    { label: "Product Category", value: "CATEGORY" },
    { label: "Product Brand", value: "BRAND" },
  ]);

  const [minValue, setMinValue] = useState("0");
  const debounceMin = useDebounce(minValue, 1000);

  const [maxValue, setMaxValue] = useState("0");
  const debounceMax = useDebounce(maxValue, 1000);

  const [indexPrice, setIndexPrice] = useState(0);

  const [searchProductBrand, setSearchProductBrand] = useState("");
  const debounceSearchProductBrand = useDebounce(searchProductBrand, 1000);

  const [searchProductCategory, setSearchProductCategory] = useState("");
  const debounceSearchProductCategory = useDebounce(searchProductCategory, 1000);

  const [totalRowsProductBrand, setTotalRowsProductBrand] = useState(0);
  const [listProductBrand, setListProductBrand] = useState([]);

  const [totalRowsProductCategory, setTotalRowsProductCategory] = useState(0);
  const [listProductCategory, setListProductCategory] = useState([]);

  const initialRender = useRef(true);

  const { fields, append, remove } = useFieldArray({
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
        setIsFetchingBrand && setIsFetchingBrand(false);
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

  const {
    isLoading: isLoadingProductCategory,
    isFetching: isFetchingProductCategory,
    isFetchingNextPage: isFetchingMoreProductCategory,
    hasNextPage: hasNextPageProductCategory,
    fetchNextPage: fetchNextPageProductCategory,
  } = useProductCategoryInfiniteLists({
    query: {
      search: debounceSearchProductCategory,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductCategory(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name,
              value: element.productCategoryId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListProductCategory(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listProductCategory.length < totalRowsProductCategory) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const mapFilterProduct = itemsWatch.map((el: any, index: any) => {
      if (index === indexPrice) {
        return {
          group: el.group,
          condition: el.condition,
          value_from: el.value_from === "" ? "0" : el.value_from,
          value_to: el.value_to === "" ? "0" : el.value_to,
          values: "0",
        };
      } else {
        return {
          ...el,
          condition: "",
        };
      }
    });

    const requestBody: any = {
      company_id: "KSNI",
      items: mapFilterProduct,
    };

    console.log(requestBody);

    filterProduct(requestBody);
  }, [debounceMin, debounceMax]);

  const addGrouping = () => {
    const filterGroupingOption = groupingOption.filter(
      (item: any) => !itemsWatch.some((element: any) => element.group === item.value)
    );
    setGroupingOption(filterGroupingOption);

    append({
      ...(type === "edit" && { id: 0 }),
      group: null,
      condition: filterGroupingOption[0]?.value === "PRICE" ? "BETWEEN" : null,
      value_from: "0",
      value_to: "0",
      values: "0",
    });
  };

  const removeGrouping = (index: any) => {
    if (itemsWatch[index]?.id !== 0) {
      removeList &&
        removeList((prevList: any) => {
          return [...prevList, { id: itemsWatch[index]?.id }];
        });
    }
    remove(index);
    setGroupingOption((prevList: any) => {
      return [...prevList, getFilterOption(itemsWatch[index]?.group)];
    });
  };

  const handleGroupChange = (value: any, onChange: any, index: any) => {
    if (value === "BRAND" || value === "CATEGORY") {
      setValue(`items.${index}.values`, "0");
    }
    onChange(value);
    console.log(value, "based on");
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
        return {
          ...el,
          condition: el?.condition ?? "",
        };
      }
    });

    setMinValue("0");
    setMaxValue("0");

    const requestBody: any = {
      company_id: "KSNI",
      items: mapFilterProduct,
    };

    console.log(requestBody);

    filterProduct(requestBody);
  };

  const handleConditionChange = (value: any, onChange: any, index: any) => {
    onChange(value);

    setValue(`items.${index}.value_from`, "0");
    setValue(`items.${index}.value_to`, "0");

    const mapFilterProduct = itemsWatch.map((el: any, elIndex: any) => {
      if (index === elIndex) {
        return {
          group: el.group,
          condition: value,
          value_from: "0",
          value_to: "0",
          values: "0",
        };
      } else {
        return {
          ...el,
          condition: el?.condition ?? "",
        };
      }
    });

    const requestBody: any = {
      company_id: "KSNI",
      items: mapFilterProduct,
    };

    filterProduct(requestBody);
  };

  const handleCategoryChange = (value: any, onChange: any, index: any) => {
    onChange(value?.toString());

    const mapFilterProduct = itemsWatch.map((el: any, elIndex: any) => {
      if (index === elIndex) {
        return {
          group: el.group,
          condition: "",
          value_from: "0",
          value_to: "0",
          values: value?.toString(),
        };
      } else {
        return {
          ...el,
          condition: el.group === "PRICE" ? el.condition : "",
        };
      }
    });

    const requestBody: any = {
      company_id: "KSNI",
      items: mapFilterProduct,
    };

    console.log(requestBody);

    filterProduct(requestBody);
  };

  return (
    <>
      {fields.map((item: any, index) => {
        return (
          <Col key={index}>
            <Spacer size={20} />

            {index > 0 && (
              <>
                <Separator />

                <Spacer size={10} />

                <div>
                  <Text variant={"subtitle1"} inline color={"blue.regular"}>
                    {groupingLable} {index + 1}
                  </Text>
                  {"  "}|{"  "}
                  <Text
                    variant={"subtitle1"}
                    clickable
                    inline
                    color={"pink.regular"}
                    onClick={() => {
                      removeGrouping(index);
                    }}
                  >
                    Delete
                  </Text>
                </div>
                <Spacer size={10} />
              </>
            )}

            <div style={{ display: "flex", gap: "5px" }}>
              <Controller
                control={control}
                name={`items.${index}.group`}
                rules={{ required: true }}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <Col width={"100%"}>
                    <Label>{groupingBasedOnLable}</Label>
                    <Spacer size={3} />
                    <CustomFormSelect
                      getPopupContainer={() => document.getElementById("area")}
                      defaultValue={item?.group}
                      style={{ width: "100%" }}
                      size={"large"}
                      placeholder={"Select"}
                      borderColor={"#AAAAAA"}
                      arrowColor={"#000"}
                      items={groupingOption}
                      onChange={(value: any) => {
                        handleGroupChange(value, onChange, index);
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

              {(itemsWatch[index]?.group === "PRICE" ||
                itemsWatch[index]?.group === "" ||
                itemsWatch[index]?.group === null) && (
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name={`items.${index}.condition`}
                  render={({ field: { onChange }, formState: { errors } }) => (
                    <Col width="100%">
                      <Label>{conditionLable}</Label>
                      <Spacer size={3} />
                      <CustomFormSelect
                        getPopupContainer={() => document.getElementById("area")}
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
                          handleConditionChange(value, onChange, index);
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
                  shouldUnregister={true}
                  rules={{
                    required: true,
                    validate: {
                      isNull: (value: any) => value !== "0",
                    },
                  }}
                  name={`items.${index}.values`}
                  render={({ field: { onChange }, formState: { errors } }) => (
                    <Col width="100%">
                      <Label>Product Category Name</Label>
                      <Spacer size={3} />
                      <CustomFormSelect
                        getPopupContainer={() => document.getElementById("area")}
                        defaultValue={item?.values === "0" ? null : item?.values}
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        isLoading={isFetchingProductBrand}
                        isLoadingMore={isFetchingMoreProductCategory}
                        fetchMore={() => {
                          if (hasNextPageProductCategory) {
                            fetchNextPageProductCategory();
                          }
                        }}
                        arrowColor={"#000"}
                        items={
                          isFetchingProductCategory && !isFetchingMoreProductCategory
                            ? []
                            : listProductCategory
                        }
                        onChange={(value: any) => {
                          handleCategoryChange(value, onChange, index);
                          // onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchProductCategory(value);
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
                      <CustomFormSelect
                        getPopupContainer={() => document.getElementById("area")}
                        defaultValue={type === "edit" ? parseInt(item?.values) : ""}
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
                          handleCategoryChange(value, onChange, index);
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

            {(itemsWatch[index]?.condition === "GT" || itemsWatch[index]?.condition === "EQ") &&
              itemsWatch[index]?.group === "PRICE" && (
                <Row width="50%" noWrap>
                  <Input
                    width="100%"
                    label="Price"
                    height="48px"
                    defaultValue={item?.value_from}
                    placeholder={"e.g 1000"}
                    {...register(`items.${index}.value_from`, {
                      onChange: (e: any) => {
                        setMinValue(e.target.value);
                        setIndexPrice(index);
                      },
                    })}
                  />
                </Row>
              )}

            {itemsWatch[index]?.condition === "BETWEEN" && itemsWatch[index]?.group === "PRICE" && (
              <>
                <Row width="100%" gap={"5px"} noWrap>
                  <Input
                    width="100%"
                    label={minLable}
                    height="48px"
                    placeholder={"e.g 1000"}
                    defaultValue={item?.value_from}
                    {...register(`items.${index}.value_from`, {
                      onChange: (e: any) => {
                        setMinValue(e.target.value);
                        setIndexPrice(index);
                      },
                    })}
                  />

                  <Input
                    width="100%"
                    label={maxLable}
                    height="48px"
                    placeholder={"e.g 1000"}
                    defaultValue={item?.value_to}
                    {...register(`items.${index}.value_to`, {
                      onChange: (e: any) => {
                        setMaxValue(e.target.value);
                        setIndexPrice(index);
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
        <Text onClick={addGrouping} clickable variant="headingSmall" color="pink.regular">
          {addMoreGroupingLable}
        </Text>
      )}
    </>
  );
};

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

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

export default ConditionalField;
