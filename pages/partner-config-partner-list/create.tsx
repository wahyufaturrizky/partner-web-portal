import React, { useState } from "react";
import {
	Text,
	Col,
	Spin,
	Row,
	Spacer,
	Table,
	Pagination,
	Dropdown,
	Button,
	Accordion,
	Input,
	Radio,
	EmptyState,
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
	useCreatePartnerConfigList,
	useValidatePartnerConfigInput,
} from "../../hooks/partner-config-list/usePartnerConfigList";

const CreateConfig: any = () => {
	const [errors, setErrors] = useState({});
	const [sharedType, setSharedType] = useState("SHARED_APP");
	const [selectedRowKeysMenuDesign, setSelectedRowKeysMenuDesign] = useState([]);
	const [fotoIjinUsaha, setFotoIjinUsaha] = useState();
	const [fotoNpwp, setFotoNpwp] = useState();

	const router = useRouter();
	const { register, handleSubmit, setValue } = useForm();

	const { mutate: createConfig } = useCreatePartnerConfigList({
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
		data.id = "";
		if (!validateRequired(data)) {
			createConfig(getFormData(data));
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

	const { data: companyTypes, isSuccess: isLoadingCompanyTypes } = useCompanyTypes({
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
		options: {
			enabled: isLoadingCompanyTypes,
		},
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

	const onSelectChangeMenuDesign = (selectedRowKeys) => {
		setSelectedRowKeysMenuDesign(selectedRowKeys);
	};

	const paginationMenuDesign = usePagination({
		page: 1,
		itemsPerPage: 5,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const rowSelectionMenuDesign = {
		selectedRowKeys: selectedRowKeysMenuDesign,
		onChange: onSelectChangeMenuDesign,
		type: "radio",
	};

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

	return (
		<>
			{!true ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Row gap="4px">
						<Text variant={"h4"}>Create Partner</Text>
					</Row>
					<Spacer size={12} />
					<Card padding="20px">
						<Row justifyContent="space-between" alignItems="center" nowrap>
							<DisabledDropdown>Draft</DisabledDropdown>
							<Row>
								<Row gap="16px">
									<Button
										size="big"
										variant={"tertiary"}
										onClick={() => router.push("/partner-config-partner-list")}
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
							<Accordion.Header variant="blue">User Data</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Email"
										height="48px"
										placeholder={"e.g Email@edot.id"}
										required
										error={errors.email}
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
									<Input
										width="100%"
										label="Company Name"
										height="48px"
										placeholder={"e.g PT. Nabati Group"}
										error={errors.name}
										{...register("name", { onBlur: onBlurValidationRequired })}
										onFocus={onFocusRemoveValidation}
										required
									/>
									<Dropdown
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
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Industry"
										width={"100%"}
										items={industryList}
										placeholder={"Select"}
										handleChange={(value) => setValue("industry_id", value)}
										required
										error={errors.industry_id}
										onSearch={(search) => setSearch({ ...search, industrySearch: search })}
									/>
									<Dropdown
										label="Sector"
										width={"100%"}
										items={sectorsList}
										placeholder={"Select"}
										handleChange={(value) => setValue("sector_id", value)}
										required
										error={errors.sector_id}
										onSearch={(search) => setSearch({ ...search, sectorSearch: search })}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Country"
										width={"100%"}
										items={countryList}
										placeholder={"Select"}
										handleChange={(value) => setValue("country_id", value)}
										error={errors.country_id}
										onSearch={(search) => setSearch({ ...search, countrySearch: search })}
									/>
									<Dropdown
										label="City"
										width={"100%"}
										items={cityList}
										placeholder={"Select"}
										handleChange={(value) => setValue("city_id", value)}
										error={errors.city_id}
										onSearch={(search) => setSearch({ ...search, citySearch: search })}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Number of Employee"
										width={"100%"}
										items={numberOfEmployeeList}
										placeholder={"Select"}
										handleChange={(value) => setValue("number_of_employee", value)}
										required
										error={errors.number_of_employee}
										onSearch={(search) => setSearch({ ...search, numberOfEmployeeSearch: search })}
									/>
									<Input
										width="100%"
										label="Subdomain"
										height="48px"
										placeholder={"e.g PT. Nabati Group"}
										error={errors.subdomain}
										onFocus={onFocusRemoveValidation}
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
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Akte Pendirian"
										height="48px"
										placeholder={"e.g 321321"}
										{...register("company_article")}
									/>
									<Input
										width="100%"
										label="Akte Perubahan"
										height="48px"
										placeholder={"e.g 3451111"}
										{...register("company_article_amandement")}
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Nomor Ijin Usaha"
										height="48px"
										type="number"
										placeholder={"e.g 12345"}
										{...register("business_license")}
									/>
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
									/>
								</Row>

								<Spacer size={20} />

								<Row width="100%" gap="20px" noWrap>
									<FileUploaderAllFiles
										label="Foto Ijin Usaha"
										onSubmit={(file) => setFotoIjinUsaha(file)}
										defaultFile={"/default-file.svg"}
										removeable
									/>

									<FileUploaderAllFiles
										label="Foto NPWP"
										onSubmit={(file) => setFotoNpwp(file)}
										defaultFile={"/default-file.svg"}
										withCrop={true}
										removeable
									/>
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
									<Input
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Samsul"}
										{...register("owner_name", { onBlur: onBlurValidationRequired })}
									/>
									<Input
										width="100%"
										label="Contact"
										height="48px"
										type="number"
										placeholder={"e.g 0823231321"}
										{...register("owner_contact", { onBlur: onBlurValidationRequired })}
									/>
								</Row>

								<Spacer size={20} />

								<Text variant="headingMedium" color="blue.darker">
									Finance
								</Text>
								<Spacer size="10" />
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Lidya"}
										{...register("pic_finance_name", { onBlur: onBlurValidationRequired })}
									/>
									<Input
										width="100%"
										label="Contact"
										height="48px"
										placeholder={"e.g 0823231321"}
										{...register("pic_finance_contact", { onBlur: onBlurValidationRequired })}
									/>
								</Row>

								{isCompany && (
									<>
										<Spacer size={20} />
										<Text variant="headingMedium" color="blue.darker">
											Operational
										</Text>
										<Spacer size="10" />
										<Row width="100%" gap="20px" noWrap>
											<Input
												width="100%"
												label="Name"
												height="48px"
												placeholder={"e.g Lidya"}
												{...register("pic_operational_name", { onBlur: onBlurValidationRequired })}
											/>
											<Input
												width="100%"
												label="Contact"
												height="48px"
												placeholder={"e.g 0823231321"}
												{...register("pic_operational_contact", {
													onBlur: onBlurValidationRequired,
												})}
											/>
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
											checked={sharedType === "SHARED_APP"}
											onChange={() => setSharedType("SHARED_APP")}
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
									/>
								</Row>
								<Spacer size={20} />
								<Text variant="subtitle1" style={{ fontWeight: 600 }}>
									If No
								</Text>
								<Spacer size={20} />
								<Row alignItems="center" gap="8px">
									<Radio
										checked={sharedType === "SHARED_DB"}
										onChange={() => setSharedType("SHARED_DB")}
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
										checked={sharedType === "DIFF_SCHEMA"}
										onChange={() => setSharedType("DIFF_SCHEMA")}
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

const DisabledDropdown = styled.div`
	border: 1px solid #f4f4f4;
	border-radius: 8px;
	background: #ffffff;
	padding: 9px 16px;
	font-weight: 600;
	font-size: 16px;
	line-height: 22px;
	width: 220px;
`;

export default CreateConfig;
