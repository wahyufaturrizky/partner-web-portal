import React, { useState } from 'react'
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
  Spin
} from "pink-lava-ui";
import { Controller, useForm, Control, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/router';
import { DevTool } from "@hookform/devtools";
import {
  Branch,
  Registration,
  Accounting,
  Purchasing,
  Inventory,
  Detail
} from './fragments'
import styled from 'styled-components'
import { useCreateProduct, useProductDetail } from '../../../hooks/mdm/product-list/useProductList';
import { useProductBrandInfiniteLists } from '../../../hooks/mdm/product-brand/useProductBrandMDM';
import useDebounce from '../../../lib/useDebounce';
import { toSnakeCase} from "../../../lib/caseConverter";

export default function CreateProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [tabAktived, setTabAktived] = useState('Detail')

  const [listProductBrand , setListProductBrand] = useState<any[]>([]);
  const [totalRowsProductBrand, setTotalRowsProductBrand] = useState(0);

  const [canBePurchased, setCanBePurchased] = useState(false);
  const [canBeSold, setCanBeSold] = useState(false);
  const [canBeExpensed, setCanExpensed] = useState(false);

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
    valid_from: "",
    valid_to: ""
  };

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
      company_id: "KSNI",
      company_code: "KSNI",
      status: "active",
      can_be_sold: false,
      can_be_purchased: false,
      can_be_expensed: false,
      name: "",
      product_type: "",
      product_category_id: 1,
      product_brand_id: 0,
      external_code: "",
      expired_date: "",
      base_uom_id: "",
      purchase_uom_id: "",
      use_unit_leveling: false,
      cost_of_product: 0,
      packaging_size: "",
      sales_price: 0,
      options: [
        {
          options_id: "MPA-0000005",
          options_values: ["9", "8"]
        }
      ],
      variants: [
        {
            "name": "variantname12",
            "cost": 13213,
            "price": 12121,
            "sku": "SKU001",
            "barcode":"13124csdfcwrrw3ewew"
        },
        {
            "name": "dad23dyyy",
            "cost": 1321311,
            "price": 1211121,
            "sku": "SKU002",
            "barcode":"13124csdfcwrrw3ewew"
        }
     ],
      purchasing_tax: 0,
      branch: {
        ids: []
      },
    }
  });

  //use-forms INVENTORY
  const {
    setValue: setValueInventory,
    getValues: getValuesInventory,
    register: registerValueInventory,
    control: controlValueInventory,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      weight: {
        net: "",
        gross: "",
        uom_id: ""
      },
      volume: {
        dimension: {
          length: 0,
          width: 0,
          height: 0
        },
        uom_id: ""
      },
      storage_management: {
        condition: "",
        transportation_type: "belum ada",
        transportation_group: "belum ada",
        temperature: "",
        self_life: 0,
        self_life_unit: ""
      }
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

    
  const data = useProductDetail({
    id:id,
    options: {
      enabled: !!id,
      onSuccess: (data) => {
        data = toSnakeCase(data);
        Object.keys(data).forEach(key => {
          if(key === 'brand'){
            setValue('product_brand_id', data[key].id)
          } else if(key === 'purchase_uom'){
            setValue('purchase_uom_id', data[key].uom_id)
          } else if(key === 'base_uom'){
            setValue('base_uom_id', data[key].uom_id)
          } else {
            setValue(key, data[key]);
          }
        })

        setCanBePurchased(data.canBePurchased);
        setCanBeSold(data.canBeSold);
        setCanExpensed(data.canBeExpensed)

        setValueInventory('weight.net', data.inventory.weight.net )
        setValueInventory('weight.gross',data.inventory.weight.gross )
        setValueInventory('weight.uom_id', data.inventory.weight.uom.id)
        setValueInventory('volume.dimension.width', data.inventory.volume.width)
        setValueInventory('volume.dimension.length', data.inventory.volume.length)
        setValueInventory('volume.dimension.height', data.inventory.volume.height)
        setValueInventory('volume.uom_id', data.inventory.volume.uom.id)
        setValueInventory('storage_management.condition', data.inventory.storage_management.condition)
        setValueInventory('storage_management.self_life', data.inventory.storage_management.self_life)
        setValueInventory('storage_management.self_life_unit', data.inventory.storage_management.self_life_unit)
        setValueInventory('storage_management.temperature', data.inventory.storage_management.temperature)
        setValueInventory('storage_management.transportation_group', data.inventory.storage_management.transportation_group)
        setValueInventory('storage_management.transportation_type', data.inventory.storage_management.transportation_type)
      } 
    }
  })

  const product = data ? toSnakeCase(data?.data) : undefined;
  const isLoadingProduct = id ? data.isLoading : false;

  const getProductVariants = (variant) => variant;
  const { mutate: createProduct, isLoading: isLoadingCreateProduct } = useCreateProduct({
    options: {
      onSuccess: () => router.push('/product-list')
    }
  })
  
  // action function
  const onSubmit = (data: any) => {
    createProduct({   
      "company_id": "KSNI",
      "company_code": "KSNI",
      "status": "active",
      "can_be_sold": true,
      "can_be_purchased": true,
      "can_be_expensed": false,
      "name": getValues('name'),
      "product_type": "consumable",
      "product_category_id": "1",
      "product_brand_id": 9,
      "external_code": "123",
      "expired_date": "2022-11-14 22:11:11",
      "base_uom_id": "MPC-0000004",
      "purchase_uom_id": "MPC-0000005",
      "use_unit_leveling": true,
      "cost_of_product": 123,
      "packaging_size": "20x20",
      "sales_price" : 2000,
      "options": [
          {
          "options_id": "MPA-0000005",
          "options_values": ["9", "8"]
          }
      ],
      "variants" : 
          [
              {
                  "name": "variantname12",
                  "cost": 13213,
                  "price": 12121,
                  "sku": "SKU001",
                  "barcode":"13124csdfcwrrw3ewew"
              },
              {
                  "name": "dad23dyyy",
                  "cost": 1321311,
                  "price": 1211121,
                  "sku": "SKU002",
                  "barcode":"13124csdfcwrrw3ewew"
              }
          ],
      "inventory" : {
          "weight": {
              "net":"123",
              "gross": "1212",
              "uom_id": "MPC-0000005"
          },
          "volume" : {
              "dimension" : {
                  "length": 1,
                  "width": 2,
                  "height": 2
              },
              "uom_id": "MPC-0000005"
          },
          "storage_management": {
              "condition" : "chilled",
              "transportation_type": "121",
              "transportation_group": "road",
              "temperature" : "gatau",
              "self_life": 9,
              "self_life_unit": "days"
          }
      },
      "purchasing_tax" : 1,
      "accounting" : {
          "income_account_id": 1,
          "expense_account_id": 2
      },
      "branch": {
          "ids": ["1"]
      },
      "registration": [
          {
              "number_type" : "uwu1",
              "number": "",
              "valid_from": "2022-11-14 22:11:11",
              "valid_to": "2022-11-14 22:11:11"
          },
          {
              "number_type" : "uwu2",
              "number": "",
              "valid_from": "2022-11-14 22:11:11",
              "valid_to": "2022-11-14 22:11:11"
          }
      ]
  
      
  })
  };

  const propsInventory = {
    setValueInventory,
    getValuesInventory,
    registerValueInventory,
    controlValueInventory,
    product
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

  const propsDetail = { 
    control,
    getProductVariants,
    getValues,
    watch,
    setValue,
    product
  }

  const switchTabItem = () => {
    switch (tabAktived) {
      // case formType === 'Company' && 'Contact':
      //   return <Contact {...propsContacts} />
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
      default:
        return null
    }
  }

  const [searchProductBrand, setSearchProductBrand] = useState("");
  const debounceFetchProductBrand = useDebounce(searchProductBrand, 1000);

  const productType = [
    { value: 'Consumable', id: 'consumable' },
    { value: 'Storagble', id: 'storagble' },
    { value: 'Service', id: 'service' },
  ]

  const productCategory: any = []

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

  return (
    <Col>
      {
       isLoadingProduct ?
          <Spin tip="Loading data..." />
       : 
      <>
      <Row gap="4px">
        <Text variant={"h4"}>Create Product</Text>
      </Row>
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
                defaultValue="active"
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
          />

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant={"primary"} onClick={onSubmit}>
              {isLoadingCreateProduct ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <UploadImage control={control} />
            <Spacer size={20} />
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Input
                  width="100%"
                  label="Product Name"
                  height="48px"
                  placeholder={"e.g Nabati Cheese"}
                  {...register("name")}
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
                      defaultValue={product?.product_type}
                      label="Product Type"
                      width="100%"
                      noSearch
                      items={productType}
                      handleChange={(value: any) => {
                        onChange(value);
                      }}
                      required
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
                  name="product_brand_id"
                 // defaultValue={salesmanGroupFormData?.parentId ?? ""}
                  render={({ field: { onChange } }) => (
                    <>
                      <span>
                        <Label style={{ display: "inline" }}>Product Brand</Label>{" "}
                        <span></span>
                      </span>

                      <Spacer size={3} />
                      <CustomFormSelect
                        defaultValue={product?.brand?.name}
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
                <Input
                    width="100%"
                    label="Expired Date"
                    height="48px"
                    placeholder={"e.g 413111"}
                    {...register("expired_date")}
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

      <DevTool control={control} />
      </>
    }
    </Col>
  )
}

const UploadImage = ({ control }: { control: Control<FormValues> }) => {
  return (
    <Controller
      control={control}
      rules={{ required: true }}
      name="image"
      render={({ field: { onChange } }) => (
        <FileUploaderAllFiles
          label="Product Photo"
          onSubmit={(file: any) => onChange(file)}
          defaultFile="/placeholder-employee-photo.svg"
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

const FlexElement = styled.div`
  display: flex;
  align-items: center;
`

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
`