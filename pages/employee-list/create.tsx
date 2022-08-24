import { useRouter } from "next/router";
import {
  Accordion,
  Button,
  Col,
  DatePickerInput,
  Dropdown,
  FileUploaderAllFiles,
  FormSelect,
  Input,
  Lozenge,
  Modal,
  Row,
  Spacer,
  Table,
  Tabs,
  Text,
  TextArea,
} from "pink-lava-ui";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import { ICCheckPrimary, ICDelete, ICEdit, ICPlusWhite } from "../../assets";
import { useCityInfiniteLists } from "../../hooks/city/useCity";
import { useLanguages } from "../../hooks/languages/useLanguages";
import {
  useCountryInfiniteLists,
  useDistrictInfiniteLists,
  useProvinceInfiniteLists,
} from "../../hooks/mdm/country-structure/useCountries";
import { useDepartmentInfiniteLists } from "../../hooks/mdm/department/useDepartment";
import {
  useBranchInfiniteLists,
  useCreateEmployeeListMDM,
  useEmployeeInfiniteLists,
} from "../../hooks/mdm/employee-list/useEmployeeListMDM";
import { useJobLevelInfiniteLists } from "../../hooks/mdm/job-level/useJobLevel";
import { useJobPositionInfiniteLists } from "../../hooks/mdm/job-position/useJobPositon";
import useDebounce from "../../lib/useDebounce";
import { colors } from "../../utils/color";
import { queryClient } from "../_app";
import moment from "moment";

const EmployeeListCreate = () => {
  const router = useRouter();

  const [departmentList, setListDepartmentList] = useState<any[]>([]);
  const [totalRowsDepartmentList, setTotalRowsDepartmentList] = useState(0);
  const [searchDepartment, setSearchDepartment] = useState("");

  const [jobPositionList, setJobPositionList] = useState<any[]>([]);
  const [totalRowsJobPositionList, setTotalRowsJobPositionList] = useState(0);
  const [searchJobPosition, setSearchJobPosition] = useState("");

  const [jobLevelList, setJobLevelList] = useState<any[]>([]);
  const [totalRowsJobLevelList, setTotalRowsJobLevelList] = useState(0);
  const [searchJobLevel, setSearchJobLevel] = useState("");

  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [totalRowsEmployeeList, setTotalRowsEmployeeList] = useState(0);
  const [searchEmployee, setSearchEmployee] = useState("");

  const [branchList, setBranchList] = useState<any[]>([]);
  const [totalRowsBranchList, setTotalRowsBranchList] = useState(0);
  const [searchBranch, setSearchBranch] = useState("");

  const [cityList, setCityList] = useState<any[]>([]);
  const [totalRowsCityList, setTotalRowsCityList] = useState(0);
  const [searchCity, setSearchCity] = useState("");

  const [countryList, setCountryList] = useState<any[]>([]);
  const [totalRowsCountryList, setTotalRowsCountryList] = useState(0);
  const [searchCountry, setSearchCountry] = useState("");

  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [totalRowsProvinceList, setTotalRowsProvinceList] = useState(0);
  const [searchProvince, setSearchProvince] = useState("");

  const [districtList, setDistrictList] = useState<any[]>([]);
  const [totalRowsDistrictList, setTotalRowsDistrictList] = useState(0);
  const [searchDistrict, setSearchDistrict] = useState("");

  const [modalChannelForm, setModalChannelForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });

  const [defaultActiveKey, setDefaultActiveKey] = useState("Personal");

  const debounceFetch = useDebounce(
    searchDepartment ||
      searchJobPosition ||
      searchJobLevel ||
      searchEmployee ||
      searchBranch ||
      searchCity ||
      searchProvince ||
      searchDistrict ||
      searchCountry,
    1000
  );

  const addressBodyField = {
    is_primary_address: false,
    address_type: "",
    street: "",
    country: "",
    province: "",
    city: "",
    district: "",
    zone: "",
    postal_code: "",
    longitude: "",
    latitude: "",
    key: 0,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      employee_type: "",
      employee_photo: "",
      title: "",
      name: "",
      nik: "",
      department: "",
      job_position: "",
      job_level: "",
      report_to: "",
      branch: "",
      join_date: "",
      resign_date: "",
      preferred_language: "",
      external_code: "",
      detailInformation: {
        personal: {
          placeof_birth: "",
          date_of_birth: "",
          nationality: "",
          marital_status: "",
          blood_type: "",
          religion: "",
          medical_number_insurance: "",
          personal_email: "",
          phone_number: "",
          mobile_number: "",
          visa_number: "",
          visa_expired_date: "",
        },
        addresess: [addressBodyField],
        bankAccount: [],
        education: [],
      },
    },
  });

  const {
    register: registerBankAccount,
    handleSubmit: handleSubmitBankAccount,
    formState: { errors: errorsBankAccount },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const {
    register: registerEducation,
    handleSubmit: handleSubmitEducation,
    control: controlEducation,
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const {
    isFetching: isFetchingDepartment,
    isFetchingNextPage: isFetchingMoreDepartment,
    hasNextPage: hasNextPageDepartment,
    fetchNextPage: fetchNextPageDepartment,
  } = useDepartmentInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsDepartmentList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.departmentId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setListDepartmentList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (departmentList.length < totalRowsDepartmentList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingCity,
    isFetchingNextPage: isFetchingMoreCity,
    hasNextPage: hasNextPageCity,
    fetchNextPage: fetchNextPageCity,
  } = useCityInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCityList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.cityId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCityList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (cityList.length < totalRowsCityList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingDistrict,
    isFetchingNextPage: isFetchingMoreDistrict,
    hasNextPage: hasNextPageDistrict,
    fetchNextPage: fetchNextPageDistrict,
  } = useDistrictInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsDistrictList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.DistrictId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setDistrictList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (districtList.length < totalRowsDistrictList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingCountry,
    isFetchingNextPage: isFetchingMoreCountry,
    hasNextPage: hasNextPageCountry,
    fetchNextPage: fetchNextPageCountry,
  } = useCountryInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCountryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.CountryId,
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

  const {
    isFetching: isFetchingProvince,
    isFetchingNextPage: isFetchingMoreProvince,
    hasNextPage: hasNextPageProvince,
    fetchNextPage: fetchNextPageProvince,
  } = useProvinceInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsProvinceList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.ProvinceId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setProvinceList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (provinceList.length < totalRowsProvinceList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingBranch,
    isFetchingNextPage: isFetchingMoreBranch,
    hasNextPage: hasNextPageBranch,
    fetchNextPage: fetchNextPageBranch,
  } = useBranchInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsBranchList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.BranchId,
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
    isFetching: isFetchingJobPosition,
    isFetchingNextPage: isFetchingMoreJobPosition,
    hasNextPage: hasNextPageJobPosition,
    fetchNextPage: fetchNextPageJobPosition,
  } = useJobPositionInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsJobPositionList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.jobPositionId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setJobPositionList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (jobPositionList.length < totalRowsJobPositionList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingEmployee,
    isFetchingNextPage: isFetchingMoreEmployee,
    hasNextPage: hasNextPageEmployee,
    fetchNextPage: fetchNextPageEmployee,
  } = useEmployeeInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsEmployeeList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.employeeId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setEmployeeList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (employeeList.length < totalRowsEmployeeList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const {
    isFetching: isFetchingJobLevel,
    isFetchingNextPage: isFetchingMoreJobLevel,
    hasNextPage: hasNextPageJobLevel,
    fetchNextPage: fetchNextPageJobLevel,
  } = useJobLevelInfiniteLists({
    query: {
      search: debounceFetch,
      company_id: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsJobLevelList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.jobLevelId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setJobLevelList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (jobLevelList.length < totalRowsJobLevelList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  const { mutate: createEmployeeList, isLoading: isLoadingCreateEmployeeList } =
    useCreateEmployeeListMDM({
      options: {
        onSuccess: () => {
          router.back();
          queryClient.invalidateQueries(["employee-list"]);
        },
      },
    });

  const onSubmit = (data: any) => {
    const formData = {
      company_id: "KSNI",
      ...data,
    };

    createEmployeeList(formData);
  };

  const { data: languageData } = useLanguages();

  const language = languageData?.rows?.map((row: any) => ({ id: row.id, value: row.name })) ?? [];

  const listTab = [
    { title: "Personal" },
    { title: "Addresess" },
    { title: "Bank Account" },
    { title: "Education" },
    { title: "Family" },
    { title: "Development" },
  ];

  const handleChangeTabs = (e: any) => {
    setDefaultActiveKey(e);
  };

  const {
    fields: fieldsAddresess,
    append: appendAddresess,
    replace: replaceAddresess,
    remove: removeAddresess,
  } = useFieldArray({
    control,
    name: "detailInformation.addresess",
  });

  const {
    fields: fieldsBankAccount,
    append: appendBankAccount,
    remove: removeBankAccount,
    replace: replaceBankAccount,
  } = useFieldArray({
    control,
    name: "detailInformation.bankAccount",
  });

  const {
    fields: fieldsEducation,
    append: appendEducation,
    remove: removeEducation,
    replace: replaceEducation,
  } = useFieldArray({
    control,
    name: "detailInformation.education",
  });

  const handleAddItemBankAccount = (data: any) => {
    if (modalChannelForm.typeForm === "Edit Bank Account") {
      let tempEdit = fieldsBankAccount.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.bankName = data.bankName;
          mapDataItem.accountNumber = data.accountNumber;
          mapDataItem.accountName = data.accountName;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });

      replaceBankAccount(tempEdit);
    } else {
      console.log("asdasdasd", data);
      appendBankAccount({
        ...data,
        key: fieldsBankAccount.length,
        id: new Date().valueOf(),
        primary: false,
      });
    }

    setModalChannelForm({ open: false, data: {}, typeForm: "" });
  };

  const handleAddItemEducation = (data: any) => {
    console.log("@data", data);

    if (modalChannelForm.typeForm === "Edit Education") {
      let tempEdit = fieldsEducation.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.schoolName = data.schoolName;
          mapDataItem.degree = data.degree;
          mapDataItem.fieldOfStudy = data.fieldOfStudy;
          mapDataItem.startYear = data.startYear;
          mapDataItem.endYear = data.endYear;
          mapDataItem.gpa = data.gpa;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });

      replaceEducation(tempEdit);
    } else {
      appendEducation({
        ...data,
        key: fieldsEducation.length,
        id: new Date().valueOf(),
      });
    }

    setModalChannelForm({ open: false, data: {}, typeForm: "" });
  };

  const columnsEducation = [
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_: any, record: any) => {
        return (
          <Row gap="16px" alignItems="center" nowrap>
            <Col>
              <ICEdit
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "Edit Education",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICDelete onClick={() => removeEducation(record.key)} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "School Name",
      dataIndex: "schoolName",
    },
    {
      title: "Degree",
      dataIndex: "degree",
    },
    {
      title: "Field of Study",
      dataIndex: "fieldOfStudy",
    },
    {
      title: "Start Year",
      dataIndex: "startYear",
    },
    {
      title: "End Year",
      dataIndex: "endYear",
    },
    {
      title: "GPA",
      dataIndex: "gpa",
    },
  ];

  const columnsBankAccount = [
    {
      title: "key",
      dataIndex: "key",
    },
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
      render: (_: any, record: any) => {
        return (
          <Row gap="16px" alignItems="center" nowrap>
            <Col>
              <ICEdit
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "Edit Bank Account",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICDelete onClick={() => removeBankAccount(record.key)} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
    },
    {
      title: "Primary",
      dataIndex: "primary",
      render: (_: any, record: any) => {
        return (
          <Row gap="16px" alignItems="center" nowrap>
            <Col>
              {record.primary ? (
                <Lozenge variant="blue">
                  <Row alignItems="center">
                    <ICCheckPrimary />
                    Primary
                  </Row>
                </Lozenge>
              ) : (
                <Text
                  clickable
                  color="pink.regular"
                  onClick={() => {
                    let tempEdit = fieldsBankAccount.map((mapDataItem) => {
                      if (mapDataItem.id === record.id) {
                        mapDataItem.primary = true;

                        return { ...mapDataItem };
                      } else {
                        mapDataItem.primary = false;
                        return { ...mapDataItem };
                      }
                    });

                    replaceBankAccount(tempEdit);
                  }}
                >
                  Set as Primary
                </Text>
              )}
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <Col>
      <Row gap="4px">
        <Text variant={"h4"}>Create Employee</Text>
      </Row>

      <Spacer size={20} />

      <Card padding="20px">
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Controller
            control={control}
            name="employee_type"
            defaultValue={"FULLTIME"}
            render={({ field: { onChange } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                items={[{ id: "FULLTIME", value: "Fulltime" }]}
                defaultValue="FULLTIME"
                handleChange={(value: any) => {
                  onChange(value);
                }}
              />
            )}
          />

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingCreateEmployeeList ? "Loading..." : "Save"}
            </Button>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">General</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" noWrap>
              <Col>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="employee_photo"
                  render={({ field: { onChange } }) => (
                    <FileUploaderAllFiles
                      label="Employee Photo"
                      onSubmit={(file: any) => onChange(file)}
                      defaultFile={"/placeholder-employee-photo.svg"}
                      withCrop
                      sizeImagePhoto="125px"
                      removeable
                      textPhoto={[
                        "This Photo will also be used for account profiles and employee identities.",
                        "Photo size 500 x 500 recommended. Drag & Drop Photo or pressing “Upload”",
                      ]}
                    />
                  )}
                ></Controller>
              </Col>
            </Row>

            <Spacer size={20} />

            <Row width="100%" noWrap>
              <Col width={"10%"}>
                <Controller
                  control={control}
                  name="title"
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter title.",
                    },
                  }}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <Label>
                        Title <span style={{ color: colors.red.regular }}>*</span>
                      </Label>
                      <Spacer size={3} />
                      <Dropdown
                        error={error?.message}
                        noSearch
                        width="100%"
                        items={[
                          { id: "mr", value: "Mr." },
                          { id: "ms", value: "Ms." },
                        ]}
                        handleChange={(value: any) => {
                          onChange(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>

              <Spacer size={10} />

              <Col width="90%">
                <Input
                  width="100%"
                  label="Name"
                  height="48px"
                  error={errors.name?.message}
                  required
                  placeholder={"e.g 123456789"}
                  {...register("name", { required: "Please enter Name." })}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width={"100%"}>
                <Input
                  type="number"
                  width="100%"
                  label="NIK"
                  height="48px"
                  required
                  placeholder={"e.g 123456789"}
                  {...register("nik", { required: "Please enter NIK." })}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="department"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Department</Label>
                      <Spacer size={3} />
                      <FormSelect
                        height="48px"
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingDepartment}
                        isLoadingMore={isFetchingMoreDepartment}
                        fetchMore={() => {
                          if (hasNextPageDepartment) {
                            fetchNextPageDepartment();
                          }
                        }}
                        items={
                          isFetchingDepartment && !isFetchingMoreDepartment ? [] : departmentList
                        }
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchDepartment(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="job_position"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Job Position</Label>
                      <Spacer size={3} />
                      <FormSelect
                        height="48px"
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingJobPosition}
                        isLoadingMore={isFetchingMoreJobPosition}
                        fetchMore={() => {
                          if (hasNextPageJobPosition) {
                            fetchNextPageJobPosition();
                          }
                        }}
                        items={
                          isFetchingJobPosition && !isFetchingMoreJobPosition ? [] : jobPositionList
                        }
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchJobPosition(value);
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
                  name="job_level"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Job Level</Label>
                      <Spacer size={3} />
                      <FormSelect
                        height="48px"
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingJobLevel}
                        isLoadingMore={isFetchingMoreJobLevel}
                        fetchMore={() => {
                          if (hasNextPageJobLevel) {
                            fetchNextPageJobLevel();
                          }
                        }}
                        items={isFetchingJobLevel && !isFetchingMoreJobLevel ? [] : jobLevelList}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchJobLevel(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="report_to"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Report to</Label>
                      <Spacer size={3} />
                      <FormSelect
                        height="48px"
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={"#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingEmployee}
                        isLoadingMore={isFetchingMoreEmployee}
                        fetchMore={() => {
                          if (hasNextPageEmployee) {
                            fetchNextPageEmployee();
                          }
                        }}
                        items={isFetchingEmployee && !isFetchingMoreEmployee ? [] : employeeList}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchEmployee(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter branch.",
                    },
                  }}
                  control={control}
                  name="branch"
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <Label>
                        Branch <span style={{ color: colors.red.regular }}>*</span>
                      </Label>
                      <Spacer size={3} />
                      <FormSelect
                        error={error?.message}
                        height="48px"
                        style={{ width: "100%" }}
                        size={"large"}
                        placeholder={"Select"}
                        borderColor={error?.message ? "#ED1C24" : "#AAAAAA"}
                        arrowColor={"#000"}
                        withSearch
                        isLoading={isFetchingBranch}
                        isLoadingMore={isFetchingMoreBranch}
                        fetchMore={() => {
                          if (hasNextPageBranch) {
                            fetchNextPageBranch();
                          }
                        }}
                        items={isFetchingBranch && !isFetchingMoreBranch ? [] : branchList}
                        onChange={(value: any) => {
                          onChange(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchBranch(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="join_date"
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="Join Date"
                    />
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Controller
                  control={control}
                  name="resign_date"
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="Join Date"
                    />
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="preferred_language"
                  render={({ field: { onChange } }) => (
                    <Dropdown
                      label="Language"
                      items={language}
                      width={"100%"}
                      placeholder={"Select"}
                      handleChange={onChange}
                      noSearch
                    />
                  )}
                />
              </Col>
              <Spacer size={10} />

              <Col width="100%">
                <Input
                  width="100%"
                  type="number"
                  label="Tax Number"
                  height="48px"
                  placeholder={"e.g 123456789 "}
                  {...register("external_code")}
                />
              </Col>
            </Row>

            <Row width="50%" noWrap>
              <Input
                width="100%"
                label="External Code"
                height="48px"
                placeholder={"e.g ABC12345"}
                {...register("external_code")}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">Detail Information</Accordion.Header>
          <Accordion.Body>
            <Tabs
              defaultActiveKey={defaultActiveKey}
              listTabPane={listTab}
              onChange={handleChangeTabs}
            />

            {defaultActiveKey === "Personal" ? (
              <>
                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Controller
                      control={control}
                      name="detailInformation.personal.placeof_birth"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Place of Birth</Label>
                          <Spacer size={3} />
                          <FormSelect
                            height="48px"
                            style={{ width: "100%" }}
                            size={"large"}
                            placeholder={"Select"}
                            borderColor={"#AAAAAA"}
                            arrowColor={"#000"}
                            withSearch
                            isLoading={isFetchingCity}
                            isLoadingMore={isFetchingMoreCity}
                            fetchMore={() => {
                              if (hasNextPageCity) {
                                fetchNextPageCity();
                              }
                            }}
                            items={isFetchingCity && !isFetchingMoreCity ? [] : cityList}
                            onChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(value: any) => {
                              setSearchCity(value);
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
                      name="detailInformation.personal.date_of_birth"
                      render={({ field: { onChange } }) => (
                        <DatePickerInput
                          fullWidth
                          onChange={(date: any, dateString: any) => onChange(dateString)}
                          label="Date of Birth"
                        />
                      )}
                    />
                  </Col>
                </Row>

                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Controller
                      control={control}
                      name="detailInformation.personal.nationality"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Nationality</Label>
                          <Spacer size={3} />
                          <FormSelect
                            height="48px"
                            style={{ width: "100%" }}
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
                            items={isFetchingCountry && !isFetchingMoreCountry ? [] : countryList}
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
                  <Spacer size={10} />

                  <Col width="100%">
                    <Controller
                      control={control}
                      name="detailInformation.personal.marital_status"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Marital Status</Label>
                          <Spacer size={3} />
                          <Dropdown
                            noSearch
                            width="100%"
                            items={[
                              { id: "single", value: "Single" },
                              { id: "married", value: "Married" },
                              { id: "divorce", value: "Divorce" },
                            ]}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                          />
                        </>
                      )}
                    />
                  </Col>
                </Row>

                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Controller
                      control={control}
                      name="detailInformation.personal.blood_type"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Blood Type</Label>
                          <Spacer size={3} />
                          <Dropdown
                            noSearch
                            width="100%"
                            items={[
                              { id: "A", value: "A" },
                              { id: "B", value: "B" },
                              { id: "O", value: "O" },
                            ]}
                            handleChange={(value: any) => {
                              onChange(value);
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
                      name="detailInformation.personal.religion"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Religion</Label>
                          <Spacer size={3} />
                          <Dropdown
                            noSearch
                            width="100%"
                            items={[
                              { id: "islam", value: "Islam" },
                              { id: "kristen", value: "Kristen" },
                              { id: "katolik", value: "Katolik" },
                              { id: "budha", value: "Budha" },
                              { id: "hindu", value: "Hindu" },
                              { id: "other", value: "Other" },
                            ]}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                          />
                        </>
                      )}
                    />
                  </Col>
                </Row>

                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Input
                      type="number"
                      width="100%"
                      label="Medical Number (Insurance)"
                      height="48px"
                      placeholder={"e.g 123456789"}
                      {...register("detailInformation.personal.medical_number_insurance")}
                    />
                  </Col>
                  <Spacer size={10} />

                  <Col width="100%">
                    <Input
                      type="email"
                      width="100%"
                      label="Personal Email"
                      height="48px"
                      error={errors.detailInformation?.personal?.personal_email?.message}
                      placeholder={"e.g you@email.com"}
                      {...register("detailInformation.personal.personal_email", {
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Entered value does not match email format",
                        },
                      })}
                    />
                  </Col>
                </Row>

                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Input
                      type="number"
                      width="100%"
                      label="Phone Number"
                      height="48px"
                      placeholder={"e.g 022 709999"}
                      {...register("detailInformation.personal.phone_number")}
                    />
                  </Col>
                  <Spacer size={10} />

                  <Col width="100%">
                    <Input
                      type="email"
                      width="100%"
                      label="Mobile Number"
                      height="48px"
                      required
                      error={errors.detailInformation?.personal?.mobile_number?.message}
                      placeholder={"e.g you@email.com"}
                      {...register("detailInformation.personal.mobile_number", {
                        required: "Please enter mobile number.",
                      })}
                    />
                  </Col>
                </Row>

                <Row width="100%" noWrap>
                  <Col width={"100%"}>
                    <Input
                      type="number"
                      width="100%"
                      label="Visa Number"
                      height="48px"
                      placeholder={"e.g 123456789"}
                      {...register("detailInformation.personal.visa_number")}
                    />
                  </Col>
                  <Spacer size={10} />

                  <Col width="100%">
                    <Controller
                      control={control}
                      name="detailInformation.personal.visa_expired_date"
                      render={({ field: { onChange } }) => (
                        <DatePickerInput
                          fullWidth
                          onChange={(date: any, dateString: any) => onChange(dateString)}
                          label="Visa Expired Date"
                        />
                      )}
                    />
                  </Col>
                </Row>
              </>
            ) : defaultActiveKey === "Addresess" ? (
              <>
                <Button
                  size="big"
                  onClick={() =>
                    appendAddresess({ ...addressBodyField, key: fieldsAddresess.length })
                  }
                >
                  <ICPlusWhite /> Add More Address
                </Button>

                {fieldsAddresess.map((item, index) => {
                  return (
                    <div key={index}>
                      <Spacer size={20} />

                      <Controller
                        control={control}
                        name={`detailInformation.addresess.${index}.is_primary_address`}
                        render={({ field: {} }) => (
                          <>
                            <Text color={"blue.dark"} variant={"headingMedium"}>
                              {getValues(`detailInformation.addresess.${index}.is_primary_address`)
                                ? "Home"
                                : "New Address"}
                            </Text>
                            <Row gap="12px" alignItems="center">
                              {getValues(
                                `detailInformation.addresess.${index}.is_primary_address`
                              ) ? (
                                <Lozenge variant="blue">
                                  <Row alignItems="center">
                                    <ICCheckPrimary />
                                    Primary
                                  </Row>
                                </Lozenge>
                              ) : (
                                <Text
                                  clickable
                                  color="pink.regular"
                                  onClick={() => {
                                    let tempEdit = fieldsAddresess.map((mapDataItem) => {
                                      if (mapDataItem.key === index) {
                                        mapDataItem.is_primary_address = true;

                                        return { ...mapDataItem };
                                      } else {
                                        mapDataItem.is_primary_address = false;
                                        return { ...mapDataItem };
                                      }
                                    });

                                    replaceAddresess(tempEdit);
                                  }}
                                >
                                  Set as Primary
                                </Text>
                              )}
                              |
                              <div style={{ cursor: "pointer" }}>
                                <Text color="pink.regular" onClick={() => removeAddresess(index)}>
                                  Delete
                                </Text>
                              </div>
                            </Row>
                          </>
                        )}
                      />

                      <Spacer size={20} />

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Controller
                            control={control}
                            name={`detailInformation.addresess.${index}.address_type`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>Address Type</Label>
                                <Spacer size={3} />
                                <Dropdown
                                  noSearch
                                  width="100%"
                                  items={[
                                    { id: "home", value: "Home" },
                                    { id: "office", value: "Office" },
                                    { id: "apartment", value: "Apartment" },
                                  ]}
                                  handleChange={(value: any) => {
                                    onChange(value);
                                  }}
                                />
                              </>
                            )}
                          />
                        </Col>
                        <Spacer size={10} />

                        <Col width="100%">
                          <TextArea
                            width="100%"
                            rows={2}
                            required
                            error={
                              errors?.["detailInformation"]?.["addresess"]?.[index]?.["street"]?.[
                                "message"
                              ]
                            }
                            placeholder="e.g Front Groceries No. 5"
                            label="Street"
                            {...register(`detailInformation.addresess.${index}.street`, {
                              required: "Please enter street.",
                            })}
                          />
                        </Col>
                      </Row>

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Controller
                            control={control}
                            name={`detailInformation.addresess.${index}.country`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>Country</Label>
                                <Spacer size={3} />
                                <FormSelect
                                  height="48px"
                                  style={{ width: "100%" }}
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
                                    isFetchingCountry && !isFetchingMoreCountry ? [] : countryList
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
                        <Spacer size={10} />

                        <Col width="100%">
                          <Controller
                            control={control}
                            name={`detailInformation.addresess.${index}.province`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>Province</Label>
                                <Spacer size={3} />
                                <FormSelect
                                  height="48px"
                                  style={{ width: "100%" }}
                                  size={"large"}
                                  placeholder={"Select"}
                                  borderColor={"#AAAAAA"}
                                  arrowColor={"#000"}
                                  withSearch
                                  isLoading={isFetchingProvince}
                                  isLoadingMore={isFetchingMoreProvince}
                                  fetchMore={() => {
                                    if (hasNextPageProvince) {
                                      fetchNextPageProvince();
                                    }
                                  }}
                                  items={
                                    isFetchingProvince && !isFetchingMoreProvince
                                      ? []
                                      : provinceList
                                  }
                                  onChange={(value: any) => {
                                    onChange(value);
                                  }}
                                  onSearch={(value: any) => {
                                    setSearchProvince(value);
                                  }}
                                />
                              </>
                            )}
                          />
                        </Col>
                      </Row>

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Controller
                            control={control}
                            name={`detailInformation.addresess.${index}.city`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>City</Label>
                                <Spacer size={3} />
                                <FormSelect
                                  height="48px"
                                  style={{ width: "100%" }}
                                  size={"large"}
                                  placeholder={"Select"}
                                  borderColor={"#AAAAAA"}
                                  arrowColor={"#000"}
                                  withSearch
                                  isLoading={isFetchingCity}
                                  isLoadingMore={isFetchingMoreCity}
                                  fetchMore={() => {
                                    if (hasNextPageCity) {
                                      fetchNextPageCity();
                                    }
                                  }}
                                  items={isFetchingCity && !isFetchingMoreCity ? [] : cityList}
                                  onChange={(value: any) => {
                                    onChange(value);
                                  }}
                                  onSearch={(value: any) => {
                                    setSearchCity(value);
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
                            name={`detailInformation.addresess.${index}.district`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>District</Label>
                                <Spacer size={3} />
                                <FormSelect
                                  height="48px"
                                  style={{ width: "100%" }}
                                  size={"large"}
                                  placeholder={"Select"}
                                  borderColor={"#AAAAAA"}
                                  arrowColor={"#000"}
                                  withSearch
                                  isLoading={isFetchingDistrict}
                                  isLoadingMore={isFetchingMoreDistrict}
                                  fetchMore={() => {
                                    if (hasNextPageDistrict) {
                                      fetchNextPageDistrict();
                                    }
                                  }}
                                  items={
                                    isFetchingDistrict && !isFetchingMoreDistrict
                                      ? []
                                      : districtList
                                  }
                                  onChange={(value: any) => {
                                    onChange(value);
                                  }}
                                  onSearch={(value: any) => {
                                    setSearchDistrict(value);
                                  }}
                                />
                              </>
                            )}
                          />
                        </Col>
                      </Row>

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Controller
                            control={control}
                            name={`detailInformation.addresess.${index}.zone`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>Zone</Label>
                                <Spacer size={3} />
                                <Dropdown
                                  noSearch
                                  width="100%"
                                  items={[{ id: "Andir", value: "Andir" }]}
                                  handleChange={(value: any) => {
                                    onChange(value);
                                  }}
                                />
                              </>
                            )}
                          />
                        </Col>
                        <Spacer size={10} />

                        <Col width="100%">
                          <Input
                            type="number"
                            width="100%"
                            error={
                              errors?.["detailInformation"]?.["addresess"]?.[index]?.[
                                "postal_code"
                              ]?.["message"]
                            }
                            placeholder="e.g 40123"
                            label="Postal Code"
                            {...register(`detailInformation.addresess.${index}.postal_code`)}
                          />
                        </Col>
                      </Row>

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Input
                            type="number"
                            width="100%"
                            error={
                              errors?.["detailInformation"]?.["addresess"]?.[index]?.[
                                "longitude"
                              ]?.["message"]
                            }
                            placeholder="e.g -6.909829165558788, 107.57502431159176"
                            label="Longitude"
                            {...register(`detailInformation.addresess.${index}.longitude`)}
                          />
                        </Col>
                        <Spacer size={10} />

                        <Col width="100%">
                          <Input
                            type="number"
                            width="100%"
                            error={
                              errors?.["detailInformation"]?.["addresess"]?.[index]?.["latitude"]?.[
                                "message"
                              ]
                            }
                            placeholder="e.g -6.909829165558788, 107.57502431159176"
                            label="Latitude"
                            {...register(`detailInformation.addresess.${index}.latitude`)}
                          />
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </>
            ) : defaultActiveKey === "Bank Account" ? (
              <>
                <Button
                  size="big"
                  onClick={() =>
                    setModalChannelForm({ open: true, typeForm: "Add Bank Account", data: {} })
                  }
                >
                  <ICPlusWhite />
                  Add Bank Account
                </Button>

                <Spacer size={20} />

                <Table
                  columns={columnsBankAccount.filter(
                    (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                  )}
                  data={fieldsBankAccount}
                />
              </>
            ) : defaultActiveKey === "Education" ? (
              <>
                <Button
                  size="big"
                  onClick={() =>
                    setModalChannelForm({ open: true, typeForm: "Add Education", data: {} })
                  }
                >
                  <ICPlusWhite />
                  Add Education
                </Button>

                <Spacer size={20} />

                <Table
                  columns={columnsEducation.filter(
                    (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                  )}
                  data={fieldsEducation}
                />
              </>
            ) : defaultActiveKey === "Family" ? (
              <>
                <Button
                  size="big"
                  onClick={() =>
                    setModalChannelForm({ open: true, typeForm: "Add Family", data: {} })
                  }
                >
                  <ICPlusWhite />
                  Add Family
                </Button>

                <Spacer size={20} />

                <Table
                  columns={columnsFamily.filter(
                    (filtering) => filtering.dataIndex !== "id" && filtering.dataIndex !== "key"
                  )}
                  data={fieldsFamily}
                />
              </>
            ) : null}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {modalChannelForm.open && (
        <Modal
          centered
          closable={true}
          visible={modalChannelForm.open}
          onCancel={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
          title={modalChannelForm.typeForm}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={20} />

              {modalChannelForm.typeForm === "Add Bank Account" ||
              modalChannelForm.typeForm === "Edit Bank Account" ? (
                <>
                  <Input
                    defaultValue={modalChannelForm.data?.bankName}
                    width="100%"
                    label="Bank Name"
                    height="48px"
                    required
                    error={errorsBankAccount.bankName?.message}
                    placeholder={"e.g BCA"}
                    {...registerBankAccount("bankName", {
                      shouldUnregister: true,
                      required: "Please enter bank name.",
                    })}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.accountNumber}
                    type="number"
                    width="100%"
                    label="Account Number"
                    height="48px"
                    required
                    error={errorsBankAccount.accountNumber?.message}
                    placeholder={"e.g 123456789"}
                    {...registerBankAccount("accountNumber", {
                      shouldUnregister: true,
                      required: "Please enter account number.",
                    })}
                  />
                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.accountName}
                    width="100%"
                    label="Account Name"
                    height="48px"
                    required
                    error={errorsBankAccount.accountName?.message}
                    placeholder={"e.g Jane Doe"}
                    {...registerBankAccount("accountName", {
                      shouldUnregister: true,
                      required: "Please enter account name.",
                    })}
                  />
                </>
              ) : modalChannelForm.typeForm === "Add Education" ||
                modalChannelForm.typeForm === "Edit Education" ? (
                <>
                  <Input
                    defaultValue={modalChannelForm.data?.schoolName}
                    width="100%"
                    label="School Name"
                    height="48px"
                    placeholder={"e.g Lala University"}
                    {...registerEducation("schoolName")}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlEducation}
                    name="degree"
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>Degree</Label>
                        <Spacer size={3} />
                        <Dropdown
                          defaultValue={modalChannelForm.data?.degree}
                          noSearch
                          defaul
                          width="100%"
                          items={[{ id: "S1", value: "S1" }]}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                        />
                      </>
                    )}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.fieldOfStudy}
                    width="100%"
                    label="Field of Study"
                    height="48px"
                    placeholder={"e.g Business"}
                    {...registerEducation("fieldOfStudy")}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlEducation}
                    name="startYear"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={moment(
                          modalChannelForm.data?.startYear || new Date(),
                          "YYYY-MM-DD"
                        )}
                        picker="year"
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="Start Year"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlEducation}
                    name="endYear"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={moment(
                          modalChannelForm.data?.endYear || new Date(),
                          "YYYY-MM-DD"
                        )}
                        picker="year"
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="End Year"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.gpa}
                    width="100%"
                    label="GPA"
                    type="number"
                    height="48px"
                    placeholder={"e.g 4.0"}
                    {...registerEducation("gpa")}
                  />
                </>
              ) : null}

              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant={"tertiary"}
                  key="submit"
                  type="primary"
                  onClick={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
                >
                  Cancel
                </Button>

                {modalChannelForm.typeForm === "Add Bank Account" ||
                modalChannelForm.typeForm === "Edit Bank Account" ? (
                  <Button
                    onClick={handleSubmitBankAccount(handleAddItemBankAccount)}
                    variant="primary"
                    size="big"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitEducation(handleAddItemEducation)}
                    variant="primary"
                    size="big"
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          }
        />
      )}
    </Col>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p: any) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default EmployeeListCreate;
