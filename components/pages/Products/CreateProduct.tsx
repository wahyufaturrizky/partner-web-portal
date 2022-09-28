import React, { useEffect, useState } from 'react'
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
  Modal
} from "pink-lava-ui";
import { Controller, useForm, Control, useFieldArray, useWatch } from 'react-hook-form'
import { useRouter } from 'next/router';
import {
  Branch,
  Registration,
  Accounting,
  Purchasing,
  Inventory,
  Detail
} from './fragments'
import styled from 'styled-components'
import { useCreateProduct, useDeleteProduct, useProductDetail, useUpdateProduct, useUploadImageProduct } from '../../../hooks/mdm/product-list/useProductList';
import { useProductBrandInfiniteLists } from '../../../hooks/mdm/product-brand/useProductBrandMDM';
import useDebounce from '../../../lib/useDebounce';
import { toSnakeCase } from "../../../lib/caseConverter";
import moment from 'moment';
import _ from 'lodash';
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { queryClient } from "../../../pages/_app";
import { useProductCategoryInfiniteLists } from 'hooks/mdm/product-category/useProductCategory';

export default function CreateProduct({ isCreateProductVariant = true}) {
  const router = useRouter();
  const { id } = router.query;
  const isUpdate = !!id;

  const [tabAktived, setTabAktived] = useState('Detail')

  const [listProductBrand , setListProductBrand] = useState<any[]>([]);
  const [totalRowsProductBrand, setTotalRowsProductBrand] = useState(0);
  const [searchProductBrand, setSearchProductBrand] = useState("");
  const debounceFetchProductBrand = useDebounce(searchProductBrand, 1000);

  const [listProductCategory , setListProductCategory] = useState<any[]>([]);
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

  const status: { id: string, value: string }[] = [
    { id: "active", value: "Active" },
    { id: "inactive", value: "Inactive" },
  ]

  const registrationBodyField = {
    number_type: "",
    number: "",
    valid_from: moment().utc().toString(),
    valid_to: moment().utc().toString()
  };

  const productType = [
    { value: 'Consumable', id: 'consumable' },
    { value: 'Storable', id: 'storable' },
    { value: 'Service', id: 'service' },
  ]

  const productCategory: any = []

  // FORM

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    getFieldState,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      image: "",
      company_id: "KSNI",
      company_code: "KSNI",
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
        condition : "",
        "transportation_type": "121",
            "transportation_group": "road",
        temperature : "",
        self_life: 0,
        self_life_unit: ""
      },
      accounting: {},
      registration: [],
      branch: {
        ids: []
      },
      category : {},
      uom: []
    }
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

  const {
    isLoading: isLoadingProduct,
    data: productData,
  } = useProductDetail({
    id:id,
    options: {
      enabled: isUpdate,
      onSuccess: (data: any) => {
        data = toSnakeCase(data);
        Object.keys(data).forEach(key => {
          setValue(key, data[key]);
          setCanBePurchased(data?.canBePurchased);
          setCanBePurchased(data.can_be_purchased);
          setCanBeSold(data.can_be_sold);
          setCanManufacture(data.can_be_manufactured);
        })
      return data;
    }
  }})

  const {
    isFetching: isFetchingProductBrand,
    isFetchingNextPage: isFetchingMoreProductBrand,
    hasNextPage: hasNextProductBrand,
    fetchNextPage: fetchNextPageProductBrand,
  } = useProductBrandInfiniteLists({
    query: {
      search: debounceFetchProductBrand,
      company: "KSNI",
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
      company_id: "KSNI",
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
        router.push('/product-list')
      }
    }
  })

  const { mutate: createProduct, isLoading: isLoadingCreateProduct } = useCreateProduct({
    options: {
      onSuccess: (data:any) => {
        if( getValues('image')){
          const formData:any = new FormData();
          formData.append("image", getValues('image'));
          formData.append("company_id", "KSNI");
          formData.append("product_id", data?.productId);
  
          uploadImage(formData);
        } else {
          router.push('/product-list')
        }
       
      }
    }
  })

  const { mutate: updateProduct, isLoading: isLoadingUpdateProduct } = useUpdateProduct({
    id,
    options: {
      onSuccess: (data:any) => {
        if( getValues('image') && getFieldState('image').isDirty){
          const formData:any = new FormData();
          formData.append("image", getValues('image'));
          formData.append("company_id", "KSNI");
          formData.append("product_id", id);
  
          uploadImage(formData);
        } else {
          router.push('/product-list')
        }
      }
    }
  })
  
  const { mutate: deleteProductList, isLoading: isLoadingDeleteProductList } =
  useDeleteProduct({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false });
        queryClient.invalidateQueries(["product-list"]);
        router.push('/product-list')
      },
    },
  });

  // VARIABLE
  const onSubmit = (data: any) => {
    let payload:any = _.pick(data,[
      'company_id',
      'company_code',
      'status',
      'can_be_sold',
      'name',
      'product_type',
      'external_code',
      'expired_date',
      'use_unit_leveling',
      'cost_of_product',
      'packaging_size',
      'sales_price',
      'variants',
      'registration',
      'accounting',
      "branch"
    ])

    payload.uom_conversion = [];

    if(data?.uom?.length > 0){
      payload.uom_conversion = data?.uom?.map(data => ({
        level_id: data?.levelId,
        uom_conversion_item_id: 39,
        conversion_id: "MCM-0000017"
      }))
    }

    payload.branch = data.branch;
    payload.can_be_sold = canBeSold;
    payload.can_be_purchased = canBePurchased;
    payload.can_be_expensed = canBeExpensed;
    payload.can_be_manufactured = canBeManufacture;

    data?.expired_date?.includes('/') ? moment(data.expired_date, 'DD/MM/YYYY').utc().toString() : moment(data.expired_date).utc().toString();
    payload.purchase_uom_id = data.purchase_uom.uom_id || "";
    payload.product_brand_id = data.brand.id || "";
    payload.base_uom_id = "";
    payload.purchase_uom_id = data?.purchase_uom?.uom_id || "";
    payload.options = data?.options?.map((data:any) => ({
      options_id: data?.option.id,
      options_values: data?.option_items?.map(data => data?.value || data?.id) || []
    }));
    
    payload.company_code = 'KSNI'

    payload.inventory = {
      weight: {
        net: data?.inventory?.weight?.net,
        gross: data?.inventory?.weight?.gross,
        uom_id: data?.inventory?.weight?.uom?.id
      },
      volume : {
          dimension : {
              length: data?.inventory?.volume?.length,
              width: data?.inventory?.volume?.width,
              height: data?.inventory?.volume?.height,
              total_volume: data?.inventory?.volume?.total_volume
          },
          uom_id:data?.inventory?.volume?.uom?.id
      },
      storage_management:  {
        ...data?.inventory?.storage_management,
       transportation_group: 'ROAD',
       transportation_type: data?.inventory?.storage_management?.transportation_type?.id
      }
    }
    payload.registration = data?.registration?.map(data => ({
      number_type : data?.number_type,
      number: data?.number,
      valid_from: data.valid_from?.includes('/') ? moment(data.valid_from, 'DD/MM/YYYY').utc().toString() : moment(data.valid_from).utc().toString(),
      valid_to: data.valid_to?.includes('/') ? moment(data.valid_to, 'DD/MM/YYYY').utc().toString() : moment(data.valid_to).utc().toString(),
    }))

    payload.variants = data?.variants?.filter(variant => variant.status === 'active').map(({id, status, ...rest}) => rest)
    payload.product_category_id = data?.category?.id
    if(isUpdate){
      delete payload.company_id;
      delete payload.company_code;
    }

    isUpdate ? updateProduct(payload) : createProduct(payload)
  };

  const propsInventory = {
    setValue,
    getValues,
    register,
    control,
  }

  const propsRegistrations = {
    control,
    register,
    fieldsRegistration,
    appendRegistration,
    removeRegistration,
    registrationBodyField,
  }

  const propsAccounting = {
    control,
    accounting: {},
  }

  const branchForm = useWatch({
    control,
    name: 'branch'
  })

  const switchTabItem = () => {
    switch (tabAktived) {
      case 'Registration':
        return <Registration {...propsRegistrations} />
      case 'Branch':
        return <Branch setValue={setValue} branch={branchForm} />
      case 'Purchasing':
        return <Purchasing />
      case 'Accounting':
        return <Accounting {...propsAccounting} />
      case 'Inventory':
        return <Inventory {...propsInventory} />
      case 'Detail':
        return <Detail {...propsDetail} />
      default:
        return null
    }
  }

  const productForm = useWatch({
    control,
  });

  // useFieldArray Product Variants
  const {
    fields: fieldsProductVariants,
    replace: replaceProductVariants,
    update: updateProductVariants
  } = useFieldArray({
    control,
    name: "variants"
  });

  const optionsForm = useWatch({
    control,
    name: 'options'
  })


  const nameForm = useWatch({
    control,
    name: 'name'
  })

  const costOfProductForm = useWatch({
    control,
    name: 'cost_of_product'
  })

  const salesPriceForm = useWatch({
    control,
    name: 'sales_price'
  })

  const combinationVariant = (list:string[][] = [[]], n = 0, result:any=[], current:any = []) => {
    if (n === list.length) result.push(current)
    else list[n].forEach(item => combinationVariant(list, n+1, result, [...current, item]))
 
    return result
  }

  const generateVariantInCreate = () => {
    let options = optionsForm?.filter(data => {
      if(data?.option?.id && data?.option_items?.length > 0) return true
      return false
    })

    if(options.map(data => data?.option_items.map(data => data?.id))?.length > 0){
      let allValues = options.map(data => data?.option_items.map(data => data?.name || data?.label));
      allValues.unshift([productForm.name])
      const variants = combinationVariant(allValues)?.map(data => data?.join(" "));

      let finalVariants = variants.map(variant => ({
        name: variant,
        cost: productForm.cost_of_product,
        price: productForm.sales_price,
        sku: '-',
        barcode: '-',
        status: 'inactive'
      }))
      replaceProductVariants(finalVariants)
    }
  }

  const generateVariantInDetail = () => {
      let finalVariants = getValues('variants').map((variant:any) => {
        return {
          name: variant.name,
          cost: variant.cost,
          price: variant.price,
          sku: variant.sku,
          barcode: variant.barcode,
          status: variant.status
        }
      })
      replaceProductVariants(finalVariants)
  }

  useEffect(() => {
    if(!isUpdate){
      generateVariantInCreate()
    }
  }, [optionsForm, salesPriceForm, costOfProductForm])

  useEffect(() => {
    if(isUpdate){
      generateVariantInDetail()
    } else {
      generateVariantInCreate()
    }
  }, [nameForm])


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
  }
  
  return (
    <Col>
      {
       isLoadingProduct ?
          <Spin tip="Loading data?..." />
       : 
      <>

      {!isUpdate ? 
        <Row gap="4px">
          <Text variant={"h4"}>Create Product</Text>
        </Row> :
        <Row gap="4px">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
          <Text variant={"h4"}>{productForm?.name}</Text>
        </Row>
      }

      <Spacer size={8} />
      <Row alignItems="center" gap="12px">
      <Col>
        <Row alignItems="center">
          <Checkbox size="small" checked={canBePurchased} onChange={()=>setCanBePurchased(!canBePurchased)}/>
          <div style={{ cursor: "pointer" }} onClick={()=>setCanBePurchased(!canBePurchased)}>
            <Text variant={"h6"}>Can Be Purchased</Text>
          </div>
        </Row>
      </Col>
      <Col>
        <Row alignItems="center">
          <Checkbox size="small" checked={canBeSold} onChange={()=>setCanBeSold(!canBeSold)}/>
          <div style={{ cursor: "pointer" }} onClick={()=>setCanBeSold(!canBeSold)}>
            <Text variant={"h6"}>Can Be Sold</Text>
          </div>
        </Row>
      </Col>
      <Col>
        <Row alignItems="center">
          <Checkbox size="small" checked={canBeExpensed} onChange={()=>setCanExpensed(!canBeExpensed)}/>
          <div style={{ cursor: "pointer" }} onClick={()=>setCanExpensed(!canBeExpensed)}>
            <Text variant={"h6"}>Can Be Expensed</Text>
          </div>
        </Row>
      </Col>
      <Col>
        <Row alignItems="center">
          <Checkbox size="small" checked={canBeManufacture} onChange={()=>setCanManufacture(!canBeManufacture)}/>
          <div style={{ cursor: "pointer" }} onClick={()=>setCanManufacture(!canBeManufacture)}>
            <Text variant={"h6"}>Can Be Manufacture</Text>
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
            {isUpdate ?
              <></> :
              <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
                Cancel
              </Button>
            }
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateProduct || isLoadingUploadImage || isLoadingUpdateProduct? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <UploadImage control={control} productForm={productForm} />
            <Spacer size={20} />
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Input
                  width="100%"
                  label="Product Name"
                  height="48px"
                  placeholder={"e.g Nabati Cheese"}
                  {...register("name", {
                    required: 'Product Name must be filled'
                  })}
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
                      label="Product Type"
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
                        <Label style={{ display: "inline" }}>Product Category </Label>{" "}
                        <span></span>
                      </span>

                      <Spacer size={3} />
                      <CustomFormSelect
                        defaultValue={productForm?.category?.name}
                        style={{ width: "100%", height: '48px' }}
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
                          console.log('value', value)
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
                        <Label style={{ display: "inline" }}>Product Brand</Label>{" "}
                        <span></span>
                      </span>

                      <Spacer size={3} />
                      <CustomFormSelect
                        defaultValue={productForm?.brand?.name}
                        style={{ width: "100%", height: '48px' }}
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
                    label="External Code"
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
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="Expired Date"
                      defaultValue={moment(productForm.expired_date)} format={'DD/MM/YYYY'}
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
          <Accordion.Header variant="blue">Detail Information</Accordion.Header>
          <Accordion.Body>
            <Tabs
              defaultActiveKey={tabAktived}
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
    }

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
                  {isLoadingDeleteProductList ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </Col>
  )
}

const UploadImage = ({ control, productForm }: { control: Control<FormValues>, productForm: any }) => {
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
  )
}

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
`