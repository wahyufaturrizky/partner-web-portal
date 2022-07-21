import React, { useState } from "react";
import { Text, Col, Spin, Row, Spacer, Dropdown, Button, Accordion, Input } from "pink-lava-ui";
import styled from "styled-components";
import { useRouter } from "next/router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCurrencyFormatLists } from "../../../hooks/currency-format/useCurrencyFormat";
import { useNumberFormatLists } from "../../../hooks/number-format/useNumberFormat";
import { useDateFormatLists } from "../../../hooks/date-format/useDateFormat";
import { useTimezone } from "../../../hooks/timezone/useTimezone";
import { useLanguages } from "../../../hooks/languages/useLanguages";
import { useTemplateRoleLists } from "../../../hooks/template-role/useTemplateRole";
import { useCountries } from "../../../hooks/country/useCountry";
import { useSectors } from "../../../hooks/sector/useSector";
import { useIndustries } from "../../../hooks/industry/useIndustry";
import { useTemplateCoaLists } from "../../../hooks/template-coa/useTemplateCoa";
import {
	useTemplateGeneral,
	useUpdateTemplateGeneral,
} from "../../../hooks/template-general/useTemplateGeneral";
import ArrowLeft from "../../assets/arrow-left.svg";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
	})
	.required();

const ConfigDetail: any = () => {
	const router = useRouter();
	const { config_id } = router.query;
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const { mutate: createConfig } = useUpdateTemplateGeneral({
		template_general_id: config_id,
		options: {
			onSuccess: (data) => {
				router.push("/template-general");
			},
		},
	});

	const [search, setSearch] = useState({
		currencySearch: "",
		industrySearch: "",
		sectorSearch: "",
		countrySearch: "",
		templateCoaSearch: "",
		dateSearch: "",
		templateSearch: "",
		numberSearch: "",
		languageSearch: "",
		timezoneSearch: "",
	});

	const { data: templateGeneral, isLoading: isLoadingTemplateGeneral } = useTemplateGeneral({
		template_general_id: config_id,
		options: {
			onSuccess: (data) => {
				setValue("name", data.name);
				setValue("status", data.activeStatus);
				setValue("countryId", data.countryId);
				setValue("sectorId", data.sectorId);
				setValue("industryId", data.industryId);
				setValue("currencyFormatId", data.currencyFormatId);
				setValue("languageId", data.languageId);
				setValue("dateFormatId", data.dateFormatId);
				setValue("timezoneId", data.timezoneId);
				setValue("coaId", data.coaId);
				setValue("numberFormatId", data.numberFormatId);
				setValue("templateRoleId", data.templateRoleId);
			},
		},
	});

	const onSubmit = (data) => {
		createConfig(data);
	};

	const { data: currencies, isSuccess: isLoadingCurrencies } = useCurrencyFormatLists({
		options: {},
		query: {
			search: search.currencySearch,
			limit: 10000,
		},
	});
	const currenciesFormat = currencies?.rows?.map((currency: any) => ({
		id: currency.id,
		value: `${currency.format} - ${currency.currencyFormat}`,
	}));

	const { data: numbers, isSuccess: isLoadingNumbers } = useNumberFormatLists({
		options: {
			enabled: isLoadingCurrencies,
		},
		query: {
			search: search.numberSearch,
			limit: 10000,
		},
	});
	const numbersFormat = numbers?.rows?.map((number: any) => ({
		id: number.id,
		value: number.numberFormat,
	}));

	const { data: dates, isSuccess: isLoadingDates } = useDateFormatLists({
		options: {
			enabled: isLoadingNumbers,
		},
		query: {
			search: search.dateSearch,
			limit: 10000,
		},
	});
	const datesFormat = dates?.rows?.map((date: any) => ({ id: date.id, value: date.format }));
	const { data: timezoneData, isSuccess: isLoadingTimezone } = useTimezone({
		query: {
			search: search.timezoneSearch,
			limit: 10000,
		},
		options: {},
	});
	const timezones = timezoneData?.rows?.map((row) => ({ id: row.id, value: row.utc })) ?? [];
	const { data: languageData, isSuccess: isLoadingLanguage } = useLanguages({
		query: {
			search: search.languageSearch,
			limit: 10000,
		},
		options: {},
	});
	const languages = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

	const { data: templateRole, isSuccess: isLoadingTemplateRole } = useTemplateRoleLists({
		options: {
			enabled: isLoadingDates,
		},
		query: {
			search: search.templateSearch,
			limit: 10000,
		},
	});
	const templateRoleLists = templateRole?.rows?.map((template: any) => ({
		id: template.id,
		value: template.name,
	}));

	const { data: countries, isSuccess: isLoadingCountries } = useCountries({
		options: {
			enabled: isLoadingTemplateRole,
		},
		query: {
			search: search.countrySearch,
			limit: 10000,
		},
	});
	const countryList = countries?.rows?.map((country: any) => ({
		id: country.id,
		value: country.name,
	}));

	const { data: sectors, isSuccess: isLoadingSectors } = useSectors({
		options: {
			enabled: isLoadingCountries,
		},
		query: {
			search: search.sectorSearch,
			limit: 10000,
		},
	});

	const sectorsList = sectors?.rows?.map((sector: any) => ({ id: sector.id, value: sector.name }));

	const { data: industries, isSuccess: isLoadingIndustries } = useIndustries({
		options: {
			enabled: isLoadingSectors,
		},
		query: {
			search: search.industrySearch,
			limit: 10000,
		},
	});

	const industryList = industries?.rows?.map((sector: any) => ({
		id: sector.id,
		value: sector.name,
	}));

	const { data: templateCoa, isLoading: isLoadingCoa } = useTemplateCoaLists({
		options: {
			enabled: isLoadingIndustries,
		},
		query: {
			search: search.templateCoaSearch,
			limit: 10000,
		},
	});

	const templateCoaLists = templateCoa?.rows?.map((sector: any) => ({
		id: sector.id,
		value: sector.name,
	}));

	const publishStatus = [
		{ id: "PUBLISH", value: '<div key="published" style="color:green;">Published</div>' },
		{ id: "DRAFT", value: '<div key="draft" style="color:red;">Draft</div>' },
	];

	return (
		<>
			{isLoadingTemplateGeneral || isLoadingCoa ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px" alignItems="center">
						<ArrowLeft
							style={{ cursor: "pointer" }}
							onClick={() => router.push("/template-config/general")}
						/>
						<Text variant={"h4"}>{templateGeneral?.name}</Text>
					</Row>
					<Spacer size={12} />
					<Card padding="20px">
						<Row justifyContent="space-between" alignItems="center" nowrap>
							<Dropdown
								label=""
								isHtml
								width={"185px"}
								items={publishStatus}
								placeholder={"Status"}
								handleChange={(text) => setValue("status", text)}
								noSearch
								defaultValue={templateGeneral?.status}
							/>
							<Row>
								<Row gap="16px">
									<Button
										size="big"
										variant={"tertiary"}
										onClick={() => router.push("/template-config/general")}
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

					<Spacer size={20} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">General</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Template Name"
										height="48px"
										placeholder={"e.g Tempalte for FMCG-Distirbution"}
										{...register("name", { required: true })}
									/>
									<Dropdown
										label="Country"
										width={"100%"}
										items={countryList}
										placeholder={"Select"}
										handleChange={(value) => setValue("countryId", value)}
										defaultValue={templateGeneral?.countryId}
										onSearch={(search) => setSearch({ ...search, countrySearch: search })}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Sector"
										width={"100%"}
										items={sectorsList}
										placeholder={"Select"}
										handleChange={(value) => setValue("sectorId", value)}
										defaultValue={templateGeneral?.sectorId}
										onSearch={(search) => setSearch({ ...search, sectorSearch: search })}
									/>
									<Dropdown
										label="Industry"
										width={"100%"}
										items={industryList}
										placeholder={"Select"}
										handleChange={(value) => setValue("industryId", value)}
										defaultValue={templateGeneral?.industryId}
										onSearch={(search) => setSearch({ ...search, industrySearch: search })}
									/>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>

					<Spacer size={32} />

					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">Default Value for new Companies</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Currrency Format"
										width={"100%"}
										items={currenciesFormat}
										placeholder={"Select"}
										handleChange={(value) => setValue("currencyFormatId", value)}
										defaultValue={templateGeneral?.currencyFormatId}
										onSearch={(search) => setSearch({ ...search, currencySearch: search })}
									/>
									<Dropdown
										label="Language"
										width={"100%"}
										items={languages}
										placeholder={"Select"}
										handleChange={(value) => setValue("languageId", value)}
										defaultValue={templateGeneral?.languageId}
										onSearch={(search) => setSearch({ ...search, languageSearch: search })}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Format Date"
										width={"100%"}
										items={datesFormat}
										placeholder={"Select"}
										handleChange={(value) => setValue("dateFormatId", value)}
										defaultValue={templateGeneral?.dateFormatId}
										onSearch={(search) => setSearch({ ...search, dateSearch: search })}
									/>
									<Dropdown
										label="Timezone"
										width={"100%"}
										items={timezones}
										placeholder={"Select"}
										handleChange={(value) => setValue("timezoneId", value)}
										defaultValue={templateGeneral?.timezoneId}
										onSearch={(search) => setSearch({ ...search, timezoneSearch: search })}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="CoA Template"
										width={"100%"}
										items={templateCoaLists}
										placeholder={"Select"}
										handleChange={(value) => setValue("coaId", value)}
										defaultValue={templateGeneral?.coaId}
										onSearch={(search) => setSearch({ ...search, templateCoaSearch: search })}
									/>
									<Dropdown
										label="Number Format"
										width={"100%"}
										items={numbersFormat}
										placeholder={"Select"}
										handleChange={(value) => setValue("numberFormatId", value)}
										defaultValue={templateGeneral?.numberFormatId}
										onSearch={(search) => setSearch({ ...search, numberSearch: search })}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Role Template"
										width={"100%"}
										items={templateRoleLists}
										placeholder={"Select"}
										handleChange={(value) => setValue("templateRoleId", value)}
										defaultValue={templateGeneral?.templateRoleId}
										onSearch={(search) => setSearch({ ...search, templateSearch: search })}
									/>
									<Dropdown
										label="Menu Template"
										width={"100%"}
										items={[]}
										placeholder={"Select"}
										handleChange={(value) => setValue("menuId", value)}
										defaultValue={templateGeneral?.menuId}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Approval Template"
										width={"100%"}
										items={[]}
										placeholder={"Select"}
										handleChange={(value) => setValue("approvalId", value)}
										defaultValue={templateGeneral?.approvalId}
									/>
									<div style={{ visibility: "hidden", width: "100%" }}>
										<Dropdown
											label="Currency Format"
											width={"100%"}
											items={currenciesFormat}
											placeholder={"Select"}
											handleChange={(value) => setValue("currencyFormatId", value)}
											defaultValue={templateGeneral?.currencyFormatId}
											onSearch={(search) => setSearch({ ...search, currencySearch: search })}
										/>
									</div>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
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

export default ConfigDetail;
