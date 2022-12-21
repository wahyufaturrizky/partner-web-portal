import React, { useState } from "react";
import {
  Text, Col, Row, Spacer, Spin, Button, Accordion, FormSelect, FormInput, Input,
} from "pink-lava-ui";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useDebounce from "lib/useDebounce";
import usePagination from "@lucasmogari/react-pagination";
import { useSalesOrganizationHirarcy, useSalesOrganizationInfiniteLists } from "hooks/sales-organization/useSalesOrganization";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import { useUserPermissions } from "hooks/user-config/usePermission";
import { queryClient } from "../../_app";
import {
  useBranchDetail, useBranchParent, useCalendarDetail, useCalendarInfiniteLists, useCreateBranch, useTimezoneInfiniteLists, useUpdateBranch,
} from "../../../hooks/mdm/branch/useBranch";

const schema = yup
  .object({
    name: yup.string().required("Branch Name is Required"),
    address: yup.string().required("Address is Required"),
  })
  .required();

const BranchDetail = () => {
  const router = useRouter();
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const { branch_id } = router.query;
  const [searchBranchParent, setSearchBranchParent] = useState("");
  const [searchSalesOrganization, setSearchSalesOrganization] = useState("");
  const [searchTimezone, setSearchTimezone] = useState("");
  const [searchCalendar, setSearchCalendar] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  const debounceFetchBranchParent = useDebounce(searchBranchParent, 1000);
  const debounceFetchSalesOrganization = useDebounce(searchSalesOrganization, 1000);
  const debounceFetchTimezone = useDebounce(searchTimezone, 1000);
  const debounceFetchCalendar = useDebounce(searchCalendar, 1000);
  const debounceFetchCountry = useDebounce(searchCountry, 1000);

  const [salesOrganizationRows, setSalesOrganizationRows] = useState(null);
  const [timezoneRows, setTimezoneRows] = useState(null);
  const [calendarRows, setCalendarRows] = useState(null);
  const [calendarDetailId, setCalendarDetailId] = useState(null);
  const [countryRows, setCountryRows] = useState(null);

  const [listSalesOrganization, setListSalesOrganization] = useState([]);
  const [listTimezone, setListTimezone] = useState<any[]>([]);
  const [listCalendar, setListCalendar] = useState<any[]>([]);
  const [listCountry, setListCountry] = useState<any[]>([]);

  const [listProvince, setListProvince] = useState([
    { value: 1, label: 'DKI Jakarta' },
    { value: 2, label: 'Jawa Barat' },
    { value: 3, label: 'Jawa Tengah' },
  ]);
  const [listCity, setListCity] = useState([
    { value: 1, label: 'Jakarta' },
    { value: 2, label: 'Bandung' },
    { value: 3, label: 'Yogyakarta' },
  ]);
  const [listDistrict, setListDistrict] = useState([
    { value: 1, label: 'Baleendah' },
    { value: 2, label: 'Bojongsoang' },
    { value: 3, label: 'Rancaekek' },
  ]);
  const [listZone, setListZone] = useState([
    { value: 1, label: 'Andir' },
    { value: 2, label: 'Arcamanik' },
    { value: 3, label: 'Baleendah' },
  ]);
  const [listPostalCode, setListPostalCode] = useState([
    { value: 1, label: '40123' },
    { value: 2, label: '40124' },
    { value: 3, label: '40125' },
  ]);

  const { data: dataUserPermission } = useUserPermissions({
    options: {
      onSuccess: () => {},
    },
  });

  const listPermission = dataUserPermission?.permission?.filter(
    (filtering: any) => filtering.menu === "Branch",
  );

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
    data: branchDetailData,
    isLoading: isLoadingBranchDetailData,
    isFetching: isFetchingBranchDetailData,
  } = useBranchDetail({
    id: branch_id && branch_id[1],
    companyId: branch_id && branch_id[0],
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => data,
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
      search: debounceFetchBranchParent,
    },
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => data?.rows?.map((parent: { parentName: string; parentId: string; }) => ({
        label: parent.parentName,
        value: parent.parentId,
      })),
    },
  });

  const {
    data: salesOrganizationData,
    isLoading: isLoadingSalesOrganizationData,
    isFetching: isFetchingSalesOrganizationData,
  } = useSalesOrganizationHirarcy({
    structure_id: 74, // structure untuk KSNI
    query: {
      search: debounceFetchSalesOrganization,
    },
    options: {
      onSuccess: (data: any) => {
      },
      select: (data: any) => data?.map((salesOrganization: { name: string; id: number; }) => ({
        label: salesOrganization.name,
        value: salesOrganization.id,
      })),
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
        setListTimezone(data?.pages[0]?.rows?.map((timezone: { utc: any; id: any; }) => ({
          label: timezone.utc, value: timezone.id,
        })));
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (timezoneRows && listTimezone.length < timezoneRows) {
          return pages.length + 1;
        }
        return undefined;
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
        setCalendarRows(data?.pages[0]?.totalRow);
        setListCalendar(data?.pages[0]?.rows?.map((calendar: { calendarName: any; id: any; }) => ({ label: calendar.calendarName, value: calendar.id })));
        setCalendarDetailId(listCalendar?.filter((calendar: any) => calendar?.value === +branchDetailData?.calendarId)[0]?.value);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (calendarRows && listCalendar.length < calendarRows) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  // start working & end working day
  const {
    data: calendarDetailData,
    isLoading: isLoadingCalendarDetailData,
    isFetching: isFetchingCalendarDetailData,
  } = useCalendarDetail({
    enabled: !!calendarDetailId,
    id: calendarDetailId,
    options: {
      onSuccess: (data: any) => {},
      select: (data: any) => {
        const start = data?.workingDays.findIndex((e: boolean) => e === true);
        const end = data?.workingDays.findIndex((e: boolean) => e === false) === 0 ? 6 : data?.workingDays.findIndex((e: boolean) => e === false) - 1;
        const findDays = (data: number) => {
          switch (data) {
            case 0: return 'Senin';
            case 1: return 'Selasa';
            case 2: return 'Rabu';
            case 3: return 'Kamis';
            case 4: return 'Jumat';
            case 5: return 'Sabtu';
            case 6: return 'Minggu';
              break;
          }
        };
        return {
          start: findDays(start),
          end: findDays(end),
        };
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
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setCountryRows(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.id,
          label: element.name,
          key: element.id,
        })));
        const flattenArray = [].concat(...mappedData);
        setListCountry(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (countryRows && listCountry.length < countryRows) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });
  // country detail

  // Sales Organization
  const [salesOrganizationList, setSalesOrganizationList] = useState([
    {
      label: "Domestic",
      value: "Domestic",
    },
    {
      label: "Export",
      value: "Export",
    },
    {
      label: "Import",
      value: "Import",
    },
  ]);

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
    const formData = {
      company_id: companyCode,
      ...data,
      start_working_day: calendarDetailData?.start ? calendarDetailData?.start : branchDetailData?.startWorkingDay,
      end_working_day: calendarDetailData?.end ? calendarDetailData?.end : branchDetailData?.endWorkingDay,
    };
    updateBranch(formData);
  };
  // || isLoadingSalesOrganizationData || isLoadingCalendar
  if (isLoadingBranchDetailData || isLoadingCountry || isLoadingTimezone || isLoadingCalendar) {
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );
  }

  return (
    <Col>
      <Row gap="4px">
        <Text variant="h4">{branchDetailData?.name}</Text>
      </Row>

      <Spacer size={20} />

      <Card>
        <Row gap="16px" justifyContent="flex-end" alignItems="center" nowrap>
          <Button size="big" variant="tertiary" onClick={() => router.back()}>
            Cancel
          </Button>
          {listPermission?.filter((data: any) => data.viewTypes[0]?.viewType.name === "Update")
            .length > 0 && (
            <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
              {isLoadingUpdateBranch ? "Loading..." : "Save"}
            </Button>
          )}
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col width="100%">
                <Input
                  width="100%"
                  label="Branch Name"
                  height="40px"
                  error={errors?.name?.message}
                  defaultValue={branchDetailData?.name}
                  required
                  placeholder="e.g PMA Bandung Selatan GT"
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
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
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
              <Col width="100%">
                <Controller
                  control={control}
                  name="company_internal_structure_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Company Internal Structure</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={salesOrganizationData?.filter((sales: { value: any; }) => sales.value === +branchDetailData?.companyInternalStructureId)[0]?.label}
                        isLoading={isLoadingSalesOrganizationData}
                        isLoadingMore={isFetchingSalesOrganizationData}
                        fetchMore={() => {}}
                        // items={salesOrganizationData}
                        items={isLoadingSalesOrganizationData && isFetchingSalesOrganizationData ? [] : salesOrganizationData}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchSalesOrganization(value);
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
                  name="sales_organization_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Sales Organization</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={salesOrganizationList?.filter((sales) => sales.value === branchDetailData?.salesOrganizationId)}
                        items={salesOrganizationList}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if (value === '') {
                            setSalesOrganizationList([
                              {
                                label: "Domestic",
                                value: "Domestic",
                              },
                              {
                                label: "Export",
                                value: "Export",
                              },
                              {
                                label: "Import",
                                value: "Import",
                              },
                            ]);
                          } else {
                            const search = new RegExp(value, 'i');
                            setSalesOrganizationList(salesOrganizationList.filter((sales) => search.test(sales.label.toLowerCase())));
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
                  name="calendar_id"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Calendar</Label>
                      <Spacer size={4} />
                      <FormSelect
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listCalendar?.filter((calendar: any) => calendar?.value === +branchDetailData?.calendarId)[0]?.label}
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
                          setCalendarDetailId(value);
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
                  name="timezone"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Timezone</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listTimezone?.filter((timezone: {value: any, label: any}) => timezone?.value === +branchDetailData?.timezone)[0]?.label}
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
              <Col width="100%">
                <Controller
                  control={control}
                  name="start_working_day"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Start Working Day</Label>
                      <FormSelect
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="loading..."
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        value={calendarDetailData?.start ? calendarDetailData?.start : branchDetailData?.startWorkingDay}
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
                        size="large"
                        placeholder="loading..."
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        disabled
                        value={calendarDetailData?.end ? calendarDetailData?.end : branchDetailData?.endWorkingDay}
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
            <Col width="50%">
              <Input
                width="100%"
                label="External Code"
                height="40px"
                defaultValue={branchDetailData?.externalCode}
                placeholder="e.g 12345"
                {...register("external_code", { required: "Please enter external code." })}
              />
            </Col>
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
                  defaultValue={branchDetailData?.address}
                  required
                  error={errors?.address?.message}
                  placeholder="e.g Jl.Soekarno Hatta"
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

                      <FormSelect
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listCountry?.filter((country: {value: number, label: string}) => country.value === branchDetailData?.countryId)[0]?.label}
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
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listProvince?.filter((province) => province.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listProvince}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if (value === '') {
                            setListProvince([
                              { value: 1, label: 'DKI Jakarta' },
                              { value: 2, label: 'Jawa Barat' },
                              { value: 3, label: 'Jawa Tengah' },
                            ]);
                          } else {
                            const search = new RegExp(value, 'i');
                            setListProvince(listProvince.filter((province) => search.test(province.label.toLowerCase())));
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
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listCity?.filter((city) => city.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listCity}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if (value === '') {
                            setListCity([
                              { value: 1, label: 'Jakarta' },
                              { value: 2, label: 'Bandung' },
                              { value: 3, label: 'Yogyakarta' },
                            ]);
                          } else {
                            const search = new RegExp(value, 'i');
                            setListCity(listCity.filter((city) => search.test(city.label.toLowerCase())));
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
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listDistrict?.filter((district) => district.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listDistrict}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if (value === '') {
                            setListDistrict([
                              { value: 1, label: 'Baleendah' },
                              { value: 2, label: 'Bojongsoang' },
                              { value: 3, label: 'Rancaekek' },
                            ]);
                          } else {
                            const search = new RegExp(value, 'i');
                            setListDistrict(listDistrict.filter((district) => search.test(district.label.toLowerCase())));
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
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listZone?.filter((zone) => zone.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listZone}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if (value === '') {
                            setListZone([
                              { value: 1, label: 'Andir' },
                              { value: 2, label: 'Arcamanik' },
                              { value: 3, label: 'Baleendah' },
                            ]);
                          } else {
                            const search = new RegExp(value, 'i');
                            setListZone(listZone.filter((zone) => search.test(zone.label.toLowerCase())));
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
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        defaultValue={listPostalCode.filter((postalCode) => postalCode.value === 1)[0]?.label}
                        isLoading={false}
                        isLoadingMore={false}
                        fetchMore={() => {}}
                        items={listPostalCode}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          if (value === '') {
                            setListPostalCode([
                              { value: 1, label: '40123' },
                              { value: 2, label: '40124' },
                              { value: 3, label: '40125' },
                            ]);
                          } else {
                            const search = new RegExp(value, 'i');
                            setListPostalCode(listPostalCode.filter((postalCode) => search.test(postalCode.label.toLowerCase())));
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
                  defaultValue={branchDetailData?.longtitude ?? branchDetailData?.longitude}
                  placeholder="e.g 110.41677"
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
                  placeholder="e.g -6.9967"
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
