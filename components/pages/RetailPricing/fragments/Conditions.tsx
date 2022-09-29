import React, { useState, useRef, useEffect } from "react";
import { Text, Col, Row, Spacer, Spin, Input, FormSelectCustom, FormSelect, DropdownMenuOptionCustom, DropdownMenuOptionCustome, Dropdown2 } from "pink-lava-ui";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import styled from "styled-components";
import { useBranchInfiniteLists } from "hooks/mdm/branch/useBranch";
import { useSalesOrganization, useSalesOrganizationHirarcy } from "hooks/sales-organization/useSalesOrganization";
import { useCountryInfiniteLists, useFetchDetailCountry } from "hooks/mdm/country-structure/useCountries";
import _ from "lodash";
import useDebounce from "lib/useDebounce";
import CountryStructureForm from "./CountryStructureForm";

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

const Conditions = ({
  register,
  control,
  setValue,
  availabilityWatch,
  retailPricing
}: any) => {

  const [groupingOption, setGroupingOption] = useState([
    { label: "Country", value: "COUNTRY" },
    { label: "Sales Organization", value: "SALES ORGANIZATION" },
    { label: "Branch", value: "BRANCH" },
  ]);

  const { fields, append, remove } = useFieldArray({
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

  const handleGroupChange = (value: any, onChange: any, index: any) => {
    let tempAvailabilityWatch = _.cloneDeep(availabilityWatch);
    tempAvailabilityWatch[index].based_on = value;

    let allBasedOn = tempAvailabilityWatch.map((el: any) => el.based_on);

    const filterGroupingOption = groupingOption.filter(
      (item: any) => !allBasedOn.includes(item.value)
    );

    onChange(value);
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
              defaultValue={retailPricing?.availability[index].based_on}
              rules={{ required: true }}
              render={({ field: { onChange }, formState: { errors } }) => (
                <Col width={"100%"}>
                  <Label>Based On</Label>
                  <Spacer size={3} />
                  <CustomFormSelect
                    style={{ width: "100%" }}
                    defaultValue={retailPricing?.availability[index].based_on}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    items={groupingOption}
                    onChange={(value: any) => {
                      handleGroupChange(value, onChange, index);
                    }}
                  />
                  {errors?.items?.[index]?.based_on?.type === "required" && (
                    <Text variant="alert" color={"red.regular"}>
                      This field is required
                    </Text>
                  )}
                </Col>
              )}
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
              <CountryCondition country={retailPricing?.availability[index].country} control={control} index={index} />
            )}
          </Row>

          <Row width="100%">
            {(availabilityWatch[index]?.based_on === "BRANCH" ) && (
              <BranchCondition branch={retailPricing?.availability[index].branch} control={control} index={index} />
            )}
          </Row>

          <Row width="100%">
            {(availabilityWatch[index]?.based_on === "SALES ORGANIZATION") && (
              <SalesOrganizationCondition salesOrganization={retailPricing?.availability[index].sales_organization} setValue={setValue} control={control} index={index} />
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

const CountryCondition = ({ control, index, country } : any) => {
  const [countryList, setCountryList] = useState<any[]>([]);
  const [totalRowsCountryList, setTotalRowsCountryList] = useState(0);
  const [searchCountry, setSearchCountry] = useState("");
  const debounceFetchCountry = useDebounce(searchCountry, 1000);

  const [countryStructure, setCountryStructure] = useState([]);
  const [countryId, setCountryId] = useState(country?.id)
  const [selectedLevel, setSelectedLevel] = useState(country?.level?.map((data: any) => parseInt(data.id)) || [])

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

  const { data: detailCountry, isLoading } = useFetchDetailCountry({
		country_id: countryId,
		options: {
			onSuccess: (data: any) => {
				setCountryStructure(
					data.structure.map((data: any, index: any) => ({
            value: data.id,
            label: data.name,
					}))
				);
			},
      enabled: !!countryId
		},
	});

  const {
    replace: replaceLevels,
  } = useFieldArray({
    control,
    name: `availability.${index}.country.level`
  });

  const watchLevel = useWatch({
    name:`availability.${index}.country.level`,
    control
  })

  return (
    <>
      <Row width="100%" noWrap>
        <Controller
          control={control}
          name={`availability.${index}.country.id`}
          defaultValue={country?.name}
          render={({ field: { onChange } }) => (
            <Col width="100%" justifyContent="flex-end">
              <span>
                <Label style={{ display: "inline" }}>Country </Label>{" "}
                <span></span>
              </span>

              <Spacer size={3} />
              <CustomFormSelect
                defaultValue={country?.name}
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
                  onChange(value);
                  setSelectedLevel([])
                  setCountryId(value)
                  replaceLevels([])
                }}
                onSearch={(value: any) => {
                  setSearchCountry(value);
                }}
              />
            </Col>
          )}
        />

        <Spacer size={20} />

        <Col width="100%" gap="5px">
          <span>
            <Label style={{ display: "inline" }}>Level</Label>{" "}
            <span></span>
          </span>
          <CustomFormSelectCustom
            mode="multiple"
            style={{
              height: "48px",
            }}
            size={"large"}
            showArrow
            items={countryStructure}
            showSearch={false}
            value={selectedLevel}
            maxTagCount={6}
            onChange={(value: any) => {
              setSelectedLevel(value)
              replaceLevels(
                value.map((id:any) => ({
                  id: id
                })
              ))
            }}
          />
        </Col>
      </Row>

      <Spacer size={20} />
      
      {!isLoading && watchLevel?.map((data:any, levelIndex:any) => {
        const structure = detailCountry?.structure?.find((country: any) => country.id === data.id);

        return (
          <Col key={data.id} width="100%">
            <CountryStructureForm
              id={data.id} 
              label={structure?.name}
              control={control}
              name={`availability.${index}.country.level.${levelIndex}.values`}
            />
            <Spacer size={20} />
          </Col>
        )
      })}

    </>
  )
}

const SalesOrganizationCondition = ({ control, index, setValue, salesOrganization } : any) => {

  const [hirarchy, setHirarchy] = useState([]);
  const [listStructure, setListStructure] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(salesOrganization?.id);
  const [selectedLevelValue, setSelectedValue] = useState(salesOrganization?.value?.map((data:any) => parseInt(data.id)) || []);

  useSalesOrganization({
    company_code: 'KSNI',
    options: {
      onSuccess: (data: any) => {
        setListStructure(
          data.salesOrganizationStructures.map((data: any, index: string) => ({
            value: data.name,
            id: data.id
          }))
        );
      },
    }
  });

  const {
    isFetching: isFetchingHirarchy,
  } = useSalesOrganizationHirarcy({
    structure_id: selectedStructure,
    options: {
      onSuccess: (data: any) => {
        const mappedData = data?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
        });
        const flattenArray = [].concat(...mappedData);
        setHirarchy(flattenArray)
      },
      enabled: !!selectedStructure
    },
  });

  const selectedNameStructure = listStructure?.find(s => s?.id === selectedStructure)

  return (
    <>
      <Row width="100%" noWrap>
        <Controller
            control={control}
            name={`availability.${index}.sales_organization.level`}
            defaultValue={salesOrganization?.level}
            render={({ field: { onChange } }) => (
              <Dropdown2
                label="Sales Organization Level"
                labelBold={true}
                defaultValue={salesOrganization?.level}
                width="100%"
                noSearch
                items={listStructure}
                handleChange={(value: any) => {
                  onChange(value)
                  setSelectedValue([])
                  setSelectedStructure(value);
                  setValue(`availability.${index}.sales_organization.ids`, [])
                }}
              />
            )}
        />
      </Row>

      <Spacer size={20} />

      {selectedStructure &&
        <Row width="100%">
          <Col width="100%">
            {isFetchingHirarchy ?
              <Spin tip="Loading data..." />
              :
              <Controller
                control={control}
                shouldUnregister={true}
                name={`availability.${index}.sales_organization.ids`}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <DropdownMenuOptionCustome
                      label={`${selectedNameStructure?.value}`}
                      isAllowClear
                      required
                      placeholder="Select"
                      handleChangeValue={(value: string[]) => {
                        setSelectedValue(value)
                        onChange(value)
                      }}
                      valueSelectedItems={selectedLevelValue}
                      noSearch
                      listItems={hirarchy}
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

const BranchCondition = ({ control, index, branch }: any) => {
  const [branchList, setBranchList] = useState<any[]>([]);
  const [totalRowsBranchList, setTotalRowsBranchList] = useState(0);
  const [searchBranch, setSearchBranch] = useState("");
  const debounceFetchLevel = useDebounce(searchBranch, 1000);
  const [selectedBranch, setSelectedBranch] = useState(branch?.value?.map((data:any) => data.id) || []);
  
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

  return (
    <Col width="100%">
      <Controller
        control={control}
        name={`availability.${index}.branch.ids`}
        render={({ field: { onChange, value }, fieldState: { error } }) => { 
          return (       
            <DropdownMenuOptionCustom
              label="Branch"
              mode="multiple"
              placeholder="Select Process"
              labelInValue
              filterOption={false}
              value={selectedBranch}
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
                onChange(value.map((data: any) => data.value))
                setSelectedBranch(value)
              }}
              valueSelectedItems={selectedBranch}
              allowClear={true}
              onClear={() => {
                setSearchBranch("");
              }}
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
  font-weight: 600;
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
