import { useRouter } from "next/router";
import {
  Accordion,
  Button,
  Col,
  DatePickerInput,
  Dropdown,
  FileUploaderAllFiles,
  FileUploaderAllFilesDragger,
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
import { ICCheckPrimary, ICDelete, ICEdit, ICPlusWhite, ICView } from "../../assets";
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
import { usePostalCodeInfiniteLists } from "../../hooks/mdm/postal-code/usePostalCode";
import { useTrainingTypeInfiniteLists } from "../../hooks/mdm/training-type/useTrainingType";

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

  const [postalCodeList, setPostalCodeList] = useState<any[]>([]);
  const [totalRowsPostalCodeList, setTotalRowsPostalCodeList] = useState(0);
  const [searchPostalCode, setSearchPostalCode] = useState("");

  const [trainingTypeList, setTrainingTypeList] = useState<any[]>([]);
  const [totalRowsTrainingTypeList, setTotalRowsTrainingTypeList] = useState(0);
  const [searchTrainingType, setSearchTrainingType] = useState("");

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
      searchPostalCode ||
      searchTrainingType ||
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
      taxNumber: "",
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
        family: [],
        training: [],
        certification: [],
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
    register: registerFamily,
    handleSubmit: handleSubmitFamily,
    control: controlFamily,
    formState: { errors: errorsFamily },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const {
    register: registerTraining,
    handleSubmit: handleSubmitTraining,
    control: controlTraining,
    formState: { errors: errorTraining },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const {
    register: registerCertification,
    handleSubmit: handleSubmitCertification,
    control: controlCertification,
    formState: { errors: errorsCertification },
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
    isFetching: isFetchingPostalCode,
    isFetchingNextPage: isFetchingMorePostalCode,
    hasNextPage: hasNextPagePostalCode,
    fetchNextPage: fetchNextPagePostalCode,
  } = usePostalCodeInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsPostalCodeList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.codeText,
              label: element.codeText,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setPostalCodeList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (postalCodeList.length < totalRowsPostalCodeList) {
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
    isFetching: isFetchingTrainingType,
    isFetchingNextPage: isFetchingMoreTrainingType,
    hasNextPage: hasNextPageTrainingType,
    fetchNextPage: fetchNextPageTrainingType,
  } = useTrainingTypeInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsTrainingTypeList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.trainingTypeId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setTrainingTypeList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (trainingTypeList.length < totalRowsTrainingTypeList) {
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

  const {
    fields: fieldsFamily,
    append: appendFamily,
    remove: removeFamily,
    replace: replaceFamily,
  } = useFieldArray({
    control,
    name: "detailInformation.family",
  });

  const {
    fields: fieldsTraining,
    append: appendTraining,
    remove: removeTraining,
    replace: replaceTraining,
  } = useFieldArray({
    control,
    name: "detailInformation.training",
  });

  const {
    fields: fieldsCertification,
    append: appendCertification,
    remove: removeCertification,
    replace: replaceCertification,
  } = useFieldArray({
    control,
    name: "detailInformation.certification",
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

  const handleAddItemFamily = (data: any) => {
    if (modalChannelForm.typeForm === "Edit Family") {
      let tempEdit = fieldsFamily.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.familyRelation = data.familyRelation;
          mapDataItem.name = data.name;
          mapDataItem.gender = data.gender;
          mapDataItem.birthOfDate = data.birthOfDate;
          mapDataItem.mobile = data.mobile;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });

      replaceFamily(tempEdit);
    } else {
      appendFamily({
        ...data,
        key: fieldsEducation.length,
        id: new Date().valueOf(),
      });
    }

    setModalChannelForm({ open: false, data: {}, typeForm: "" });
  };

  const handleAddItemTraining = (data: any) => {
    console.log("@data", data);
    if (modalChannelForm.typeForm === "Edit Training") {
      let tempEdit = fieldsTraining.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.trainingType = data.trainingType;
          mapDataItem.trainingName = data.trainingName;
          mapDataItem.trainingStatus = data.trainingStatus;
          mapDataItem.startDate = data.startDate;
          mapDataItem.endDate = data.endDate;
          mapDataItem.descriptionTraining = data.descriptionTraining;
          mapDataItem.imageCertTraining = data.imageCertTraining;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });

      replaceTraining(tempEdit);
    } else {
      appendTraining({
        ...data,
        key: fieldsEducation.length,
        id: new Date().valueOf(),
      });
    }

    setModalChannelForm({ open: false, data: {}, typeForm: "" });
  };

  const handleAddItemCertification = (data: any) => {
    if (modalChannelForm.typeForm === "Edit Certification") {
      let tempEdit = fieldsCertification.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.certificationName = data.certificationName;
          mapDataItem.institution = data.institution;
          mapDataItem.certificationNumber = data.certificationNumber;
          mapDataItem.certificationDate = data.certificationDate;
          mapDataItem.imageCertCertification = data.imageCertCertification;

          return { ...mapDataItem };
        } else {
          return mapDataItem;
        }
      });

      replaceCertification(tempEdit);
    } else {
      appendCertification({
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

  const columnsFamily = [
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
                    typeForm: "Edit Family",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICDelete onClick={() => removeFamily(record.key)} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Family Relation",
      dataIndex: "familyRelation",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Birth of Date",
      dataIndex: "birthOfDate",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
    },
  ];

  const columnsTraining = [
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
              <ICView
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "View Training",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICEdit
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "Edit Training",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICDelete onClick={() => removeTraining(record.key)} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Training Type",
      dataIndex: "trainingType",
    },
    {
      title: "Training Name",
      dataIndex: "trainingName",
    },
    {
      title: "Training Status",
      dataIndex: "trainingStatus",
    },
    {
      title: "Description",
      dataIndex: "descriptionTraining",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
    },
    {
      title: "Image Cert Training",
      dataIndex: "imageCertTraining",
    },
  ];

  const columnsCertification = [
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
              <ICView
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "View Certification",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICEdit
                onClick={() =>
                  setModalChannelForm({
                    open: true,
                    typeForm: "Edit Certification",
                    data: record,
                  })
                }
              />
            </Col>
            <Col>
              <ICDelete onClick={() => removeCertification(record.key)} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Certification Name",
      dataIndex: "certificationName",
    },
    {
      title: "Institution",
      dataIndex: "institution",
    },
    {
      title: "Certification Number",
      dataIndex: "certificationNumber",
    },
    {
      title: "Certification  Date",
      dataIndex: "certificationDate",
    },
    {
      title: "imageCertCertification",
      dataIndex: "imageCertCertification",
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
            render={({ field: { onChange } }) => (
              <Dropdown
                label=""
                width="185px"
                noSearch
                items={[
                  { id: "Fulltime", value: "Fulltime" },
                  { id: "Contract", value: "Contract" },
                  { id: "Freelance", value: "Freelance" },
                  { id: "Outsource", value: "Outsource" },
                  { id: "Part Time", value: "Part Time" },
                  { id: "Intern", value: "Intern" },
                ]}
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
                />
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
                  {...register("name", {
                    required: "Please enter Name.",
                    maxLength: {
                      value: 100,
                      message: "Max length exceeded",
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
                  label="NIK"
                  error={errors.nik?.message}
                  height="48px"
                  required
                  placeholder={"e.g 123456789"}
                  {...register("nik", {
                    required: "Please enter NIK.",
                    maxLength: {
                      value: 16,
                      message: "Max length exceeded",
                    },
                  })}
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
                  error={errors.taxNumber?.message}
                  placeholder={"e.g 123456789 "}
                  {...register("taxNumber", {
                    maxLength: {
                      value: 16,
                      message: "Max length exceeded",
                    },
                  })}
                />
              </Col>
            </Row>

            <Row width="50%" noWrap>
              <Input
                width="100%"
                label="External Code"
                height="48px"
                error={errors.external_code?.message}
                placeholder={"e.g ABC12345"}
                {...register("external_code", {
                  maxLength: {
                    value: 100,
                    message: "Max length exceeded",
                  },
                })}
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
                              { id: "AB", value: "AB" },
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
                              { id: "Moslem", value: "Moslem" },
                              { id: "Cristian", value: "Cristian" },
                              { id: "Catholic", value: "Catholic" },
                              { id: "Budhist", value: "Budhist" },
                              { id: "Hindu", value: "Hindu" },
                              { id: "Konghucu", value: "Konghucu" },
                              { id: "Other", value: "Other" },
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
                      error={errors.detailInformation?.personal?.medical_number_insurance?.message}
                      label="Medical Number (Insurance)"
                      height="48px"
                      placeholder={"e.g 123456789"}
                      {...register("detailInformation.personal.medical_number_insurance", {
                        maxLength: {
                          value: 50,
                          message: "Max length exceeded",
                        },
                      })}
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
                        maxLength: {
                          value: 200,
                          message: "Max length exceeded",
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
                      error={errors.detailInformation?.personal?.phone_number?.message}
                      label="Phone Number"
                      height="48px"
                      placeholder={"e.g 022 709999"}
                      {...register("detailInformation.personal.phone_number", {
                        maxLength: {
                          value: 15,
                          message: "Max length exceeded",
                        },
                      })}
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
                        maxLength: {
                          value: 15,
                          message: "Max length exceeded",
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
                      error={errors.detailInformation?.personal?.visa_number?.message}
                      label="Visa Number"
                      height="48px"
                      placeholder={"e.g 123456789"}
                      {...register("detailInformation.personal.visa_number", {
                        maxLength: {
                          value: 30,
                          message: "Max length exceeded",
                        },
                      })}
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
                                    { id: "School", value: "School" },
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
                            rules={{
                              maxLength: {
                                value: 225,
                                message: "Max length exceeded",
                              },
                              required: {
                                value: true,
                                message: "Please enter account street.",
                              },
                            }}
                            name={`detailInformation.addresess.${index}.street`}
                            render={({ field: { onChange } }) => (
                              <TextArea
                                width="100%"
                                rows={2}
                                onChange={onChange}
                                required
                                error={
                                  errors?.["detailInformation"]?.["addresess"]?.[index]?.[
                                    "street"
                                  ]?.["message"]
                                }
                                placeholder="e.g Front Groceries No. 5"
                                label="Street"
                              />
                            )}
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
                          <Controller
                            control={control}
                            name={`detailInformation.addresess.${index}.postal_code`}
                            render={({ field: { onChange } }) => (
                              <>
                                <Label>Postal Code</Label>
                                <Spacer size={3} />
                                <FormSelect
                                  height="48px"
                                  style={{ width: "100%" }}
                                  size={"large"}
                                  placeholder={"Select"}
                                  borderColor={"#AAAAAA"}
                                  arrowColor={"#000"}
                                  withSearch
                                  isLoading={isFetchingPostalCode}
                                  isLoadingMore={isFetchingMorePostalCode}
                                  fetchMore={() => {
                                    if (hasNextPagePostalCode) {
                                      fetchNextPagePostalCode();
                                    }
                                  }}
                                  items={
                                    isFetchingPostalCode && !isFetchingMorePostalCode
                                      ? []
                                      : postalCodeList
                                  }
                                  onChange={(value: any) => {
                                    onChange(value);
                                  }}
                                  onSearch={(value: any) => {
                                    setSearchPostalCode(value);
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
                            error={
                              errors?.["detailInformation"]?.["addresess"]?.[index]?.[
                                "longitude"
                              ]?.["message"]
                            }
                            placeholder="e.g -6.909829165558788, 107.57502431159176"
                            label="Longitude"
                            {...register(`detailInformation.addresess.${index}.longitude`, {
                              maxLength: {
                                value: 225,
                                message: "Max length exceeded",
                              },
                            })}
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
                            {...register(`detailInformation.addresess.${index}.latitude`, {
                              maxLength: {
                                value: 225,
                                message: "Max length exceeded",
                              },
                            })}
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
            ) : (
              <>
                <Button
                  size="big"
                  onClick={() =>
                    setModalChannelForm({ open: true, typeForm: "Add Training", data: {} })
                  }
                >
                  <ICPlusWhite />
                  Add Training
                </Button>

                <Spacer size={20} />

                <Table
                  columns={columnsTraining.filter(
                    (filtering) =>
                      filtering.dataIndex !== "id" &&
                      filtering.dataIndex !== "key" &&
                      filtering.dataIndex !== "imageCertTraining"
                  )}
                  data={fieldsTraining}
                />

                <Spacer size={20} />

                <Button
                  size="big"
                  onClick={() =>
                    setModalChannelForm({ open: true, typeForm: "Add Certification", data: {} })
                  }
                >
                  <ICPlusWhite />
                  Add Certification
                </Button>

                <Spacer size={20} />

                <Table
                  columns={columnsCertification.filter(
                    (filtering) =>
                      filtering.dataIndex !== "id" &&
                      filtering.dataIndex !== "key" &&
                      filtering.dataIndex !== "imageCertCertification"
                  )}
                  data={fieldsCertification}
                />
              </>
            )}
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
                      maxLength: {
                        value: 100,
                        message: "Max length exceeded",
                      },
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
                      maxLength: {
                        value: 20,
                        message: "Max length exceeded",
                      },
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
                      maxLength: {
                        value: 100,
                        message: "Max length exceeded",
                      },
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
                    {...registerEducation("schoolName", {
                      shouldUnregister: true,
                      maxLength: {
                        value: 100,
                        message: "Max length exceeded",
                      },
                    })}
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
                          items={[
                            { id: "Master Degree", value: "Master Degree" },
                            { id: "Magister Degree", value: "Magister Degree" },
                            { id: "Magister Degree", value: "Magister Degree" },
                            { id: "Doctor", value: "Doctor" },
                            { id: "Bachelor Degree", value: "Bachelor Degree" },
                            { id: "Associate", value: "Associate" },
                            { id: "Diploma 4", value: "Diploma 4" },
                            { id: "Diploma 3", value: "Diploma 3" },
                            { id: "Diploma 2", value: "Diploma 2" },
                            { id: "Diploma 1", value: "Diploma 1" },
                            { id: "Senior High School", value: "Senior High School" },
                          ]}
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
                    {...registerEducation("fieldOfStudy", {
                      shouldUnregister: true,
                      maxLength: {
                        value: 150,
                        message: "Max length exceeded",
                      },
                    })}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlEducation}
                    name="startYear"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.startYear
                            ? moment(modalChannelForm.data?.startYear, "YYYY-MM-DD")
                            : ""
                        }
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
                        defaultValue={
                          modalChannelForm.data?.endYear
                            ? moment(modalChannelForm.data?.endYear, "YYYY-MM-DD")
                            : ""
                        }
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
                    {...registerEducation("gpa", {
                      shouldUnregister: true,
                      maxLength: {
                        value: 5,
                        message: "Max length exceeded",
                      },
                    })}
                  />
                </>
              ) : modalChannelForm.typeForm === "Add Family" ||
                modalChannelForm.typeForm === "Edit Family" ? (
                <>
                  <Controller
                    control={controlFamily}
                    name="familyRelation"
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>Family Relation</Label>
                        <Spacer size={3} />
                        <Dropdown
                          defaultValue={modalChannelForm.data?.familyRelation}
                          noSearch
                          defaul
                          width="100%"
                          items={[
                            { id: "Husband", value: "Husband" },
                            { id: "Father", value: "Father" },
                            { id: "Mother", value: "Mother" },
                            { id: "Wife", value: "Wife" },
                            { id: "Child", value: "Child" },
                          ]}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                        />
                      </>
                    )}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.name}
                    width="100%"
                    label="Name"
                    height="48px"
                    error={errorsFamily.name?.message}
                    placeholder={"e.g Jane Doe"}
                    {...registerFamily("name", {
                      maxLength: {
                        value: 100,
                        message: "Max length exceeded",
                      },
                    })}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlFamily}
                    name="gender"
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>Gender</Label>
                        <Spacer size={3} />
                        <Dropdown
                          defaultValue={modalChannelForm.data?.gender}
                          noSearch
                          defaul
                          width="100%"
                          items={[
                            { id: "Male", value: "Male" },
                            { id: "Female", value: "Female" },
                          ]}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                        />
                      </>
                    )}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlFamily}
                    name="birthOfDate"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.birthOfDate
                            ? moment(modalChannelForm.data?.birthOfDate, "YYYY-DD-MM")
                            : ""
                        }
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="Birth of Date"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.mobile}
                    width="100%"
                    label="Mobile"
                    error={errorsFamily.mobile?.message}
                    type="number"
                    height="48px"
                    placeholder={"e.g 08123456789"}
                    {...registerFamily("mobile", {
                      maxLength: {
                        value: 15,
                        message: "Max length exceeded",
                      },
                    })}
                  />
                </>
              ) : modalChannelForm.typeForm === "Add Training" ||
                modalChannelForm.typeForm === "Edit Training" ? (
                <>
                  <Input
                    defaultValue={modalChannelForm.data?.trainingName}
                    error={errorTraining.trainingName?.message}
                    width="100%"
                    label="Training Name"
                    height="48px"
                    placeholder={"e.g Training Business"}
                    {...registerTraining("trainingName", {
                      maxLength: {
                        value: 100,
                        message: "Max length exceeded",
                      },
                      shouldUnregister: true,
                    })}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlTraining}
                    name="trainingType"
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>Training Type</Label>
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
                          isLoading={isFetchingTrainingType}
                          isLoadingMore={isFetchingMoreTrainingType}
                          fetchMore={() => {
                            if (hasNextPageTrainingType) {
                              fetchNextPageTrainingType();
                            }
                          }}
                          items={
                            isFetchingTrainingType && !isFetchingMoreTrainingType
                              ? []
                              : trainingTypeList
                          }
                          onChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(value: any) => {
                            setSearchTrainingType(value);
                          }}
                        />
                      </>
                    )}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlTraining}
                    name="trainingStatus"
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>Training Status</Label>
                        <Spacer size={3} />
                        <Dropdown
                          defaultValue={modalChannelForm.data?.trainingStatus}
                          noSearch
                          defaul
                          width="100%"
                          items={[
                            { id: "Completed", value: "Completed" },
                            { id: "In Progress", value: "In Progress" },
                            { id: "Plan", value: "Plan" },
                          ]}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                        />
                      </>
                    )}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlTraining}
                    name="startDate"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.startDate
                            ? moment(modalChannelForm.data?.startDate, "YYYY-DD-MM")
                            : ""
                        }
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="Start Date"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlTraining}
                    name="endDate"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.endDate
                            ? moment(modalChannelForm.data?.endDate, "YYYY-DD-MM")
                            : ""
                        }
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="End Date"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlTraining}
                    rules={{
                      maxLength: {
                        value: 225,
                        message: "Max length exceeded",
                      },
                    }}
                    name="descriptionTraining"
                    render={({ field: { onChange } }) => (
                      <TextArea
                        width="100%"
                        rows={2}
                        onChange={onChange}
                        defaultValue={modalChannelForm.data?.descriptionTraining}
                        error={errorTraining.descriptionTraining?.message}
                        placeholder="e.g Training very helpfull"
                        label="Description"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Text variant="headingRegular">
                    Upload Certification <Text variant="body1">(Max. 5MB, Format .jpeg, .pdf)</Text>
                  </Text>

                  <Spacer size={16} />

                  <Controller
                    control={controlTraining}
                    name="imageCertTraining"
                    render={({ field: { onChange } }) => (
                      <FileUploaderAllFilesDragger
                        onSubmit={(file: any) => onChange(file)}
                        defaultFileList={
                          modalChannelForm.data?.imageCertTraining
                            ? [modalChannelForm.data?.imageCertTraining]
                            : []
                        }
                        defaultFile={
                          modalChannelForm.data?.imageCertTraining
                            ? URL.createObjectURL(modalChannelForm.data?.imageCertTraining)
                            : "/placeholder-employee-photo.svg"
                        }
                        withCrop
                        removeable
                      />
                    )}
                  />
                </>
              ) : modalChannelForm.typeForm === "View Training" ? (
                <>
                  <Spacer size={20} />
                  View Training
                  <Spacer size={20} />
                </>
              ) : modalChannelForm.typeForm === "View Certification" ? (
                <>
                  <Spacer size={20} />
                  View Certification
                  <Spacer size={20} />
                </>
              ) : (
                <>
                  <Input
                    defaultValue={modalChannelForm.data?.certificationName}
                    width="100%"
                    error={errorsCertification.certificationName?.message}
                    label="Certification Name"
                    height="48px"
                    placeholder={"e.g Business Cetification"}
                    {...registerCertification("certificationName", {
                      maxLength: {
                        value: 50,
                        message: "Max length exceeded",
                      },
                    })}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.institution}
                    error={errorsCertification.institution?.message}
                    width="100%"
                    label="Institution"
                    height="48px"
                    placeholder={"e.g Business Center"}
                    {...registerCertification("institution", {
                      maxLength: {
                        value: 50,
                        message: "Max length exceeded",
                      },
                    })}
                  />

                  <Spacer size={20} />

                  <Input
                    defaultValue={modalChannelForm.data?.certificationNumber}
                    width="100%"
                    label="Certification Number"
                    height="48px"
                    placeholder={"e.g Business Center"}
                    {...registerCertification("certificationNumber")}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlCertification}
                    name="certificationDate"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.certificationDate
                            ? moment(modalChannelForm.data?.certificationDate, "YYYY-DD-MM")
                            : ""
                        }
                        onChange={(date: any, dateString: any) => onChange(dateString)}
                        label="Certification Date"
                      />
                    )}
                  />

                  <Spacer size={20} />

                  <Text variant="headingRegular">
                    Upload Certification <Text variant="body1">(Max. 5MB, Format .jpeg, .pdf)</Text>
                  </Text>

                  <Spacer size={16} />

                  <Controller
                    control={controlCertification}
                    name="imageCertCertification"
                    render={({ field: { onChange } }) => (
                      <FileUploaderAllFilesDragger
                        onSubmit={(file: any) => onChange(file)}
                        defaultFileList={
                          modalChannelForm.data?.imageCertCertification
                            ? [modalChannelForm.data?.imageCertCertification]
                            : []
                        }
                        defaultFile={
                          modalChannelForm.data?.imageCertCertification
                            ? URL.createObjectURL(modalChannelForm.data?.imageCertCertification)
                            : "/placeholder-employee-photo.svg"
                        }
                        withCrop
                        removeable
                      />
                    )}
                  />
                </>
              )}

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
                ) : modalChannelForm.typeForm === "Add Education" ||
                  modalChannelForm.typeForm === "Edit Education" ? (
                  <Button
                    onClick={handleSubmitEducation(handleAddItemEducation)}
                    variant="primary"
                    size="big"
                  >
                    Save
                  </Button>
                ) : modalChannelForm.typeForm === "Add Family" ||
                  modalChannelForm.typeForm === "Edit Family" ? (
                  <Button
                    onClick={handleSubmitFamily(handleAddItemFamily)}
                    variant="primary"
                    size="big"
                  >
                    Save
                  </Button>
                ) : modalChannelForm.typeForm === "Add Training" ||
                  modalChannelForm.typeForm === "Edit Training" ? (
                  <Button
                    onClick={handleSubmitTraining(handleAddItemTraining)}
                    variant="primary"
                    size="big"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitCertification(handleAddItemCertification)}
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
