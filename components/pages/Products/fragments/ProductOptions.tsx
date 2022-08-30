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
import { Controller, useFieldArray } from 'react-hook-form';

export default function ProductOptions({control, setValue}: any) {

  // useFieldArray BANK
  const {
    fields: fieldsProductOption,
    append: appendProductOption,
    remove: removeProductOption,
  } = useFieldArray({
    control,
    name: "product_option"
  });

  const handleAddMoreProductOption = () => {
    appendProductOption({
      options_id: '',
      options_value: [],
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

  return (
    <Col>
        <Text variant="headingMedium" color="blue.darker">Options</Text>
        <Spacer size={12} />
        <Row>
          <Button variant="primary" size="big" onClick={handleAddMoreProductOption}>
            +
            Add New
          </Button>
        </Row>
        <Spacer size={12} />
        <Col gap="20px">
          {fieldsProductOption.map((product, index) => 
            <ProductOption
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
  setValue
}: any) => {

  const [productOption, setProductOption] = useState(0)
  const productValues = listProductOptionsValues.find(value => value.id === productOption);

  let productOptionValues = [];

  if(productValues){
    productOptionValues.push(...productValues.items.map(item => ({
      label: item.name,
      value: item.id
    })))
  }

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
            name={`options.${index}.options_id`}
            render={({ field: { onChange } }) => (
              <CustomFormSelect
                //defaultValue={accounting?.incomeAccountId?.name}
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
            name={`options.${index}.options_values`}
            render={({ field: { onChange } }) => (
              <CustomDropdownOption
                  label=""
                  handleChangeValue={(value) => {
                    onChange(value);
                  }}
                  listItems={productOptionValues}
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