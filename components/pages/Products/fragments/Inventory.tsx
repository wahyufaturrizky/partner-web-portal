import React, { useState } from 'react'
import {
  Row,
  Col,
  Dropdown2,
  Spacer,
  Input,
  Text,
  FormSelect
} from 'pink-lava-ui'
import styled from 'styled-components'
import useDebounce from '../../../../lib/useDebounce'
import { useUOMInfiniteLists } from '../../../../hooks/mdm/unit-of-measure/useUOM'
import { Controller } from 'react-hook-form'

export default function Inventory(props: any) {
  const { setValueInventory, registerValueInventory, controlValueInventory, product } = props
  const storageCondition = [
    { id: 'cold', label: 'Cold', value: 'Cold' },
    { id: 'chilled', label: 'Chilled', value: 'Chilled' },
    { id: 'dry', label: 'Dry', value: 'Dry' },
  ]

  const shelfLifeUnit = [
    { id: 'days', label: 'Days', value: 'Days' },
    { id: 'months', label: 'Months', value: 'Months' },
  ]

  const [length, setLength] = useState(product?.inventory?.volume?.length ?? 0);
  const [width, setWidth] = useState(product?.inventory?.volume?.width ?? 0);
  const [height, setHeight] = useState(product?.inventory?.volume?.height ?? 0);

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
              label: element.format,
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

  return (
    <div>
      <Col>
        <HeaderLabel>Weight Management</HeaderLabel>
        <Spacer size={20} />
        <Row gap="20px" width="100%">
          <Col width="48%">
            <Input
              width="100%"
              label="Net Weight"
              height="48px"
              placeholder={"e.g Nabati Cheese"}
              {...registerValueInventory("weight.net")}
              required
            />
          <Spacer size={20} />
            <Controller
              control={controlValueInventory}
              name="weight.uom_id"
              defaultValue={product?.weight?.uom?.name}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <span>
                    <Label style={{ display: "inline" }}>Weight Unit of Measure</Label>{" "}
                    <span></span>
                  </span>

                  <Spacer size={3} />
                  <CustomFormSelect
                    defaultValue={product?.inventory?.weight?.uom?.name}
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
          </Col>
          <Col width="48%">
            <Input
              width="100%"
              label="Gross Weight"
              height="48px"
              placeholder={"e.g Nabati Cheese"}
              {...registerValueInventory("weight.gross")}
              required
            />
          </Col>
        </Row>
        <Spacer size={32} />
      </Col>
      <Col>
        <Label>Volume Management</Label>
        <Spacer size={20} />
        <Row gap="20px" width="100%" noWrap>
          <Col gap="4px" width="100%" noWrap>
            <Text style={{ position: 'absolute' }} variant="subtitle1" color="black.regular">Dimension (Length x Width x Height)</Text>
            <Row gap="4px" width="100%" noWrap>
              <CustomInput
                label=""
                height="48px"
                placeholder={"e.g 7"}
                value={length}
                type={"number"}
                minValue="0"
                onChange={(e:any) => {
                  setLength(e.target.value)
                  setValueInventory("volume.dimension.length", e.target.value)
                }}
              />
              <Symbol>
                X
              </Symbol>
              <CustomInput
                label=""
                height="48px"
                placeholder={"e.g 7"}
                value={width}
                type={"number"}
                minValue="0"
                onChange={(e:any) => {
                  setWidth(e.target.value)
                  setValueInventory("volume.dimension.width", e.target.value)
                }}
              />
              <Symbol>
                X
              </Symbol>
              <CustomInput
                label=""
                height="48px"
                placeholder={"e.g 7"}
                value={height}
                type={"number"}
                minValue="0"
                onChange={(e:any) => {
                  setHeight(e.target.value)
                  setValueInventory("volume.dimension.height", e.target.value)
                }}
              />
            </Row>
          </Col>
          <Controller
              control={controlValueInventory}
              name="volume.uom_id"
              defaultValue={product?.inventory?.volume?.uom?.name}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <span>
                    <Label style={{ display: "inline" }}>Volume Unit of Measure</Label>{" "}
                    <span></span>
                  </span>

                  <Spacer size={3} />
                  <CustomFormSelect
                    defaultValue={product?.inventory?.volume?.uom?.name}
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
        <Spacer size={20} />
        <Row gap="20px" width="calc((100%/2) - 10px)" noWrap>
          <Input
            width="100%"
            label="Volume"
            height="48px"
            placeholder={"e.g 7"}
            value={length * height * width}
            required
            disabled
          />
        </Row>
        <Spacer size={32} />
      </Col>
      <Col>
        <Label>Storage Management</Label>
        <Spacer size={20} />
        <Row gap="20px" width="100%" noWrap>
          <Dropdown2
            label="Storage Condition"
            width="100%"
            items={storageCondition}
            handleChange={(value: string) => setValueInventory("storage_management.condition", value)}
            onSearch={(search: string) => {}}
            required
            defaultValue={product?.inventory?.storage_management?.condition}
          />
          <Input
              width="100%"
              label="Temperature Condition"
              height="48px"
              placeholder={"e.g 30 Degree Celcius"}
              {...registerValueInventory("storage_management.temperature")}
              required
            />
        </Row>
        <Spacer size={20} />
        <Row gap="20px" width="100%" noWrap>
          <Dropdown2
            label="Transportation Group"
            width="100%"
            items={[]}
            handleChange={(value: string) => setValueInventory("storage_management.transportationGroup", value)}
            onSearch={(search: string) => {}}
            required
            defaultValue={product?.inventory?.storage_management?.transportation_group}
          />
          <Dropdown2
            label="Transportation Type"
            width="100%"
            items={[]}
            handleChange={(value: string) => setValueInventory("storage_management.transportationType", value)}
            onSearch={(search: string) => {}}
            required
            defaultValue={product?.inventory?.storage_management?.transportation_type}
          />
        </Row>
        <Spacer size={20} />
        <Row gap="20px" width="100%" noWrap>
          <Input
            width="100%"
            label="Shelf Life"
            height="48px"
            placeholder={"e.g 7"}
            {...registerValueInventory("storage_management.self_life")}
            required
          />
          <Dropdown2
            label="Shelf Life Unit"
            width="100%"
            items={shelfLifeUnit}
            handleChange={(value: string) => setValueInventory("storage_management.self_life_unit", value)}
            onSearch={(search: string) => {}}
            required
            defaultValue={product?.inventory?.storage_management?.self_life_unit}
          />
        </Row>
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

const CustomInput = styled(Input)`
  width: 100% !important;
`

const Symbol = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
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