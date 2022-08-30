import React, { useState } from 'react'
import styled from 'styled-components'
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
  Pagination
} from 'pink-lava-ui'

import { useUOMInfiniteLists } from '../../../../hooks/mdm/unit-of-measure/useUOM';
import useDebounce from '../../../../lib/useDebounce';
import { Controller } from 'react-hook-form';
import _ from 'lodash';
import usePagination from '@lucasmogari/react-pagination';
import ProductOptions from './ProductOptions';

export default function Detail(props: any) {
  const {
    control,
    watch,
    setValue,
    product
  } = props

  const columsVariant = [
    {
      title: "Variant Name",
      dataIndex: "name",
    },
    {
      title: "Cost",
      dataIndex: "cost",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "SKU",
      dataIndex: "sku",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const [totalRowsUomTemplate, setTotalRowsUomTemplate] = useState(0);
  const [searchUomTemplate, setSearchUomTemplate] = useState("");
  const debounceFetchUomTemplate = useDebounce(searchUomTemplate, 1000);
  const [listUomTemplate, setListUomTemplate] = useState<any[]>([]);
  
  const {
    isFetching: isFetchingUomTemplate,
    isFetchingNextPage: isFetchingMoreUomTemplate,
    hasNextPage: hasNextUomTemplate,
    fetchNextPage: fetchNextPageUomTemplate,
  } = useUOMInfiniteLists({
    query: {
      search: debounceFetchUomTemplate,
      limit: 10,
      company_id: 'KSNI'
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

  const combinationVariant = (list:string[][] = [[]], n = 0, result:any=[], current:any = []) => {
    if (n === list.length) result.push(current)
    else list[n].forEach(item => combinationVariant(list, n+1, result, [...current, item]))
 
    return result
  }


  const [searchVariant, setSearchVariant] = useState('')
  let options = watch('options')?.filter(data => {
    if(data.options_id && data.options_values) return true
    return false
  })

  let allValues = options.map(data => data.options_values.map(data => data.label));
  const variants = combinationVariant(allValues)?.map(data => data.join(" "));
  const variantsData = variants.map(variant => ({
    name: variant,
    cost: 0,
    price: 0,
    sku: '-',
    barcode: '-',
    action: (
        <Button
          size="small"
          onClick={() => {}}
          variant="tertiary"
        >
          View Detail
        </Button>
      )
  }))

  const paginationVariant = usePagination({
		page: 1,
		itemsPerPage: 5,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: variantsData.length,
	});
	const page = paginationVariant?.page;
  let paginateVariant = variantsData?.slice(5 * (page - 1), 5 * page) || [];
  paginateVariant = paginateVariant.filter(variant => variant.name.toLowerCase().includes(searchVariant.toLowerCase()));

  return (
    <div>
      <Row gap="20px" width="100%" noWrap>
          <Controller
            control={control}
            name="base_uom_id"
            //defaultValue={accounting?.incomeAccountId?.id}
            render={({ field: { onChange } }) => (
              <Col width="100%">
                <span>
                  <Label style={{ display: "inline" }}>Base of Unit Measure</Label>{" "}
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  //defaultValue={product?.base_uom?.name}
                  style={{ width: "100%", height: '48px' }}
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
                  items={
                    isFetchingUomTemplate || isFetchingMoreUomTemplate
                      ? []
                      : listUomTemplate
                  }
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
          <Controller
            control={control}
            name="purchase_uom_id"
            //defaultValue={accounting?.incomeAccountId?.id}
            render={({ field: { onChange } }) => (
              <Col width="100%">
                <span>
                  <Label style={{ display: "inline" }}>Purchase of Unit Measure</Label>{" "}
                  <span></span>
                </span>

                <Spacer size={3} />
                <CustomFormSelect
                  defaultValue={product?.purchase_uom?.name}
                  style={{ width: "100%", height: '48px' }}
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
                  items={
                    isFetchingUomTemplate || isFetchingMoreUomTemplate
                      ? []
                      : listUomTemplate
                  }
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
        <Text variant="body1">Use Unit of Measure Leveling?</Text>
        <Controller
          control={control}
          name="use_unit_leveling"
          //defaultValue={companyData.useApproval}
          render={({ field: { onChange } }) => (
            <Switch
              defaultChecked={product?.use_unit_leveling}
              checked={product?.use_unit_leveling}
              onChange={(value: any) => {
                onChange(value)
              }}
            />
          )}
        />
      </Col>

      <Spacer size={42} />
      <Divider />
      <Spacer size={39} />
      <Col>
        <ProductOptions 
          control={control} 
          setValue={setValue}
        />
      </Col>
      <Spacer size={48} />

      <Col>
        <Text variant="headingMedium" color="blue.darker">Variant</Text>
        <Spacer size={26} />
        <Search
            placeholder={`Search Variant Name, SKU Code `}
            onChange={(e: any) => setSearchVariant(e.target.value)}
            width="360px"
            height="48px"
				/>
        <Spacer size={16} />
        <Table
          columns={columsVariant}
          data={paginateVariant}
          width="100%"
        />
        <Pagination pagination={paginationVariant} />
      </Col>
    </div>
  )
}

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const HeaderLabel = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
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

const Divider = styled.div`
	border: 1px dashed #dddddd;
`;