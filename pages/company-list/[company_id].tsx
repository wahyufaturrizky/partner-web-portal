import React, { useState } from "react";
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
  FormSelect
} from "pink-lava-ui";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm} from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import {
  useCoa,
  useCompany,
  useCountries,
  useCreateCompany,
  useCurrenciesMDM,
  useDateFormatLists,
  useMenuDesignLists,
  useNumberFormatLists,
  useTimezones,
  useUpdateCompany,
  useUploadLogoCompany,
} from "../../hooks/company-list/useCompany";
import { useTimezone } from "../../hooks/timezone/useTimezone";
import { useLanguages } from "hooks/languages/useLanguages";
import moment from "moment";
import { lang } from "lang";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import { useSegmentInfiniteLists } from "hooks/segment/useSegment";
import useDebounce from "lib/useDebounce";
import { useInfiniteIndustry } from "hooks/industry/useIndustries";
import { colors } from "utils/color";

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
    email: yup.string().email("Email not validated"),
    address: yup.string().default(""),
    taxId: yup.string().default(""),
    language: yup.string().required("Language is Required"),
    source_exchange: yup.string().default(""),
    country: yup.string().required("Country is Required"),
    industry: yup.string().default(""),
    numberOfEmployee: yup.string().default(""),
    sector: yup.string().default(""),
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
};

const DetailCompany: any = () => {
  const router = useRouter();
  const t = localStorage.getItem("lan") || "en-US";

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

  const [searchFromTemplate, setSearchFromTemplate] = useState("");

  const [searchTimezone, setSearchTimezone] = useState();

  // const [searchCountry, setSearchCountry] = useState();

  // const [industryList, setIndustryList] = useState(IndustryDataFake);
  const [sectorList, setSectorList] = useState([]);

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
  const [searchCountry, setSearchCountry] = useState("");
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchSegment, setSearchSegment] = useState("");
  const [industryId, setIndustryId] = useState("");

  const debounceFetch = useDebounce(
      searchCountry ||
      searchSegment ||
      searchIndustry,
    1000
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
  });

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
        setFromTemplate(data.fromTemplate);
        setValue("name", data.name);
        setValue("code", data.code);
        setValue("email", data.email);
        setValue("address", data.address);
        setValue("taxId", data.taxId);
        setValue("language", data.language);
        setValue("source_exchange", data.sourceExchange);
        setValue("country", data.country);
        setValue("industry", data.industry);
        setValue("numberOfEmployee", data.employees);
        setValue("sector", data.sector);
        setValue("fromTemplate", data.fromTemplate);
        setValue("companyType", data.companyType);
        setValue("corporate", data.corporate);
        setValue("currency", data.currency);
        setValue("coaTemplate", data.coa);
        setValue("formatDate", data.formatDate);
        setValue("numberFormat", data.formatNumber);
        setValue("timezone", data.timezone);
        setValue("isPkp", data.pkp);
        setValue("advanceApproval", data.advanceApproval);
        setValue("retailPricing", data.retailPricing);
        setValue("pricingStructure", data.pricingStructure);
        setValue("external_code", data.externalCode);
        setValue("fiscal_year", data.fiscalYear);
      },
    },
  });

  const activeStatus = [
    { id: "Active", value: `<div key="1" style="color:green;">${lang[t].companyList.tertier.active}</div>` },
    { id: "Unactive", value: `<div key="2" style="color:red;">${lang[t].companyList.tertier.nonActive}</div>` },
  ];

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
      company_id: "KSNI"
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
    isFetching: isFetchingSegment,
    isFetchingNextPage: isFetchingMoreSegment,
    hasNextPage: hasNextPageSegment,
    fetchNextPage: fetchNextPageSegment,
  } = useSegmentInfiniteLists({
    query: {
      search: debounceFetch,
      limit: 10,
      industry_id : industryId ? industryId : companyData?.industryId
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsSegmentList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setSegmentList((industryId || companyData?.industryId) ? flattenArray : []);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (segmentList.length < totalRowsSegmentList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
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
		},
		options: {
			onSuccess: (data: any) => {
				setTotalRowsIndustryList(data.pages[0].totalRow);
				const mappedData = data?.pages?.map((group: any) => {
					return group.rows?.map((element: any) => {
						return {
							label: element.name,
							value: element.id,
						};
					});
				});
				const flattenArray = [].concat(...mappedData);
				setIndustryList(flattenArray);
			},
			getNextPageParam: (_lastPage: any, pages: any) => {
				if (industryList.length < totalRowsIndustryList) {
					return pages.length + 1;
				} else {
					return undefined;
				}
			},
		},
	});
  // const { data: menuDesignData, isLoading: isLoadingMenuDesignList } = useMenuDesignLists({
  //   options: {
  //     onSuccess: (data) => {},
  //   },
  //   query: {
  //     search: searchMenuDesign,
  //   },
  // });

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

  const { data: listLanguage } = useLanguages({
    options: { onSuccess: () => {} },
    query: {},
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

  const { mutate: updateCompany, isLoading: isLoadingUpdateCompany } = useUpdateCompany({
    id: company_id,
    options: {
      onSuccess: () => {
        alert("Update Success!");
        router.push("/company-list");
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
      address: address,
      country: data.country || "",
      industry: data.industry,
      employees: data.numberOfEmployee,
      sector: data.sector,
      from_template: fromTemplate,
      tax_id: data.taxId,
      pkp: data.isPkp,
      logo: foto,
      company_type: data.companyType,
      corporate: data.corporate,
      currency: data.currency,
      source_exchange: data.source_exchange || "",
      language: data.language,
      coa: data.coaTemplate,
      format_date: data.formatDate,
      format_number: data.numberFormat,
      timezone: data.timezone || "",
      advance_approval: data.advanceApproval,
      retail_pricing: data.retailPricing,
      pricing_structure: data.pricingStructure,
      chart_of_account: data.chart_of_account,
      fiscal_year: `${data.fiscal_year}`,
      external_code: data.external_code,
      status: data.activeStatus,
    };
    // console.log(payload);
    updateCompany(payload);
  };

  if (isLoadingCompanyData)
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/company-list")} />
          <Text variant={"h4"}>{companyData.name}</Text>
        </Row>
        <Spacer size={12} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center" nowrap>
            <Dropdown
              label=""
              isHtml
              width={"185px"}
              items={activeStatus}
              placeholder={"Status"}
              handleChange={(text) => setValue("activeStatus", text)}
              defaultValue={companyData.status}
              noSearch
              defaultValue="Active"
            />
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

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">{lang[t].companyList.companyProfile}</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <FileUploaderAllFiles
                  label={lang[t].companyList.companyLogo}
                  // onSubmit={(file) => setFoto(file)}
                  onSubmit={(file) => handleUploadLogo(file)}
                  //   defaultFile="/placeholder-employee-photo.svg"
                  defaultFile={foto ? foto : `/placeholder-employee-photo.svg`}
                  withCrop={true}
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
                      value={"companyInternal"}
                      checked={fromTemplate == "none"}
                      onChange={(e: any) => setFromTemplate("none")}
                    >
                      <SpanAlign>{lang[t].companyList.none}</SpanAlign>
                    </Radio>
                    <Radio
                      value={"companyInternal"}
                      checked={fromTemplate == "eDot"}
                      onChange={(e: any) => setFromTemplate("eDot")}
                    >
                      eDOT
                    </Radio>
                    <Radio
                      value={"companyInternal"}
                      checked={fromTemplate == "Other Company"}
                      onChange={(e: any) => setFromTemplate("Other Company")}
                    >
                      {lang[t].companyList.otherCompany}
                    </Radio>
                  </Flex>
                </Col>
                <Col width="50%">
                  {/* For company */}
                  {/* <Input
                    width="100%"
                    label={lang[t].companyList.name}
                    height="48px"
                    placeholder={"e.g PT. Kaldu Sari Nabati Indonesia"}
                    error={errors?.name?.message}
                    required
                    {...register("name", { required: true })}
                  /> */}
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  width="100%"
                  label={lang[t].companyList.name}
                  height="48px"
                  placeholder={"e.g PT. Kaldu Sari Nabati Indonesia"}
                  defaultValue={companyData.name}
                  error={errors?.name?.message}
                  required
                  {...register("name", { required: true })}
                />
                <Input
                  width="100%"
                  label={lang[t].companyList.companyCode}
                  height="48px"
                  placeholder={"e.g KSNI"}
                  defaultValue={companyData.code}
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
                    placeholder={"e.g karina@nabatisnack.co.id"}
                    defaultValue={companyData.email}
                    error={errors?.email?.message}
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
                    placeholder={"e.g JL. Soekarno Hatta"}
                    defaultValue={companyData.phone_number}
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
                    defaultValue={companyData.country}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Country <span style={{ color: colors.red.regular }}>*</span>
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          error={error?.message}
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingCountry}
                          isLoadingMore={isFetchingMoreCountry}
                          defaultValue={companyData.country}
                          fetchMore={() => {
                            if (hasNextPageCountry) {
                              fetchNextPageCountry();
                            }
                          }}
                          items={isFetchingCountry && !isFetchingMoreCountry ? [] : countryList}
                          onChange={(value: any) => {
                            onChange(value);
                            setValue("country",value);
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
                    placeholder={"e.g JL. Soekarno Hatta"}
                    defaultValue={companyData.address}
                    {...register("address")}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Controller
                    control={control}
                    name="industry_id"
                    defaultValue={companyData.industryId}
                    render={({ field: { onChange }, fieldState: { error } }) => (
                      <>
                        <Label>
                          Industry
                        </Label>
                        <Spacer size={3} />
                        <FormSelect
                          height="48px"
                          style={{ width: "100%" }}
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingIndustry}
                          isLoadingMore={isFetchingMoreIndustry}
                          defaultValue={companyData.industryId}
                          fetchMore={() => {
                            if (hasNextIndustry) {
                              fetchNextIndustry();
                            }
                          }}
                          items={isFetchingIndustry && !isFetchingMoreIndustry ? [] : industryList}
                          onChange={(value: any) => {
                            onChange(value);
                            setValue("industry_id",value);
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
                    name="segment_id"
                    defaultValue={companyData.sectorId}
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
                          size={"large"}
                          placeholder={"Select"}
                          borderColor={"#AAAAAA"}
                          arrowColor={"#000"}
                          withSearch
                          isLoading={isFetchingSegment}
                          isLoadingMore={isFetchingMoreSegment}
                          defaultValue={companyData.sectorId}
                          fetchMore={() => {
                            if (hasNextPageSegment) {
                              fetchNextPageSegment();
                            }
                          }}
                          items={isFetchingSegment && !isFetchingMoreSegment ? [] : segmentList}
                          onChange={(value: any) => {
                            onChange(value);
                            setValue("segment_id",value);
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
                    width={"100%"}
                    items={NumberOfEmployeeDataFake}
                    placeholder={"Select"}
                    handleChange={(value: any) => setValue("numberOfEmployee", value)}
                    required
                    defaultValue={companyData.employees}
                    {...register("numberOfEmployee", { required: true })}
                    noSearch
                  />
                </Col>
                <Col width="50%">
                  <Input
                    width="100%"
                    label={lang[t].companyList.taxID}
                    height="48px"
                    placeholder={"e.g 10"}
                    defaultValue={companyData.taxId}
                    {...register("taxId")}
                  />
                  <Row>
                    <Text variant="body1">PKP ? </Text>
                    <Switch
                      defaultChecked={companyData.pkp}
                      onChange={(value) => setValue("isPkp", value)}
                    />
                  </Row>
                </Col>
              </Row>
              {/* <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown
                    label="Menu Design"
                    width={"100%"}
                    items={[]}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("fromTemplate", value)}
                    // onSearch={(search) => setSearchMenuDesign(search)}
                    {...register("fromTemplate")}
                  />
                </Col>
              </Row> */}
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
                    width={"100%"}
                    items={CompanyTypeDataFake}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("companyType", value)}
                    noSearch
                    defaultValue={companyData.companyType}
                    error={errors?.companyType?.message}
                    {...register("companyType")}
                  />
                </Col>
                <Col width="50%">
                  <Dropdown
                    label={lang[t].companyList.corporate}
                    width={"100%"}
                    items={CorporateDataFake}
                    placeholder={"Select"}
                    handleChange={(value) => setValue("corporate", value)}
                    defaultValue={companyData.corporate}
                    {...register("corporate")}
                    noSearch
                  />
                </Col>
              </Row>
              <Spacer size={10} />
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  {isLoadingCurrencyList ? (
                    <Spin tip="Loading data..." />
                  ) : (
                    <Dropdown
                      label={lang[t].companyList.currency}
                      width={"100%"}
                      items={currencyData.rows.map((data) => ({
                        value: `${data.currency} - ${data.currencyName}`,
                        id: `${data.currency} - ${data.currencyName}`,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("currency", value)}
                      onSearch={(search) => setSearchCurrency(search)}
                      required
                      defaultValue={companyData.currency}
                      error={errors?.currency?.message}
                      {...register("currency", { required: true })}
                    />
                  )}
                </Col>
                <Col width="50%">
                  <Dropdown
                    label={lang[t].companyList.sourceExchangeRate}
                    width="100%"
                    items={[]}
                    placeholder={"Select"}
                    handleChange={(value: string) => setValue("source_exchange", value)}
                    onSearch={(value: string) => setSearch({ ...search, sourceExchange: value })}
                    defaultValue={companyData.sourceExchange}
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
                      width={"100%"}
                      items={dateFormatData.rows.map((data) => ({
                        value: data.format,
                        id: data.format,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("formatDate", value)}
                      defaultValue={companyData.formatDate}
                      error={errors?.formatDate?.message}
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
                      width={"100%"}
                      items={coaData.rows.map((data) => ({
                        value: data.name,
                        id: data.id,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("coaTemplate", value)}
                      onSearch={(search) => setSearchCoa(search)}
                      defaultValue={companyData.coa}
                      error={errors?.coaTemplate?.message}
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
                      width={"100%"}
                      items={timezoneData?.rows.map((data) => ({
                        value: `${data.utc} ${data.name}`,
                        id: `${data.utc} ${data.name}`,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("timezone", value)}
                      onSearch={(search) => setSearchTimezone(search)}
                      defaultValue={companyData.timezone}
                      error={errors?.timezone?.message}
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
                    placeholder={"Select"}
                    handleChange={(value: string) => setValue("language", value)}
                    onSearch={(search: string) => setSearch(search)}
                    required
                    defaultValue={companyData.language}
                    error={errors?.language?.message}
                    {...register("language", { required: true })}
                  />
                </Col>

                <Col width="50%">
                  {isLoadingNumberFormatList ? (
                    <Spin tip="Loading data..." />
                  ) : (
                    <Dropdown
                      label={lang[t].companyList.numberFormat}
                      width={"100%"}
                      items={numberFormatData.rows.map((data) => ({
                        value: data.format,
                        id: data.format,
                      }))}
                      placeholder={"Select"}
                      handleChange={(value) => setValue("numberFormat", value)}
                      defaultValue={companyData.formatNumber}
                      error={errors?.numberFormat?.message}
                      {...register("numberFormat")}
                      noSearch
                    />
                  )}
                </Col>
              </Row>
              <Spacer size={20} />
              <Row width="100%" gap="20px" noWrap>
                <Row width="100%" noWrap style={{ alignItems: "center" }}>
                  <Text variant="body1" style={{
                    display: 'flex',
                    gap: '.25rem',
                    paddingRight: '.25rem'
                  }}>
                    {lang[t].companyList.companyUseAdvanceApproval}{" "}
                    <Tooltip
                      overlayInnerStyle={{ width: "fit-content" }}
                      title={`Advance Approval`}
                      color={"#F4FBFC"}
                    >
                      <ExclamationCircleOutlined />
                    </Tooltip>
                  </Text>
                  <Switch
                    defaultChecked={companyData.advanceApproval}
                    onChange={(value) => setValue("advanceApproval", value)}
                  />
                </Row>
                <Row justifyContent="center" width="100%" noWrap style={{ alignItems: "center" }}>
                  <Text variant="body1" style={{
                    display: 'flex',
                    gap: '.25rem',
                    paddingRight: '.25rem'
                  }}>
                    {lang[t].companyList.companyUseRetailPricing}{" "}
                    <Tooltip
                      overlayInnerStyle={{ width: "fit-content" }}
                      title={`Retail Pricing`}
                      color={"#F4FBFC"}
                    >
                      <ExclamationCircleOutlined />
                    </Tooltip>
                  </Text>
                  <Switch
                    defaultChecked={companyData.retailPricing}
                    onChange={(value) => setValue("retailPricing", value)}
                  />
                </Row>
                <Row width="100%" justifyContent="end" noWrap style={{ alignItems: "center" }}>
                  <Text variant="body1" style={{
                    display: 'flex',
                    gap: '.25rem',
                    paddingRight: '.25rem'
                  }}>
                    {lang[t].companyList.companyUsePricingStructure}{" "}
                    <Tooltip
                      overlayInnerStyle={{ width: "fit-content" }}
                      title={`Pricing Structure`}
                      color={"#F4FBFC"}
                    >
                      <ExclamationCircleOutlined />
                    </Tooltip>
                  </Text>
                  <Switch
                    defaultChecked={companyData.pricingStructure}
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
                    placeholder={"Select"}
                    handleChange={(value: any) => setValue("chart_of_account", value)}
                    defaultValue={companyData.chartOfAccount}
                    {...register("chart_of_account")}
                    noSearch
                  />
                  <Input
                    width="100%"
                    label={lang[t].companyList.externalCode}
                    height="48px"
                    placeholder="e.g 3221114810"
                    defaultValue={companyData.externalCode}
                    {...register("external_code")}
                  />
                </Col>
                <Col width="48%">
                  <Controller
                    control={control}
                    name={`fiscal_year`}
                    render={({ field: { onChange } }) => (
                      <DatePickerInput
                        fullWidth
                        picker="year"
                        placeholder="YYYY"
                        onChange={(date: any, dateString: any) =>
                          setValue("fiscal_year", Number(dateString))
                        }
                        label={lang[t].companyList.fiscalYear}
                        defaultValue={moment(companyData.fiscalYear, 'YYYY')}
                        format={"YYYY"}
                      />
                    )}
                  />
                  {/* <DatePickerInput
                    fullWidth
                    placeholder="YYYY"
                    onChange={(date: any, dateString: any) =>
                      setValue("fiscal_year", Number(dateString))
                    }
                    label="Fiscal Year"
                    picker="year"
                    defaultValue={moment(toString(companyData.fiscalYear))}
                    format={"YYYY"}
                  /> */}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </>
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

export default DetailCompany;
