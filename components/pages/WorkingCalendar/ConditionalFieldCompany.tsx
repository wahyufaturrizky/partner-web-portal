import React, { useEffect, useState, useRef } from "react";
import { Text, Row, Spacer, FormSelect, FormSelectCustom, Radio } from "pink-lava-ui";
import useDebounce from "lib/useDebounce";
import { useBranchInfiniteLists } from "hooks/mdm/branch/useBranch";
import {
  useSalesOrganization,
  useSalesOrganizationHirarcy,
} from "hooks/sales-organization/useSalesOrganization";
import { useCompanyInfiniteLists } from "hooks/company-list/useCompany";
import { Controller } from "react-hook-form";

const ConditionalFieldCompany = ({ control, onChangePayload, workingCalendarData }: any) => {
  const [companyPayload, setCompanyPayload] = useState({
    company: workingCalendarData?.company?.company ?? "",
    sales_organization: workingCalendarData?.company?.salesOrganization ?? 0,
    distribution_channel: workingCalendarData?.company?.distributionChannel ?? [],
    branch: workingCalendarData?.company?.branch ?? "",
  });
  const [selectedSalesHierarcy, setSelectedSalesHierarcy] = useState([]);
  const [radioValue, setRadioValue] = useState(
    !workingCalendarData?.branch ? "companyInternal" : "branch"
  );

  // Company State
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [totalRowsCompanyList, setTotalRowsCompanyList] = useState(0);
  const [searchCompany, setSearchCompany] = useState("");
  const debounceFetchCompany = useDebounce(searchCompany, 1000);

  // Branch State
  const [branchList, setBranchList] = useState<any[]>([]);
  const [totalRowsBranchList, setTotalRowsBranchList] = useState(0);
  const [searchBranch, setSearchBranch] = useState("");
  const debounceFetchBranch = useDebounce(searchBranch, 1000);

  //Sales Organization State
  const [salesOrgId, setSalesOrgId] = useState(0);
  const [salesOrgList, setSalesOrgList] = useState<any[]>([]);
  const [salesHierarcyList, setSalesHierarcyList] = useState<any[]>([]);
  const [salesHierarcyTemp, setSalesHierarcyTemp] = useState([]);

  const initialRender = useRef(true);
  const initialRenderSalesOrg = useRef(true);

  // Company API
  const {
    isFetching: isFetchingCompany,
    isFetchingNextPage: isFetchingMoreCompany,
    hasNextPage: hasNextPageCompany,
    fetchNextPage: fetchNextPageCompany,
  } = useCompanyInfiniteLists({
    query: {
      search: debounceFetchCompany,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCompanyList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.code,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCompanyList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (companyList.length < totalRowsCompanyList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // Branch API
  const {
    isFetching: isFetchingBranch,
    isFetchingNextPage: isFetchingMoreBranch,
    hasNextPage: hasNextPageBranch,
    fetchNextPage: fetchNextPageBranch,
  } = useBranchInfiniteLists({
    query: {
      company_id: "KSNI",
      search: debounceFetchBranch,
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

  const {
    data: salesHierarcyData,
    isLoading: isLoadingSalesHierarcy,
    refetch,
  } = useSalesOrganizationHirarcy({
    structure_id: salesOrgId,
    options: {
      enabled: false,
      onSuccess: (data: any) => {
        setSalesHierarcyList(data);
      },
      select: (data: any) => {
        const getLastHierarcy = data.length > 0 ? data[data.length - 1] : [];

        const mappedData =
          getLastHierarcy?.hirarcies?.length > 0 || getLastHierarcy.length > 0
            ? getLastHierarcy?.hirarcies?.map((element: any) => {
                return {
                  value: element.id,
                  label: element.name,
                };
              })
            : [];

        return mappedData;
      },
    },
  });

  // Sales Organization API
  const { data: salesOrgData, isLoading: isLoadingSalesOrganization } = useSalesOrganization({
    company_code: "KSNI",
    options: {
      retry: true,
      onSuccess: (data: any) => {
        setSalesOrgList(data);
      },
      select: (data: any) => {
        const mappedData = data?.salesOrganizationStructures?.map((element: any) => {
          return {
            value: element.id,
            label: element.name,
          };
        });
        return mappedData;
      },
    },
  });

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    onChangePayload(companyPayload);
  }, [companyPayload]);

  useEffect(() => {
    if (initialRenderSalesOrg.current) {
      initialRenderSalesOrg.current = false;
      return;
    }
    refetch();
  }, [salesOrgId]);

  return (
    <>
      <Text variant="headingRegular">
        Company<span style={{ color: "#EB008B" }}>*</span>
      </Text>
      <Controller
        control={control}
        shouldUnregister={true}
        defaultValue={workingCalendarData?.company?.company}
        name="company"
        render={({ field: { onChange }, formState: { errors } }) => (
          <>
            <FormSelect
              defaultValue={workingCalendarData?.company?.company ?? ""}
              style={{ width: "50%" }}
              size={"large"}
              placeholder={"Select"}
              borderColor={"#AAAAAA"}
              arrowColor={"#000"}
              withSearch
              isLoading={isFetchingCompany}
              isLoadingMore={isFetchingMoreCompany}
              fetchMore={() => {
                if (hasNextPageCompany) {
                  fetchNextPageCompany();
                }
              }}
              items={isFetchingCompany && isFetchingMoreCompany ? [] : companyList}
              onChange={(value: any) => {
                setCompanyPayload((prevState) => {
                  return {
                    ...prevState,
                    company: value,
                  };
                });
              }}
              onSearch={(value: any) => {
                setSearchCompany(value);
              }}
            />

            {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
          </>
        )}
      />

      <Spacer size={20} />

      <Row gap={"8px"} alignItems={"center"}>
        <Radio
          value={"companyInternal"}
          checked={radioValue === "companyInternal"}
          onChange={(e: any) => {
            setRadioValue(e.target.value);
            setCompanyPayload((prevState: any) => {
              return {
                ...prevState,
                sales_organization: 0,
                distribution_channel: [],
                branch: null,
              };
            });
          }}
        >
          Company Internal Structure
        </Radio>
        <Radio
          value={"branch"}
          checked={radioValue === "branch"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRadioValue(e.target.value);
            setCompanyPayload((prevState: any) => {
              return {
                ...prevState,
                sales_organization: 0,
                distribution_channel: [],
                branch: null,
              };
            });
          }}
        >
          Branch
        </Radio>
      </Row>

      <Spacer size={20} />

      {radioValue === "companyInternal" && (
        <Row gap={"8px"} width={"100%"} alignItems={"center"} noWrap>
          <div style={{ width: "50%" }}>
            <Text variant="headingRegular">
              Sales Org<span style={{ color: "#EB008B" }}>*</span>
            </Text>
            <Controller
              control={control}
              shouldUnregister={true}
              defaultValue={workingCalendarData?.company?.salesOrganization}
              name="sales_organization"
              render={({ field: { onChange }, formState: { errors } }) => (
                <>
                  <FormSelect
                    defaultValue={workingCalendarData?.company?.salesOrganization}
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isLoadingSalesOrganization}
                    isLoadingMore={false}
                    fetchMore={() => {}}
                    items={isLoadingSalesOrganization ? [] : salesOrgList}
                    onChange={(value: any) => {
                      setCompanyPayload((prevState) => {
                        return {
                          ...prevState,
                          sales_organization: value,
                        };
                      });
                      setSalesOrgId(value);
                    }}
                    onSearch={(value: any) => {
                      const filterData = salesOrgData?.filter(
                        (text: any) => text.label.indexOf(value) > -1
                      );
                      setSalesOrgList(filterData);
                    }}
                  />
                  {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                </>
              )}
            />
          </div>
          <div style={{ width: "50%" }}>
            <Text variant="headingRegular">
              Distribution Channel<span style={{ color: "#EB008B" }}>*</span>
            </Text>
            <Controller
              control={control}
              shouldUnregister={true}
              defaultValue={workingCalendarData?.company?.distributionChannel}
              name="distribution_channel"
              render={({ field: { onChange }, formState: { errors } }) => (
                <>
                  <FormSelectCustom
                    mode="multiple"
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    showArrow
                    arrowColor={"#000"}
                    withSearch
                    maxTagCount={3}
                    isLoading={isLoadingSalesHierarcy}
                    isLoadingMore={false}
                    fetchMore={() => {}}
                    items={isLoadingSalesHierarcy ? [] : salesHierarcyList}
                    value={selectedSalesHierarcy}
                    onChange={(value: any) => {
                      setCompanyPayload((prevState) => {
                        return {
                          ...prevState,
                          distribution_channel: value,
                        };
                      });
                      setSelectedSalesHierarcy(value);
                    }}
                    onSearch={(value: any) => {
                      const filterData = salesHierarcyData?.filter(
                        (text: any) => text.label.indexOf(value) > -1
                      );
                      setSalesHierarcyList(filterData);
                    }}
                  />
                  {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                </>
              )}
            />
          </div>
        </Row>
      )}

      {radioValue === "branch" && (
        <Row gap={"8px"} width={"100%"} alignItems={"center"} noWrap>
          <div style={{ width: "50%" }}>
            <Text variant="headingRegular">
              Branch Name<span style={{ color: "#EB008B" }}>*</span>
            </Text>
            <Controller
              control={control}
              shouldUnregister={true}
              defaultValue={workingCalendarData?.company?.branch}
              name="country"
              render={({ field: { onChange }, formState: { errors } }) => (
                <>
                  <FormSelect
                    defaultValue={workingCalendarData?.company?.branch}
                    style={{ width: "100%" }}
                    size={"large"}
                    placeholder={"Select"}
                    borderColor={"#AAAAAA"}
                    arrowColor={"#000"}
                    withSearch
                    isLoading={isFetchingBranch}
                    isLoadingMore={isFetchingMoreBranch}
                    fetchMore={() => {
                      if (hasNextPageBranch) {
                        fetchNextPageBranch();
                      }
                    }}
                    items={branchList}
                    onChange={(value: any) => {
                      setCompanyPayload((prevState) => {
                        return {
                          ...prevState,
                          branch: value,
                        };
                      });
                    }}
                    onSearch={(value: any) => {
                      setSearchBranch(value);
                    }}
                  />
                  {/* {errors?.company_name?.type === "required" && (
                  <Text variant="alert" color={"red.regular"}>
                    This field is required
                  </Text>
                )} */}
                </>
              )}
            />
          </div>
        </Row>
      )}
    </>
  );
};

export default ConditionalFieldCompany;
