import React, { useState } from 'react'
import {
  Modal,
  Button,
  FormSelect,
  Input,
  RangeDatePicker,
  Col,
  Spacer,
  Row,
  Text,
  FormInput,
  Tooltip
} from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Controller, useForm, useWatch } from "react-hook-form";
import moment from 'moment';
import { useProductCategoryInfiniteLists } from 'hooks/mdm/product-category/useProductCategory';
import useDebounce from 'lib/useDebounce';
import styled from 'styled-components';
import { useProductVariantInfiniteLists } from 'hooks/mdm/product-variant/useProductVariant';
import { useProductGroupInfiniteLists } from 'hooks/mdm/product-group/useProductGroup';

interface PropsContactModal {
  visible: true | false
  onCancel: () => void
  onSubmit: (index: any, data: any) => void
  defaultValues: any
  index: any
}

export default function ModalAddRetailPricing({
  visible,
  onCancel,
  onSubmit,
  defaultValues,
  index
}: PropsContactModal) {

  const defaultCreateValue = {
    price_computation: 'FORMULA',
    based_on: 'COST',
    apply_on: 'ALL PRODUCT',
    valid_date: [moment(), moment()]
  }
  
  if(defaultValues?.valid_date){
    defaultValues.valid_date = defaultValues.valid_date.map((date:any) => {
        console.log('date', date)
        if(moment(date, 'DD/MM/YYYY', true).isValid()){
          return moment(date, 'DD/MM/YYYY')
        }  else {
          return moment(date);
        }
      }
    )
  }

  console.log("defaultValues", defaultValues)

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: defaultValues ? defaultValues : defaultCreateValue
  });

  const retailPricing = watch();

  const applyOnWatch = useWatch({
    control,
    name: "apply_on",
  });

  const priceComputationOnWatch = useWatch({
    control,
    name: "price_computation",
  });

  const basedOnWatch = useWatch({
    control,
    name: "based_on",
  });

  const [listProductCategory , setListProductCategory] = useState<any[]>([]);
  const [totalRowsProductCategory, setTotalRowsProductCategory] = useState(0);
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const debounceFetchProductCategory = useDebounce(searchProductCategory, 1000);

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

  const [listProductVariant , setListProductVariant] = useState<any[]>([]);
  const [totalRowsProductVariant, setTotalRowsProductVariant] = useState(0);
  const [searchProductVariant, setSearchProductVariant] = useState("");
  const debounceFetchProductVariant = useDebounce(searchProductVariant, 1000);

  const {
    isFetching: isFetchingProductVariant,
    isFetchingNextPage: isFetchingMoreProductVariant,
    hasNextPage: hasNextProductVariant,
    fetchNextPage: fetchNextPageProductVariant,
  } = useProductVariantInfiniteLists({
    query: {
      search: debounceFetchProductVariant,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductVariant(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name, 
              value: element.productVariantId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListProductVariant(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listProductVariant.length < totalRowsProductVariant) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const [listProductGroup , setListProductGroup] = useState<any[]>([]);
  const [totalRowsProductGroup, setTotalRowsProductGroup] = useState(0);
  const [searchProductGroup, setSearchProductGroup] = useState("");
  const debounceFetchProductGroup = useDebounce(searchProductGroup, 1000);

  const {
    isFetching: isFetchingProductGroup,
    isFetchingNextPage: isFetchingMoreProductGroup,
    hasNextPage: hasNextProductGroup,
    fetchNextPage: fetchNextPageProductGroup,
  } = useProductGroupInfiniteLists({
    query: {
      search: debounceFetchProductGroup,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductGroup(data?.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              label: element.name, 
              value: element.productGroupId,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListProductGroup(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listProductGroup.length < totalRowsProductGroup) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const onSave = (data: any) => {
    let newRule: any = {
      apply_on: data.apply_on,
      price_computation: data.price_computation,
      min_qty: data.min_qty,
      valid_date: data.valid_date.map((date: any) => moment(date, 'DD/MM/YYYY').utc().toString())
    }

    if(data.apply_on === 'PRODUCT VARIANT'){
      newRule.product_variant = data.product_variant
    }
    if(data.apply_on === 'PRODUCT CATEGORY'){
      newRule.product_category = data.product_category
    }
    if(data.apply_on === 'PRODUCT GROUP'){
      newRule.product_group = data.product_group
    }

    if(data.price_computation !== 'FORMULA') {
      newRule.value = data.value
    }
    
    if(data.price_computation === 'FORMULA') {
      newRule.based_on = data.based_on

      if(data.based_on === 'COST'){
        newRule.margin_min = data.margin_min
        newRule.margin_max = data.margin_max
        newRule.extra_fee = data.extra_fee
        newRule.rounding_method = data.rounding_method
      }
    }
    onSubmit(index, newRule)
    onCancel()

  }
  const validDateDefault = retailPricing?.valid_date
  return (
    <Modal
      width={880}
      visible={visible}
      onCancel={onCancel}
      title="Retail Price Rule"
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
					<Button size="big" variant="secondary" key="submit" type="primary" onClick={() => onCancel()}>
						Cancel
					</Button>
					<Button variant="primary" size="big" onClick={handleSubmit(onSave)}>
						{"Save"}
					</Button>
				</div>
      }
      content={
        <>
        <Spacer size={20} />
        <Row width="100%" noWrap>
          <Controller
            control={control}
            rules={{ required: true }}
            shouldUnregister={true}
            name="price_computation"
            defaultValue={retailPricing?.price_computation}
            render={({ field: { onChange }, formState: { errors } }) => (
              <Col width="100%">
                <span>
                  <Label style={{ display: "inline" }}>Price Computation </Label>{" "}
                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title={`Price Computation`}
                    color={"#F4FBFC"}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  size={"large"}
                  style={{ width: "100%" }}
                  defaultValue={retailPricing?.price_computation}
                  items={[
                    { label: 'Discount', value: 'DISCOUNT' },
                    { label: 'Formula', value: 'FORMULA' },
                    { label: 'Fixed Price', value: 'FIXED PRICE' },
                  ]}
                  onChange={(value: any) => {
                    onChange(value);
                  }}
                />
              </Col>
            )}
          />
          <Spacer size={20} />
          <div style={{ visibility: "hidden", width: "100%" }}>
            <Input
              label="Name"
              height="48px"
              placeholder={"e.g 10000000"}
            />
          </div>
        </Row>

        <Spacer size={20} />

       {priceComputationOnWatch === 'FIXED PRICE' && 
        <Row width="100%">
            <Col width="50%">
              <Controller
                  control={control}
                  name="value"
                  defaultValue={retailPricing?.value}
                  render={({ field: { onChange } }) => (
                    <Col width="100%">
                      <Label>
                        Fixed Price
                      </Label>
                      <Spacer size={3} />
                      <CustomFormInput
                        size={"large"}
                        defaultValue={retailPricing?.value}
                        onChange={(value:any) => onChange(value)}
                        placeholder={`e.g 0.1`}
                        style={{ height: 48, width: '100%' }}
                        type="number"
                      />
                    </Col>
                  )}
                />
            </Col>
          </Row>
        }

       {priceComputationOnWatch === 'DISCOUNT' && 
          <Row width="100%">
            <Col width="50%">
              <Controller
                  control={control}
                  name="value"
                  defaultValue={retailPricing?.value}
                  render={({ field: { onChange } }) => (
                    <Col width="100%">
                      <Label>
                        Discount Price
                      </Label>
                      <Spacer size={3} />
                      <FormInput
                        size={"large"}
                        defaultValue={retailPricing?.value}
                        onChange={(value:any) => onChange(value)}
                        placeholder={`e.g 0.1`}
                        style={{ height: 48, width: '100%' }}
                        suffix="%"
                      />
                    </Col>
                  )}
                />
            </Col>
          </Row>
        }

      {priceComputationOnWatch === 'FORMULA' && 
      <>
       <Row>
          <Row width="100%" noWrap>
            <Row width="100%">
              <Controller
                  control={control}
                  rules={{ required: true }}
                  shouldUnregister={true}
                  name="based_on"
                  defaultValue={retailPricing?.based_on}
                  render={({ field: { onChange }, formState: { errors } }) => (
                    <Col width="100%">
                      <span>
                        <Label style={{ display: "inline" }}>Based On </Label>{" "}
                        <Tooltip
                          overlayInnerStyle={{ width: "fit-content" }}
                          title={`Based On`}
                          color={"#F4FBFC"}
                        >
                          <ExclamationCircleOutlined />
                        </Tooltip>
                      </span>

                      <Spacer size={3} />
                      <CustomFormSelect
                        defaultValue={retailPricing?.based_on}
                        size={"large"}
                        style={{ width: "100%" }}
                        items={[
                          { label: 'Pricing Structure ', value: 'PRICING STRUCTURE' },
                          { label: 'Cost', value: 'COST' },
                        ]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                      />
                    </Col>
                  )}
                />
            </Row>
            <Spacer size={20} />
            {basedOnWatch === 'COST' ?
              <Row width="100%">
                <Controller
                  control={control}
                  name="rounding_method"
                  defaultValue={retailPricing?.rounding_method}
                  render={({ field: { onChange } }) => (
                    <Col width="100%">
                      <Row width="100%" alignItems="center">
                        <Label>
                          Rounding Method
                        </Label>
                        <Spacer size={5} display="inline" />
                        <Tooltip
                            overlayInnerStyle={{ width: "fit-content" }}
                            title={`Rounding Method`}
                            color={"#F4FBFC"}
                          >
                            <ExclamationCircleOutlined />
                        </Tooltip>
                      </Row>
                      <Spacer size={3} />
                      <CustomFormInput
                        size={"large"}
                        defaultValue={retailPricing?.rounding_method}
                        onChange={(value:any) => onChange(value)}
                        placeholder={`e.g 0.1`}
                        style={{ height: 48, width: '100%' }}
                        type="number"
                      />
                    </Col>
                  )}
                />
              </Row>
              :
              <div style={{ visibility: "hidden", width: "100%" }}>
                <Input
                  label="Name"
                  height="48px"
                  placeholder={"e.g 10000000"}
                />
              </div>
            }
          </Row>
            
          <Spacer size={20} />
          {basedOnWatch === 'COST' && 
            <Row>
              <Row width="100%" noWrap>
                <Row width="100%">
                  <Controller
                    control={control}
                    name="margin_min"
                    defaultValue={retailPricing?.margin_min}
                    render={({ field: { onChange } }) => (
                      <Col width="100%">
                        <Label>
                          Margin Minimum
                        </Label>
                        <Spacer size={3} />
                        <CustomFormInput
                          size={"large"}
                          defaultValue={retailPricing?.margin_min}
                          onChange={(value:any) => onChange(value)}
                          placeholder={`e.g 0.1`}
                          style={{ height: 48, width: '100%' }}
                          type="number"
                        />
                      </Col>
                    )}
                  />
                </Row>

                <Spacer size={20} />

                <Row width="100%">
                  <Controller
                    control={control}
                    name="margin_max"
                    defaultValue={retailPricing?.margin_max}
                    render={({ field: { onChange } }) => (
                      <Col width="100%">
                        <Label>
                          Margin Maximum
                        </Label>
                        <Spacer size={3} />
                        <CustomFormInput
                          size={"large"}
                          defaultValue={retailPricing?.margin_max}
                          onChange={(value:any) => onChange(value)}
                          placeholder={`e.g 0.1`}
                          style={{ height: 48, width: '100%' }}
                          type="number"
                        />
                      </Col>
                    )}
                  />
                </Row>
              </Row>

              <Spacer size={20} />

              <Row width="100%" noWrap alignItems="flex-end">
                <Row width="100%">
                  <Controller
                    control={control}
                    name="extra_fee"
                    defaultValue={retailPricing?.extra_fee}
                    render={({ field: { onChange } }) => (
                      <Col width="100%">
                        <Label>
                          Extra Fee
                        </Label>
                        <Spacer size={3} />
                        <CustomFormInput
                          size={"large"}
                          defaultValue={retailPricing?.extra_fee}
                          onChange={(value:any) => onChange(value)}
                          placeholder={`e.g 0.1`}
                          style={{ height: 48, width: '100%' }}
                          type="number"
                        />
                      </Col>
                    )}
                  />
                </Row>

                <Spacer size={20} />

                <Row width="100%">
                  <Col width="100%">
                    <Label>
                      Hint
                    </Label>
                    <Spacer size={3} />
                    <CustomForm>
                      <Span>
                        Sales Price with a 10.0% discount and $500.00 Extra fee
                        Example : $ 100.00*0.9 + $500.00 = $ 590.00
                      </Span>
                    </CustomForm>
                  </Col>
                </Row>
              </Row>
            </Row>
          } 
          </Row>
      </>
    }
        
        <Spacer size={32} />

        <Text variant="headingMedium" color="blue.dark">Conditions</Text>
        
        <Spacer size={4} />

        <Row width="100%" noWrap>
          <Row width="100%">
            <Controller
              control={control}
              rules={{ required: true }}
              shouldUnregister={true}
              defaultValue={retailPricing?.apply_on}
              name="apply_on"
              render={({ field: { onChange }, formState: { errors } }) => (
                <Col width="100%">
                  <span>
                    <Label style={{ display: "inline" }}>Apply on </Label>{" "}
                    <Tooltip
                      overlayInnerStyle={{ width: "fit-content" }}
                      title={`Apply On`}
                      color={"#F4FBFC"}
                    >
                        <ExclamationCircleOutlined />
                    </Tooltip>
                  </span>
                  <Spacer size={4} />
                  <CustomFormSelect
                    defaultValue={retailPricing?.apply_on}
                    size={"large"}
                    style={{ width: "100%" }}
                    items={[
                      { label: 'All Product', value: 'ALL PRODUCT' },
                      { label: 'Product Category', value: 'PRODUCT CATEGORY' },
                      { label: 'Product Group', value: 'PRODUCT GROUP' },
                      { label: 'Product Variant', value: 'PRODUCT VARIANT' },
                    ]}
                    onChange={(value: any) => {
                      onChange(value);
                    }}
                />
                </Col>
              )}
            />
          </Row>
          <Spacer size={20} />

          {applyOnWatch === 'ALL PRODUCT' && 
            <div style={{ visibility: "hidden", width: "100%" }}>
              <Input
                label="Name"
                height="48px"
                placeholder={"e.g 10000000"}
              />
            </div>
          }

          {applyOnWatch === "PRODUCT CATEGORY" && 
            <Row width="100%" noWrap>
              <Col width="100%">
                <span>
                  <Label style={{ display: "inline" }}>Category </Label>{" "}
                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title={`Product Category`}
                    color={"#F4FBFC"}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  labelInValue
                  defaultValue={retailPricing?.product_category?.name}
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
                    setValue('product_category.name', value.label)
                    setValue('product_category.id', value.key)
                  }}
                  onSearch={(value: any) => {
                    setSearchProductCategory(value);
                  }}
                />
              </Col>
            </Row>
          }

          {applyOnWatch === "PRODUCT VARIANT" && 
            <Row width="100%">
              <Col width="100%">
                <span>
                  <Label style={{ display: "inline" }}>Product Variant Name</Label>{" "}
                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title={`Product Variant Name`}
                    color={"#F4FBFC"}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  labelInValue
                  defaultValue={retailPricing?.product_variant?.name}
                  style={{ width: "100%", height: '48px' }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingProductVariant}
                  isLoadingMore={isFetchingMoreProductVariant}
                  fetchMore={() => {
                    if (hasNextProductVariant) {
                      fetchNextPageProductVariant();
                    }
                  }}
                  items={
                    isFetchingProductVariant || isFetchingMoreProductVariant
                      ? []
                      : listProductVariant
                  }
                  onChange={(value: any) => {
                    setValue('product_variant.name', value.label)
                    setValue('product_variant.id', value.key)
                  }}
                  onSearch={(value: any) => {
                    setSearchProductVariant(value);
                  }}
                />
              </Col>
            </Row>
          }

          {applyOnWatch === "PRODUCT GROUP" && 
           <Row width="100%">
              <Col width="100%">
                <span>
                  <Label style={{ display: "inline" }}>Product Group Name</Label>{" "}
                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title={`Product Group Name`}
                    color={"#F4FBFC"}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  labelInValue
                  defaultValue={retailPricing?.product_group?.name}
                  style={{ width: "100%", height: '48px' }}
                  size={"large"}
                  placeholder={"Select"}
                  borderColor={"#AAAAAA"}
                  arrowColor={"#000"}
                  withSearch
                  isLoading={isFetchingProductGroup}
                  isLoadingMore={isFetchingMoreProductGroup}
                  fetchMore={() => {
                    if (hasNextProductGroup) {
                      fetchNextPageProductGroup();
                    }
                  }}
                  items={
                    isFetchingProductGroup || isFetchingMoreProductGroup
                      ? []
                      : listProductGroup
                  }
                  onChange={(value: any) => {
                    setValue('product_group.name', value.label)
                    setValue('product_group.id', value.key)
                  }}
                  onSearch={(value: any) => {
                    setSearchProductGroup(value);
                  }}
                />
              </Col>
           </Row>
          }
        </Row>

        <Spacer size={20} />

        <Row size="100%" noWrap justifyContent="center">
          <Row width="100%">
            <Controller
              control={control}
              name="min_qty"
              defaultValue={retailPricing?.min_qty}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <Label>
                    Minimum Quantity
                  </Label>
                  <Spacer size={3} />
                  <CustomFormInput
                    size={"large"}
                    defaultValue={retailPricing?.min_qty}
                    onChange={(value:any) => onChange(value)}
                    placeholder={`e.g 0.1`}
                    style={{ height: 48, width: '100%' }}
                    type="number"
                  />
                </Col>
              )}
            />
          </Row>

          <Spacer size={20} />

          <Row width="100%">
            <Controller
              control={control}
              defaultValue={validDateDefault}
              name={`valid_date`}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <RangeDatePicker
                    separator={<span>-</span>}
                    fullWidth
                    defaultValue={validDateDefault}
                    onChange={(date: any, dateString: any) => onChange(dateString)}
                    label="Validity Date"
                    format={'DD/MM/YYYY'}
                  />
                </Col>
              )}
            />
          </Row>
        </Row>
        <Spacer size={30} />
        </>
      }
    />
  )
}

const CustomForm = styled.div`
  background: #D5FAFD;
  border-radius: 8px;
  height: 50px;
  justify-content: center;
  align-items: center;
  padding: 15px;
  display: flex;
  gap: 8px;
`

const Span = styled.div`
  font-family: 'Nunito Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #165F66;
`

const Link = styled.a`  
  font-family: 'Nunito Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #EB008B;
`

const CustomFormInput = styled(FormInput)`
  input {
    height: 48px !important;
  }
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

  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }
`

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;
