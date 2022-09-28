import React, { useState } from "react";
import { Text, Col, Row, Spacer, Spin, Button, Accordion, FormSelect, FormInput, Input } from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useBranchDetail, useBranchParent, useCalendarDetail, useCalendarInfiniteLists, useCreateBranch, useTimezoneInfiniteLists, useUpdateBranch } from "../../hooks/mdm/branch/useBranch";
import { queryClient } from "../_app";
import { useCountryInfiniteLists, useFetchCountriesStructure, useFetchDetailCountry } from "hooks/mdm/country-structure/useCountries";
import { useTimezone } from "hooks/timezone/useTimezone";
import { useCities } from "hooks/city/useCity";
import { useTimezones } from "hooks/company-list/useCompany";
import useDebounce from "lib/useDebounce";
import usePagination from "@lucasmogari/react-pagination";
import { useSalesOrganizationHirarcy, useSalesOrganizationInfiniteLists } from "hooks/sales-organization/useSalesOrganization";

const BranchDetail = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const { branch_id } = router.query;

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
  const [listTimezone, setListTimezone] = useState<any[]>([])
  const [listCalendar, setListCalendar] = useState<any[]>([])
  const [listCountry, setListCountry] = useState([
    { value: 1, label: 'Indonesia' },
    { value: 2, label: 'Japan' },
    { value: 3, label: 'Malaysia' },
    { value: 4, label: 'Singepore' },
  ])
  const [listProvince, setListProvince] = useState([
    { value: 1, label: 'DKI Jakarta' },
    { value: 2, label: 'Jawa Barat' },
    { value: 3, label: 'Jawa Tengah' },
  ])
  const [listCity, setListCity] = useState([
    { value: 1, label: 'Jakarta' },
    { value: 2, label: 'Bandung' },
    { value: 3, label: 'Yogyakarta' },
  ])
  const [listDistrict, setListDistrict] = useState([
    { value: 1, label: 'Baleendah' },
    { value: 2, label: 'Bojongsoang' },
    { value: 3, label: 'Rancaekek' },
  ])
  const [listZone, setListZone] = useState([
    { value: 1, label: 'Andir' },
    { value: 2, label: 'Arcamanik' },
    { value: 3, label: 'Baleendah' },
  ])
  const [listPostalCode, setListPostalCode] = useState([
    { value: 1, label: '40123' },
    { value: 2, label: '40124' },
    { value: 3, label: '40125' },
  ])


  const { register, control, handleSubmit } = useForm();

  const {
    data: branchDetailData,
    isLoading: isLoadingBranchDetailData,
    isFetching: isFetchingBranchDetailData,
  } = useBranchDetail({
    id: branch_id && branch_id[1],
    companyId: branch_id && branch_id[0],
    options: {
      onSuccess: (data: any) => {
        console.log(data, '<<< ini data detail')
      },
      select: (data: any) => {
        return data
      },
    },
  });

  const {
    data: branchParentData,
    isLoading: isLoadingBranchParentData,
    isFetching: isFetchingBranchParentData,
  } = useBranchParent({
    query: {
      company_id: branch_id && branch_id[0],
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

  // company internal structure
  //  ini untuk cari company jangan di hapus karena masih hardcoded

  // const { 
  //   isFetching: isFetchingSalesOrganization,
  //   isFetchingNextPage: isFetchingMoreSalesOrganization,
  //   isLoading: isLoadingSalesOrganization,
  //   hasNextPage: salesOrganizationHasNextPage,
  //   fetchNextPage: salesOrganizationFetchNextPage, 
  // } = fetchInfiniteeSalesOrganizationLists({
  //   query: {
  //     search: debounceFetchSalesOrganization,
  //     // company_code: "KSNI",
  //     structure_id: 101, //structure untuk KSNI
  //   },
  //   options: {
  //     onSuccess: (data: any) => {
  //       setSalesOrganizationRows(data?.pages[0]?.totalRow);
  //       console.log(data, '<<<<<<data salesOrg')
  //       // setListSalesOrganization(data?.pages[0]?.rows?.map(organization: any => {
  //       //   return {
  //       //     label: organization.utc, value: organization.id
  //       //   }
  //       // }))
  //     },
  //     getNextPageParam: (_lastPage: any, pages: any) => {
  //       if (listSalesOrganization.length < salesOrganizationRows) {
  //         return pages.length + 1;
  //       } else {
  //         return undefined;
  //       }
  //     },
  //   },
  // });

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
  // TimeZone
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
        setListTimezone(data?.pages[0]?.rows?.map((timezone: { utc: any; id: any; }) => {
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
        setCalendarRows(data?.pages[0]?.totalRow)
        setListCalendar(data?.pages[0]?.rows?.map((calendar: { calendarName: any; id: any; }) => {
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
    id: calendarDetailId,
    options: {
      onSuccess: (data: any) => {
        console.log(data, '<<< ini data detail calendar')
      },
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


  // Country

  // country detail


  // country structure

  // Province
  
  // City

  // District

  // Zone

  // Postal Code



  const { mutate: updateBranch, isLoading: isLoadingUpdateBranch } = useUpdateBranch({
    id: branch_id && branch_id[1],
    companyId: branch_id && branch_id[0],
    options: {
      onSuccess: () => {
        router.back();
        queryClient.invalidateQueries(["branch-list"]);
      },
    },
  });


  const onSubmit = (data: any) => {
    console.log(data, '<<<<data hasil submit')
    const formData = {
      company_id: "KSNI",
      ...data,
    };
    updateBranch(formData);
  };

  if(isLoadingBranchDetailData || isLoadingSalesOrganizationData || isLoadingCalendar){
  return (
    <Center>
      <Spin tip="Loading data..." />
    </Center>
  )};

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>{branchDetailData?.name}</Text>
      </Row>

      <Spacer size={20} />

      <Card>
        <Row gap="16px" justifyContent="flex-end" alignItems="center" nowrap>
          <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
            {isLoadingUpdateBranch ? "Loading..." : "Save"}
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
                    defaultValue={branchDetailData?.name}
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
                        defaultValue={branchParentData?.filter((parent: { value: string }) => parent.value === branchDetailData?.parentId)[0]?.label}
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
                        default_value={salesOrganizationData?.filter((sales: { value: any; }) => sales.value === branchDetailData?.company_internal_structure_id)[0]?.label}
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
                        defaultValue={listTimezone?.filter((timezone: {value: any, label: any}) => timezone?.value === branchDetailData?.timezone)[0]?.label}
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
                  name="calendar"
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
                        defaultValue={listCalendar?.filter((calendar: any) => calendar?.value === branchDetailData?.calendarId)[0]?.label}
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
              <Input
                  width="100%"
                  label="External Code"
                  height="40px"
                  defaultValue={branchDetailData?.external_code}
                  required
                  placeholder={"e.g 12345"}
                  {...register("external_code", { required: "Please enter external code." })}
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
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange } }) => (
                    <>
                      <Text variant="headingRegular">
                        Address<span style={{ color: "#EB008B" }}>*</span>
                      </Text>
                      <FormInput
                      defaultValue={branchDetailData?.description} 
                      size={"large"} 
                      placeholder={"e.g 12345"} 
                      />
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
                        defaultValue={listCountry?.filter(country => country.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listCountry}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if(value === '') {
                            setListCountry([
                              { value: 1, label: 'Indonesia' },
                              { value: 2, label: 'Japan' },
                              { value: 3, label: 'Malaysia' },
                              { value: 4, label: 'Singepore' },
                            ])
                          } else {
                            const search = new RegExp(value, 'i')
                            setListCountry(listCountry.filter(country => search.test(country.label.toLowerCase())))
                          }
                        }}
                      />
                    </>                    
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width="100%">
              <Controller
                  control={control}
                  name="province_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Province</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={listProvince?.filter(province => province.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listProvince}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if(value === '') {
                            setListProvince([
                              { value: 1, label: 'DKI Jakarta' },
                              { value: 2, label: 'Jawa Barat' },
                              { value: 3, label: 'Jawa Tengah' },
                            ])
                          } else {
                            const search = new RegExp(value, 'i')
                            setListProvince(listProvince.filter(province => search.test(province.label.toLowerCase())))
                          }
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
                  name="city_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>City</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={listCity?.filter(city => city.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listCity}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if(value === '') {
                            setListCity([
                              { value: 1, label: 'Jakarta' },
                              { value: 2, label: 'Bandung' },
                              { value: 3, label: 'Yogyakarta' },
                            ])
                          } else {
                            const search = new RegExp(value, 'i')
                            setListCity(listCity.filter(city => search.test(city.label.toLowerCase())))
                          }
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width="100%">
              <Controller
                  control={control}
                  name="district_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>District</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={listDistrict?.filter(district => district.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listDistrict}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if(value === '') {
                            setListDistrict([
                              { value: 1, label: 'Baleendah' },
                              { value: 2, label: 'Bojongsoang' },
                              { value: 3, label: 'Rancaekek' },
                            ])
                          } else {
                            const search = new RegExp(value, 'i')
                            setListDistrict(listDistrict.filter(district => search.test(district.label.toLowerCase())))
                          }
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
                  name="zone_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Zone</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={listZone?.filter(zone => zone.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listZone}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if(value === '') {
                            setListZone([
                              { value: 1, label: 'Andir' },
                              { value: 2, label: 'Arcamanik' },
                              { value: 3, label: 'Baleendah' },
                            ])
                          } else {
                            const search = new RegExp(value, 'i')
                            setListZone(listZone.filter(zone => search.test(zone.label.toLowerCase())))
                          }
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="100%" noWrap>
              <Col width="100%">
              <Controller
                  control={control}
                  name="postal_code_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Postal Code</Label>
                      <Spacer size={4} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        defaultValue={listPostalCode.filter(postalCode => postalCode.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listPostalCode}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if(value === '') {
                            setListPostalCode([
                              { value: 1, label: '40123' },
                              { value: 2, label: '40124' },
                              { value: 3, label: '40125' },
                            ])
                          } else {
                            const search = new RegExp(value, 'i')
                            setListPostalCode(listPostalCode.filter(postalCode => search.test(postalCode.label.toLowerCase())))
                          }
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
                    label="Longitude"
                    height="40px"
                    defaultValue={branchDetailData?.longitude}
                    required
                    placeholder={"e.g 110.41677"}
                    {...register("longitude", { required: "Please enter longitude." })}
                />
              </Col>
            </Row>

            <Spacer size={15} />

            <Row width="50%" noWrap>
              <Col width="100%">
              <Input
                    width="100%"
                    label="Latitude"
                    height="40px"
                    defaultValue={branchDetailData?.latitude}
                    required
                    placeholder={"e.g -6.9967"}
                    {...register("latitude", { required: "Please enter name." })}
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

export default BranchDetail;
