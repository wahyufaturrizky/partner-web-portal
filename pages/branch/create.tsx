import React, { useState } from "react";
import { Text, Col, Row, Spacer, Button, Accordion, FormSelect, FormInput } from "pink-lava-ui";
// import { Text, Col, Row, Spacer, Spin, Button, Accordion, FormSelect, FormInput, Input } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useBranchParent, useCalendarDetail, useCalendarInfiniteLists, useCreateBranch, useTimezoneInfiniteLists } from "../../hooks/mdm/branch/useBranch";
import { queryClient } from "../_app";
import useDebounce from "lib/useDebounce";
import { useSalesOrganizationHirarcy } from "hooks/sales-organization/useSalesOrganization";

const BranchCreate = () => {
  const router = useRouter();

  const [searchBranchParent, setSearchBranchParent] = useState("")
  const [searchSalesOrganization, setSearchSalesOrganization] = useState("");
  const [searchTimezone, setSearchTimezone] = useState("");
  const [searchCalendar, setSearchCalendar] = useState("");

  const debounceFetchBranchParent = useDebounce(searchBranchParent, 1000)
  const debounceFetchSalesOrganization = useDebounce(searchSalesOrganization, 1000);
  const debounceFetchTimezone = useDebounce(searchTimezone, 1000);
  const debounceFetchCalendar = useDebounce(searchCalendar, 1000);

  const [salesOrganizationRows, setSalesOrganizationRows] = useState(null)
  const [timezoneRows, setTimezoneRows] = useState(null)
  const [calendarRows, setCalendarRows] = useState(null)
  const [calendarDetailId, setCalendarDetailId] = useState(1)

  const [listSalesOrganization, setListSalesOrganization] = useState([])
  const [listTimezone, setListTimezone] = useState([])
  const [listCalendar, setListCalendar] = useState([])
  const { register, control, handleSubmit } = useForm();

  const {
    data: branchParentData,
    isLoading: isLoadingBranchParentData,
    isFetching: isFetchingBranchParentData,
  } = useBranchParent({
    query: {
      // company_id: branch_id && branch_id[0],
      company_id: "KSNI",
      is_group: true,
      search: debounceFetchBranchParent
    },
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => {
        return data?.rows?.map((parent: { parentName: string; parentId: string; }) => {
          return {
            label: parent.parentName,
            value: parent.parentId
          }
        })
      },
    },
  });

  const {
    data: salesOrganizationData,
    isLoading: isLoadingSalesOrganizationData,
    isFetching: isFetchingSalesOrganizationData,
  } = useSalesOrganizationHirarcy({
      structure_id: 101, //structure untuk KSNI
      // query: {
      //   search: debounceFetchSalesOrganization
      // },
      options: {
        onSuccess: (data: any) => {
          console.log(data, '<<< ini data sales org hirarki')
        },
        select: (data: any) => {
          return data?.map((salesOrganization: { name: string; id: number; }) => {
            return {
              label: salesOrganization.name,
              value: salesOrganization.id
            }
          })
        },
      },
  });

  const { 
    isFetching: isFetchingTimezone,
    isFetchingNextPage: isFetchingMoreTimezone,
    isLoading: isLoadingTimezone,
    hasNextPage: timezoneHasNextPage,
    fetchNextPage: timezoneFetchNextPage, 
  } = useTimezoneInfiniteLists({
    query: {
      search: debounceFetchTimezone,
    },
    options: {
      onSuccess: (data) => {
        setTimezoneRows(data?.pages[0]?.totalRow);
        setListTimezone(data?.pages[0]?.rows?.map(timezone => {
          return {
            label: timezone.utc, value: timezone.id
          }
        }))
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listTimezone.length < timezoneRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // Calendar
  const { 
    isFetching: isFetchingCalendar,
    isFetchingNextPage: isFetchingMoreCalendar,
    isLoading: isLoadingCalendar,
    hasNextPage: calendarHasNextPage,
    fetchNextPage: calendarFetchNextPage, 
  } = useCalendarInfiniteLists({
    query: {
      search: debounceFetchCalendar,
    },
    options: {
      onSuccess: (data) => {
        setCalendarRows(data?.pages[0]?.totalRow)
        setListCalendar(data?.pages[0]?.rows?.map(calendar => {
          return { label: calendar.calendarName, value: calendar.id}
        }))
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (listCalendar.length < calendarRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  // start working & end working day
  const {
    data: calendarDetailData,
    isLoading: isLoadingCalendarDetailData,
    isFetching: isFetchingCalendarDetailData,
  } = useCalendarDetail({
    id: calendarDetailId,
    options: {
      onSuccess: (data: any) => {
        console.log(data, '<<< ini data detail calendar')
      },
      select: (data: any) => {
        return data
      },
    },
  });  

  const { mutate: createBranch, isLoading: isLoadingCreateBranch } = useCreateBranch({
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["branch-list"]);
      },
    },
  });

  if( isLoadingCalendar || isLoadingSalesOrganizationData || isLoadingTimezone){
    return <>loading...</>
  }
  const onSubmit = (data: any) => {
    console.log(data, '<<< ini yang di save')
    const formData = {
      company_id: "KSNI",
      ...data,
    };
    createBranch(formData);
  };

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>Create Branch</Text>
      </Row>

      <Spacer size={20} />

      <Card>
        <Row gap="16px" justifyContent="flex-end" alignItems="center" nowrap>
          <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
            {isLoadingCreateBranch ? "Loading..." : "Save"}
          </Button>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">
                        Branch Name<span style={{ color: "#EB008B" }}>*</span>
                      </Text>
                      <FormInput size={"large"} placeholder={"e.g PMA Bandung Selatan GT"} />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="parent_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Parent</Label>
                      <Spacer size={4} />

                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isLoadingBranchParentData}
                        items={
                          isLoadingBranchParentData && !isFetchingBranchParentData
                            ? []
                            : branchParentData
                        }
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchBranchParent(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="company_internal_structure_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Company Internal Structure</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isLoadingSalesOrganizationData}
                        isLoadingMore={isFetchingSalesOrganizationData}
                        fetchMore={() => {}}
                        items={salesOrganizationData}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchSalesOrganization(value)
                        }}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="timezone"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Timezone</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingTimezone}
                        isLoadingMore={isFetchingMoreTimezone}
                        fetchMore={() => {
                          if (timezoneHasNextPage) {
                            timezoneFetchNextPage();
                          }
                        }}
                        items={
                          isFetchingTimezone && !isFetchingMoreTimezone
                            ? []
                            : listTimezone
                        }
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchTimezone(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="start_working_day"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Start Working Day</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"loading..."}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        value={calendarDetailData?.start}
                        disabled
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchCalendar(value);
                      }}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="end_working_day"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>End Working Day</Label>
                        <FormSelect
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"loading..."}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          disabled
                          value={calendarDetailData?.end}
                          isLoading={isLoadingCalendarDetailData}
                          isLoadingMore={isFetchingCalendarDetailData}
                          fetchMore={() => {}}
                          items={[]}
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {}}
                        />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Controller
                  control={control}
                  name="uom_category_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Calendar</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingCalendar}
                        isLoadingMore={isFetchingMoreCalendar}
                        fetchMore={() => {
                          if (calendarHasNextPage) {
                            calendarFetchNextPage();
                          }
                        }}
                        items={
                          isFetchingCalendar && !isFetchingMoreCalendar
                            ? []
                            : listCalendar
                        }
                        onChange={(value: any) => {
                          onChange(value);
                          console.log(value, 'id')
                          setCalendarDetailId(value)
                        }}
                        onSearch={(value: any) => {
                          setSearchCalendar(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="external_code"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">External Code</Text>
                      <FormInput size={"large"} placeholder={"e.g 12345"} />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">Address</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">
                        Address<span style={{ color: "#EB008B" }}>*</span>
                      </Text>
                      <FormInput size={"large"} placeholder={"e.g 12345"} />
                    </>
                  )}
                />
              </Col>

              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="country_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Country</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={[]}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {}}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Col>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default BranchCreate;
