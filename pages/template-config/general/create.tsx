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
import { useCreateTemplateGeneral } from "../../../hooks/template-general/useTemplateGeneral";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
	})
	.required();

const CreateConfig: any = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const { mutate: createConfig } = useCreateTemplateGeneral({
		options: {
			onSuccess: () => {
				router.push("/template-general");
			},
		},
	});

	const onSubmit = (data) => {
		createConfig(data);
	};

	const { data: currencies, isSuccess: isLoadingCurrencies } = useCurrencyFormatLists({
		options: {},
		query: {
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
			limit: 10000,
		},
	});
	const datesFormat = dates?.rows?.map((date: any) => ({ id: date.id, value: date.format }));
	const { data: timezoneData, isSuccess: isLoadingTimezone } = useTimezone();
	const timezones = timezoneData?.rows?.map((row) => ({ id: row.id, value: row.utc })) ?? [];
	const { data: languageData, isSuccess: isLoadingLanguage } = useLanguages();
	const languages = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

	const { data: templateRole, isSuccess: isLoadingTemplateRole } = useTemplateRoleLists({
		options: {
			enabled: isLoadingDates,
		},
		query: {
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
			limit: 10000,
		},
	});

	const sectorsList = sectors?.rows?.map((sector: any) => ({ id: sector.id, value: sector.name }));

	const { data: industries, isSuccess: isLoadingIndustries } = useIndustries({
		options: {
			enabled: isLoadingSectors,
		},
		query: {
			limit: 10000,
		},
	});

	const industryList = industries?.rows?.map((sector: any) => ({
		id: sector.id,
		value: sector.name,
	}));

	const { data: templateCoa, isSuccess: isLoadingCoa } = useTemplateCoaLists({
		options: {
			enabled: isLoadingIndustries,
		},
		query: {
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
			{!isLoadingCoa ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px">
						<Text variant={"h4"}>Create Template List</Text>
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
								defaultValue="DRAFT"
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
										noSearch
										handleChange={(value) => setValue("countryId", value)}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Sector"
										width={"100%"}
										items={sectorsList}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("sectorId", value)}
									/>
									<Dropdown
										label="Industry"
										width={"100%"}
										items={industryList}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("industryId", value)}
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
										noSearch
										handleChange={(value) => setValue("currencyFormatId", value)}
									/>
									<Dropdown
										label="Language"
										width={"100%"}
										items={languages}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("languageId", value)}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Format Date"
										width={"100%"}
										items={datesFormat}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("dateFormatId", value)}
									/>
									<Dropdown
										label="Timezone"
										width={"100%"}
										items={timezones}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("timezoneId", value)}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="CoA Template"
										width={"100%"}
										items={templateCoaLists}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("coaId", value)}
									/>
									<Dropdown
										label="Number Format"
										width={"100%"}
										items={numbersFormat}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("numberFormatId", value)}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Role Template"
										width={"100%"}
										items={templateRoleLists}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("templateRoleId", value)}
									/>
									<Dropdown
										label="Menu Template"
										width={"100%"}
										items={[]}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("menuId", value)}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Approval Template"
										width={"100%"}
										items={[]}
										placeholder={"Select"}
										noSearch
										handleChange={(value) => setValue("approvalId", value)}
									/>
									<div style={{ visibility: "hidden", width: "100%" }}>
										<Dropdown
											label="Currency Format"
											width={"100%"}
											items={currenciesFormat}
											placeholder={"Select"}
											noSearch
											handleChange={(value) => setValue("currencyFormatId", value)}
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

export default CreateConfig;
