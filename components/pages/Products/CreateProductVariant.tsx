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
  Detail,
  Division
} from './fragments'
import styled from 'styled-components'
import { useCreateProductVariant, useDeleteProductVariant, useProductVariantDetail, useUpdateProductVariant, useUploadImageProductVariant } from '../../../hooks/mdm/product-variant/useProductVariant';
import { useProductBrandInfiniteLists } from '../../../hooks/mdm/product-brand/useProductBrandMDM';
import useDebounce from '../../../lib/useDebounce';
import { toSnakeCase } from "../../../lib/caseConverter";
import moment from 'moment';
import _ from 'lodash';
import ArrowLeft from "../../../assets/icons/arrow-left.svg";
import { queryClient } from "../../../pages/_app";

export default function CreateProductVariant({ isCreateProductVariant = true}) {
  const router = useRouter();
  const { id } = router.query;
  const isUpdate = !!id;

  const [tabAktived, setTabAktived] = useState('Detail')

  const [listProductBrand , setListProductBrand] = useState<any[]>([]);
  const [totalRowsProductBrand, setTotalRowsProductBrand] = useState(0);
  const [searchProductBrand, setSearchProductBrand] = useState("");
  const debounceFetchProductBrand = useDebounce(searchProductBrand, 1000);

  const [canBePurchased, setCanBePurchased] = useState(false);
  const [canBeSold, setCanBeSold] = useState(false);

  const [isShowDelete, setShowDelete] = useState({ open: false });

  // DUMMY DATA
  const listTabItems: { title: string }[] = [
    { title: "Detail" },
    { title: "Inventory" },
    { title: "Purchasing" },
    { title: "Accounting" },
    { title: "Branch" },
    { title: "Division" },
    { title: "Registration" },
  ];

  const status: { id: string, value: string }[] = [
    { id: "active", value: "Active" },
    { id: "inactive", value: "Inactive" },
  ]

  const registrationBodyField = {
    number_type: "",
    number: "",
    valid_from: moment().format('DD/MM/YYYY'),
    valid_to: moment().format('DD/MM/YYYY')
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
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      sku_number: "",
      barcode: "",
      image: "",
      company_id: "KSNI",
      company_code: "KSNI",
      product_type: "",
      name: "",
      status: "active",
      can_be_sold: false,
      can_be_purchased: false,
      expired_date: moment().format('DD/MM/YYYY'),
      external_code: "",
      use_unit_leveling: false,
      packaging_size: "",
      cost_of_product: 0,
      sales_price: 0,
      category: null,
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
      branch: []
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
    isLoading: isLoadingProduct
  } = useProductVariantDetail({
    id:id,
    options: {
      enabled: isUpdate,
      onSuccess: (data: any) => {
        data = toSnakeCase(data);
        Object.keys(data).forEach(key => {
          setValue(key, data[key]);
          setCanBePurchased(data.canBePurchased);
          setCanBeSold(data.canBeSold);
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

  const { mutate: uploadImage, isLoading: isLoadingUploadImage } = useUploadImageProductVariant({
    options: {
      onSuccess: () => {
        router.push('/product-variant')
      }
    }
  })

  const { mutate: createProduct, isLoading: isLoadingCreateProduct } = useCreateProductVariant({
    options: {
      onSuccess: (data:any) => {
        if( getValues('image')){
          const formData:any = new FormData();
          formData.append("image", getValues('image'));
          formData.append("company_id", "KSNI");
          formData.append("product_id", data.productId);
  
          uploadImage(formData);
        } else {
          router.push('/product-variant')
        }
       
      }
    }
  })

  const { mutate: updateProduct, isLoading: isLoadingUpdateProduct } = useUpdateProductVariant({
    id,
    options: {
      onSuccess: (data:any) => {
        const formData:any = new FormData();
        formData.append("image", getValues('image'));
        formData.append("company_id", "KSNI");
        formData.append("product_id", data.product_id);

        uploadImage(formData);
      }
    }
  })
  
  const { mutate: deleteProductList, isLoading: isLoadingDeleteProductList } =
  useDeleteProductVariant({
    options: {
      onSuccess: () => {
        setShowDelete({ open: false });
        queryClient.invalidateQueries(["product-variant"]);
        router.push('/product-variant')
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
      'can_be_purchased',
      'name',
      'product_type',
      'external_code',
      'expired_date',
      'use_unit_leveling',
      'cost_of_product',
      'packaging_size',
      'sales_price',
      'registration',
    ])

    payload.expired_date = moment(data.expired_date).utc().toString();
    payload.product_brand_id = data.brand.id;
    payload.base_uom_id = data.base_uom.uom_id;
    payload.purchase_uom_id = data.purchase_uom.uom_id;
    payload.accounting = {
      income_account_id: data?.accounting?.income_account?.id || 0,
      expense_account_id: data?.accounting?.expense_account?.id || 0
    };
    payload.company_code = 'KSNI'
    payload.inventory = {
      weight: {
          net: data.inventory.weight.net ,
          gross: data.inventory.weight.gross,
          uom_id: data.inventory.weight.uom.id
      },
      volume : {
          dimension : {
              length: data.inventory.volume.length,
              width: data.inventory.volume.width,
              height: data.inventory.volume.height
          },
          uom_id:data.inventory.volume.uom.id
      },
      storage_management:  {
        "condition" : "chilled",
        "transportation_type": "121",
        "transportation_group": "road",
        "temperature" : "gatau",
        "self_life": 9,
        "self_life_unit": "days"
    }
    }
    payload.registration = data.registration.map(data => ({
      number_type : data.number_type,
      number: data.number,
      valid_from: moment(data.valid_from).utc().toString(),
      valid_to: moment(data.valid_to).utc().toString()
    }))

    if(isUpdate){
      payload.product_id = id
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

  const switchTabItem = () => {
    switch (tabAktived) {
      case 'Registration':
        return <Registration {...propsRegistrations} />
      case 'Branch':
        return <Branch />
      case 'Purchasing':
        return <Purchasing />
      case 'Accounting':
        return <Accounting {...propsAccounting} />
      case 'Inventory':
        return <Inventory {...propsInventory} />
      case 'Detail':
        return <Detail {...propsDetail} />
      case 'Division':
        return <Division />
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


  const combinationVariant = (list:string[][] = [[]], n = 0, result:any=[], current:any = []) => {
    if (n === list.length) result.push(current)
    else list[n].forEach(item => combinationVariant(list, n+1, result, [...current, item]))
 
    return result
  }
  useEffect(() => {
    let options = optionsForm?.filter(data => {
      if(data?.option?.id && data?.option_items?.length > 0) return true
      return false
    })

    if(options.map(data => data.option_items.map(data => data.id))?.length > 0){
      let allValues = options.map(data => data.option_items.map(data => data.name || data.label));
      allValues.unshift([productForm.name])
      const variants = combinationVariant(allValues)?.map(data => data.join(" "));

      let finalVariants = variants.map(variant => ({
        name: variant,
        cost: productForm.cost_of_product,
        price: productForm.sales_price,
        sku: '-',
        barcode: '-',
      }))
      replaceProductVariants(finalVariants)
    }

  }, [optionsForm, nameForm])

  const propsDetail = { 
    control,
    getValues,
    watch,
    setValue,
    register,
    isUpdate,
    fieldsProductVariants,
    replaceProductVariants,
    isCreateProductVariant
  }
  
  return (
    <Col>
      {
       isLoadingProduct ?
          <Spin tip="Loading data..." />
       : 
      <>

      {!isUpdate ? 
        <Row gap="4px">
          <Text variant={"h4"}>Create Product Variant</Text>
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
              <Button size="big" variant={"tertiary"} disabled={productForm?.variants?.length > 0} onClick={() => setShowDelete({ open: true})}>
                Delete
             </Button> :
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
                  name="product_category_id"
                  render={({ field: { onChange } }) => (
                    <Dropdown
                      defaultValue={productForm?.category?.name}
                      label="Product Category"
                      width="100%"
                      noSearch
                      items={productCategory}
                      handleChange={(value: any) => {
                        onChange(value);
                      }}
                    />
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
                    label="SKU Number"
                    height="48px"
                    placeholder={"e.g 413111"}
                    {...register("sku_number", {
                      required: 'Sku Number is required'
                    })}
                  />
              </Col>

              <Spacer size={10} />

              <Col width="100%">
                <Input
                    width="100%"
                    label="Barcode"
                    height="48px"
                    placeholder={"e.g 413111"}
                    {...register("barcode")}
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