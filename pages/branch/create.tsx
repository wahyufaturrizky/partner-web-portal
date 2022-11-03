import React, { useState } from "react";
import { Text, Col, Row, Spacer, Spin, Button, Accordion, FormSelect, FormInput, Input } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useBranchParent, useCalendarDetail, useCalendarInfiniteLists, useCreateBranch, useTimezoneInfiniteLists } from "../../hooks/mdm/branch/useBranch";
import { queryClient } from "../_app";
import useDebounce from "lib/useDebounce";
import { useSalesOrganizationHirarcy } from "hooks/sales-organization/useSalesOrganization";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
	.object({
		name: yup.string().required("Branch Name is Required"),
		address: yup.string().required("Address is Required"),
	})
	.required();

const BranchCreate = () => {
  const router = useRouter();

  const [searchBranchParent, setSearchBranchParent] = useState("")
  const [searchSalesOrganization, setSearchSalesOrganization] = useState("");
  const [searchTimezone, setSearchTimezone] = useState("");
  const [searchCalendar, setSearchCalendar] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  const debounceFetchBranchParent = useDebounce(searchBranchParent, 1000)
  const debounceFetchSalesOrganization = useDebounce(searchSalesOrganization, 1000);
  const debounceFetchTimezone = useDebounce(searchTimezone, 1000);
  const debounceFetchCalendar = useDebounce(searchCalendar, 1000);
  const debounceFetchCountry = useDebounce(searchCountry, 1000);

  const [salesOrganizationRows, setSalesOrganizationRows] = useState(null)
  const [timezoneRows, setTimezoneRows] = useState(null)
  const [calendarRows, setCalendarRows] = useState(null)
  const [calendarDetailId, setCalendarDetailId] = useState(null)
  const [countryRows, setCountryRows] = useState(null)

  const [listSalesOrganization, setListSalesOrganization] = useState([])
  const [listTimezone, setListTimezone] = useState([])
  const [listCalendar, setListCalendar] = useState([])
  const [listCountry, setListCountry] = useState([])

  // const { register, control, handleSubmit } = useForm();
  const {
      register,
      handleSubmit,
      setValue,
      control,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      // defaultValues: defaultValues,
    });
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
        console.log(data, '<<< parent')
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
        },
        select: (data: any) => {
          return data?.map((salesOrganization: { name: string; id: number; }) => {
            return {
              label: salesOrganization.name,
              value: salesOrganization.id.toString()
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
      onSuccess: (data: any) => {
        setTimezoneRows(data?.pages[0]?.totalRow);
        setListTimezone(data?.pages[0]?.rows?.map((timezone: { utc: string; id: number; }) => {
          return {
            label: timezone.utc, value: timezone.id
          }
        }))
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (timezoneRows && listTimezone.length < timezoneRows) {
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
      onSuccess: (data: any) => {
        setCalendarDetailId(data?.pages[0]?.rows[0]?.id)
        setCalendarRows(data?.pages[0]?.totalRow)
        setListCalendar(data?.pages[0]?.rows?.map((calendar: { calendarName: string; id: number; }) => {
          return { label: calendar.calendarName, value: calendar.id}
        }))
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (calendarRows && listCalendar.length < calendarRows) {
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
    enabled: calendarDetailId? true : false,
    id: calendarDetailId,
    options: {
      onSuccess: (data: any) => {},
      select: (data: any) => {
        let start = data?.workingDays.findIndex((e: boolean) => e === true)
        let end = data?.workingDays.findIndex((e: boolean) => e === false) === 0 ? 6 : data?.workingDays.findIndex((e: boolean) => e === false) - 1
        const findDays = (data: number) => {
          switch (data) {
            case 0: return 'Senin'
            case 1: return 'Selasa'
            case 2: return 'Rabu'
            case 3: return 'Kamis'
            case 4: return 'Jumat'
            case 5: return 'Sabtu'
            case 6: return 'Minggu'            
              break;
          } 
        }
        return {
          start: findDays(start),
          end: findDays(end)
        }
      },
    },
  });  

  const {
    isFetching: isFetchingCountry,
    isFetchingNextPage: isFetchingMoreCountry,
    isLoading: isLoadingCountry,
    hasNextPage: countryHasNextPage,
    fetchNextPage: countryFetchNextPage,
  } = useCountryInfiniteLists({
    query: {
      search: debounceFetchCountry,
      limit: 1000,
    },
    options: {
      onSuccess: (data: any) => {
        setCountryRows(data.pages[0].totalRow);
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
        setListCountry(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (countryRows && listCountry.length < countryRows) {
          return pages.length + 1;
        } else {
          return undefined;
        }
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

  if( isLoadingCalendar || isLoadingSalesOrganizationData || isLoadingTimezone || isLoadingCountry){
    return (
      <Center>
      <Spin tip="Loading data..." />
    </Center>
    )
  }
  const onSubmit = (data: any) => {
    const formData = {
      company_id: "KSNI",
      ...data,
      // external_code: +data?.external_code,
      // parent_id: '1',
      start_working_day: data?.start_working_day? data?.start_working_day : calendarDetailData?.start,
      end_working_day: data?.end_working_day? data?.end_working_day : calendarDetailData?.end,
      province_id: 1,
      city_id: 1,
      district_id: 1,
      zone_id: 1,
      postal_code_id: 1,
      longtitude: 123.123,
      latitude: -67.2123
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
                <Input
                    width="100%"
                    label="Branch Name"
                    height="40px"
                    error={errors?.name?.message}
                    required
                    placeholder={"e.g PMA Bandung Selatan GT"}
                    {...register("name", { required: "Please enter name." })}
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
                        isFetching={isFetchingBranchParentData}
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
                  name="calendar_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Calendar</Label>
                      <Spacer size={4} />

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
                <Input
                    width="100%"
                    label="External Code"
                    height="40px"
                    placeholder={"e.g 12345"}
                    {...register("external_code", { required: "Please enter name." })}
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">Address</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width="100%">
              <Input
                  width="100%"
                  label="Address"
                  height="40px"
                  required
                  error={errors?.address?.message}
                  placeholder={"e.g Jl. Soekarno Hatta"}
                  {...register("address", { required: "Please enter name." })}
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
                      <Spacer size={4} />

                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingCountry}
                        isLoadingMore={isFetchingMoreCountry}
                        fetchMore={() => {
                          if (countryHasNextPage) {
                            countryFetchNextPage();
                          }
                        }}
                        items={
                          isFetchingCountry && !isFetchingMoreCountry
                            ? []
                            : listCountry
                        }
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchCountry(value);
                        }}
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

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default BranchCreate;
