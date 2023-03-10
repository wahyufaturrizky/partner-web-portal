import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Row,
  Spacer,
  Text,
  DropdownMenuOption,
  FormSelect
} from "pink-lava-ui";

import styled from 'styled-components';
import { useProductOptionsInfiniteLists } from '../../../../hooks/mdm/product-option/useProductOptionMDM';
import useDebounce from '../../../../lib/useDebounce';
import { ICDelete } from '../../../../assets';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { lang } from 'lang';

export default function ProductOptionsCreate({control, setValue }: any) {
  const t = localStorage.getItem("lan") || "en-US";

  // useFieldArray Product Option
  const {
    fields: fieldsProductOption,
    append: appendProductOption,
    remove: removeProductOption,
  } = useFieldArray({
    control,
    name: "options"
  });

  const optionsForm = useWatch({
    control,
    name: 'options'
  })

  const variantsForm = useWatch({
    control,
    name: 'variants'
  })

  const handleAddMoreProductOption = () => {
    appendProductOption({
      option: '',
      option_items: [],
      key: fieldsProductOption?.length
    })
  }

  const [totalRowsProductOptions, setTotalRowsProductOptions] = useState(0);
  const [searchProductOptions, setSearchProductOptions] = useState("");
  const debounceFetchProductOptions = useDebounce(searchProductOptions, 1000);
  const [listProductOptions, setListProductOptions] = useState<any[]>([]);
  const [listProductOptionsValues, setListProductOptionsValues] = useState<any[]>([]);

  const {
    isFetching: isFetchingProductOptions,
    isFetchingNextPage: isFetchingMoreProductOptions,
    hasNextPage: hasNextProductOptions,
    fetchNextPage: fetchNextPageProductOptions,
  } = useProductOptionsInfiniteLists({
    query: {
      search: debounceFetchProductOptions,
      limit: 10,
      company_id: 'KSNI'
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProductOptions(data.pages[0].totalRow);
        const mappedDataProductOption = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.productOptionId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedDataProductOption);
        setListProductOptions(flattenArray);

        const mappedDataProductOptionValues = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any, index) => {
            return {
              key: index,
              items: element.productOptionItems,
              name: element.name,
              id: element.productOptionId,
            };
          });
        });
        const flattenArrayValues = [].concat(...mappedDataProductOptionValues);
        setListProductOptionsValues(flattenArrayValues);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listProductOptions.length < totalRowsProductOptions) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const TableHeader  = () => {
    return (
      <>
      <Row style={{background: "#F4F4F4", borderRadius: "8px 8px 0px 0px", height:"55px"}} 
        justifyContent="center"
        alignItems="center"
        width="100%" noWrap>
        <Row width="20px" gap="16px" alignItems="center" nowrap></Row>
  
        <Row width="360px">
          <Text variant="headingRegular">{lang[t].productList.create.table.optionsName}</Text>
        </Row>
  
        <Spacer size={32} />
           
        <Row width="616px">
          <Text variant="headingRegular">{lang[t].productList.create.table.optionsValue}</Text>
        </Row>
      </Row>
    </>
    )
  }

  return (
    <Col>
        <Text variant="headingMedium" color="blue.darker">Options</Text>
        <Spacer size={12} />
        <Row>
          <Button variant="primary" size="big" onClick={handleAddMoreProductOption}>
            +
            {lang[t].productList.list.button.addNew}
          </Button>
        </Row>
        <Spacer size={12} />
        {fieldsProductOption?.length > 0 &&
          <Col gap="20px">
            <TableHeader />
            {fieldsProductOption.map((product, index) => 
              <ProductOption
                variantsForm={variantsForm}
                optionsForm={optionsForm}
                index={index}
                key={index}
                product={product}
                removeProductOption={removeProductOption}
                control={control}
                listProductOptionsValues={listProductOptionsValues}
                listProductOptions={listProductOptions}
                isFetchingProductOptions={isFetchingProductOptions}
                setSearchProductOptions={setSearchProductOptions}
                isFetchingMoreProductOptions={isFetchingMoreProductOptions}
                fetchNextPageProductOptions={fetchNextPageProductOptions}
                hasNextProductOptions={hasNextProductOptions}
                setValue={setValue}
              />
            )}
          </Col>
        }
    </Col>
  )
}

const ProductOption = ({
  listProductOptions,
  listProductOptionsValues,
  isFetchingProductOptions,
  setSearchProductOptions,
  isFetchingMoreProductOptions,
  hasNextProductOptions,
  fetchNextPageProductOptions,
  removeProductOption,
  control,
  index,
  optionsForm,
}: any) => {

  const [productOption, setProductOption] = useState(optionsForm?.[index]?.option?.id ?? 0)
  const productValues = listProductOptionsValues.find(value => value.id === productOption);
  let productOptionValues = [];

  if(productValues){
    productOptionValues.push(...productValues.items.map(item => ({
      label: item.name,
      value: item.id
    })))
  }

  const productName = listProductOptionsValues?.find(product => product.id === productOption)?.name

  return (
    <>
      <Row style={{flex: 1}} width="100%" noWrap>
        <Row style={{cursor: 'pointer'}} width="30px" gap="16px" alignItems="center" nowrap>
          <Col>
            <ICDelete onClick={() => removeProductOption(index)} />
          </Col>
        </Row>

        <Spacer size={14} />

        <Controller
            control={control}
            name={`options.${index}.option.id`}
            render={({ field: { onChange } }) => (
              <CustomFormSelect
                defaultValue={optionsForm?.[index]?.option?.name || productName}
                style={{ width: "360px", height: '48px' }}
                size={"large"}
                placeholder={"Select"}
                borderColor={"#AAAAAA"}
                arrowColor={"#000"}
                withSearch
                isLoading={isFetchingProductOptions}
                isLoadingMore={isFetchingMoreProductOptions}
                fetchMore={() => {
                  if (hasNextProductOptions) {
                    fetchNextPageProductOptions();
                  }
                }}
                items={
                  isFetchingProductOptions || isFetchingMoreProductOptions
                    ? []
                    : listProductOptions
                }
                onChange={(value: any) => {
                  setProductOption(value);
                  onChange(value)
                }}
                onSearch={(value: any) => {
                  setSearchProductOptions(value);
                }}
              />
            )}
        />

        <Spacer size={32} />
           
        <Row width="616px">
          <Controller
            control={control}
            name={`options.${index}.option_items`}
            render={({ field: { onChange } }) => (
              <CustomDropdownOption
                  label=""
                  handleChangeValue={(value) => {
                    onChange(value);
                  }}
                  listItems={productOptionValues}
                  valueSelectedItems={optionsForm?.[index]?.option_items?.map(data => data.id || data.value)}
                />
            )}
          />
        </Row>
      </Row>
    </>
  )
}

const CustomDropdownOption = styled(DropdownMenuOption)`
  && {
    width: 100%;
  }
  .ant-col {
    width: 616px;
  }
  width: 616px;
  div:first-child {
    width: 616px;
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