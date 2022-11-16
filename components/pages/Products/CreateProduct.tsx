import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Row,
  Tabs,
  Spacer,
  Text,
  Dropdown,
  FileUploaderAllFiles,
  Accordion,
  FormSelect,
  Checkbox,
  Dropdown2,
  Spin,
  DatePickerInput,
  Modal,
} from "pink-lava-ui";
import { Controller, useForm, Control, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/router";
import { Branch, Registration, Accounting, Purchasing, Inventory, Detail } from "./fragments";
import styled from "styled-components";
import {
  useCreateProduct,
  useDeleteProduct,
  useProductDetail,
  useUpdateProduct,
  useUploadImageProduct,
} from "../../../hooks/mdm/product-list/useProductList";
import { useProductBrandInfiniteLists } from "../../../hooks/mdm/product-brand/useProductBrandMDM";
import useDebounce from "../../../lib/useDebounce";
import { toSnakeCase } from "../../../lib/caseConverter";
import moment from "moment";
import _ from "lodash";
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { queryClient } from "../../../pages/_app";
import { useProductCategoryInfiniteLists } from "hooks/mdm/product-category/useProductCategory";
import { lang } from "lang";

export default function CreateProduct({ isCreateProductVariant = true }) {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";
  const companyId = localStorage.getItem("companyId")
  const companyCode = localStorage.getItem("companyCode")

  const { id } = router.query;
  const isUpdate = !!id;

  const [tabAktived, setTabAktived] = useState("Detail");

  const [listProductBrand, setListProductBrand] = useState<any[]>([]);
  const [totalRowsProductBrand, setTotalRowsProductBrand] = useState(0);
  const [searchProductBrand, setSearchProductBrand] = useState("");
  const debounceFetchProductBrand = useDebounce(searchProductBrand, 1000);

  const [listProductCategory, setListProductCategory] = useState<any[]>([]);
  const [totalRowsProductCategory, setTotalRowsProductCategory] = useState(0);
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const debounceFetchProductCategory = useDebounce(searchProductCategory, 1000);

  const [canBePurchased, setCanBePurchased] = useState(false);
  const [canBeSold, setCanBeSold] = useState(false);
  const [canBeExpensed, setCanExpensed] = useState(false);
  const [canBeManufacture, setCanManufacture] = useState(false);

  const [isShowDelete, setShowDelete] = useState({ open: false });

  // DUMMY DATA
  const listTabItems: { title: string }[] = [
    { title: "Detail" },
    { title: "Inventory" },
    { title: "Purchasing" },
    { title: "Accounting" },
    { title: "Branch" },
    { title: "Registration" },
  ];

  const status: { id: string; value: string }[] = [
    { id: "active", value: "Active" },
    { id: "inactive", value: "Inactive" },
  ];

  const registrationBodyField = {
    number_type: "",
    number: "",
    valid_from: moment().utc().toString(),
    valid_to: moment().utc().toString(),
  };

  const productType = [
    { value: "Consumable", id: "consumable" },
    { value: "Storable", id: "storable" },
    { value: "Service", id: "service" },
  ];

  const productCategory: any = [];

  // FORM

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    setError,
    watch,
    getFieldState,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      image: "",
      company_id: companyId,
      company_code: companyCode,
      product_type: "",
      name: "",
      status: "active",
      can_be_sold: false,
      can_be_purchased: false,
      can_be_expensed: false,
      expired_date: moment().utc().toString(),
      external_code: "",
      use_unit_leveling: false,
      packaging_size: "",
      cost_of_product: 0,
      sales_price: 0,
      brand: {},
      base_uom: {},
      purchase_uom: {},
      options: [],
      variants: [],
      inventory: {
        condition: "",
        transportation_type: "121",
        transportation_group: "road",
        temperature: "",
        self_life: 0,
        self_life_unit: "",
      },
      accounting: {},
      registration: [],
      branch: {
        ids: [],
      },
      category: {},
      uom: [],
    },
  });

  //useFieldArray REGISTRATION
  const {
    fields: fieldsRegistration,
    append: appendRegistration,
    remove: removeRegistration,
  } = useFieldArray({
    control,
    name: "registration",
  });

  const { isLoading: isLoadingProduct, data: productData } = useProductDetail({
    id: id,
    options: {
      enabled: isUpdate,
      onSuccess: (data: any) => {
        data = toSnakeCase(data);
        Object.keys(data).forEach((key) => {
          if(key === 'uom_conversion'){
            setValue('uom', data[key]?.map((data:any, index:any) => ({
              baseUom: data.base_uom_name,
              conversionNumber: data.conversion_number,
              id: data.id,
              index,
              key: data.id,
              levelId: data?.level_id,
              qty: data?.qty,
              uomConversionItemId: data.conversion_id,
              name: data.name,
              uomName: data?.uom_name
            })))
          } else if(key === 'registrations') {
            setValue('registration', data[key])
          } else if(key === 'branch') {
              let branchIds:any = []
              data[key].forEach((branch:any) => {
                branchIds.push(...branch.branchs.map((branch:any) => branch.id))
              })
              let branch = {
                ids: branchIds
              }
              setValue(key, branch)
          } else {
            setValue(key, data[key]);
          }
          setCanExpensed(data?.can_be_expensed);
          setCanBePurchased(data.can_be_purchased);
          setCanBeSold(data.can_be_sold);
          setCanManufacture(data.can_be_manufactured);
        });
        return data;
      },
    },
  });

  const {
    isFetching: isFetchingProductBrand,
    isFetchingNextPage: isFetchingMoreProductBrand,
    hasNextPage: hasNextProductBrand,
    fetchNextPage: fetchNextPageProductBrand,
  } = useProductBrandInfiniteLists({
    query: {
      search: debounceFetchProductBrand,
      company: companyCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductBrand(data?.pages[0].totalRow);
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

  const {
    isFetching: isFetchingProductCategory,
    isFetchingNextPage: isFetchingMoreProductCategory,
    hasNextPage: hasNextProductCategory,
    fetchNextPage: fetchNextPageProductCategory,
  } = useProductCategoryInfiniteLists({
    query: {
      search: debounceFetchProductCategory,
      company_id: companyCode,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductCategory(data?.pages[0].totalRow);
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

  const { mutate: uploadImage, isLoading: isLoadingUploadImage } = useUploadImageProduct({
    options: {
      onSuccess: () => {
        router.push("/product-list");
      },
    },
  });

  const { mutate: createProduct, isLoading: isLoadingCreateProduct } = useCreateProduct({
    options: {
      onSuccess: (data: any) => {
        if (getValues("image")) {
          const formData: any = new FormData();
          formData.append("image", getValues("image"));
          formData.append("company_id", companyCode);
          formData.append("product_id", data?.productId);

          uploadImage(formData);
        } else {
          router.push("/product-list");
        }
      },
      onError: (e: any) => {
        if(e?.data?.message?.includes('already exist')){
          setError('name', {message:  e.data.message, type: "focus" }, { shouldFocus: true })
        }
      }
    },
  });

  const { mutate: updateProduct, isLoading: isLoadingUpdateProduct } = useUpdateProduct({
    id,
    options: {
      onSuccess: (data: any) => {
        if (getValues("image") && getFieldState("image").isDirty) {
          const formData: any = new FormData();
          formData.append("image", getValues("image"));
          formData.append("company_id", companyCode);
          formData.append("product_id", id);

          uploadImage(formData);
        } else {
          router.push("/product-list");
        }
      },
    },
  });

  const { mutate: deleteProductList, isLoading: isLoadingDeleteProductList } = useDeleteProduct({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false });
        queryClient.invalidateQueries(["product-list"]);
        router.push("/product-list");
      },
    },
  });

  // VARIABLE
  const onSubmit = (data: any) => {
    let payload: any = _.pick(data, [
      "company_id",
      "company_code",
      "status",
      "can_be_sold",
      "name",
      "product_type",
      "external_code",
      "expired_date",
      "use_unit_leveling",
      "cost_of_product",
      "packaging_size",
      "sales_price",
      "variants",
      "registration",
      "accounting",
    ]);

    payload.uom_conversion = [];

    if (data?.uom?.length > 0 && payload.use_unit_leveling) {
      console.log("data?.uom", data?.uom)
      payload.uom_conversion = data?.uom?.map((data) => ({
        level_id: data?.levelId || null,
        uom_conversion_item_id: data?.id,
        conversion_id: data?.uomConversionItemId,
      }));
    } else {
      payload.uom_conversion = [];
    }

    payload.branch = data.branch;
    payload.can_be_sold = canBeSold;
    payload.can_be_purchased = canBePurchased;
    payload.can_be_expensed = canBeExpensed;
    payload.can_be_manufactured = canBeManufacture;

    payload.expired_date = data?.expired_date?.includes("/")
      ? moment(data.expired_date, "DD/MM/YYYY").utc().toString()
      : moment(data.expired_date).utc().toString();
    payload.purchase_uom_id = data.purchase_uom.uom_id || "";
    payload.product_brand_id = data.brand.id || "";
    payload.base_uom_id = data.base_uom.uom_id;
    payload.purchase_uom_id = data?.purchase_uom?.uom_id || "";
    payload.options = data?.options?.map((data: any) => ({
      options_id: data?.option.id,
      options_values: data?.option_items?.map((data) => data?.value || data?.id) || [],
    }));

    payload.company_code = companyCode;
    payload.inventory = {
      weight: {
        net: data?.inventory?.weight?.net,
        gross: data?.inventory?.weight?.gross,
        uom_id: data?.inventory?.weight?.uom?.id,
      },
      volume: {
        dimension: {
          length: data?.inventory?.volume?.length,
          width: data?.inventory?.volume?.width,
          height: data?.inventory?.volume?.height,
          total_volume: data?.inventory?.volume?.total_volume,
        },
        uom_id: data?.inventory?.volume?.uom?.id,
      },
      storage_management: {
        ...data?.inventory?.storage_management,
        transportation_group: data?.inventory?.storage_management?.transportation_group,
        transportation_type: data?.inventory?.storage_management?.transportation_type?.id,
      },
    };
    payload.registration = data?.registration?.map((data) => ({
      number_type: data?.number_type,
      number: data?.number,
      valid_from: data.valid_from?.includes("/")
        ? moment(data.valid_from, "DD/MM/YYYY").utc().toString()
        : moment(data.valid_from).utc().toString(),
      valid_to: data.valid_to?.includes("/")
        ? moment(data.valid_to, "DD/MM/YYYY").utc().toString()
        : moment(data.valid_to).utc().toString(),
    })) || [];

    payload.variants = data?.variants.map(({id, ...rest}: any) => ({
      ...rest
    }))

    payload.product_category_id = data?.category?.id;
    if (isUpdate) {
      delete payload.company_id;
      delete payload.company_code;
    }

    isUpdate ? updateProduct(payload) : createProduct(payload);
  };

  const propsInventory = {
    setValue,
    getValues,
    register,
    control,
    errors
  };

  const propsRegistrations = {
    control,
    register,
    fieldsRegistration,
    appendRegistration,
    removeRegistration,
    registrationBodyField,
  };

  const propsAccounting = {
    control,
    accounting: {},
    setValue
  };

  const branchForm = useWatch({
    control,
    name: "branch",
  });

  const switchTabItem = () => {
      return (
      <>
        <div style={{display: tabAktived === 'Registration' ? 'block': 'none'}}>
          <Registration {...propsRegistrations} />
          </div>
        <div style={{display: tabAktived === 'Branch' ? 'block': 'none'}}>
          <Branch setValue={setValue} branch={branchForm} isUpdate={isUpdate} />
        </div>
        <div style={{display: tabAktived === 'Purchasing' ? 'block': 'none'}}>
          <Purchasing />
        </div>
        <div style={{display: tabAktived === 'Accounting' ? 'block': 'none'}}>
          <Accounting {...propsAccounting} />
        </div>
        <div style={{display: tabAktived === 'Inventory' ? 'block': 'none'}}>
          <Inventory {...propsInventory} />
        </div>
        <div style={{display: tabAktived === 'Detail' ? 'block': 'none'}}>
          <Detail {...propsDetail} />
        </div>
      </>
      )
  }

  const productForm = useWatch({
    control,
  });

  // useFieldArray Product Variants
  const {
    fields: fieldsProductVariants,
    replace: replaceProductVariants,
    update: updateProductVariants,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const variantsForm = useWatch({
    control,
    name: "variants",
  });

  const optionsForm = useWatch({
    control,
    name: "options",
  });

  const nameForm = useWatch({
    control,
    name: "name",
  });


  const inventoryWatch = useWatch({
    control,
    name: "inventory",
  });

  const costOfProductForm = useWatch({
    control,
    name: "cost_of_product",
  });

  const salesPriceForm = useWatch({
    control,
    name: "sales_price",
  });

  const combinationVariant = (
    list: string[][] = [[]],
    n = 0,
    result: any = [],
    current: any = []
  ) => {
    if (n === list.length) result.push(current);
    else list[n].forEach((item) => combinationVariant(list, n + 1, result, [...current, item]));

    return result;
  };

  const generateVariantInCreate = () => {
    let options = optionsForm?.filter((data) => {
      if (data?.option?.id && data?.option_items?.length > 0) return true;
      return false;
    });

    if (options?.length > 0 && options.map((data) => data?.option_items.map((data) => data?.id))?.length > 0) {
      let allValues = options.map((data) =>
        data?.option_items.map((data) => data?.name || data?.label)
      );
      allValues.unshift([productForm.name]);
      const variants = combinationVariant(allValues)?.map((data) => data?.join(" "));

      let finalVariants = variants.map((variant) => ({
        name: variant,
        cost: productForm.cost_of_product,
        price: productForm.sales_price,
        sku: "-",
        barcode: "-",
        status: "inactive",
      }));
      replaceProductVariants(finalVariants);
    } else {
      replaceProductVariants([])
    }
  };

  const generateVariantInDetail = () => {
    let finalVariants = getValues("variants").map((variant: any) => {
      return {
        id: variant.id,
        name: variant.name,
        cost: variant.cost,
        price: variant.price,
        sku: variant.sku,
        barcode: variant.barcode,
        status: variant.status,
      };
    });
    replaceProductVariants(finalVariants);
  };

  useEffect(() => {
    if (!isUpdate) {
      generateVariantInCreate();
    }
  }, [optionsForm, salesPriceForm, costOfProductForm]);

  useEffect(() => {
    if (isUpdate) {
      generateVariantInDetail();
    } else {
      generateVariantInCreate();
    }
  }, [nameForm]);

  const propsDetail = {
    control,
    getValues,
    watch,
    setValue,
    register,
    isUpdate,
    fieldsProductVariants,
    replaceProductVariants,
    updateProductVariants,
    variantsForm,
    isLoadingProduct,
  };

  console.log("productData", productData)
  return (
    <Col>
      {isLoadingProduct ? (
        <Spin tip="Loading..." />
      ) : (
        <>
          {!isUpdate ? (
            <Row gap="4px">
              <Text variant={"h4"}>{lang[t].productList.create.headerTitle}</Text>
            </Row>
          ) : (
            <Row gap="4px">
              <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
              <Text variant={"h4"}>{productForm?.name}</Text>
            </Row>
          )}

          <Spacer size={8} />
          <Row alignItems="center" gap="12px">
            <Col>
              <Row alignItems="center">
                <Checkbox
                  size="small"
                  checked={canBePurchased}
                  onChange={() => setCanBePurchased(!canBePurchased)}
                />
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setCanBePurchased(!canBePurchased)}
                >
                  <Text variant={"h6"}>{lang[t].productList.create.checkbox.canBePurchased}</Text>
                </div>
              </Row>
            </Col>
            <Col>
              <Row alignItems="center">
                <Checkbox
                  size="small"
                  checked={canBeSold}
                  onChange={() => setCanBeSold(!canBeSold)}
                />
                <div style={{ cursor: "pointer" }} onClick={() => setCanBeSold(!canBeSold)}>
                  <Text variant={"h6"}>{lang[t].productList.create.checkbox.canBeSold}</Text>
                </div>
              </Row>
            </Col>
            <Col>
              <Row alignItems="center">
                <Checkbox
                  size="small"
                  checked={canBeExpensed}
                  onChange={() => setCanExpensed(!canBeExpensed)}
                />
                <div style={{ cursor: "pointer" }} onClick={() => setCanExpensed(!canBeExpensed)}>
                  <Text variant={"h6"}>{lang[t].productList.create.checkbox.canBeExpensed}</Text>
                </div>
              </Row>
            </Col>
            <Col>
              <Row alignItems="center">
                <Checkbox
                  size="small"
                  checked={canBeManufacture}
                  onChange={() => setCanManufacture(!canBeManufacture)}
                />
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setCanManufacture(!canBeManufacture)}
                >
                  <Text variant={"h6"}>{lang[t].productList.create.checkbox.canBeManufacture}</Text>
                </div>
              </Row>
            </Col>
          </Row>

          <Spacer size={20} />

          <Card padding="20px">
            <Row justifyContent="space-between" alignItems="center" nowrap>
              <Controller
                control={control}
                name="status"
                defaultValue={"active"}
                render={({ field: { onChange } }) => (
                  <Dropdown
                    label=""
                    width="185px"
                    noSearch
                    items={status}
                    defaultValue={productForm.status}
                    handleChange={(value: any) => {
                      onChange(value);
                    }}
                  />
                )}
              />

              <Row gap="16px">
                {isUpdate ? (
                  <></>
                ) : (
                  <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                    {lang[t].productList.list.button.cancel}
                  </Button>
                )}
                <Button size="big" variant={"primary"} onClick={(e: any) => {
                  if(!inventoryWatch?.weight?.net){
                    setTabAktived('Inventory')
                    handleSubmit(onSubmit)(e)
                  } else {
                    handleSubmit(onSubmit)(e)
                  }
                }}>
                  {isLoadingCreateProduct || isLoadingUploadImage || isLoadingUpdateProduct
                    ? "Loading..."
                    : lang[t].productList.list.button.save}
                </Button>
              </Row>
            </Row>
          </Card>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">{lang[t].productList.create.accordion.general}</Accordion.Header>
              <Accordion.Body>
                <UploadImage control={control} productForm={productForm} />
                <Spacer size={20} />
                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Input
                      width="100%"
                      label={lang[t].productList.create.field.productName}
                      height="48px"
                      placeholder={"e.g Nabati Cheese"}
                      {...register("name", {
                        required: "Product Name must be filled",
                      })}
                      error={errors.name?.message}
                      required
                    />
                  </Col>
                  <Spacer size={10} />

                  <Col width="100%">
                    <Controller
                      control={control}
                      name="product_type"
                      render={({ field: { onChange } }) => (
                        <Dropdown2
                          defaultValue={productForm?.product_type}
                          label={lang[t].productList.create.field.productType}
                          labelBold={true}
                          width="100%"
                          noSearch
                          items={productType}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                        />
                      )}
                    />
                  </Col>
                </Row>

                <Spacer size={20} />

                <Row width="100%" noWrap>
                  <Col width="100%">
                    <Controller
                      control={control}
                      name="category.id"
                      defaultValue={productForm?.category?.name}
                      render={({ field: { onChange } }) => (
                        <Col width="100%">
                          <span>
                            <Label style={{ display: "inline" }}>{lang[t].productList.create.field.productCategory}</Label>{" "}
                            <span></span>
                          </span>

                          <Spacer size={3} />
                          <CustomFormSelect
                            defaultValue={productForm?.category?.name}
                            style={{ width: "100%", height: "48px" }}
                            size={"large"}
                            placeholder={"Select"}
                            borderColor={"#AAAAAA"}
                            arrowColor={"#000"}
                            withSearch
                            isLoading={isFetchingProductCategory}
                            isLoadingMore={isFetchingMoreProductCategory}
                            fetchMore={() => {
                              if (hasNextProductCategory) {
                                fetchNextPageProductCategory();
                              }
                            }}
                            items={
                              isFetchingProductCategory || isFetchingMoreProductCategory
                                ? []
                                : listProductCategory
                            }
                            onChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(value: any) => {
                              setSearchProductCategory(value);
                            }}
                          />
                        </Col>
                      )}
                    />
                  </Col>

                  <Spacer size={10} />

                  <Col width="100%">
                    <Controller
                      control={control}
                      name="brand.id"
                      defaultValue={productForm?.brand?.id}
                      render={({ field: { onChange } }) => (
                        <>
                          <span>
                            <Label style={{ display: "inline" }}>{lang[t].productList.create.field.productBrand}</Label> <span></span>
                          </span>

                          <Spacer size={3} />
                          <CustomFormSelect
                            defaultValue={productForm?.brand?.name}
                            style={{ width: "100%", height: "48px" }}
                            size={"large"}
                            placeholder={"Select"}
                            borderColor={"#AAAAAA"}
                            arrowColor={"#000"}
                            withSearch={true}
                            isLoading={isFetchingProductBrand}
                            isLoadingMore={isFetchingMoreProductBrand}
                            fetchMore={() => {
                              if (hasNextProductBrand) {
                                fetchNextPageProductBrand();
                              }
                            }}
                            items={
                              isFetchingProductBrand || isFetchingMoreProductBrand
                                ? []
                                : listProductBrand
                            }
                            onChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(value: any) => {
                              setSearchProductBrand(value);
                            }}
                          />
                        </>
                      )}
                    />
                  </Col>
                </Row>

                <Spacer size={10} />

                <Row width="100%" noWrap>
                  <Col width="100%">
                    <Input
                      width="100%"
                      label={lang[t].productList.create.field.externalCode}
                      height="48px"
                      placeholder={"e.g 413111"}
                      {...register("external_code")}
                    />
                  </Col>

                  <Spacer size={10} />

                  <Col width="100%">
                    <Controller
                      control={control}
                      name={`expired_date`}
                      render={({ field: { onChange } }) => (
                        <DatePickerInput
                          fullWidth
                          placeholder="Select"
                          onChange={(date: any, dateString: any) => onChange(dateString)}
                          label={lang[t].productList.create.field.discontinueDate}
                          format={"DD/MM/YYYY"}
                          defaultValue={productData?.expiredDate ? moment(productData?.expiredDate) : undefined}
                        />
                      )}
                    />
                  </Col>
                </Row>
                <Spacer size={20} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">{lang[t].productList.create.accordion.productInformation}</Accordion.Header>
              <Accordion.Body>
                <Tabs
                  activeKey={tabAktived}
                  listTabPane={listTabItems}
                  onChange={(e: any) => setTabAktived(e)}
                />
                <Spacer size={20} />
                {switchTabItem()}
                <Spacer size={100} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </>
      )}

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false })}
          title={"Confirm Delete"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={4} />
              Are you sure to delete Product Name {productForm?.name}
              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDelete({ open: false })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    deleteProductList({ ids: [id] });
                  }}
                >
                  {isLoadingDeleteProductList ? "Loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </Col>
  );
}

const UploadImage = ({
  control,
  productForm,
}: {
  control: Control<FormValues>;
  productForm: any;
}) => {
  return (
    <Controller
      control={control}
      name="image"
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Product Photo"
          onSubmit={(file: any) => onChange(file)}
          defaultFile={productForm?.image}
          withCrop
          sizeImagePhoto="125px"
          removeable
          textPhoto={[
            "Packaging product photo, biscuit wrap, etc.",
            "Photo size 1024x1024 recommended. Max File 5 MB",
          ]}
        />
      )}
    ></Controller>
  );
};

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
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
