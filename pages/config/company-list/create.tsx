import React, { useEffect, useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Button,
  Accordion,
  Input,
  TextArea,
  DatePickerInput,
  Dropdown2,
  Switch,
  FileUploaderAllFiles,
  Spin,
  Radio,
  Tooltip,
  FormSelect,
} from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import { useLanguages } from "hooks/languages/useLanguages";
import moment from "moment";
import { lang } from "lang";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import { useSegmentInfiniteLists } from "hooks/segment/useSegment";
import { useInfiniteIndustry } from "hooks/industry/useIndustries";
import useDebounce from "lib/useDebounce";
import { colors } from "utils/color";
import { useUpdateTemplateGeneral } from "hooks/template-general/useTemplateGeneral";
import { useExchangeRates } from "hooks/mdm/exchange-rate/useExchangeRate";
import { useTimezone } from "../../../hooks/timezone/useTimezone";
import {
  useCoa,
  useCompany,
  useCompanyInfiniteLists,
  useCreateCompany,
  useCurrenciesMDM,
  useDateFormatLists,
  useMenuDesignLists,
  useNumberFormatLists,
  useTimezones,
  useUploadLogoCompany,
} from "../../../hooks/company-list/useCompany";
import ArrowLeft from "../../assets/icons/arrow-left.svg";

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
    code: yup.string().required("Company code is Required").test('len', 'Maximum 4 Characters', (val) => val.toString().length <= 4),
    email: yup.string().email("Email not validated").required("Email is required"),
    phone_number: yup.string().required("Phone Number is Required"),
    address: yup.string().required("Addres is required").default(""),
    taxId: yup.string().default(""),
    language: yup.string().required("Language is Required"),
    country: yup.string().required("Country is Required"),
    source_exchange: yup.string().default(""),
    industry_id: yup.string().default(""),
    numberOfEmployee: yup.string().required("Number of employee is Required").default(""),
    sector_id: yup.string().default(""),
    fromTemplate: yup.string().default("none"),
    companyType: yup.string().default(""),
    corporate: yup.string().default(""),
    currency: yup.string().required("Currency is Required"),
    coaTemplate: yup.string().default(""),
    formatDate: yup.string().default(""),
    numberFormat: yup.string().default(""),
    timezone: yup.string().default(""),
    isPkp: yup.boolean(),
    advanceApproval: yup.boolean(),
    retailPricing: yup.boolean(),
    pricingStructure: yup.boolean(),
    other_company: yup.string().default(""),
  })
  .required();

const defaultValue = {
  activeStatus: "Active",
  isPkp: false,
  advanceApproval: false,
  retailPricing: false,
  pricingStructure: false,
  chart_of_account: "",
  external_code: "",
  fiscal_year: 0,
  industry_id: "",
  country: "",
  sector_id: "",
};

const CreateCompany: any = () => {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";

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
  const [searchTimezone, setSearchTimezone] = useState("");
  const companyCode = localStorage.getItem("companyCode");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState({
    language: "",
    sourceExchange: "",
  });

  const [foto, setFoto] = useState("");

  const [fromTemplate, setFromTemplate] = useState("none");

  const [countryList, setCountryList] = useState<any[]>([]);
  const [totalRowsCountryList, setTotalRowsCountryList] = useState(0);
  const [industryList, setIndustryList] = useState<any[]>([]);
  const [totalRowsIndustryList, setTotalRowsIndustryList] = useState(0);
  const [segmentList, setSegmentList] = useState<any[]>([]);
  const [totalRowsSegmentList, setTotalRowsSegmentList] = useState(0);
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [totalRowsCompanyList, setTotalRowsCompanyList] = useState(0);

  const [searchCountry, setSearchCountry] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchSegment, setSearchSegment] = useState("");
  const [searchOtherCompany, setSearchOtherCompany] = useState("");
  const [otherCompanyId, setOtherCompanyId] = useState("0");

  const [industryId, setIndustryId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [segmentId, setSegmentId] = useState("");
  const [companyParent, setCompanyParent] = useState("");
  const [language, setLanguage] = useState("");

  const [dataCurrency, setDataCurrency] = useState("");
  const debounceFetch = useDebounce(
    searchCountry
      || searchSegment
      || searchOtherCompany
      || searchIndustry,
    1000,
  );
  const [queryParam, setQueryParam] = useState<any>({
    search: debounceFetch,
    limit: 10,
    company_id: companyCode,
  });

  useEffect(() => {
    if (countryId) {
      setQueryParam({ ...queryParam, country_id: countryId });
    }
    if (industryId) {
      setQueryParam({ ...queryParam, country_id: countryId, industry_id: industryId });
    }
    if (segmentId) {
      setQueryParam({
        ...queryParam, country_id: countryId, industry_id: industryId, sector_id: segmentId,
      });
    }
  }, [countryId, industryId, segmentId]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
  });

  const activeStatus = [
    { id: "Active", value: `<div key="1" style="color:green;">${lang[t].companyList.tertier.active}</div>` },
    { id: "Inactive", value: `<div key="2" style="color:red;">${lang[t].companyList.tertier.nonActive}</div>` },
  ];

  const { data: dateFormatData, isLoading: isLoadingDateFormatList } = useDateFormatLists({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      company_id: companyCode,
    },
  });

  const { data: numberFormatData, isLoading: isLoadingNumberFormatList } = useNumberFormatLists({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      company_id: companyCode,
    },
  });

  const { data: coaData, isLoading: isLoadingCoaList } = useCoa({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchCoa,
      company_id: companyCode,
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
      // company_id: companyCode
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCountryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.id,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setCountryList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (countryList.length < totalRowsCountryList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const {
    data: ExchangeData,
    isLoading: isLoadingExchange,
    isFetching: isFetchingExchange,
  } = useExchangeRates({
    query: {
      // search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      company_id: companyCode,
      // currency: dataCurrency,
      // start_date: dataFromDate,
      // end_date: dataToDate,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => ({
          id: element.exchangeRateId,
          value: element.currencyName,
          // key: element.exchangeRateId,
          // id: element.exchangeRateId,
          // exchangeCode: element.currencyCode,
          // exchangeName: element.currencyName,
          // exchangeValue: element.value,
          // exchangeSell: element.sell,
          // exchangeBuy: element.buy,
          // exchangeLastUpdated: moment(element.modifiedAt).format("DD/MM/YYYY"),
        }));
        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });
  const {
    isFetching: isFetchingSegment,
    isFetchingNextPage: isFetchingMoreSegment,
    hasNextPage: hasNextPageSegment,
    fetchNextPage: fetchNextPageSegment,
  } = useSegmentInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
      industry_id: industryId,
      // company_id: companyCode
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsSegmentList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          value: element.id,
          label: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setSegmentList(industryId ? flattenArray : []);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (segmentList.length < totalRowsSegmentList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });
  const {
    isLoading: isLoadingIndustry,
    isFetching: isFetchingIndustry,
    isFetchingNextPage: isFetchingMoreIndustry,
    hasNextPage: hasNextIndustry,
    fetchNextPage: fetchNextIndustry,
  } = useInfiniteIndustry({
    query: {
      search: debounceFetch,
      limit: 10,
      // company_id: companyCode
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsIndustryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          label: element.name,
          value: element.id,
        })));
        const flattenArray = [].concat(...mappedData);
        setIndustryList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (industryList.length < totalRowsIndustryList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });
  const {
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
    isFetchingNextPage: isFetchingMoreCompany,
    hasNextPage: hasNextCompany,
    fetchNextPage: fetchNextCompany,
  } = useCompanyInfiniteLists({
    query: queryParam,
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCompanyList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => group.rows?.map((element: any) => ({
          id: element.id,
          parent: element.parent,
          label: element.name,
          value: element.name,
        })));
        const flattenArray = [].concat(...mappedData);
        setCompanyList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (companyList.length < totalRowsCompanyList) {
          return pages.length + 1;
        }
        return undefined;
      },
    },
  });

  const { data: currencyData, isLoading: isLoadingCurrencyList } = useCurrenciesMDM({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchCurrency,
      // company_id: companyCode
    },
  });

  const { data: timezoneData, isLoading: isLoadingTimezoneList } = useTimezones({
    options: {
      onSuccess: (data) => {},
    },
    query: {
      search: searchTimezone,
      // company_id: companyCode
    },
  });

  const { data: listLanguage } = useLanguages({
    options: { onSuccess: () => {} },
    query: {
      company_id: companyCode,
    },
  });

  const { mutate: createCompany } = useCreateCompany({
    options: {
      onSuccess: (data) => {
        alert("Create Success!");
        router.push("/config/company-list");
      },
      onError: (error: any) => {
        if (error?.data?.message?.includes("already exits")) {
          setError('code', { message: error?.data?.message, type: "focus" }, { shouldFocus: true });
        }
      },
    },
  });

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
    const payload: any = {
      account_id: "0",
      name: data.name,
      code: data.code,
      email: data.email,
      address,
      country: data.country || "",
      employees: data.numberOfEmployee,
      industry_id: data.industry_id,
      sector_id: data.sector_id,
      from_template: fromTemplate,
      other_company_id: fromTemplate === "others" ? otherCompanyId : 0,
      other_company: data.other_company,
      phone_number: data.phone_number,
      tax_id: data.taxId,
      pkp: data.isPkp,
      logo: foto,
      company_type: data.companyType,
      corporate: data.corporate,
      currency: data.currency,
      source_exchange: data.source_exchange || "",
      language: data.language,
      coa: `${data.coaTemplate}`,
      format_date: data.formatDate,
      format_number: data.numberFormat,
      timezone: data.timezone || "",
      advance_approval: data.advanceApproval,
      pricing_structure: data.pricingStructure,
      retail_pricing: data.retailPricing,
      chart_of_account: data.chart_of_account,
      fiscal_year: `${data.fiscal_year}`,
      external_code: data.external_code,
      status: data.activeStatus,
      parent: companyParent,
    };
    console.log(payload);

    createCompany(payload);
  };

  const { mutate: getTemplateGeneral, data: templateGeneralData } : any = useUpdateTemplateGeneral({
    options: {
      onSuccess: (data: any) => {
        if (data.countryId) setValue("country", data.country.refCountryId);
        if (data.industryId) setValue("industry_id", data.industryId);
        if (data.languageId) setValue("language", data.languageId);
        if (data?.currencyFormat?.id) setValue("currency", data.currencyFormat.format);
        if (data?.dateFormatId) setValue("formatDate", data.dateFormat.format);
        if (data?.timezoneId) setValue("timezone", data.timezone.name);
        if (data?.numberFormatId) setValue("numberFormat", data.numberFormat.format);
        if (data?.coaId) setValue("coaTemplate", data.coaId);
        setLanguage(data.languageId);
      },
    },
  });

  const fillUpTemplateGeneral = () => {
    if (countryId && industryId && fromTemplate === "eDot") {
      getTemplateGeneral(
        {
          country_id: countryId,
          industry_id: industryId,
          sector_id: segmentId || 0,
        },
      );
    }
  };

  useEffect(() => {
    fillUpTemplateGeneral();
  }, [industryId, segmentId, countryId, fromTemplate]);

  return (
    <Col>
      <Row gap="4px" alignItems="center">
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/config/company-list")} />
        <Text variant="h4">{lang[t].companyList.addNewCompany}</Text>
      </Row>
      <Spacer size={12} />
      <Card padding="20px">
        <Row justifyContent="space-between" alignItems="center" nowrap>
          <Dropdown
            label=""
            isHtml
            width="185px"
            items={activeStatus}
            placeholder="Status"
            handleChange={(text) => setValue("activeStatus", text)}
            noSearch
            defaultValue="Active"
          />
          <Row>
            <Row gap="16px">
              <Button
                size="big"
                variant="tertiary"
                onClick={() => Router.push("/config/company-list")}
              >
                {lang[t].companyList.tertier.cancel}
              </Button>
              <Button size="big" variant="primary" onClick={handleSubmit(onSubmit)}>
                {lang[t].companyList.primary.save}
              </Button>
            </Row>
          </Row>
        </Row>
      </Card>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">{lang[t].companyList.companyProfile}</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" gap="20px" noWrap>
              <FileUploaderAllFiles
                label={lang[t].companyList.companyLogo}
                  // onSubmit={(file) => setFoto(file)}
                onSubmit={(file) => handleUploadLogo(file)}
                defaultFile="/placeholder-employee-photo.svg"
                withCrop
                removeable
                textPhoto={[
                  "Format .JPG .JPEG .PNG and Dimension Minimum 72 x 72, Optimal size 300 x 300",
                  "File Size Max. 5MB",
                ]}
              />
            </Row>
            <Spacer size={12} />
            <Row width="100%" gap={20} noWrap>
              <Span>{lang[t].companyList.copyFromTemplate}</Span>
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Flex>
                  <Radio
                    value="companyInternal"
                    checked={fromTemplate == "none"}
                    onChange={(e: any) => setFromTemplate("none")}
                  >
                    <SpanAlign>{lang[t].companyList.none}</SpanAlign>
                  </Radio>
                  <Radio
                    value="companyInternal"
                    checked={fromTemplate == "eDot"}
                    onChange={(e: any) => setFromTemplate("eDot")}
                  >
                    eDOT
                  </Radio>
                  <Radio
                    value="companyInternal"
                    checked={fromTemplate == "others"}
                    onChange={(e: any) => setFromTemplate("others")}
                  >
                    {lang[t].companyList.otherCompany}
                  </Radio>
                </Flex>
              </Col>
              <Col width="50%">
                {/* For company */}
                {fromTemplate === "others" && (
                  <Col width="100%">
                    <Controller
                      control={control}
                      name="other_company"
                      render={({ field: { onChange }, fieldState: { error } }) => (
                        <>
                          <Label>
                            Other Company Name
                          </Label>
                          <Spacer size={3} />
                          <FormSelect
                            height="48px"
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Select"
                            borderColor="#AAAAAA"
                            arrowColor="#000"
                            withSearch
                            isLoading={isFetchingCompany}
                            isLoadingMore={isFetchingMoreCompany}
                            fetchMore={() => {
                              if (hasNextCompany) {
                                fetchNextCompany();
                              }
                            }}
                            items={isFetchingCompany && !isFetchingMoreCompany ? [] : companyList}
                            onChange={(value: any) => {
                              onChange(value);
                              setValue("other_company", value);
                              setOtherCompanyId(companyList.filter((e: { value: any; }) => e.value === value)[0]?.id);
                              setCompanyParent(companyList.filter((e: { value: any; }) => e.value === value)[0]?.parent);
                            }}
                            onSearch={(value: any) => {
                              setSearchOtherCompany(value);
                            }}
                          />
                        </>
                      )}
                    />
                  </Col>
                )}
              </Col>
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Input
                width="100%"
                label={lang[t].companyList.name}
                height="48px"
                placeholder="e.g PT. Kaldu Sari Nabati Indonesia"
                error={errors?.name?.message}
                required
                {...register("name", { required: true })}
              />
              <Input
                width="100%"
                label={lang[t].companyList.companyCode}
                height="48px"
                placeholder="e.g eDot"
                error={errors?.code?.message}
                required
                {...register("code", { required: true })}
              />
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Input
                  width="100%"
                  label={lang[t].companyList.email}
                  height="48px"
                  placeholder="e.g karina@nabatisnack.co.id"
                  error={errors?.email?.message}
                  required
                  {...register("email", { required: true })}
                />
              </Col>
              <Col width="50%">
                {/* <TextArea
                    width="100%"
                    rows={1}
                    label={<Text placeholder="e.g JL. Soekarno Hatta">Address</Text>}
                    {...register("address")}
                    onChange={(e) => setAddress(e.target.value)}
                  /> */}
                <Input
                  width="100%"
                  label="Phone Number"
                  height="48px"
                  placeholder="e.g 0811321456"
                  error={errors?.phone_number?.message}
                  required
                  {...register("phone_number", { required: true })}
                />
              </Col>
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Controller
                  control={control}
                  name="country"
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter country.",
                    },
                  }}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <Label>
                        Country
                        {' '}
                        <span style={{ color: colors.red.regular }}>*</span>
                      </Label>
                      <Spacer size={3} />
                      <FormSelect
                        error={error?.message}
                        height="48px"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
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
                          setValue("country", value);
                          setCountryId(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchCountry(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
              <Col width="50%">
                <Input
                  width="100%"
                  label={lang[t].companyList.address}
                  height="48px"
                  placeholder="e.g JL. Soekarno Hatta"
                  {...register("address")}
                  required
                  error={errors?.address?.message}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Col>
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Controller
                  control={control}
                  name="industry_id"
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <Label>
                        Industry
                      </Label>
                      <Spacer size={3} />
                      <FormSelect
                        height="48px"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        isLoading={isFetchingIndustry}
                        isLoadingMore={isFetchingMoreIndustry}
                        fetchMore={() => {
                          if (hasNextIndustry) {
                            fetchNextIndustry();
                          }
                        }}
                        items={isFetchingIndustry && !isFetchingMoreIndustry ? [] : industryList}
                        onChange={(value: any) => {
                          onChange(value);
                          setValue("industry_id", value);
                          setIndustryId(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchIndustry(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
              <Col width="50%">
                <Controller
                  control={control}
                  name="sector_id"
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <Label>
                        Segment
                      </Label>
                      <Spacer size={3} />
                      <FormSelect
                        error={error?.message}
                        height="48px"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Select"
                        borderColor="#AAAAAA"
                        arrowColor="#000"
                        withSearch
                        isLoading={isFetchingSegment}
                        isLoadingMore={isFetchingMoreSegment}
                        fetchMore={() => {
                          if (hasNextPageSegment) {
                            fetchNextPageSegment();
                          }
                        }}
                        items={isFetchingSegment && !isFetchingMoreSegment ? [] : segmentList}
                        onChange={(value: any) => {
                          onChange(value);
                          setValue("sector_id", value);
                          setSegmentId(value);
                        }}
                        onSearch={(value: any) => {
                          setSearchSegment(value);
                        }}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Dropdown
                  label={lang[t].companyList.numberOfEmployee}
                  width="100%"
                  items={NumberOfEmployeeDataFake}
                  placeholder="Select"
                  handleChange={(value: any) => setValue("numberOfEmployee", value)}
                  required
                  {...register("numberOfEmployee", { required: true })}
                  error={errors?.numberOfEmployee?.message}
                  noSearch
                />

              </Col>
              <Col width="50%">
                <Input
                  width="100%"
                  label={lang[t].companyList.taxID}
                  height="48px"
                  placeholder="e.g 10"
                  {...register("taxId")}
                />
                <Row>
                  <Text variant="body1">PKP ? </Text>
                  <Switch onChange={(value) => setValue("isPkp", value)} />
                </Row>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">{lang[t].companyList.generalSetup}</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Dropdown
                  label={lang[t].companyList.companyType}
                  width="100%"
                  items={CompanyTypeDataFake}
                  placeholder="Select"
                  handleChange={(value) => setValue("companyType", value)}
                  noSearch
                  error={errors?.companyType?.message}
                  {...register("companyType")}
                />
              </Col>
              <Col width="50%">
                <Dropdown
                  label={lang[t].companyList.corporate}
                  width="100%"
                  items={CorporateDataFake}
                  placeholder="Select"
                  handleChange={(value) => setValue("corporate", value)}
                  {...register("corporate")}
                  noSearch
                />
              </Col>
            </Row>
            <Spacer size={10} />
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                {/* {isLoadingCurrencyList ? (
                    <Spin tip="Loading data..." />
                  ) : ( */}
                <Dropdown
                  label={lang[t].companyList.currency}
                  width="100%"
                  items={!isLoadingCurrencyList ? currencyData?.rows?.map((data) => ({
                    value: `${data.currency} - ${data.currencyName}`,
                    id: `${data.currency} - ${data.currencyName}`,
                  })) : []}
                  placeholder="Select"
                  handleChange={(value) => {
                    setDataCurrency(value?.split("-")[0]);
                    setValue("currency", value);
                  }}
                  onSearch={(search) => setSearchCurrency(search)}
                  required
                  error={errors?.currency?.message}
                  defaultValue={templateGeneralData?.currencyFormat?.format}
                  key={templateGeneralData?.currencyFormat?.format}
                  {...register("currency", { required: true })}
                />
                {/* )} */}
              </Col>
              <Col width="50%">
                <Dropdown
                  label={lang[t].companyList.sourceExchangeRate}
                  width="100%"
                  items={ExchangeData?.data}
                  placeholder="Select"
                  handleChange={(value) => {
                    setValue("source_exchange", value);
                  }}
                  onSearch={(value: string) => setSearch({ ...search, sourceExchange: value })}
                  {...register("source_exchange", { required: true })}
                />
              </Col>
            </Row>
            <Spacer size={10} />
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                {isLoadingDateFormatList ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <Dropdown
                    label={lang[t].companyList.formatDate}
                    width="100%"
                    items={dateFormatData.rows.map((data) => ({
                      value: data.format,
                      id: data.format,
                    }))}
                    placeholder="Select"
                    handleChange={(value) => setValue("formatDate", value)}
                    error={errors?.formatDate?.message}
                    defaultValue={templateGeneralData?.dateFormat?.format}
                    key={templateGeneralData?.dateFormat?.format}
                    {...register("formatDate")}
                    noSearch
                  />
                )}
              </Col>
              <Col width="50%">
                {isLoadingCoaList ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <Dropdown
                    label={lang[t].companyList.coaTemplate}
                    width="100%"
                    items={coaData.rows.map((data) => ({
                      value: data.name,
                      id: data.id,
                    }))}
                    placeholder="Select"
                    handleChange={(value) => setValue("coaTemplate", value)}
                    onSearch={(search) => setSearchCoa(search)}
                    error={errors?.coaTemplate?.message}
                    defaultValue={templateGeneralData?.coa?.name}
                    key={templateGeneralData?.coa?.name}
                    {...register("coaTemplate")}
                  />
                )}
              </Col>
            </Row>
            <Spacer size={10} />
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                {isLoadingTimezoneList ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <Dropdown
                    label={lang[t].companyList.timezone}
                    width="100%"
                    items={timezoneData?.rows.map((data) => ({
                      value: `${data.utc} ${data.name}`,
                      id: `${data.utc} ${data.name}`,
                    }))}
                    placeholder="Select"
                    handleChange={(value) => setValue("timezone", value)}
                    onSearch={(search) => setSearchTimezone(search)}
                    error={errors?.timezone?.message}
                    defaultValue={
                        `${templateGeneralData?.timezone?.utc}
                        ${templateGeneralData?.timezone?.name}`
}
                    key={templateGeneralData?.timezone?.name}
                    {...register("timezone")}
                  />
                )}
                <Dropdown
                  label={lang[t].companyList.language}
                  width="100%"
                  items={listLanguage?.rows.map((data: any) => ({
                    id: data?.id,
                    value: data?.name,
                  }))}
                  placeholder="Select"
                  handleChange={(value: string) => setValue("language", value)}
                  onSearch={(search: string) => setSearch(search)}
                  required
                  error={errors?.language?.message}
                  defaultValue={listLanguage?.rows?.find((data) => data?.id == language)?.name}
                  key={language}
                  {...register("language", { required: true })}
                />
              </Col>

              <Col width="50%">
                {isLoadingNumberFormatList ? (
                  <Spin tip="Loading data..." />
                ) : (
                  <Dropdown
                    label={lang[t].companyList.numberFormat}
                    width="100%"
                    items={numberFormatData.rows.map((data) => ({
                      value: data.format,
                      id: data.format,
                    }))}
                    placeholder="Select"
                    handleChange={(value) => setValue("numberFormat", value)}
                    error={errors?.numberFormat?.message}
                    defaultValue={templateGeneralData?.numberFormat?.format}
                    key={templateGeneralData?.numberFormat?.numberFormat}
                    {...register("numberFormat")}
                    noSearch
                  />
                )}
              </Col>
            </Row>
            <Spacer size={20} />
            <Row width="100%" gap="20px" noWrap>
              <Row width="100%" noWrap style={{ alignItems: "center" }}>
                <Text
                  variant="body1"
                  style={{
                    display: 'flex',
                    gap: '.25rem',
                    paddingRight: '.25rem',
                  }}
                >
                  {lang[t].companyList.companyUseAdvanceApproval}

                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title="Advance Approval"
                    color="#F4FBFC"
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </Text>
                <Switch
                  defaultChecked={false}
                  onChange={(value) => setValue("advanceApproval", value)}
                />
              </Row>
              <Row justifyContent="center" width="100%" noWrap style={{ alignItems: "center" }}>
                <Text
                  variant="body1"
                  style={{
                    display: 'flex',
                    gap: '.25rem',
                    paddingRight: '.25rem',
                  }}
                >
                  {lang[t].companyList.companyUseRetailPricing}

                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title="Retail Pricing"
                    color="#F4FBFC"
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </Text>
                <Switch
                  defaultChecked={false}
                  onChange={(value) => setValue("retailPricing", value)}
                />
              </Row>
              <Row width="100%" justifyContent="end" noWrap style={{ alignItems: "center" }}>
                <Text
                  variant="body1"
                  style={{
                    display: 'flex',
                    gap: '.25rem',
                    paddingRight: '.25rem',
                  }}
                >
                  {lang[t].companyList.companyUsePricingStructure}

                  <Tooltip
                    overlayInnerStyle={{ width: "fit-content" }}
                    title="Pricing Structure"
                    color="#F4FBFC"
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </Text>
                <Switch
                  defaultChecked={false}
                  onChange={(value) => setValue("pricingStructure", value)}
                />
              </Row>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Spacer size={20} />

      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">{lang[t].companyList.financeSetup}</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" gap="20px" noWrap>
              <Col width="50%">
                <Dropdown
                  label={lang[t].companyList.chartOfAccount}
                  width="100%"
                  items={[]}
                  placeholder="Select"
                  handleChange={(value: any) => setValue("chart_of_account", value)}
                  {...register("chart_of_account")}
                  noSearch
                />
                <Input
                  width="100%"
                  label={lang[t].companyList.externalCode}
                  height="48px"
                  placeholder="e.g 3221114810"
                  {...register("external_code")}
                />
              </Col>
              <Col width="48%">
                <DatePickerInput
                  fullWidth
                  placeholder="YYYY"
                  onChange={(date: any, dateString: any) => setValue("fiscal_year", Number(dateString))}
                  label={lang[t].companyList.fiscalYear}
                  picker="year"
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
  padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

const Flex = styled.div`
  width: 100%;
  display: flex:
  text-align: center;
  align-items: center;
  font-weight: 700;
  margin-top: 20px;
`;

const Span = styled.span`
  font-weight: 700;
`;

const SpanAlign = styled.span`
  margin: auto;
`;
const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default CreateCompany;
