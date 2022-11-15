import moment from "moment";
import Image from "next/image";
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
  Switch,
  Table,
  Tabs,
  Text,
  TextArea,
  Spin,
} from "pink-lava-ui";
import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";
import { ICCheckPrimary, ICDelete, ICEdit, ICPlusWhite, ICView } from "../../assets";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { useCityInfiniteLists } from "../../hooks/city/useCity";
import { useLanguages } from "../../hooks/languages/useLanguages";
import { useCountryInfiniteLists } from "../../hooks/mdm/country-structure/useCountries";
import { useDepartmentInfiniteLists } from "../../hooks/mdm/department/useDepartment";
import {
  useBranchInfiniteLists,
  useCountryStructureListMDM,
  useDeleteEmployeeListMDM,
  useEmployeeInfiniteLists,
  useEmployeeListMDM,
  useReportToInfiniteLists,
  useUpdateEmployeeListMDM,
  useUploadFilePhotoEmployeeMDM,
} from "../../hooks/mdm/employee-list/useEmployeeListMDM";
import { useJobLevelInfiniteLists } from "../../hooks/mdm/job-level/useJobLevel";
import { useJobPositionInfiniteLists } from "../../hooks/mdm/job-position/useJobPositon";
import { usePostalCodeInfiniteLists } from "../../hooks/mdm/postal-code/usePostalCode";
import { useTrainingTypeInfiniteLists } from "../../hooks/mdm/training-type/useTrainingType";
import useDebounce from "../../lib/useDebounce";
import { colors } from "../../utils/color";

const EmployeeDetail = () => {
  const router = useRouter();
  const { id: idEmployee } = router.query;

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

  const [postalCodeList, setPostalCodeList] = useState<any[]>([]);
  const [totalRowsPostalCodeList, setTotalRowsPostalCodeList] = useState(0);
  const [searchPostalCode, setSearchPostalCode] = useState("");

  const [trainingTypeList, setTrainingTypeList] = useState<any[]>([]);
  const [totalRowsTrainingTypeList, setTotalRowsTrainingTypeList] = useState(0);
  const [searchTrainingType, setSearchTrainingType] = useState("");

  const [reportToList, setReportToList] = useState<any[]>([]);
  const [totalRowsReportToList, setTotalRowsReportToList] = useState(0);
  const [searchReportTo, setSearchReportTo] = useState("");

  const [countryId, setCountryId] = useState();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [modalChannelForm, setModalChannelForm] = useState({
    open: false,
    data: {},
    typeForm: "create",
  });

  const [defaultActiveKey, setDefaultActiveKey] = useState("Personal");

  const debounceFetch = useDebounce(
    searchDepartment ||
      searchJobPosition ||
      searchReportTo ||
      searchJobLevel ||
      searchEmployee ||
      searchBranch ||
      searchCity ||
      searchPostalCode ||
      searchTrainingType ||
      searchCountry,
    1000
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      type: "",
      photo: "",
      title: "",
      name: "",
      nik: "",
      department: "",
      job_position: "",
      job_level: "",
      is_salesman: false,
      report_to: "",
      branch: "",
      date_join: null,
      date_resign: null,
      languages: [],
      tax: "",
      external_code: "",
      personal: {
        pob: "",
        dob: "",
        nationality: "",
        martial: "",
        blood: "",
        religion: "",
        insurance: "",
        email: "",
        phone: "",
        mobile: "",
        visa: "",
        visa_expire: null,
      },
      address: [],
      bank: [],
      education: [],
      family: [],
      development: {
        certification: [],
        training: [],
      },
    },
  });

  const { data: dataEmployee, isLoading: isLoadingEmployee } = useEmployeeListMDM({
    options: {
      onSuccess: (data: any) => {
        setValue("type", data.type);
        setValue("photo", data.photo);
        setValue("title", data.title);
        setValue("name", data.name);
        setValue("nik", data.nik);
        setValue("department", data.department);
        setValue("job_position", data.jobPosition);
        setValue("job_level", data.jobLevel);
        setValue("is_salesman", data.isSalesman);
        setValue("report_to", data.reportTo);
        setValue("branch", data.branch);
        setValue("date_join", data.dateJoin);
        setValue("date_resign", data.dateResign);
        setValue("languages", data.languages);
        setValue("tax", data.tax);
        setValue("external_code", data.externalCode);
        setValue("personal.pob", data.personal.pob);
        setValue("personal.dob", data.personal.dob);
        setValue("personal.nationality", data.personal.nationality);
        setValue("personal.martial", data.personal.martial);
        setValue("personal.blood", data.personal.blood);
        setValue("personal.religion", data.personal.religion);
        setValue("personal.email", data.personal.email);
        setValue("personal.phone", data.personal.phone);
        setValue("personal.mobile", data.personal.mobile);
        setValue("personal.visa", data.personal.visa);
        setValue("personal.visa_expire", data.personal.visaExpire);
        setValue("address", data.address);
        setValue("bank", data.bank);
        setValue("education", data.education);
        setValue("family", data.family);
        setValue("development", data.development);

        replaceTraining(
          data.development.training.map((data: any) => ({
            id: data.id,
            type: data.type,
            name: data.name,
            status: data.status,
            start: data.start,
            end: data.end,
            description: data.description,
            attachments: data.attachments,
          }))
        );

        replaceCertification(
          data.development.certification.map((data: any) => ({
            id: data.id,
            name: data.name,
            institution: data.institution,
            number: data.number,
            date: data.date,
            attachments: data.attachments,
          }))
        );
      },
    },
    id: idEmployee,
  });

  const addressBodyField = {
    primary: false,
    type: "",
    street: "",
    country: "",
    country_levels: [],
    province: "",
    city: "",
    district: "",
    zone: "",
    postal_code: "",
    lon: "",
    lat: "",
    key: 0,
  };

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
    setValue: setValueTraining,
    formState: { errors: errorTraining },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const {
    register: registerCertification,
    handleSubmit: handleSubmitCertification,
    control: controlCertification,
    setValue: setValueCertification,
    formState: { errors: errorsCertification },
  } = useForm({
    shouldUseNativeValidation: true,
  });

  const { mutate: uploadFilePhotoEmployee, isLoading: isLoadingFilePhotoFilePhotoEmployee } =
    useUploadFilePhotoEmployeeMDM({
      options: {
        onSuccess: (data: any) => {
          setValue("photo", data);
          alert("Upload Success");
        },
      },
    });

  const { mutate: uploadFilePhotoCertificate, isLoading: isLoadingFilePhotoFilePhotoCertificate } =
    useUploadFilePhotoEmployeeMDM({
      options: {
        onSuccess: (data: any) => {
          setValueCertification("attachments", data);
          alert("Upload Success");
        },
      },
    });

  const { mutate: uploadFilePhotoTraining, isLoading: isLoadingFilePhotoFilePhotoTraining } =
    useUploadFilePhotoEmployeeMDM({
      options: {
        onSuccess: (data: any) => {
          setValueTraining("attachments", data);
          alert("Upload Success");
        },
      },
    });

  const handleUploadPhotoEmployeeFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);
    uploadFilePhotoEmployee(formData);
  };

  const handleUploadPhotoTrainingFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);
    uploadFilePhotoTraining(formData);
  };

  const handleUploadPhotoCertificateFile = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);
    uploadFilePhotoCertificate(formData);
  };

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
    isFetching: isFetchingReportTo,
    isFetchingNextPage: isFetchingMoreReportTo,
    hasNextPage: hasNextPageReportTo,
    fetchNextPage: fetchNextPageReportTo,
  } = useReportToInfiniteLists({
    query: {
      search: debounceFetch,
      company: "KSNI",
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsReportToList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.ReportToId,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setReportToList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (reportToList.length < totalRowsReportToList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
      enabled: false,
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
              label: element.code,
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
    fields: fieldsAddresess,
    append: appendAddresess,
    replace: replaceAddresess,
    remove: removeAddresess,
  } = useFieldArray({
    control,
    name: "address",
  });

  const { data: countryStructureListData } = useCountryStructureListMDM({
    id: countryId,
    options: {
      onSuccess: (data: any) => {},
      enabled: countryId || countryId !== undefined ? true : false,
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
      enabled: false,
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
      company: "KSNI",
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

  const { mutate: updateEmployeeList, isLoading: isLoadingUpdateEmployeeList } =
    useUpdateEmployeeListMDM({
      options: {
        onSuccess: () => {
          router.back();
        },
      },
      id: idEmployee,
    });

  const onSubmit = (data: any) => {
    if (data.hasOwnProperty("id")) {
      delete data.id;
    }

    data.address.map((dataAddress: any) => {
      if (dataAddress.hasOwnProperty("id") || dataAddress.hasOwnProperty("key")) {
        delete dataAddress.id;
        delete dataAddress.key;
      }
    });

    data.bank.map((dataBank: any) => {
      if (dataBank.hasOwnProperty("id") || dataBank.hasOwnProperty("key")) {
        delete dataBank.id;
        delete dataBank.key;
      }
    });

    data.development.certification.map((dataCertification: any) => {
      if (dataCertification.hasOwnProperty("id") || dataCertification.hasOwnProperty("key")) {
        delete dataCertification.id;
        delete dataCertification.key;
      }
    });

    data.development.training.map((dataTraining: any) => {
      if (dataTraining.hasOwnProperty("id") || dataTraining.hasOwnProperty("key")) {
        delete dataTraining.id;
        delete dataTraining.key;
      }
    });

    data.education.map((dataEducation: any) => {
      if (dataEducation.hasOwnProperty("id") || dataEducation.hasOwnProperty("key")) {
        delete dataEducation.id;
        delete dataEducation.key;
      }
    });

    data.family.map((dataFamily: any) => {
      if (dataFamily.hasOwnProperty("id") || dataFamily.hasOwnProperty("key")) {
        delete dataFamily.id;
        delete dataFamily.key;
      }
    });

    data.address.map((dataAddress: any) => {
      if (
        dataAddress.hasOwnProperty("province") ||
        dataAddress.hasOwnProperty("city") ||
        dataAddress.hasOwnProperty("district") ||
        dataAddress.hasOwnProperty("zone") ||
        dataAddress.hasOwnProperty("id") ||
        dataAddress.hasOwnProperty("key")
      ) {
        delete dataAddress.id;
        delete dataAddress.key;
        delete dataAddress.province;
        delete dataAddress.city;
        delete dataAddress.district;
        delete dataAddress.zone;
      }
    });

    const formData = {
      company: "KSNI",
      ...data,
    };

    updateEmployeeList({
      ...formData,
      development: {
        certification: formData.development.certification.map((data: any) => ({
          ...data,
          attachments: [data.attachments],
        })),
        training: formData.development.training.map((data: any) => ({
          ...data,
          attachments: [data.attachments],
        })),
      },
      languages: [formData.languages],
    });
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
    fields: fieldsBankAccount,
    append: appendBankAccount,
    remove: removeBankAccount,
    replace: replaceBankAccount,
  } = useFieldArray({
    control,
    name: "bank",
  });

  const {
    fields: fieldsEducation,
    append: appendEducation,
    remove: removeEducation,
    replace: replaceEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: fieldsFamily,
    append: appendFamily,
    remove: removeFamily,
    replace: replaceFamily,
  } = useFieldArray({
    control,
    name: "family",
  });

  const {
    fields: fieldsTraining,
    append: appendTraining,
    remove: removeTraining,
    replace: replaceTraining,
  } = useFieldArray({
    control,
    name: "development.training",
  });

  const {
    fields: fieldsCertification,
    append: appendCertification,
    remove: removeCertification,
    replace: replaceCertification,
  } = useFieldArray({
    control,
    name: "development.certification",
  });

  const handleAddItemBankAccount = (data: any) => {
    if (modalChannelForm.typeForm === "Edit Bank Account") {
      let tempEdit = fieldsBankAccount.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.bank = data.bank;
          mapDataItem.account_number = data.account_number;
          mapDataItem.account_name = data.account_name;

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
          mapDataItem.school = data.school;
          mapDataItem.degree = data.degree;
          mapDataItem.study = data.study;
          mapDataItem.start = data.start;
          mapDataItem.end = data.end;
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
          mapDataItem.relation = data.relation;
          mapDataItem.name = data.name;
          mapDataItem.gender = data.gender;
          mapDataItem.dob = data.dob;
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
    if (modalChannelForm.typeForm === "Edit Training") {
      let tempEdit = fieldsTraining.map((mapDataItem) => {
        if (mapDataItem.id === modalChannelForm.data.id) {
          mapDataItem.type = data.type;
          mapDataItem.name = data.name;
          mapDataItem.status = data.status;
          mapDataItem.start = data.start;
          mapDataItem.end = data.end;
          mapDataItem.description = data.description;
          mapDataItem.attachments = data.attachments;

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
          mapDataItem.name = data.name;
          mapDataItem.institution = data.institution;
          mapDataItem.number = data.number;
          mapDataItem.date = data.date;
          mapDataItem.attachments = data.attachments;

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
      dataIndex: "school",
    },
    {
      title: "Degree",
      dataIndex: "degree",
    },
    {
      title: "Field of Study",
      dataIndex: "study",
    },
    {
      title: "Start Year",
      dataIndex: "start",
    },
    {
      title: "End Year",
      dataIndex: "end",
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
      dataIndex: "relation",
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
      dataIndex: "dob",
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
      dataIndex: "type",
    },
    {
      title: "Training Name",
      dataIndex: "name",
    },
    {
      title: "Training Status",
      dataIndex: "status",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Start Date",
      dataIndex: "start",
    },
    {
      title: "End Date",
      dataIndex: "end",
    },
    {
      title: "Image Cert Training",
      dataIndex: "attachments",
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
      dataIndex: "name",
    },
    {
      title: "Institution",
      dataIndex: "institution",
    },
    {
      title: "Certification Number",
      dataIndex: "number",
    },
    {
      title: "Certification  Date",
      dataIndex: "date",
    },
    {
      title: "attachments",
      dataIndex: "attachments",
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
      dataIndex: "bank",
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
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
                        mapDataItem.type = "Home";

                        return { ...mapDataItem };
                      } else {
                        mapDataItem.primary = false;
                        mapDataItem.type = "";
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

  const { mutate: deleteEmployeeList, isLoading: isLoadingDeleteEmployeeList } =
    useDeleteEmployeeListMDM({
      options: {
        onSuccess: () => {
          setShowDeleteModal(false);
          router.back();
        },
      },
    });

  if (isLoadingEmployee) {
    return (
      <Row alignItems="center" justifyContent="center">
        <Spin tip="Loading data..." />
      </Row>
    );
  }

  return (
    <Col>
      <Row gap="4px">
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => router.back()} />
        <Text variant={"h4"}>{dataEmployee?.name}</Text>
      </Row>

      <Spacer size={20} />

      <Card padding="20px">
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Row alignItems="center" gap="16px">
            <Text color="grey.regular">
              Employee Type <span style={{ color: colors.red.regular }}>*</span>
            </Text>
            <Controller
              control={control}
              defaultValue={dataEmployee?.type}
              name="type"
              rules={{
                required: {
                  value: true,
                  message: "Please enter type employee.",
                },
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <Dropdown
                  error={error?.message}
                  label=""
                  defaultValue={dataEmployee?.type}
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
          </Row>

          <Row gap="16px">
            <Button size="big" variant={"tertiary"} onClick={() => setShowDeleteModal(true)}>
              Delete
            </Button>
            <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
              {isLoadingUpdateEmployeeList ? "Loading..." : "Save"}
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
                <FileUploaderAllFiles
                  label="Employee Photo"
                  onSubmit={(file: any) => handleUploadPhotoEmployeeFile(file)}
                  defaultFile={dataEmployee?.photo || "/placeholder-employee-photo.svg"}
                  withCrop
                  disabled={isLoadingFilePhotoFilePhotoEmployee}
                  sizeImagePhoto="125px"
                  removeable
                  textPhoto={[
                    "This Photo will also be used for account profiles and employee identities.",
                    "Photo size 500 x 500 recommended. Drag & Drop Photo or pressing “Upload”",
                  ]}
                />
              </Col>
            </Row>

            <Spacer size={20} />

            <Row width="100%" noWrap>
              <Col width={"10%"}>
                <Controller
                  control={control}
                  name="title"
                  defaultValue={dataEmployee?.title}
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
                        defaultValue={dataEmployee?.title}
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
                  defaultValue={dataEmployee?.name}
                  height="48px"
                  error={errors.name?.message}
                  required
                  placeholder={"e.g Jane Doe"}
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
                  defaultValue={dataEmployee?.nik}
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
                        defaultValue={dataEmployee?.department}
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
                        defaultValue={dataEmployee?.job_position}
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

                <Spacer size={8} />

                <Controller
                  control={control}
                  defaultValue={dataEmployee?.isSalesman}
                  name="is_salesman"
                  render={({ field: { onChange, value } }) => (
                    <Row alignItems="center" gap="12px">
                      <Text>Is Salesman</Text>
                      <Switch
                        defaultChecked={value || dataEmployee?.isSalesman}
                        checked={value || dataEmployee?.isSalesman}
                        onChange={onChange}
                      />
                    </Row>
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
                        defaultValue={dataEmployee?.job_level}
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
                        defaultValue={dataEmployee?.report_to}
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
                  defaultValue={dataEmployee?.branch}
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
                        defaultValue={dataEmployee?.branch}
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
                        items={
                          isFetchingBranch && !isFetchingMoreBranch
                            ? []
                            : [{ id: "test branch", value: "test branch" }]
                        }
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
                  name="date_join"
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
                  name="date_resign"
                  render={({ field: { onChange } }) => (
                    <DatePickerInput
                      fullWidth
                      onChange={(date: any, dateString: any) => onChange(dateString)}
                      label="Resign Date"
                    />
                  )}
                />
              </Col>
            </Row>

            <Row width="100%" noWrap>
              <Col width="100%">
                <Controller
                  control={control}
                  name="languages"
                  render={({ field: { onChange } }) => (
                    <>
                      <Label>Language</Label>
                      <Spacer size={3} />
                      <FormSelect
                        defaultValue={dataEmployee?.languages}
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
                <Input
                  width="100%"
                  type="number"
                  defaultValue={dataEmployee?.tax}
                  label="Tax Number"
                  height="48px"
                  error={errors.tax?.message}
                  placeholder={"e.g 123456789 "}
                  {...register("tax", {
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
                defaultValue={dataEmployee?.external_code}
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
                    <Input
                      width="100%"
                      label="Place of Birth"
                      defaultValue={dataEmployee?.personal?.pob}
                      height="48px"
                      required
                      placeholder={"e.g Medan"}
                      {...register("personal.pob")}
                    />
                  </Col>
                  <Spacer size={10} />

                  <Col width="100%">
                    <Controller
                      control={control}
                      name="personal.dob"
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
                      name="personal.nationality"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Nationality</Label>
                          <Spacer size={3} />
                          <FormSelect
                            defaultValue={dataEmployee?.personal?.nationality}
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
                      name="personal.martial"
                      render={({ field: { onChange } }) => (
                        <>
                          <Label>Marital Status</Label>
                          <Spacer size={3} />
                          <Dropdown
                            noSearch
                            defaultValue={dataEmployee?.personal?.martial}
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
                      name="personal.blood"
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
                      name="personal.religion"
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
                      error={errors.personal?.insurance?.message}
                      label="Medical Number (Insurance)"
                      height="48px"
                      placeholder={"e.g 123456789"}
                      {...register("personal.insurance", {
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
                      error={errors.personal?.email?.message}
                      placeholder={"e.g you@email.com"}
                      {...register("personal.email", {
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
                      error={errors.personal?.phone?.message}
                      label="Phone Number"
                      height="48px"
                      placeholder={"e.g 022 709999"}
                      {...register("personal.phone", {
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
                      type="number"
                      width="100%"
                      label="Mobile Number"
                      height="48px"
                      required
                      defaultValue={dataEmployee?.personal?.mobile}
                      error={errors.personal?.mobile?.message}
                      placeholder={"e.g you@email.com"}
                      {...register("personal.mobile", {
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
                      error={errors.personal?.visa?.message}
                      label="Visa Number"
                      height="48px"
                      placeholder={"e.g 123456789"}
                      {...register("personal.visa", {
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
                      name="personal.visa_expire"
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
                        name={`address.${index}.primary`}
                        render={({ field: {} }) => (
                          <>
                            <DisplayAddess index={index} control={control} />

                            <Row gap="12px" alignItems="center">
                              <DisplayAddessCheckPrimary
                                index={index}
                                control={control}
                                fieldsAddresess={fieldsAddresess}
                                replaceAddresess={replaceAddresess}
                              />
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
                          <InputAddressType index={index} control={control} />
                        </Col>
                        <Spacer size={10} />

                        <Col width="100%">
                          <Controller
                            control={control}
                            defaultValue={dataEmployee?.address?.[index]?.street}
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
                            name={`address.${index}.street`}
                            render={({ field: { onChange } }) => (
                              <TextArea
                                width="100%"
                                rows={2}
                                defaultValue={dataEmployee?.address?.[index]?.street}
                                onChange={onChange}
                                required
                                error={errors?.["address"]?.[index]?.["street"]?.["message"]}
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
                            name={`address.${index}.country`}
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
                                    setCountryId(value);
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
                            name={`address.${index}.province`}
                            render={({ field: { onChange } }) => (
                              <Dropdown
                                label="Province"
                                width="100%"
                                items={countryStructureListData?.structures?.[0]?.values.map(
                                  (data) => ({ id: data.id, value: data.name })
                                )}
                                handleChange={onChange}
                              />
                            )}
                          />
                        </Col>
                      </Row>

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Controller
                            control={control}
                            name={`address.${index}.city`}
                            render={({ field: { onChange } }) => (
                              <Dropdown
                                label="City"
                                width="100%"
                                items={countryStructureListData?.structures?.[1]?.values.map(
                                  (data) => ({ id: data.id, value: data.name })
                                )}
                                handleChange={onChange}
                              />
                            )}
                          />
                        </Col>
                        <Spacer size={10} />

                        <Col width="100%">
                          <Controller
                            control={control}
                            name={`address.${index}.district`}
                            render={({ field: { onChange } }) => (
                              <Dropdown
                                label="District"
                                width="100%"
                                items={countryStructureListData?.structures?.[2]?.values.map(
                                  (data) => ({ id: data.id, value: data.name })
                                )}
                                handleChange={onChange}
                              />
                            )}
                          />
                        </Col>
                      </Row>

                      <Row width="100%" noWrap>
                        <Col width={"100%"}>
                          <Controller
                            control={control}
                            name={`address.${index}.zone`}
                            render={({ field: { onChange } }) => (
                              <Dropdown
                                label="Zone"
                                width="100%"
                                items={countryStructureListData?.structures?.[3]?.values.map(
                                  (data) => ({ id: data.id, value: data.name })
                                )}
                                handleChange={onChange}
                              />
                            )}
                          />
                        </Col>
                        <Spacer size={10} />

                        <Col width="100%">
                          <Controller
                            control={control}
                            name={`address.${index}.postal_code`}
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
                            error={errors?.["address"]?.[index]?.["lon"]?.["message"]}
                            placeholder="e.g -6.909829165558788, 107.57502431159176"
                            label="Longitude"
                            {...register(`address.${index}.lon`, {
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
                            error={errors?.["address"]?.[index]?.["lat"]?.["message"]}
                            placeholder="e.g -6.909829165558788, 107.57502431159176"
                            label="Latitude"
                            {...register(`address.${index}.lat`, {
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
                      filtering.dataIndex !== "attachments"
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
                      filtering.dataIndex !== "attachments"
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
          width={
            modalChannelForm.typeForm === "View Training" ||
            modalChannelForm.typeForm === "View Certification"
              ? "80%"
              : undefined
          }
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
                    defaultValue={modalChannelForm.data?.bank}
                    width="100%"
                    label="Bank Name"
                    height="48px"
                    required
                    error={errorsBankAccount.bank?.message}
                    placeholder={"e.g BCA"}
                    {...registerBankAccount("bank", {
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
                    defaultValue={modalChannelForm.data?.account_number}
                    type="number"
                    width="100%"
                    label="Account Number"
                    height="48px"
                    required
                    error={errorsBankAccount.account_number?.message}
                    placeholder={"e.g 123456789"}
                    {...registerBankAccount("account_number", {
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
                    defaultValue={modalChannelForm.data?.account_name}
                    width="100%"
                    label="Account Name"
                    height="48px"
                    required
                    error={errorsBankAccount.account_name?.message}
                    placeholder={"e.g Jane Doe"}
                    {...registerBankAccount("account_name", {
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
                    defaultValue={modalChannelForm.data?.school}
                    width="100%"
                    label="School Name"
                    height="48px"
                    placeholder={"e.g Lala University"}
                    {...registerEducation("school", {
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
                    rules={{
                      shouldUnregister: true,
                    }}
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
                    defaultValue={modalChannelForm.data?.study}
                    width="100%"
                    label="Field of Study"
                    height="48px"
                    placeholder={"e.g Business"}
                    {...registerEducation("study", {
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
                    name="start"
                    rules={{
                      shouldUnregister: true,
                    }}
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.start
                            ? moment(modalChannelForm.data?.start, "YYYY-MM-DD")
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
                    name="end"
                    rules={{
                      shouldUnregister: true,
                    }}
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.end
                            ? moment(modalChannelForm.data?.end, "YYYY-MM-DD")
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
                    name="relation"
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>Family Relation</Label>
                        <Spacer size={3} />
                        <Dropdown
                          defaultValue={modalChannelForm.data?.relation}
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
                      shouldUnregister: true,
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
                    name="dob"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.dob
                            ? moment(modalChannelForm.data?.dob, "YYYY-DD-MM")
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
                      shouldUnregister: true,
                    })}
                  />
                </>
              ) : modalChannelForm.typeForm === "Add Training" ||
                modalChannelForm.typeForm === "Edit Training" ? (
                <>
                  <Input
                    defaultValue={modalChannelForm.data?.name}
                    error={errorTraining.name?.message}
                    width="100%"
                    label="Training Name"
                    height="48px"
                    placeholder={"e.g Training Business"}
                    {...registerTraining("name", {
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
                    name="type"
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
                    name="status"
                    render={({ field: { onChange } }) => (
                      <>
                        <Label>Training Status</Label>
                        <Spacer size={3} />
                        <Dropdown
                          defaultValue={modalChannelForm.data?.status}
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
                    name="start"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.start
                            ? moment(modalChannelForm.data?.start, "YYYY-DD-MM")
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
                    name="end"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.end
                            ? moment(modalChannelForm.data?.end, "YYYY-DD-MM")
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
                    name="description"
                    render={({ field: { onChange } }) => (
                      <TextArea
                        width="100%"
                        rows={2}
                        onChange={onChange}
                        defaultValue={modalChannelForm.data?.description}
                        error={errorTraining.description?.message}
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

                  <FileUploaderAllFilesDragger
                    disabled={isLoadingFilePhotoFilePhotoTraining}
                    onSubmit={(file: any) => handleUploadPhotoTrainingFile(file)}
                    defaultFileList={
                      modalChannelForm.data?.attachments ? [modalChannelForm.data?.attachments] : []
                    }
                    defaultFile={
                      modalChannelForm.data?.attachments
                        ? modalChannelForm.data?.attachments
                        : "/placeholder-employee-photo.svg"
                    }
                    withCrop
                    removeable
                  />
                </>
              ) : modalChannelForm.typeForm === "View Training" ? (
                <>
                  <Spacer size={20} />

                  <Image
                    src={
                      modalChannelForm.data?.attachments
                        ? modalChannelForm.data?.attachments
                        : "/sample-cert.svg"
                    }
                    layout="responsive"
                    width={100}
                    height={100}
                    placeholder="blur"
                    blurDataURL={
                      modalChannelForm.data?.attachments
                        ? modalChannelForm.data?.attachments
                        : "/placeholder-employee-photo.svg"
                    }
                    alt="iew-training"
                  />
                  <Spacer size={20} />
                </>
              ) : modalChannelForm.typeForm === "View Certification" ? (
                <>
                  <Spacer size={20} />

                  <Image
                    src={
                      modalChannelForm.data?.attachments
                        ? modalChannelForm.data?.attachments
                        : "/sample-cert.svg"
                    }
                    layout="responsive"
                    width={100}
                    height={100}
                    placeholder="blur"
                    blurDataURL={
                      modalChannelForm.data?.attachments
                        ? modalChannelForm.data?.attachments
                        : "/placeholder-employee-photo.svg"
                    }
                    alt="iew-training"
                  />
                  <Spacer size={20} />
                </>
              ) : (
                <>
                  <Input
                    defaultValue={modalChannelForm.data?.name}
                    width="100%"
                    error={errorsCertification.name?.message}
                    label="Certification Name"
                    height="48px"
                    placeholder={"e.g Business Cetification"}
                    {...registerCertification("name", {
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
                    defaultValue={modalChannelForm.data?.number}
                    width="100%"
                    label="Certification Number"
                    height="48px"
                    placeholder={"e.g Business Center"}
                    {...registerCertification("number")}
                  />

                  <Spacer size={20} />

                  <Controller
                    control={controlCertification}
                    name="date"
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        defaultValue={
                          modalChannelForm.data?.date
                            ? moment(modalChannelForm.data?.date, "YYYY-DD-MM")
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

                  <FileUploaderAllFilesDragger
                    disabled={isLoadingFilePhotoFilePhotoCertificate}
                    onSubmit={(file: any) => handleUploadPhotoCertificateFile(file)}
                    defaultFileList={
                      modalChannelForm.data?.attachments ? [modalChannelForm.data?.attachments] : []
                    }
                    defaultFile={
                      modalChannelForm.data?.attachments
                        ? modalChannelForm.data?.attachments
                        : "/placeholder-employee-photo.svg"
                    }
                    withCrop
                    removeable
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
                {modalChannelForm.typeForm === "View Certification" ||
                  (modalChannelForm.typeForm === "View Training" ? null : (
                    <Button
                      size="big"
                      variant={"tertiary"}
                      key="submit"
                      type="primary"
                      onClick={() => setModalChannelForm({ open: false, data: {}, typeForm: "" })}
                    >
                      Cancel
                    </Button>
                  ))}

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
                ) : modalChannelForm.typeForm === "Add Certification" ||
                  modalChannelForm.typeForm === "Edit Certification" ? (
                  <Button
                    onClick={handleSubmitCertification(handleAddItemCertification)}
                    variant="primary"
                    size="big"
                  >
                    Save
                  </Button>
                ) : null}
              </div>
            </div>
          }
        />
      )}

      {showDeleteModal && (
        <Modal
          closable={false}
          centered
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          title={"Confirm Delete"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={4} />
              Are you sure to delete Product Name {dataEmployee?.name}
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
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    deleteEmployeeList({ ids: [idEmployee] });
                  }}
                >
                  {isLoadingDeleteEmployeeList ? "Loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </Col>
  );
};

const DisplayAddess = ({ control, index }: { control: any; index: any }) => {
  const data = useWatch({
    control,
    name: `address.${index}`,
  });
  return (
    <Text color={"blue.dark"} variant={"headingMedium"}>
      {data.type || "New Address"}
    </Text>
  );
};

const InputAddressType = ({ control, index }: { control: any; index: any }) => {
  const data = useWatch({
    control,
    name: `address.${index}`,
  });
  return (
    <Controller
      control={control}
      rules={{
        required: {
          value: true,
          message: "Please enter address type.",
        },
      }}
      defaultValue={data.type}
      name={`address.${index}.type`}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <Label>
            Address Type <span style={{ color: colors.red.regular }}>*</span>
          </Label>
          <Spacer size={3} />
          <Dropdown
            defaultValue={data.type}
            error={error?.message}
            noSearch
            width="100%"
            items={[
              { id: "Home", value: "Home" },
              { id: "Office", value: "Office" },
              { id: "Apartment", value: "Apartment" },
              { id: "School", value: "School" },
            ]}
            handleChange={(value: any) => {
              onChange(value);
            }}
          />
        </>
      )}
    />
  );
};

const DisplayAddessCheckPrimary = ({
  control,
  index,
  fieldsAddresess,
  replaceAddresess,
}: {
  control: any;
  index: any;
  fieldsAddresess: any;
  replaceAddresess: any;
}) => {
  const data = useWatch({
    control,
    name: `address.${index}`,
  });
  return (
    <>
      {data.primary && data.type === "Home" ? (
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
            let tempEdit = fieldsAddresess.map((mapDataItem: any) => {
              if (mapDataItem.key === index) {
                mapDataItem.primary = true;
                mapDataItem.type = "Home";

                return { ...mapDataItem };
              } else {
                mapDataItem.primary = false;
                mapDataItem.type = "";
                return { ...mapDataItem };
              }
            });

            replaceAddresess(tempEdit);
          }}
        >
          Set as Primary
        </Text>
      )}
    </>
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

export default EmployeeDetail;
