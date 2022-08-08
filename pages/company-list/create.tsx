import React, { useState } from "react";
import {
  Text,
  Col,
  Row,
  Spacer,
  Dropdown,
  Table,
  Button,
  Accordion,
  Input,
  TextArea,
  Dropdown2,
  Switch,
} from "pink-lava-ui";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import {
  useCoa,
  useCurrenciesMDM,
  useDateFormatLists,
  useMenuDesignLists,
  useNumberFormatLists,
} from "../../hooks/company-list/useCompany";

const fakeCountry = [
  {
    id: 1,
    value: "Indonesia",
  },
  {
    id: 2,
    value: "Malaysia",
  },
  {
    id: 3,
    value: "Vietnam",
  },
  {
    id: 4,
    value: "Brunei",
  },
];

const fakeMenuDesign = [
  {
    id: 1,
    value: "FMCG Manufacture",
  },
  {
    id: 2,
    value: "FMCG Distribution",
  },
  {
    id: 3,
    value: "FMCG Marketing",
  },
];

const CompanyTypeData = [
  {
    id: 1,
    value: "Holding",
  },
  {
    id: 2,
    value: "Corporate",
  },
  {
    id: 3,
    value: "Company",
  },
];

const IndustryData = [
  {
    id: 1,
    value: "Agricultural & Allied Industries",
  },
  {
    id: 2,
    value: "Automobiles",
  },
  {
    id: 3,
    value: "Aviation",
  },
  {
    id: 4,
    value: "Banking & Insurance",
  },
  {
    id: 5,
    value: "Cement",
  },
  {
    id: 6,
    value: "Consumer Durables",
  },
  {
    id: 7,
    value: "E-Commerce",
  },
  {
    id: 8,
    value: "Education & Training",
  },
  {
    id: 9,
    value: "Engineering & Capital Goods",
  },
  {
    id: 10,
    value: "FMCG",
  },
  {
    id: 11,
    value: "Gems & Jewellery",
  },
  {
    id: 12,
    value: "Healthcare",
  },
];

const CorporateData = [
  {
    id: 1,
    value: "Domestic",
  },
  {
    id: 2,
    value: "International",
  },
  {
    id: 3,
    value: "Other",
  },
];

const numberOfEmployeeData = [
  {
    id: 1,
    value: "1-50",
  },
  {
    id: 2,
    value: "51-100",
  },
  {
    id: 3,
    value: "101-500",
  },
  {
    id: 4,
    value: "501-1000",
  },
  {
    id: 5,
    value: "1001-5000",
  },
  {
    id: 6,
    value: "5001-10000",
  },
  {
    id: 7,
    value: "10001++",
  },
];

const fakeCurrency = [
  {
    id: 1,
    value: "IDR - Indonesia Rupiah",
  },
  {
    id: 2,
    value: "USD - United States Dollar",
  },
  {
    id: 3,
    value: "SGD - Singapore Dollar",
  },
];

const fakeTimezone = [
  {
    id: 1,
    value: "(UTC +07:00) Bangkok, Hanoi, Jakarta",
  },
  {
    id: 2,
    value: "(UTC +08:00) Beijing, Chongqing, Hongkong",
  },
  {
    id: 3,
    value: "(UTC +08:00) Kuala Lumpure, Singapore",
  },
];

const schema = yup
  .object({
    name: yup.string().required("Full Name is Required"),
    code: yup.string().required("Company code has been used, try another"),
    email: yup.string().email("Email"),
    address: yup.string().required("Address is Required"),
  })
  .required();

const defaultValue = {
  activeStatus: "Y",
};

const CreateCompany: any = () => {
  const router = useRouter();

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [permissionsIds, setPermissions] = useState();
  const [search, setSearch] = useState("");
  const [dateFormatList, setDateFormatList] = useState([]);
  const [numberFormatList, setNumberFormatList] = useState([]);
  const [dataFormat, setDateFormat] = useState();
  const [coaList, setCoaList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValue,
  });

  const activeStatus = [
    { id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
    { id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
  ];

  const { data: dateFormatData, isLoading: isLoadingDateFormatList } = useDateFormatLists({
    options: {
      onSuccess: (data) => {
        let newDateFormatList: any = [];
        data.rows.forEach((item) => {
          const obj = {
            id: item.id,
            value: item.format,
          };
          newDateFormatList.push(obj);
        });
        setDateFormatList(newDateFormatList);
      },
    },
  });

  const { data: numberFormatData, isLoading: isLoadingNumberFormatList } = useNumberFormatLists({
    options: {
      onSuccess: (data) => {
        let newNumberFormatList: any = [];
        data.rows.forEach((item) => {
          const obj = {
            id: item.id,
            value: item.format,
          };
          newNumberFormatList.push(obj);
        });
        setNumberFormatList(newNumberFormatList);
      },
    },
  });

  const { data: coaData, isLoading: isLoadingCoaList } = useCoa({
    options: {
      onSuccess: (data) => {
        // console.log(data);
        let newCoaList: any = [];
        data.rows.forEach((item) => {
          const obj = {
            id: item.id,
            value: item.name,
          };
          newCoaList.push(obj);
        });
        setCoaList(newCoaList);
      },
    },
  });

  const { data: menuDesignData, isLoading: isLoadingMenuDesign } = useMenuDesignLists({
    options: {
      onSuccess: (data) => {
        console.log(data);
        let newMenuDesignList: any = [];
        // data.rows.forEach((item) => {
        //   const obj = {
        //     id: item.id,
        //     value: item.format,
        //   };
        //   newCoaList.push(obj);
        // });
        // setCoaList(newCoaList);
      },
    },
  });

  const { data: currencyData, isLoading: isLoadingCurrencyList } = useCurrenciesMDM({
    options: {
      onSuccess: (data) => {
        console.log(data);
        let newCurrencyList: any = [];
        data.rows.forEach((item) => {
          const obj = {
            id: item.id,
            value: `${item.currency} - ${item.currencyName}`,
          };
          newCurrencyList.push(obj);
        });
        setCurrencyList(newCurrencyList);
      },
    },
  });

  const onSubmit = (data) => {
    // const payload = {
    // 	...data,
    // 	permissions: permissionsIds,
    // };
    // createRole(payload);
  };

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/company-list")} />
          <Text variant={"h4"}>Add New Company</Text>
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
              noSearch
              defaultValue="Y"
            />
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant={"tertiary"}
                  onClick={() => Router.push("/company-list")}
                >
                  Cancel
                </Button>
                <Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        {/* <Spacer size={20} />
        <Alert><Text variant="subtitle2" color="white">“General” Associated Menu must be filled.</Text></Alert> */}
        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">Company Profile</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Input
                  width="100%"
                  label="Name"
                  height="48px"
                  placeholder={"e.g PT. Kaldu Sari Nabati Indonesia"}
                  {...register("name", { required: true })}
                />
                <Input
                  width="100%"
                  label="Company Code"
                  height="48px"
                  placeholder={"e.g KSNI"}
                  {...register("code", { required: true })}
                />
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Input
                    width="100%"
                    label="Email"
                    height="48px"
                    placeholder={"e.g karina@nabatisnack.co.id"}
                    {...register("email", { required: true })}
                  />
                </Col>
                <Col width="50%">
                  <TextArea
                    //   value={desc}
                    //   onChange={(e) => setDesc(e.target.value)}
                    width="100%"
                    rows={1}
                    label={<Text placeholder="e.g JL. Soekarno Hatta">Address</Text>}
                    {...register("address", { required: true })}
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown2
                    label="Country"
                    width={"100%"}
                    // items={accounts}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                  />
                </Col>
                <Col width="50%">
                  <Dropdown
                    label="Industry"
                    width={"100%"}
                    items={IndustryData}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown2
                    label="Number of Employee"
                    width={"100%"}
                    items={numberOfEmployeeData}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                  />
                </Col>
                <Col width="50%">
                  <Dropdown2
                    label="Sector"
                    width={"100%"}
                    // items={accounts}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown2
                    label="Menu Design"
                    width={"100%"}
                    // items={accounts}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                  />
                </Col>
                <Col width="50%">
                  <Input
                    width="100%"
                    label="Tax ID (optional)"
                    height="48px"
                    placeholder={"e.g 10"}
                    {...register("email", { required: true })}
                  />
                  <Row>
                    <Text variant="body1">PKP ? </Text>
                    <Switch />
                  </Row>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Spacer size={20} />

        <Accordion>
          <Accordion.Item key={1}>
            <Accordion.Header variant="blue">General Setup</Accordion.Header>
            <Accordion.Body>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown
                    label="Company Type"
                    width={"100%"}
                    items={CompanyTypeData}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                    noSearch
                  />
                </Col>
                <Col width="50%">
                  <Dropdown
                    label="Corporate"
                    width={"100%"}
                    items={CorporateData}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                    noSearch
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown
                    label="Currency"
                    width={"100%"}
                    items={currencyList}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchCurrency(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                    isLoading={isLoadingCurrencyList}
                    noSearch
                  />
                </Col>
                <Col width="50%">
                  <Dropdown2
                    label="CoA Template"
                    width={"100%"}
                    items={coaList}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                    isLoading={isLoadingCoaList}
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown
                    label="Format Date"
                    width={"100%"}
                    items={dateFormatList}
                    placeholder={"Select"}
                    handleChange={(value) => setDateFormat(value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                    isLoading={isLoadingDateFormatList}
                    noSearch
                  />
                </Col>
                <Col width="50%">
                  <Dropdown
                    label="Number Format"
                    width={"100%"}
                    items={numberFormatList}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                    isLoading={isLoadingNumberFormatList}
                    noSearch
                  />
                </Col>
              </Row>
              <Row width="100%" gap="20px" noWrap>
                <Col width="50%">
                  <Dropdown2
                    label="Timezone"
                    width={"100%"}
                    // items={accounts}
                    placeholder={"Select"}
                    // handleChange={(value) => setValue("accountGroupId", value)}
                    // onSearch={(search) => setSearchAccountGroup(search)}
                    // required
                    // error={errors?.accountGroupId?.message}
                    // defaultValue={account?.accountGroup?.groupName}
                  />
                </Col>

                <Col width="50%">
                  <Spacer size={20} />
                  <Row width="100%" gap="20px" noWrap>
                    <Text variant="body1">Company Use Advance Pricing</Text>
                    <Switch />
                  </Row>
                  <Spacer size={20} />
                  <Row width="100%" gap="20px" noWrap>
                    <Text variant="body1">Company Use Advance Costing</Text>
                    <Switch />
                  </Row>
                  <Spacer size={20} />
                  <Row width="100%" gap="20px" noWrap>
                    <Text variant="body1">Using Approval</Text>
                    <Switch />
                  </Row>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

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

export default CreateCompany;
