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
import { Controller, useWatch } from 'react-hook-form'

export default function Inventory(props: any) {
  const { setValue, register, control } = props

  const inventoryForm = useWatch({
    control: control,
    name: 'inventory'
  });

  const storageCondition = [
    { id: 'cold', label: 'Cold', value: 'Cold' },
    { id: 'chilled', label: 'Chilled', value: 'Chilled' },
    { id: 'dry', label: 'Dry', value: 'Dry' },
  ]

  const shelfLifeUnit = [
    { id: 'days', label: 'Days', value: 'Days' },
    { id: 'months', label: 'Months', value: 'Months' },
  ]

  const [length, setLength] = useState(inventoryForm?.volume?.length ?? 0);
  const [width, setWidth] = useState(inventoryForm.volume?.width ?? 0);
  const [height, setHeight] = useState(inventoryForm.volume?.height ?? 0);

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
              {...register("inventory.weight.net", {
                required: 'Net Weight must be filled'
              })}
            />
          <Spacer size={20} />
            <Controller
              control={control}
              name="inventory.weight.uom.id"
              defaultValue={inventoryForm?.weight?.uom?.id}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <span>
                    <Label style={{ display: "inline" }}>Weight Unit of Measure</Label>{" "}
                    <span></span>
                  </span>

                  <Spacer size={3} />
                  <CustomFormSelect
                    defaultValue={inventoryForm.weight?.uom?.name}
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
              {...register("inventory.weight.gross")}
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
                  setValue("inventory.volume.length", e.target.value)
                  setValue("inventory.volume.total_volume", e.target.value * width * height)
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
                  setValue("inventory.volume.width", e.target.value)
                  setValue("inventory.volume.total_volume", e.target.value * length * height)
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
                  setValue("inventory.volume.height", e.target.value)
                  setValue("inventory.volume.total_volume", e.target.value * width * length)
                }}
              />
            </Row>
          </Col>
          <Controller
              control={control}
              name="inventory.volume.uom.id"
              defaultValue={inventoryForm.volume?.uom?.id}
              render={({ field: { onChange } }) => (
                <Col width="100%">
                  <span>
                    <Label style={{ display: "inline" }}>Volume Unit of Measure</Label>{" "}
                    <span></span>
                  </span>

                  <Spacer size={3} />
                  <CustomFormSelect
                    defaultValue={inventoryForm.volume?.uom?.name}
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
            handleChange={(value: string) => setValue("inventory.storage_management.condition", value)}
            onSearch={(search: string) => {}}
            defaultValue={inventoryForm.storage_management?.condition}
          />
          <Input
              width="100%"
              label="Temperature Condition"
              height="48px"
              placeholder={"e.g 30 Degree Celcius"}
              {...register("inventory.storage_management.temperature")}
            />
        </Row>
        <Spacer size={20} />
        <Row gap="20px" width="100%" noWrap>
          <Dropdown2
            label="Transportation Group"
            width="100%"
            items={[]}
            handleChange={(value: string) => setValue("inventory.storage_management.transportation_group", value)}
            onSearch={(search: string) => {}}
            defaultValue={inventoryForm.storage_management?.transportation_group}
          />
          <Dropdown2
            label="Transportation Type"
            width="100%"
            items={[]}
            handleChange={(value: string) => setValue("inventory.storage_management.transportation_type.id", value)}
            onSearch={(search: string) => {}}
            defaultValue={inventoryForm.storage_management?.transportation_type?.name}
          />
        </Row>
        <Spacer size={20} />
        <Row gap="20px" width="100%" noWrap>
          <Input
            width="100%"
            label="Shelf Life"
            height="48px"
            placeholder={"e.g 7"}
            {...register("inventory.storage_management.self_life")}
          />
          <Dropdown2
            label="Shelf Life Unit"
            width="100%"
            items={shelfLifeUnit}
            handleChange={(value: string) => setValue("inventory.storage_management.self_life_unit", value)}
            onSearch={(search: string) => {}}
            defaultValue={inventoryForm.storage_management?.self_life_unit}
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