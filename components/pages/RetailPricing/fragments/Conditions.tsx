import React, { useState, useRef, useEffect } from "react";
import { Text, Col, Row, Spacer, Spin, Input, FormSelectCustom, FormSelect, DropdownMenuOptionCustom, Tooltip } from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import styled from "styled-components";
import { useBranchInfiniteLists } from "hooks/mdm/branch/useBranch";
import { useSalesOrganization, useSalesOrganizationHirarcy } from "hooks/sales-organization/useSalesOrganization";
import { useCountryInfiniteLists, useFetchDetailCountry } from "hooks/mdm/country-structure/useCountries";
import _ from "lodash";
import useDebounce from "lib/useDebounce";
import CountryStructureForm from "./CountryStructureForm";
import { colors } from "utils/color";

const getFilterOption = (group: any) => {
  switch (group) {
    case "COUNTRY":
      return { label: "Country", value: "COUNTRY" };
    case "SALES ORGANIZATION":
      return { label: "Sales Organization", value: "SALES ORGANIZATION" };
    case "BRANCH":
      return { label: "Branch", value: "BRANCH" };

    default:
      return [];
  }
};

const defaultGroup = [
  { label: "Country", value: "COUNTRY" },
  { label: "Sales Organization", value: "SALES ORGANIZATION" },
  { label: "Branch", value: "BRANCH" },
]

const Conditions = ({
  control,
  setValue,
  availabilityWatch,
  retailPricing=[]
}: any) => {

  const basedOn = retailPricing?.availability?.map(({based_on}:any) => based_on) || availabilityWatch?.map(({based_on}:any) => based_on) || []

  const [groupingOption, setGroupingOption] = useState(defaultGroup?.filter(({value}) => !basedOn?.includes(value)));

  const { fields, append, remove, replace} = useFieldArray({
    name: "availability",
    control,
  });

  const addGrouping = () => {
    append({
      based_on: "",
    });
  };

  const removeGrouping = (index: any) => {
    remove(index); 
    setGroupingOption((prevList: any) => {
      return [...prevList, getFilterOption(availabilityWatch[index]?.based_on)];
    });
  };

  const handleGroupChange = (value: any, index: any) => {
    let tempAvailabilityWatch = _.cloneDeep(availabilityWatch);
    tempAvailabilityWatch[index] = {}
    tempAvailabilityWatch[index].based_on = value;

    let allBasedOn = tempAvailabilityWatch.map((el: any) => el.based_on);

    const filterGroupingOption = defaultGroup.filter(
      (item: any) => !allBasedOn.includes(item.value)
    );

    replace(tempAvailabilityWatch);
    setGroupingOption(filterGroupingOption);
  };


  return (
    <>
      {fields.map((item: any, index) => {
        return (
        <Row key={index}>
          {index > 0 && (
            <Col width="100%">
              <Spacer size={32} />
              <Separator />
              <Spacer size={20} />

              <Row alignItems="center">
                <Text variant={"headingMedium"} inline color={"blue.dark"}>
                  Condition {index + 1}
                </Text>
                <Spacer size={10} />
                <Text
                  variant={"subtitle1"}
                  clickable
                  inline
                  color={"pink.regular"}
                  onClick={() => {
                    removeGrouping(index);
                  }}
                >
                  Delete
                </Text>
              </Row>
              <Spacer size={10} />
            </Col>
          )}
          <Spacer size={10} />
          <Row width="100%" noWrap>
            <Controller
              control={control}
              name={`availability.${index}.based_on`}
              rules={{
                required: {
                  value: true,
                  message: "This Field is required.",
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                return (
                  <Col width={"100%"}>
                    <Label>
                      Based On
                      <Spacer size={5} display="inline-block" />
                      <Tooltip
                        overlayInnerStyle={{ width: "fit-content" }}
                        title={`Based On`}
                        color={"#F4FBFC"}
                      >
                        <ExclamationCircleOutlined />
                      </Tooltip>
                    </Label>
                    <Spacer size={3} />
                    <CustomFormSelect
                      height="48px"
                      defaultValue={value === "" ? undefined: _.startCase(_.toLower(value))}
                      style={{ width: "100%" }}
                      placeholder={"Select"}
                      borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                      arrowColor={"#000"}
                      size={"large"}
                      items={groupingOption}
                      onChange={(value: any) => {
                        handleGroupChange(value, index);
                      }}
                      error={error?.message}
                    />
                  </Col>
                )
              }}
            />

            <Spacer size={20} />

            <div style={{ visibility: "hidden", width: "100%" }}>
							<Input
								label="Hide"
								height="48px"
								placeholder={"e.g 10000000"}
							/>
						</div>
          </Row>

          <Spacer size={20} />

          <Row width="100%">
            {(availabilityWatch[index]?.based_on === "COUNTRY") && (
              <CountryCondition country={availabilityWatch[index]} control={control} index={index} setValue={setValue} />
            )}
          </Row>

          <Row width="100%">
            {(availabilityWatch[index]?.based_on === "BRANCH" ) && (
              <BranchCondition selectAll={availabilityWatch[index]?.select_all} control={control} index={index} setValue={setValue} />
            )}
          </Row>

          <Row width="100%">
            {(availabilityWatch[index]?.based_on === "SALES ORGANIZATION") && (
              <SalesOrganizationCondition salesOrganization={availabilityWatch[index]} setValue={setValue} control={control} index={index} selectAll={availabilityWatch[index].select_all}/>
            )}
          </Row>

          <Spacer size={10} />
        </Row>
      );
    })}
    <Row width="100%">
      {availabilityWatch[0]?.based_on !== "" && availabilityWatch.length !== 3 && (
        <Text onClick={addGrouping} clickable variant="headingSmall" color="pink.regular">
          + Add More Conditions
        </Text>
      )}
    </Row>
    <Spacer size={20} />
   </>
  )
}

const CountryCondition = ({ control, index, country, setValue } : any) => {
  const [countryList, setCountryList] = useState<any[]>([]);
  const [totalRowsCountryList, setTotalRowsCountryList] = useState(0);
  const [searchCountry, setSearchCountry] = useState("");
  const debounceFetchCountry = useDebounce(searchCountry, 1000);

  const [countryStructure, setCountryStructure] = useState([]);

  const {
    isFetching: isFetchingCountry,
    isFetchingNextPage: isFetchingMoreCountry,
    hasNextPage: hasNextPageCountry,
    fetchNextPage: fetchNextPageCountry,
  } = useCountryInfiniteLists({
    query: {
      search: debounceFetchCountry,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCountryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
              key: element.id
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCountryList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (countryList.length < totalRowsCountryList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { isSuccess } = useFetchDetailCountry({
		country_id: country?.country?.id,
		options: {
			onSuccess: (data: any) => {
				setCountryStructure(
					data.structure.map((data: any, index: any) => ({
            value: data.id,
            label: data.name,
            key: data.id
					}))
				);
			},
      enabled: !!country?.country?.id
		},
	});

  return (
    <>
      <Row width="100%" noWrap>
        <Col width="100%" justifyContent="flex-end">
          <span>
            <Label style={{ display: "inline" }}>Country </Label>{" "}
            <span></span>
          </span>
          <Spacer size={3} />
          <CustomFormSelect
            defaultValue={country?.country?.name}
            labelInValue
            style={{ width: "100%", height: '48px' }}
            size={"large"}
            placeholder={"Select"}
            borderColor={"#AAAAAA"}
            arrowColor={"#000"}
            withSearch
            isLoading={isFetchingCountry}
            isLoadingMore={isFetchingMoreCountry}
            fetchMore={() => {
              if (hasNextPageCountry) {
                fetchNextPageCountry();
              }
            }}
            items={
              isFetchingCountry || isFetchingMoreCountry
                ? []
                : countryList
            }
            onChange={(value: any) => {
              setValue(`availability.${index}.country.id`, value.key);
              setValue(`availability.${index}.country.name`, value.label);
              setValue(`availability.${index}.country.value`, []);
            }}
            onSearch={(value: any) => {
              setSearchCountry(value);
            }}
          />
        </Col>

        <Spacer size={20} />

        <Controller
          control={control}
          shouldUnregister={true}
          name={`availability.${index}.country.value`}
          render={({ field: { onChange, value }, formState: { errors } }) => {
            value = value?.map((value:any) => parseInt(value.id))
            return (
              <Col width="100%" gap="5px">
                <span>
                  <Label style={{ display: "inline" }}>Level</Label>{" "}
                </span>
                <Spacer size={3} />
                <CustomFormSelectCustom
                  labelInValue
                  mode="multiple"
                  style={{
                    height: "48px",
                  }}
                  placeholder={"Select"}
                  size={"large"}
                  showArrow
                  items={countryStructure}
                  showSearch={false}
                  value={value}
                  maxTagCount={6}
                  onChange={(value: any) => {
                    value = value?.map((value:any) => ({
                      id: value.key,
                      name: value?.label?.[1],
                      levels: country?.country?.value?.find((value:any) => value.id === value.key) || []
                    })) || []
                    onChange(value)
                  }}
                />
              </Col>
            )
          }}
        />
      </Row>

      <Spacer size={20} />
      
      {isSuccess && country?.country?.value?.map((data:any, levelIndex:any) => {
        return (
          <Col key={data.id} width="100%">
            <CountryStructureForm
              key={data.id}
              id={data.id} 
              label={data?.name}
              control={control}
              name={`availability.${index}.country.value.${levelIndex}.levels`}
              setValue={setValue}
            />
            <Spacer size={20} />
          </Col>
        )
      })}

    </>
  )
}

const SalesOrganizationCondition = ({ control, index, setValue, salesOrganization, selectAll } : any) => {

  const [hirarchy, setHirarchy] = useState([]);
  const [listStructure, setListStructure] = useState([]);

  useSalesOrganization({
    company_code: 'KSNI',
    options: {
      onSuccess: (data: any) => {
        setListStructure(
          data.salesOrganizationStructures.map((data: any, index: string) => ({
            value: data.id,
            key: data.id,
            label: data.name
          }))
        );
      },
    }
  });

  const {
    isFetching: isFetchingHirarchy,
  } = useSalesOrganizationHirarcy({
    structure_id: salesOrganization.id,
    options: {
      onSuccess: (data: any) => {
        const mappedData = data?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
              key: element.id
            };
        });
        const flattenArray = [].concat(...mappedData);
        setHirarchy(flattenArray)
      },
      enabled: !!salesOrganization.id
    },
  });

  const onSelectAll = (selectAll:boolean) => {
    setValue(`availability.${index}.select_all`, selectAll)
    let hirarchies = hirarchy.map((value:any) => ({
      id: value.key,
      name: value.label
    }))
    if(selectAll){
      setValue(`availability.${index}.value`, hirarchies)
    }else{
      setValue(`availability.${index}.value`, [])
    }
  }
  
  return (
    <>
      <Row width="100%" noWrap>
        <Col width="100%">
          <Label>Sales Organization Level</Label>
          <Spacer size={3} />
          <CustomFormSelect
            defaultValue={salesOrganization?.name}
            style={{ width: "100%" }}
            size={"large"}
            placeholder={"Select"}
            borderColor={"#AAAAAA"}
            arrowColor={"#000"}
            items={listStructure}
            labelInValue={true}
            onChange={(value: any) => {
              setValue(`availability.${index}.id`, value.key);
              setValue(`availability.${index}.name`, value.label);
            }}
          />
        </Col>
      </Row>

      <Spacer size={20} />

      {salesOrganization.id &&
        <Row width="100%">
          <Col width="100%">
            {isFetchingHirarchy ?
              <Spin tip="Loading data..." />
              :
              <Controller
                control={control}
                shouldUnregister={true}
                name={`availability.${index}.value`}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  value = value?.map((value:any) => parseInt(value.id)) || []
                  return (
                    <DropdownMenuOptionCustom
                      label={<Label>{salesOrganization?.name}`</Label>}
                      isAllowClear
                      required
                      mode="multiple"
                      placeholder="Select"
                      onChange={(value:any) => {
                        value = value?.map((value:any) => ({
                          id: value.key,
                          name: value.label
                        })) || []
                        onChange(value)
                      }}
                      value={value || []}
                      valueSelectedItems={value || []}
                      noSearch
                      listItems={hirarchy}
                      onSelectAll={() => onSelectAll(true)}
                      onClearAll={() =>  onSelectAll(false)}
                      selectAll={selectAll}
                    />
                  )
                }}
              />
            }
          </Col>
        </Row>
      }
    </>
  )
}

const BranchCondition = ({ control, index, setValue, selectAll }: any) => {
  const [branchList, setBranchList] = useState<any[]>([]);
  const [totalRowsBranchList, setTotalRowsBranchList] = useState(0);
  const [searchBranch, setSearchBranch] = useState("");
  const debounceFetchLevel = useDebounce(searchBranch, 1000);
  const {
    isFetching: isFetchingBranch,
    isFetchingNextPage: isFetchingMoreBranch,
    hasNextPage: hasNextPageBranch,
    fetchNextPage: fetchNextPageBranch,
  } = useBranchInfiniteLists({
    query: {
      search: debounceFetchLevel,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsBranchList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.branchId,
              label: element.name,
              key: element.branchId
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setBranchList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (branchList.length < totalRowsBranchList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const onSelectAll = (selectAll:boolean) => {
    setValue(`availability.${index}.select_all`, selectAll)
    let branches = branchList.map((value:any) => ({
      id: value.key,
      name: value.label
    }))
    if(selectAll){
      setValue(`availability.${index}.value`, branches)
    }else{
      setValue(`availability.${index}.value`, [])
    }
  }

  return (
    <Col width="100%">
      <Controller
        control={control}
        name={`availability.${index}.value`}
        render={({ field: { onChange, value=[] }, fieldState: { error } }) => { 
          value = value?.map((value:any) => ({
            value: value.id,
            key: value.id,
            label: value.name
          }))
          return (       
            <DropdownMenuOptionCustom
              label={<Label>Branch</Label>}
              mode="multiple"
              placeholder="Select"
              labelInValue
              filterOption={false}
              value={value || []}
              isLoading={isFetchingBranch}
              isLoadingMore={isFetchingMoreBranch}
              listItems={isFetchingBranch && !isFetchingMoreBranch ? [] : branchList}
              fetchMore={() => {
                if (hasNextPageBranch) {
                  fetchNextPageBranch();
                }
              }}
              onSearch={(value:any) => {
                setSearchBranch(value);
              }}
              onChange={(value:any) => {
                value = value?.map((value:any) => ({
                  id: value.key,
                  name: value.label
                })) || []
                onChange(value)
              }}
              valueSelectedItems={value || []}
              allowClear={true}
              onClear={() => {
                setSearchBranch("");
              }}
              onSelectAll={() => onSelectAll(true)}
              onClearAll={() =>  onSelectAll(false)}
              selectAll={selectAll}
            />
            );
          }}
      />
    </Col>
  )
}

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px dashed #dddddd;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const CustomFormSelectCustom = styled(FormSelectCustom)`
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


export default Conditions;
