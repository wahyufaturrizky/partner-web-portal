import { yupResolver } from "@hookform/resolvers/yup";
import usePagination from "@lucasmogari/react-pagination";
import { lang } from "lang";
import Router, { useRouter } from "next/router";
import {
  Accordion,
  Button,
  Col,
  Dropdown,
  Dropdown2,
  FileUploaderAllFiles,
  Input,
  Row,
  Spacer,
  Spin,
  Switch,
  Text,
  TextArea,
} from "pink-lava-ui";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import {
  useCoa,
  useCompany,
  useCountries,
  useCurrenciesMDM,
  useDateFormatLists,
  useMenuDesignLists,
  useNumberFormatLists,
  useTimezones,
  useUpdateCompany,
  useUploadLogoCompany,
} from "../../hooks/company-list/useCompany";

const CompanyTypeDataFake = [
  {
    id: "Holding",
    value: "Holding",
  },
  {
    id: "Corporate",
    value: "Corporate",
  },
  {
    id: "Company",
    value: "Company",
  },
];

const IndustryDataFake = [
  {
    id: "Agricultural & Allied Industries",
    value: "Agricultural & Allied Industries",
    data: [
      {
        id: "Agricultural products",
        value: "Agricultural products",
      },
      {
        id: "Forestry & logging",
        value: "Forestry & logging",
      },
      {
        id: "Fishery",
        value: "Fishery",
      },
    ],
  },
  {
    id: "Automobiles",
    value: "Automobiles",
    data: [
      {
        id: "Commercial vehicles",
        value: "Commercial vehicles",
      },
      {
        id: "Passenger cars",
        value: "Passenger cars",
      },
      {
        id: "Three & two-wheelers",
        value: "Three & two-wheelers",
      },
    ],
  },
  {
    id: "Aviation",
    value: "Aviation",
    data: [
      {
        id: "Civil aviation",
        value: "Civil aviation",
      },
      {
        id: "Military aviation",
        value: "Military aviation",
      },
    ],
  },
  {
    id: "Banking & Insurance",
    value: "Banking & Insurance",
    data: [
      {
        id: "Public Banking",
        value: "Public Banking",
      },
      {
        id: "Private banking",
        value: "Private banking",
      },
      {
        id: "International banking",
        value: "International banking",
      },
      {
        id: "Life insurance",
        value: "Life insurance",
      },
      {
        id: "General insurance",
        value: "General insurance",
      },
    ],
  },
  {
    id: "Cement",
    value: "Cement",
    data: [
      {
        id: "Cement production",
        value: "Cement production",
      },
      {
        id: "Cement transportation",
        value: "Cement transportation",
      },
    ],
  },
  {
    id: "Consumer Durables",
    value: "Consumer Durables",
    data: [
      {
        id: "Consumer electronics (brown goods)",
        value: "Consumer electronics (brown goods)",
      },
      {
        id: "Consumer appliances (white goods)",
        value: "Consumer appliances (white goods)",
      },
    ],
  },
  {
    id: "E-Commerce",
    value: "E-Commerce",
    data: [
      {
        id: "E-procurement",
        value: "E-procurement",
      },
      {
        id: "E-marketing",
        value: "E-marketing",
      },
      {
        id: "E-payment",
        value: "E-payment",
      },
    ],
  },
  {
    id: "Education & Training",
    value: "Education & Training",
    data: [
      {
        id: "Education",
        value: "Education",
      },
      {
        id: "Training",
        value: "Training",
      },
    ],
  },
  {
    id: "Engineering & Capital Goods",
    value: "Engineering & Capital Goods",
    data: [
      {
        id: "Transport equipment",
        value: "Transport equipment",
      },
      {
        id: "Capital goods",
        value: "Capital goods",
      },
      {
        id: "other machinery/equipment and light engineering products such as castings, forgings and fasteners",
        value:
          "other machinery/equipment and light engineering products such as castings, forgings and fasteners",
      },
    ],
  },
  {
    id: "FMCG",
    value: "FMCG",
    data: [
      {
        id: "Packaged foods",
        value: "Packaged foods",
      },
      {
        id: "Beverages",
        value: "Beverages",
      },
      {
        id: "Toiletries",
        value: "Toiletries",
      },
      {
        id: "Over-the-counter drugs",
        value: "Over-the-counter drugs",
      },
      {
        id: "Other consumables",
        value: "Other consumables",
      },
    ],
  },
  {
    id: "Gems & Jewellery",
    value: "Gems & Jewellery",
    data: [
      {
        id: "Gems",
        value: "Gems",
      },
      {
        id: "Jewelry",
        value: "Jewelry",
      },
    ],
  },
  {
    id: "Healthcare",
    value: "Healthcare",
    data: [
      {
        id: "Hospitals",
        value: "Hospitals",
      },
      {
        id: "Medical devices",
        value: "Medical devices",
      },
      {
        id: "Clinical trials",
        value: "Clinical trials",
      },
      {
        id: "Outsourcing",
        value: "Outsourcing",
      },
      {
        id: "Telemedicine",
        value: "Telemedicine",
      },
      {
        id: "Medical tourism",
        value: "Medical tourism",
      },
      {
        id: "Health insurance and Medical equipment",
        value: "Health insurance and Medical equipment",
      },
    ],
  },
];

const CorporateDataFake = [
  {
    id: "Domestic",
    value: "Domestic",
  },
  {
    id: "International",
    value: "International",
  },
  {
    id: "Other",
    value: "Other",
  },
];

const NumberOfEmployeeDataFake = [
  {
    id: "1-50",
    value: "1-50",
  },
  {
    id: "51-100",
    value: "51-100",
  },
  {
    id: "101-500",
    value: "101-500",
  },
  {
    id: "501-1000",
    value: "501-1000",
  },
  {
    id: "1001-5000",
    value: "1001-5000",
  },
  {
    id: "5001-10000",
    value: "5001-10000",
  },
  {
    id: "10001++",
    value: "10001++",
  },
];

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    code: yup.string().required("Company code is Required"),
    email: yup.string().email("Email not validated").required("Email is Required"),
    address: yup.string(),
    taxId: yup.string(),
    country: yup.string().required("Country is Required"),
    industry: yup.string().required("Industry is Required"),
    numberOfEmployee: yup.string(),
    sector: yup.string().required("Sector is Required"),
    menuDesign: yup.string(),
    companyType: yup.string().required("Company Type is Required"),
    corporate: yup.string(),
    currency: yup.string().required("Currency is Required"),
    coaTemplate: yup.string().required("CoA Template is Required"),
    formatDate: yup.string().required("Format Date is Required"),
    numberFormat: yup.string().required("Number Format is Required"),
    timezone: yup.string(),
    isPkp: yup.boolean(),
    advancePricing: yup.boolean(),
    pricingStructure: yup.boolean(),
    usingApproval: yup.boolean(),
  })
  .required();

// const defaultValue = {
//   activeStatus: "Y",
//   isPkp: false,
//   advancePricing: false,
//   pricingStructure: false,
//   usingApproval: false,
//   country: ''
// };

const DetailCompany: any = () => {
  const t = localStorage.getItem("lan") || "en-US";
  const router = useRouter();
  const { company_id } = router.query;

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [searchCoa, setSearchCoa] = useState("");

  const [searchCurrency, setSearchCurrency] = useState("");

  const [searchMenuDesign, setSearchMenuDesign] = useState("");

  const [searchTimezone, setSearchTimezone] = useState();

  const [searchCountry, setSearchCountry] = useState();

  const [industryList, setIndustryList] = useState(IndustryDataFake);
  const [sectorList, setSectorList] = useState([]);

  const [address, setAddress] = useState("");

  const [foto, setFoto] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: defaultValue,
  });

  const activeStatus = [
    {
      id: "Active",
      value: `<div key="1" style="color:green;">${lang[t].companyList.tertier.active}</div>`,
    },
    {
      id: "Unactive",
      value: `<div key="2" style="color:red;">${lang[t].companyList.tertier.nonActive}</div>`,
    },
  ];

  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    isFetching: isFetchingCompanyData,
  } = useCompany({
    id: company_id,
    options: {
      onSuccess: (data: any) => {
        setAddress(data.address);
        setFoto(data.logo);
      },
    },
  });

  const { mutate: updateCompany, isLoading: isLoadingUpdateCompany } = useUpdateCompany({
    id: company_id,
    options: {
      onSuccess: () => {
        alert("Update Success!");
        router.push("/company-list");
      },
    },
  });

  const { data: dateFormatData, isLoading: isLoadingDateFormatList } = useDateFormatLists({
    options: {
      onSuccess: (data) => {},
    },
  });

  const { data: numberFormatData, isLoading: isLoadingNumberFormatList } = useNumberFormatLists({
    options: {
      onSuccess: (data) => {},
    },
  });

  const { data: coaData, isLoading: isLoadingCoaList } = useCoa({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchCoa,
    },
  });

  const { data: menuDesignData, isLoading: isLoadingMenuDesignList } = useMenuDesignLists({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchMenuDesign,
    },
  });

  const { data: currencyData, isLoading: isLoadingCurrencyList } = useCurrenciesMDM({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchCurrency,
    },
  });

  const { data: countryData, isLoading: isLoadingCountryList } = useCountries({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchCountry,
    },
  });

  const { data: timezoneData, isLoading: isLoadingTimezoneList } = useTimezones({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchTimezone,
    },
  });

  const handleSearchIndustry = (value) => {
    const newIndustry = IndustryDataFake.filter((tz) => tz.value.includes(value));
    setIndustryList(newIndustry);
  };

  const handleSelectIndustry = (value) => {
    setValue("industry", value);
    const filterIndustry = industryList.filter((tz) => tz.value.includes(value));
    setSectorList(filterIndustry[0].data);
  };

  const { mutate: uploadLogo, isLoading: isLoadingUploadLogo } = useUploadLogoCompany({
    options: {
      onSuccess: (data) => {
        setFoto(data);
        alert("Upload Success");
      },
    },
  });

  const handleUploadLogo = (file: any) => {
    const formData = new FormData();
    formData.append("upload_file", file);
    uploadLogo(formData);
  };

  const onSubmit = (data) => {
    const payload = {
      account_id: "0",
      name: data.name,
      code: data.code,
      email: data.email,
      address: address,
      country: data.country,
      industry: data.industry,
      employees: data.numberOfEmployee,
      sector: data.sector,
      menu_design: data.menuDesign,
      tax_id: data.taxId,
      pkp: data.isPkp,
      logo: foto,
      company_type: data.companyType,
      corporate: data.corporate,
      currency: data.currency,
      coa: data.coaTemplate,
      format_date: data.formatDate,
      format_number: data.numberFormat,
      timezone: data.timezone,
      advance_pricing: data.advancePricing,
      pricing_structure: data.pricingStructure,
      use_approval: data.usingApproval,
      status: data.activeStatus,
    };

    updateCompany(payload);
  };

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/company-list")} />
          <Text variant={"h4"}>{lang[t].companyList.addNewCompany}</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            {!isLoadingCompanyData && !isFetchingCompanyData && (
              <Controller
                control={control}
                name="activeStatus"
                defaultValue={companyData.country}
                render={({ field: { onChange } }) => (
                  <Dropdown
                    label=""
                    isHtml
                    width={"185px"}
                    items={activeStatus}
                    placeholder={"Status"}
                    handleChange={(value: any) => {
                      onChange(value);
                    }}
                    noSearch
                    defaultValue={companyData.isActive ? "Y" : "N"}
                  />
                )}
              />
            )}
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => Router.push("/company-list")}
                >
                  {lang[t].companyList.tertier.cancel}
                </Button>
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  {lang[t].companyList.primary.save}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        {!isLoadingCompanyData && !isFetchingCompanyData && (
          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">
                {lang[t].companyList.companyProfile}
              </Accordion.Header>
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <Input
                    width="100%"
                    label={lang[t].companyList.name}
                    height="48px"
                    placeholder={"e.g PT. Kaldu Sari Nabati Indonesia"}
                    error={errors?.name?.message}
                    {...register("name", { required: true })}
                    defaultValue={companyData.name}
                  />
                  <Input
                    width="100%"
                    label={lang[t].companyList.companyCode}
                    height="48px"
                    placeholder={"e.g KSNI"}
                    error={errors?.code?.message}
                    {...register("code", { required: true })}
                    defaultValue={companyData.code}
                  />
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    <Input
                      width="100%"
                      label={lang[t].companyList.email}
                      height="48px"
                      placeholder={"e.g karina@nabatisnack.co.id"}
                      error={errors?.email?.message}
                      {...register("email", { required: true })}
                      defaultValue={companyData.email}
                    />
                  </Col>
                  <Col width="50%">
                    <TextArea
                      width="100%"
                      rows={1}
                      label={
                        <Text placeholder="e.g JL. Soekarno Hatta">
                          {lang[t].companyList.address}
                        </Text>
                      }
                      {...register("address")}
                      onChange={(e) => setAddress(e.target.value)}
                      defaultValue={companyData.address}
                    />
                  </Col>
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    {isLoadingCountryList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="country"
                        defaultValue={companyData.country}
                        render={({ field: { onChange } }) => (
                          <Dropdown2
                            label={lang[t].companyList.country}
                            width={"100%"}
                            items={countryData.rows.map((data) => ({
                              id: data.id, // id
                              value: data.name, // id
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            // handleChange={(value) => setValue("country", value)}
                            onSearch={(search) => setSearchCountry(search)}
                            required
                            error={errors?.country?.message}
                            defaultValue={companyData.country}
                          />
                        )}
                      />
                    )}
                  </Col>
                  <Col width="50%">
                    <Controller
                      control={control}
                      name={lang[t].companyList.industry}
                      defaultValue={companyData.industry}
                      render={({ field: { onChange } }) => (
                        <Dropdown
                          label="Industry"
                          width={"100%"}
                          items={industryList}
                          placeholder={"Select"}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                          onSearch={(search) => handleSearchIndustry(search)}
                          required
                          error={errors?.industry?.message}
                          {...register("industry", { required: true })}
                          defaultValue={companyData.industry}
                        />
                      )}
                    />
                  </Col>
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    <Controller
                      control={control}
                      name="numberOfEmployee"
                      defaultValue={companyData.employees}
                      render={({ field: { onChange } }) => (
                        <Dropdown
                          label={lang[t].companyList.numberOfEmployee}
                          width={"100%"}
                          items={NumberOfEmployeeDataFake}
                          placeholder={"Select"}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                          {...register("numberOfEmployee")}
                          noSearch
                          defaultValue={companyData.employees}
                        />
                      )}
                    />
                  </Col>
                  <Col width="50%">
                    <Controller
                      control={control}
                      name="sector"
                      defaultValue={companyData.sector}
                      render={({ field: { onChange } }) => (
                        <Dropdown
                          label={lang[t].companyList.sector}
                          width={"100%"}
                          items={sectorList}
                          placeholder={"Select"}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                          required
                          noSearch
                          error={errors?.sector?.message}
                          {...register("sector", { required: true })}
                          defaultValue={companyData.sector}
                        />
                      )}
                    />
                  </Col>
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    {isLoadingMenuDesignList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="menuDesign"
                        defaultValue={companyData.menuDesign}
                        render={({ field: { onChange } }) => (
                          <Dropdown2
                            label={lang[t].companyList.menuDesign}
                            width={"100%"}
                            items={menuDesignData.rows.map((data) => ({
                              id: data.id,
                              value: data.name,
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(search) => setSearchMenuDesign(search)}
                            required
                            error={errors?.menuDesign?.message}
                            {...register("menuDesign", { required: true })}
                            defaultValue={companyData.menuDesign}
                          />
                        )}
                      />
                    )}
                    <FileUploaderAllFiles
                      label={lang[t].companyList.companyLogo}
                      // onSubmit={(file) => setFoto(file)}
                      onSubmit={(file) => handleUploadLogo(file)}
                      defaultFile={foto}
                      withCrop={true}
                      removeable
                    />
                  </Col>
                  <Col width="50%">
                    <Input
                      width="100%"
                      label={lang[t].companyList.taxID}
                      height="48px"
                      placeholder={"e.g 10"}
                      {...register("taxId")}
                      defaultValue={companyData.taxId}
                    />
                    <Row>
                      <Text variant="body1">PKP ? </Text>
                      <Controller
                        control={control}
                        name="isPkp"
                        defaultValue={companyData.useApproval}
                        render={({ field: { onChange } }) => (
                          <Switch
                            defaultChecked={companyData.pkp}
                            checked={companyData.pkp}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                          />
                        )}
                      />
                    </Row>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
        <Spacer size={20} />
        {!isLoadingCompanyData && !isFetchingCompanyData && (
          <Accordion>
            <Accordion.Item key={1}>
              <Accordion.Header variant="blue">{lang[t].companyList.generalSetup}</Accordion.Header>
              <Accordion.Body>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    <Controller
                      control={control}
                      name="companyType"
                      defaultValue={companyData.companyType}
                      render={({ field: { onChange } }) => (
                        <Dropdown
                          label={lang[t].companyList.companyType}
                          width={"100%"}
                          items={CompanyTypeDataFake}
                          placeholder={"Select"}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                          required
                          noSearch
                          error={errors?.companyType?.message}
                          {...register("companyType", { required: true })}
                          defaultValue={companyData.companyType}
                        />
                      )}
                    />
                  </Col>
                  <Col width="50%">
                    <Controller
                      control={control}
                      name="corporate"
                      defaultValue={companyData.corporate}
                      render={({ field: { onChange } }) => (
                        <Dropdown
                          label={lang[t].companyList.corporate}
                          width={"100%"}
                          items={CorporateDataFake}
                          placeholder={"Select"}
                          handleChange={(value: any) => {
                            onChange(value);
                          }}
                          {...register("corporate")}
                          noSearch
                          defaultValue={companyData.corporate}
                        />
                      )}
                    />
                  </Col>
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    {isLoadingCurrencyList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="currency"
                        defaultValue={companyData.currency}
                        render={({ field: { onChange } }) => (
                          <Dropdown2
                            label={lang[t].companyList.currency}
                            width={"100%"}
                            items={currencyData.rows.map((data) => ({
                              value: `${data.currency} - ${data.currencyName}`,
                              id: `${data.currency} - ${data.currencyName}`,
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(search) => setSearchCurrency(search)}
                            required
                            error={errors?.currency?.message}
                            {...register("currency", { required: true })}
                            defaultValue={companyData.currency}
                          />
                        )}
                      />
                    )}
                  </Col>
                  <Col width="50%">
                    {isLoadingCoaList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="coaTemplate"
                        defaultValue={companyData.coa}
                        render={({ field: { onChange } }) => (
                          <Dropdown2
                            label={lang[t].companyList.coaTemplate}
                            width={"100%"}
                            items={coaData.rows.map((data) => ({
                              id: data.name,
                              value: data.name,
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(search) => setSearchCoa(search)}
                            required
                            error={errors?.coaTemplate?.message}
                            {...register("coaTemplate", { required: true })}
                            defaultValue={companyData.coa}
                          />
                        )}
                      />
                    )}
                  </Col>
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    {isLoadingDateFormatList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="formatDate"
                        defaultValue={companyData.formatDate}
                        render={({ field: { onChange } }) => (
                          <Dropdown
                            label={lang[t].companyList.formatDate}
                            width={"100%"}
                            items={dateFormatData.rows.map((data) => ({
                              value: data.format,
                              id: data.format,
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            required
                            error={errors?.formatDate?.message}
                            {...register("formatDate", { required: true })}
                            noSearch
                            defaultValue={companyData.formatDate}
                          />
                        )}
                      />
                    )}
                  </Col>
                  <Col width="50%">
                    {isLoadingNumberFormatList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="numberFormat"
                        defaultValue={companyData.formatNumber}
                        render={({ field: { onChange } }) => (
                          <Dropdown
                            label={lang[t].companyList.numberFormat}
                            width={"100%"}
                            items={numberFormatData.rows.map((data) => ({
                              value: data.format,
                              id: data.format,
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            required
                            error={errors?.numberFormat?.message}
                            {...register("numberFormat", { required: true })}
                            noSearch
                            defaultValue={companyData.formatNumber}
                          />
                        )}
                      />
                    )}
                  </Col>
                </Row>
                <Row width="100%" gap="20px" noWrap>
                  <Col width="50%">
                    {isLoadingTimezoneList ? (
                      <Spin tip="Loading data..." />
                    ) : (
                      <Controller
                        control={control}
                        name="timezone"
                        defaultValue={companyData.timezone}
                        render={({ field: { onChange } }) => (
                          <Dropdown2
                            label={lang[t].companyList.timezone}
                            width={"100%"}
                            items={timezoneData.rows.map((data) => ({
                              value: `${data.utc} ${data.name}`,
                              id: `${data.utc} ${data.name}`,
                            }))}
                            placeholder={"Select"}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                            onSearch={(search) => setSearchTimezone(search)}
                            required
                            error={errors?.timezone?.message}
                            {...register("timezone", { required: true })}
                            defaultValue={companyData.timezone}
                          />
                        )}
                      />
                    )}
                  </Col>

                  <Col width="50%">
                    <Spacer size={20} />
                    <Row width="100%" gap="20px" noWrap>
                      <Text variant="body1">{lang[t].companyList.companyUseAdvancePricing}</Text>
                      <Controller
                        control={control}
                        name="advancePricing"
                        defaultValue={companyData.advancePricing}
                        render={({ field: { onChange } }) => (
                          <Switch
                            defaultChecked={companyData.advancePricing}
                            checked={companyData.advancePricing}
                            // onChange={(value) => setValue("advancePricing", value)}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                          />
                        )}
                      />
                    </Row>
                    <Spacer size={20} />
                    <Row width="100%" gap="20px" noWrap>
                      <Text variant="body1">{lang[t].companyList.companyUsePricingStructure}</Text>
                      <Controller
                        control={control}
                        name="pricingStructure"
                        defaultValue={companyData.pricingStructure}
                        render={({ field: { onChange } }) => (
                          <Switch
                            defaultChecked={!companyData.pricingStructure}
                            checked={companyData.pricingStructure}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                          />
                        )}
                      />
                    </Row>
                    <Spacer size={20} />
                    <Row width="100%" gap="20px" noWrap>
                      <Text variant="body1">{lang[t].companyList.usingApproval}</Text>
                      <Controller
                        control={control}
                        name="usingApproval"
                        defaultValue={companyData.useApproval}
                        render={({ field: { onChange } }) => (
                          <Switch
                            defaultChecked={companyData.useApproval}
                            checked={companyData.useApproval}
                            handleChange={(value: any) => {
                              onChange(value);
                            }}
                          />
                        )}
                      />
                    </Row>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
        <Spacer size={20} />
      </Col>
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default DetailCompany;
