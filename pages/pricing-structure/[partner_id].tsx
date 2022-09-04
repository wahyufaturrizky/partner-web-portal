import React, { useState } from "react";
import {
  Text,
  Col,
  Spin,
  Row,
  Spacer,
  Table,
  Pagination,
  Dropdown2,
  Button,
  Accordion,
  Input,
  Radio,
  EmptyState,
  Dropdown,
  Alert,
  FileUploaderAllFiles,
} from "pink-lava-ui";
import styled from "styled-components";
import { Router, useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCountries } from "../../hooks/country/useCountry";
import { useCities } from "../../hooks/city/useCity";
import { useCompanyTypes } from "../../hooks/companyType/useCompanyType";
import { useSectors } from "../../hooks/sector/useSector";
import { useIndustries } from "../../hooks/industry/useIndustry";
import usePagination from "@lucasmogari/react-pagination";
import _ from "lodash";
import { useMenuDesignLists } from "../../hooks/menu-design/useMenuDesign";
import {
  useApprovePartnerConfigList,
  useCreatePartnerConfigDraftList,
  useCreatePartnerConfigList,
  useDeletePartnerConfigList,
  usePartnerConfigList,
  useValidatePartnerConfigInput,
} from "../../hooks/pricing-structure/usePricingStructure";
import { STATUS_APPROVAL_TEXT, STATUS_APPROVAL_VARIANT } from "../../utils/utils";
import { ModalRejectPartner } from "../../components/modals/ModalRejectPartner";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import ArrowLeft from "../../assets/arrow-left.svg";
import { ModalInactiveReason } from "../../components/modals/ModalInactiveReason";
import ExclamationError from "../../assets/exclamation-error.svg";

const DetailConfig: any = () => {
  const [errors, setErrors] = useState({});
  const [sharedType, setSharedType] = useState("SHARED_APP");
  const [selectedRowKeysMenuDesign, setSelectedRowKeysMenuDesign] = useState([]);
  const [modalReject, setModalReject] = useState({ open: false });
  const [fotoIjinUsaha, setFotoIjinUsaha] = useState();
  const [fotoNpwp, setFotoNpwp] = useState();
  const [modalInactiveReason, setModalInactiveReason] = useState({ open: false });

  const router = useRouter();
  const { partner_id } = router.query;

  const { register, getValues, handleSubmit, setValue } = useForm();

  const { data: partner, isLoading } = usePartnerConfigList({
    partner_config_id: partner_id,
    options: {
      onSuccess: (data) => {
        let newData = data;
        data = newData.row;
        setValue("email", data.email);
        setValue("name", data.name);
        setValue("id", data.id);
        setValue("subdomain", data.subdomain);
        setValue("country_id", data.countryId);
        setValue("partner_type_id", data.partnerTypeId);
        setValue("industry_id", data.industryId);
        setValue("sector_id", data.sectorId);
        setValue("city_id", data.cityId);
        setValue("company_article", data.companyArticle);
        setValue("company_article_amandement", data.companyArticleAmandement);
        setValue("business_license", data.businessLicense);
        setValue("tax_number", data.taxNumber);
        setValue("owner_name", data.ownerName);
        setValue("owner_contact", data.ownerContact);
        setValue("pic_finance_name", data.picFinanceName);
        setValue("pic_finance_contact", data.picFinanceContact);
        setValue("pic_operational_name", data.picOperationalName);
        setValue("pic_operational_contact", data.picOperationalContact);
        setValue("setting_type", data.settingType);
        setValue("backup", data.backup);
        setValue("menu_design_id", data.menuDesignId);
        setValue("number_of_employee", data.numberOfEmployee);
        setSelectedRowKeysMenuDesign([data.menuDesignId]);
        setSharedType(data.settingType);

        if (data.approvalStatus === "REJECTED") {
          let rejectionDetail = newData?.rejectedReason?.rejectionDetail;

          if (rejectionDetail) {
            let parseRejectedDetail = JSON.parse(rejectionDetail);
            if (Object.keys(parseRejectedDetail)?.length > 0) {
              let employeeKeys = Object.keys(parseRejectedDetail.general);
              let generalKeys = Object.keys(parseRejectedDetail.contact);
              let menuDesignKeys = ["menu_design"];

              let allKeys = [...employeeKeys, ...generalKeys, ...menuDesignKeys];

              const newErrors = _.cloneDeep(errors) as any;
              allKeys.forEach((key) => {
                let newKey = {
                  name: "Company Name",
                  partner_type_id: "Company Type",
                  industry_id: "Industry",
                  country_id: "Country",
                  sector: "Sector",
                  subdomain: "Subdomain",
                  company_article: "Akte Pendirian",
                  company_article_amandement: "Akte Perubahan",
                  business_license: "Nomor Ijin Usaha",
                  tax_number: "Nomor NPWP",
                  business_license_image: "Foto Ijin Usaha",
                  tax_number_image: "Foto NPWP",
                  owner_contact: "Owner Contact",
                  pic_finance_contact: "Pic Finance Contact",
                  pic_operational_contact: "Pic Operational Contact",
                  menu_design: "Menu Design",
                };

                newErrors[key] = `${newKey[key]} has not been filled in or adjusted again`;
              });

              setErrors(newErrors);
            }
          }
        }
      },
    },
  });

  const { mutate: createConfig } = useCreatePartnerConfigList({
    options: {
      onSuccess: () => {
        router.push("/partner-config-partner-list");
      },
    },
  });

  const { mutate: draftConfig } = useCreatePartnerConfigDraftList({
    options: {
      onSuccess: () => {
        router.push("/partner-config-partner-list");
      },
    },
  });

  function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (
        typeof object[key] !== "object" ||
        key === "business_license_image" ||
        key === "tax_number_image"
      )
        formData.append(key, object[key]);
      else formData.append(key, JSON.stringify(object[key]));
    });
    return formData;
  }

  const validateRequired = (data) => {
    const newErrors = _.cloneDeep(errors);
    const isError = false;

    if (!data.name) {
      newErrors["name"] = "Company Name is required";
      isError = true;
    }

    if (!data.email) {
      newErrors["email"] = "Email is required";
      isError = true;
    }

    if (!data.partner_type_id) {
      newErrors["partner_type_id"] = "Company Type is required";
      isError = true;
    }

    if (!data.industry_id) {
      newErrors["industry_id"] = "Industry is required";
      isError = true;
    }

    if (!data.sector_id) {
      newErrors["sector_id"] = "Sector is required";
      isError = true;
    }

    if (!data.number_of_employee) {
      newErrors["number_of_employee"] = "Number of Employee is required";
      isError = true;
    }

    if (!data.backup) {
      newErrors["backup"] = "Backup Retention is required";
      isError = true;
    }

    setErrors(newErrors);

    return isError;
  };

  const onSubmit = (data) => {
    data.setting_type = sharedType;
    if (selectedRowKeysMenuDesign.length > 0) {
      data.menu_design_id = selectedRowKeysMenuDesign[0];
      if (fotoIjinUsaha) {
        data.business_license_image = fotoIjinUsaha;
      }
      if (fotoNpwp) {
        data.tax_number_image = fotoNpwp;
      }
    }
    if (!validateRequired(data)) {
      createConfig(getFormData(data));
    }
  };

  const onSubmitDraft = (data) => {
    data.setting_type = sharedType;
    if (selectedRowKeysMenuDesign.length > 0) {
      data.menu_design_id = selectedRowKeysMenuDesign[0];
    }
    if (!validateRequired(data)) {
      draftConfig(getFormData(data));
    }
  };

  const [search, setSearch] = useState({
    companySearch: "",
    industrySearch: "",
    sectorSearch: "",
    countrySearch: "",
    citySearch: "",
    numberOfEmployeeSearch: "",
  });

  const { data: companyTypes, isLoading: isLoadingCompanyTypes } = useCompanyTypes({
    options: {},
    query: {
      search: search.companySearch,
      limit: 10000,
    },
  });
  const companyTypeList = companyTypes?.rows?.map((companyType: any) => ({
    id: companyType.id,
    value: companyType.name,
  }));

  const [isCompany, setIsCompany] = useState(false);

  const { data: countries, isSuccess: isLoadingCountries } = useCountries({
    options: {},
    query: {
      limit: 10000,
      search: search.countrySearch,
    },
  });
  const countryList = countries?.rows?.map((country: any) => ({
    id: country.id,
    value: country.name,
  }));

  const { data: cities, isSuccess: isLoadingCities } = useCities({
    options: {
      enabled: isLoadingCountries,
    },
    query: {
      limit: 10000,
      search: search.citySearch,
    },
  });
  const cityList = cities?.rows?.map((city: any) => ({
    id: city.id,
    value: city.name,
  }));

  const { data: sectors, isSuccess: isLoadingSectors } = useSectors({
    options: {
      enabled: isLoadingCities,
    },
    query: {
      limit: 10000,
      search: search.sectorSearch,
    },
  });

  const sectorsList = sectors?.rows?.map((sector: any) => ({ id: sector.id, value: sector.name }));

  const { data: industries, isSuccess: isLoadingIndustries } = useIndustries({
    options: {
      enabled: isLoadingSectors,
    },
    query: {
      limit: 10000,
      search: search.industrySearch,
    },
  });

  const industryList = industries?.rows?.map((sector: any) => ({
    id: sector.id,
    value: sector.name,
  }));

  let numberOfEmployeeList = [
    { id: "1-50", value: "1-50" },
    { id: "51-100", value: "51-100" },
    { id: "101-500", value: "101-500" },
    { id: "501-1000", value: "501-1000" },
    { id: "1001-5000", value: "1001-5000" },
    { id: "5001-10.000", value: "5001-10.000" },
    { id: "10.001+", value: "10.001+" },
  ];

  if (search.numberOfEmployeeSearch) {
    numberOfEmployeeList = numberOfEmployeeList.filter(({ value }) =>
      value.includes(search.numberOfEmployeeSearch)
    );
  }

  const paginationMenuDesign = usePagination({
    page: 1,
    itemsPerPage: 5,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { data: designLists, isLoading: isLoadingMenuDesign } = useMenuDesignLists({
    options: {
      onSuccess: (data) => {
        paginationMenuDesign.setTotalItems(data.totalRow);
      },
      enabled: isLoadingIndustries,
    },
    query: {
      page: paginationMenuDesign.page,
      limit: paginationMenuDesign.itemsPerPage,
    },
  });

  const dataDesignLists = [];
  designLists?.rows?.map((design) => {
    dataDesignLists.push({
      key: design.id,
      name: design.name,
      action: (
        <Button
          size="small"
          onClick={() => {
            const urlSearchParam = new URLSearchParams(design).toString();
            window.open(`/menu-design/detail?${urlSearchParam}`, "_blank");
          }}
          variant="tertiary"
        >
          View Detail
        </Button>
      ),
    });
  });

  const paginateFieldMenuDesign = dataDesignLists;

  const columnsMenuDesign = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
  ];

  const onBlurValidationRequired = (e) => {
    if (!e.target.value) {
      const newErrors = _.cloneDeep(errors);
      newErrors[e.target.name] = "This field is required";
      setErrors(newErrors);
    }
  };

  const onFocusRemoveValidation = (e) => {
    const newErrors = _.cloneDeep(errors);
    delete newErrors[e.target.name];
    setErrors(newErrors);
  };

  const [isEmailOrSubdomain, setIsEmailOrSubdomain] = useState();
  const { mutate: validateInput } = useValidatePartnerConfigInput({
    options: {
      onError: (e) => {
        const newErrors = _.cloneDeep(errors);
        newErrors[isEmailOrSubdomain] = e.message;
        setErrors(newErrors);
      },
    },
  });

  const { mutate: approvePartner } = useApprovePartnerConfigList({
    options: {
      onSuccess: () => {
        router.push("/partner-config-partner-list");
      },
    },
    partner_id,
  });

  const { mutate: rejectPartner } = useApprovePartnerConfigList({
    options: {
      onSuccess: () => {
        setModalReject({ open: false });
        router.push("/partner-config-partner-list");
      },
    },
    partner_id,
  });

  const validateEmail = (value: any) => {
    validateInput({
      field: "email",
      value,
    });
  };

  const validateSubdomain = (value: any) => {
    validateInput({
      field: "subdomain",
      value,
    });
  };

  const approve = () => {
    const payload = {
      approvalStatus: "APPROVED",
    };
    approvePartner(payload);
  };

  const reject = (data) => {
    rejectPartner(data);
  };

  const activeStatus = [
    { id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
    { id: "N", value: '<div key="2" style="color:red;">Inactive</div>' },
  ];

  let STATUS = partner?.row?.approvalStatus;

  if (partner?.row?.approvalStatus === "APPROVED") {
    STATUS = partner?.row?.activeStatus === "Y" ? "ACTIVE" : "INACTIVE";
  }

  const isDisabled = STATUS === "WAITING";

  const onSelectChangeMenuDesign = (selectedRowKeys) => {
    setSelectedRowKeysMenuDesign(selectedRowKeys);
  };
  const rowSelectionMenuDesign = {
    selectedRowKeys: selectedRowKeysMenuDesign,
    onChange: STATUS === "WAITING" ? () => {} : onSelectChangeMenuDesign,
    type: "radio",
    getCheckboxProps: (record) => ({
      disabled: STATUS === "WAITING",
      name: record.name,
    }),
  };

  const [modalDelete, setModalDelete] = useState({ open: false });

  const { mutate: deletePartners } = useDeletePartnerConfigList({
    options: {
      onSuccess: () => {
        setModalDelete({ open: false });
        router.push("/partner-config-partner-list");
      },
    },
  });

  const rejectedReason = partner?.rejectedReason;
  const inactiveReason = partner?.row?.inactiveReason;

  return (
    <>
      {isLoading || isLoadingCompanyTypes ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Row gap="4px" alignItems="center">
            <ArrowLeft
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/partner-config-partner-list")}
            />
            <Text variant={"h4"}>{partner?.row?.name}</Text>
          </Row>
          <Spacer size={12} />
          <Card padding="20px">
            <Row justifyContent="space-between" alignItems="center" nowrap>
              {STATUS === "ACTIVE" ? (
                <Dropdown
                  label=""
                  isHtml
                  width={"185px"}
                  items={activeStatus}
                  placeholder={"Status"}
                  key={modalInactiveReason.open}
                  handleChange={(text) => {
                    if (text === "N") {
                      setModalInactiveReason({ open: true });
                    } else {
                      setValue("active_status", text);
                      setValue("inactive_reason", "");
                    }
                  }}
                  noSearch
                  defaultValue={getValues("active_status") || partner?.row?.activeStatus}
                />
              ) : (
                <DisabledDropdown2 status={STATUS}>
                  {STATUS_APPROVAL_TEXT[STATUS]}
                </DisabledDropdown2>
              )}
              <Row>
                <Row gap="16px">
                  {STATUS === "DRAFT" && (
                    <Button
                      size="big"
                      variant={"tertiary"}
                      onClick={() => setModalDelete({ open: true })}
                    >
                      Delete
                    </Button>
                  )}

                  {STATUS === "WAITING" ? (
                    <>
                      <Button
                        size="big"
                        variant={"secondary"}
                        onClick={() => setModalReject({ open: true })}
                      >
                        Reject
                      </Button>
                      <Button size="big" variant={"primary"} onClick={approve}>
                        Approve
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="big"
                        variant={"secondary"}
                        onClick={handleSubmit(onSubmitDraft)}
                      >
                        Save as Draft
                      </Button>
                      <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                        Submit
                      </Button>
                    </>
                  )}
                </Row>
              </Row>
            </Row>
          </Card>

          <Spacer size={20} />

          {rejectedReason && STATUS === "REJECTED" && (
            <>
              <Alert>
                <Text variant="subtitle2" color="white">
                  {rejectedReason?.rejectionReason}
                </Text>
              </Alert>
              <Spacer size={20} />
            </>
          )}

          {isDisabled && inactiveReason && (
            <>
              <Alert variant="warning">
                <Text variant="subtitle2" color="cheese.darkest">
                  {inactiveReason}
                </Text>
              </Alert>
              <Spacer size={20} />
            </>
          )}

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">User Data</Accordion.Header>
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Email"
                      height="48px"
                      placeholder={"e.g Email@edot.id"}
                      required
                      error={errors.email}
                      disabled={isDisabled}
                      onFocus={(e) => {
                        setIsEmailOrSubdomain("email");
                        onFocusRemoveValidation(e);
                      }}
                      {...register("email", {
                        onBlur: (e) => {
                          if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(e.target.value)) {
                            setValue("email", e.target.value);
                            validateEmail(e.target.value);
                          } else {
                            const newErrors = _.cloneDeep(errors);
                            newErrors["email"] = "Invalid email address format";
                            setErrors(newErrors);
                          }
                        },
                      })}
                    />
                    {errors.email && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <div style={{ visibility: "hidden", width: "100%" }}>
                    <Input
                      width="100%"
                      label="Email"
                      height="48px"
                      placeholder={"e.g Email@edot.id"}
                    />
                  </div>
                </Row>
                <Spacer size={20} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={32} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">General Data</Accordion.Header>
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Company Name"
                      height="48px"
                      placeholder={"e.g PT. Nabati Group"}
                      error={errors.name}
                      {...register("name", { onBlur: onBlurValidationRequired })}
                      onFocus={onFocusRemoveValidation}
                      required
                      disabled={isDisabled}
                    />
                    {errors.name && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Dropdown2
                      label="Company Type"
                      width={"100%"}
                      items={companyTypeList}
                      placeholder={"Select"}
                      required
                      handleChange={(value) => {
                        setValue("partner_type_id", value);
                        setIsCompany(
                          companyTypeList?.find((company) => company.id === value)?.value ===
                            "Company"
                        );
                      }}
                      onSearch={(search) => setSearch({ ...search, companySearch: search })}
                      error={errors.partner_type_id}
                      disabled={isDisabled}
                      defaultValue={partner?.row?.partnerTypeId}
                    />
                    {errors.partner_type_id && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Dropdown2
                      label="Industry"
                      width={"100%"}
                      items={industryList}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("industry_id", value)}
                      required
                      error={errors.industry_id}
                      onSearch={(search) => setSearch({ ...search, industrySearch: search })}
                      disabled={isDisabled}
                      defaultValue={partner?.row?.industryId}
                    />
                    {errors.industry_id && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Dropdown2
                      label="Sector"
                      width={"100%"}
                      items={sectorsList}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("sector_id", value)}
                      required
                      error={errors.sector_id || errors.sector}
                      onSearch={(search) => setSearch({ ...search, sectorSearch: search })}
                      disabled={isDisabled}
                      defaultValue={partner?.row?.sectorId}
                    />
                    {errors.sector && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Dropdown2
                      label="Country"
                      width={"100%"}
                      items={countryList}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("country_id", value)}
                      error={errors.country_id}
                      onSearch={(search) => setSearch({ ...search, countrySearch: search })}
                      disabled={isDisabled}
                      defaultValue={partner?.row?.countryId}
                    />
                    {errors.country_id && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Dropdown2
                      label="City"
                      width={"100%"}
                      items={cityList}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("city_id", value)}
                      error={errors.city_id}
                      onSearch={(search) => setSearch({ ...search, citySearch: search })}
                      disabled={isDisabled}
                      defaultValue={partner?.row?.cityId}
                    />
                    {errors.city_id && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Dropdown2
                      label="Number of Employee"
                      width={"100%"}
                      items={numberOfEmployeeList}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("number_of_employee", value)}
                      required
                      error={errors.number_of_employee}
                      onSearch={(search) =>
                        setSearch({ ...search, numberOfEmployeeSearch: search })
                      }
                      disabled={isDisabled}
                      defaultValue={partner?.row?.numberOfEmployee}
                    />
                    {errors.number_of_employee && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Subdomain"
                      height="48px"
                      placeholder={"e.g PT. Nabati Group"}
                      error={errors.subdomain}
                      suffix={"edot.id"}
                      {...register("subdomain", {
                        onBlur: (e) => {
                          if (
                            /^[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/.test(e.target.value)
                          ) {
                            setValue("subdomain", e.target.value);
                            validateSubdomain(e.target.value);
                          } else {
                            const newErrors = _.cloneDeep(errors);
                            newErrors["subdomain"] = "Invalid domain format";
                            setErrors(newErrors);
                          }
                        },
                      })}
                      onFocus={(e) => {
                        setIsEmailOrSubdomain("subdomain");
                        onFocusRemoveValidation(e);
                      }}
                      disabled={isDisabled}
                    />
                    {errors.subdomain && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Akte Pendirian"
                      height="48px"
                      error={errors.company_article}
                      placeholder={"e.g 321321"}
                      {...register("company_article")}
                      disabled={isDisabled}
                    />
                    {errors.company_article && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Akte Perubahan"
                      height="48px"
                      error={errors.company_article_amandement}
                      placeholder={"e.g 3451111"}
                      {...register("company_article_amandement")}
                      disabled={isDisabled}
                    />
                    {errors.company_article_amandement && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Nomor Ijin Usaha"
                      height="48px"
                      type="number"
                      placeholder={"e.g 12345"}
                      error={errors.business_license}
                      {...register("business_license")}
                      disabled={isDisabled}
                    />
                    {errors.business_license && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Nomor NPWP"
                      height="48px"
                      type="number"
                      placeholder={"e.g 123456789101112"}
                      error={errors.tax_number}
                      onFocus={onFocusRemoveValidation}
                      {...register("tax_number", {
                        onBlur: (e) => {
                          if (e.target.value.length > 15) {
                            const newErrors = _.cloneDeep(errors);
                            newErrors["tax_number"] = `Can't have more than 15 character`;
                            setErrors(newErrors);
                          }
                        },
                      })}
                      disabled={isDisabled}
                    />
                    {errors.tax_number && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Row width="100%" gap="20px" noWrap>
                  <Col width="100%" gap="8px">
                    <FileUploaderAllFiles
                      label="Foto Ijin Usaha"
                      error={errors.business_license_image}
                      onSubmit={(file) => setFotoIjinUsaha(file)}
                      defaultFile={partner?.row?.businessLicenseImage}
                      disabled={isDisabled}
                    />
                    {errors.business_license_image && (
                      <Row gap="4px" alignItems="center">
                        <ExclamationError />
                        <ErrorText>{errors.business_license_image}</ErrorText>
                      </Row>
                    )}
                  </Col>

                  <Col width="100%" gap="8px">
                    <FileUploaderAllFiles
                      label="Foto NPWP"
                      onSubmit={(file) => setFotoNpwp(file)}
                      defaultFile={partner?.row?.taxNumberImage}
                      disabled={isDisabled}
                      withCrop={true}
                      error={errors.tax_number_image}
                    />
                    {errors.tax_number_image && (
                      <Row gap="4px" alignItems="center">
                        <ExclamationError />
                        <ErrorText>{errors.tax_number_image}</ErrorText>
                      </Row>
                    )}
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">Contact</Accordion.Header>
              <Accordion.Body>
                <Text variant="headingMedium" color="blue.darker">
                  Owner
                </Text>
                <Spacer size="10" />
                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Name"
                      height="48px"
                      placeholder={"e.g Samsul"}
                      {...register("owner_name", { onBlur: onBlurValidationRequired })}
                      disabled={isDisabled}
                    />
                    {errors.owner_name && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Contact"
                      height="48px"
                      type="number"
                      placeholder={"e.g 0823231321"}
                      {...register("owner_contact", { onBlur: onBlurValidationRequired })}
                      disabled={isDisabled}
                      error={errors.owner_contact}
                    />
                    {errors.owner_contact && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                <Spacer size={20} />

                <Text variant="headingMedium" color="blue.darker">
                  Finance
                </Text>
                <Spacer size="10" />
                <Row width="100%" gap="20px" noWrap>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Name"
                      height="48px"
                      placeholder={"e.g Lidya"}
                      {...register("pic_finance_name", { onBlur: onBlurValidationRequired })}
                      disabled={isDisabled}
                    />
                    {errors.pic_finance_name && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                  <Row width="100%" style={{ position: "relative" }}>
                    <Input
                      width="100%"
                      label="Contact"
                      height="48px"
                      placeholder={"e.g 0823231321"}
                      {...register("pic_finance_contact", { onBlur: onBlurValidationRequired })}
                      disabled={isDisabled}
                      error={errors.pic_finance_contact}
                    />
                    {errors.pic_finance_contact && (
                      <ExclamationError style={{ position: "absolute", top: "40%", right: "2%" }} />
                    )}
                  </Row>
                </Row>

                {isCompany && (
                  <>
                    <Spacer size={20} />
                    <Text variant="headingMedium" color="blue.darker">
                      Operational
                    </Text>
                    <Spacer size="10" />
                    <Row width="100%" gap="20px" noWrap>
                      <Row width="100%" style={{ position: "relative" }}>
                        <Input
                          width="100%"
                          label="Name"
                          height="48px"
                          placeholder={"e.g Lidya"}
                          {...register("pic_operational_name", {
                            onBlur: onBlurValidationRequired,
                          })}
                          disabled={isDisabled}
                        />
                        {errors.pic_operational_name && (
                          <ExclamationError
                            style={{ position: "absolute", top: "40%", right: "2%" }}
                          />
                        )}
                      </Row>
                      <Row width="100%" style={{ position: "relative" }}>
                        <Input
                          width="100%"
                          label="Contact"
                          height="48px"
                          placeholder={"e.g 0823231321"}
                          {...register("pic_operational_contact", {
                            onBlur: onBlurValidationRequired,
                          })}
                          disabled={isDisabled}
                          error={errors.pic_operational_contact}
                        />
                        {errors.pic_operational_contact && (
                          <ExclamationError
                            style={{ position: "absolute", top: "40%", right: "2%" }}
                          />
                        )}
                      </Row>
                    </Row>
                  </>
                )}
                <Spacer size={20} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">Technical Settings</Accordion.Header>
              <Accordion.Body>
                <Row
                  justifyContent="space-between"
                  gap="20px"
                  alignItem="center"
                  width="100%"
                  noWrap
                >
                  <Row alignItems="center" gap="8px" width="100%">
                    <Radio
                      disabled={isDisabled}
                      checked={sharedType === "SHARED_APP"}
                      onChange={() =>
                        STATUS === "WAITING" ? () => {} : setSharedType("SHARED_APP")
                      }
                    />
                    <Text variant="subtitle1" style={{ fontWeight: 600 }}>
                      Is Shared App (Default checked)
                    </Text>
                  </Row>
                  <Input
                    width="100%"
                    label="Backup retention (Years)"
                    height="48px"
                    placeholder={"e.g 2"}
                    error={errors.backup}
                    {...register("backup", { onBlur: onBlurValidationRequired })}
                    required
                    disabled={isDisabled}
                  />
                </Row>
                <Spacer size={20} />
                <Text variant="subtitle1" style={{ fontWeight: 600 }}>
                  If No
                </Text>
                <Spacer size={20} />
                <Row alignItems="center" gap="8px">
                  <Radio
                    disabled={isDisabled}
                    checked={sharedType === "SHARED_DB"}
                    onChange={() => (STATUS === "WAITING" ? () => {} : setSharedType("SHARED_DB"))}
                  />
                  <Text variant="subtitle1" style={{ fontWeight: 600 }}>
                    Using Shared DB
                  </Text>
                </Row>
                <Spacer size={20} />
                <Text variant="subtitle1" style={{ fontWeight: 600 }}>
                  If No
                </Text>
                <Spacer size={20} />
                <Row alignItems="center" gap="8px">
                  <Radio
                    disabled={isDisabled}
                    checked={sharedType === "DIFF_SCHEMA"}
                    onChange={() =>
                      STATUS === "WAITING" ? () => {} : setSharedType("DIFF_SCHEMA")
                    }
                  />
                  <Text variant="subtitle1" style={{ fontWeight: 600 }}>
                    Using Different Schema?
                  </Text>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">Menu Design</Accordion.Header>
              <Accordion.Body>
                <Row gap="4px" alignItems="center">
                  <ExclamationError />
                  <ErrorText>{errors.menu_design}</ErrorText>
                </Row>
                <Spacer size="16" />
                <Col gap="60px">
                  <Table
                    columns={columnsMenuDesign}
                    data={paginateFieldMenuDesign}
                    rowSelection={rowSelectionMenuDesign}
                  />
                  <Pagination pagination={paginationMenuDesign} />
                </Col>
                <Spacer size={20} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Spacer size={20} />

          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">Company List</Accordion.Header>
              <Accordion.Body>
                <EmptyState
                  image={"/empty-state.svg"}
                  title={"No Data Company List"}
                  description={`The data will appear when your partner adds to the company list`}
                  height={325}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {modalReject.open && (
            <ModalRejectPartner
              visible={modalReject.open}
              onCancel={() => setModalReject({ open: false })}
              onOk={(data) => reject(data)}
              roleIds={[1]}
            />
          )}

          {modalDelete.open && (
            <ModalDeleteConfirmation
              visible={modalDelete.open}
              onCancel={() => setModalDelete({ open: false })}
              onOk={() => deletePartners({ ids: [partner_id] })}
              itemTitle={partner?.row?.name}
            />
          )}

          {modalInactiveReason.open && (
            <ModalInactiveReason
              visible={modalInactiveReason.open}
              onCancel={() => {
                setValue("active_status", "Y");
                setModalInactiveReason({ open: false });
              }}
              onOk={(reason) => {
                setValue("active_status", "N");
                setValue("inactive_reason", reason);
                setModalInactiveReason({ open: false });
              }}
            />
          )}
        </Col>
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DisabledDropdown2 = styled.div`
  border: 1px solid #f4f4f4;
  border-radius: 8px;
  background: #ffffff;
  padding: 9px 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  width: 220px;
  color: ${(p) =>
    p.status === "DRAFT" || p.status === "INACTIVE"
      ? "#000000"
      : p.status === "WAITING"
      ? "#FFB400"
      : p.status === "REJECTED"
      ? "#ED1C24"
      : "#01A862"};
`;

const ErrorText = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: #ed1c24;
`;

export default DetailConfig;
