import React, { useState } from "react";
import { Text, Col, Row, Spacer, Dropdown, Button, Accordion, Input, FormSelect, EmptyState } from "pink-lava-ui";
import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import styled from "styled-components";
import * as yup from "yup";
import Router from "next/router";

import ArrowLeft from "../../assets/icons/arrow-left.svg";

import { useCreateUser } from "../../hooks/user-config/useUser";
import { useRolePermissions } from "../../hooks/role/useRole";
import { useLanguages } from "../../hooks/languages/useLanguages";
import { useTimezoneInfiniteLists } from "hooks/mdm/branch/useBranch";
import useDebounce from "lib/useDebounce";
import { useEmployeeInfiniteLists } from "hooks/mdm/employee-list/useEmployeeListMDM";
import { lang } from "lang";
import { useAllLibraryLanguage } from "hooks/mdm/library-language/useLibraryLanguage";

const phoneRegex = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
const schema = yup
	.object({
		fullname: yup.string().required("Full Name is Required"),
		// employee_id: yup.string().required("Associated Employee is Required"),
		email: yup.string().email("Must be Valid Email").required("Email is Required"),
		phone_number: yup.string().matches(phoneRegex, "Must be Valid Phone Number").required("Phone Number is Required"),
		password: yup.string().required("Password is Required"),
		confirmPassword: yup.string().required("Password is Required").oneOf([yup.ref('password')], 'Passwords does not match'),
	})
	.required();

const defaultValue = {
	status: "ACTIVE",
	title: "Mr."
};

const personTitle = [{
	id: "Mr.",
	value: "Mr."
}, {
	id: "Mrs.",
	value: "Mrs."
}, {
	id: "Ms.",
	value: "Ms."
}]
const CreateUserConfig: any = () => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});
	const t = localStorage.getItem("lan") || "en-US";
	const companyCode = localStorage.getItem("companyCode");
	const [searchTimezone, setSearchTimezone] = useState("")
	const [searchEmployee, setSearchEmployee] = useState("")

	const debounceFetchTimezone = useDebounce(searchTimezone, 1000);
	const debounceFetchEmployee = useDebounce(searchEmployee, 1000);

	const [timezoneRows, setTimezoneRows] = useState(null)
	const [employeeRows, setEmployeeRows] = useState(null)
	
	const [listTimezone, setListTimezone] = useState<any[]>([])
	const [listEmployee, setListEmployee] = useState<any[]>([])
	const [employeeLanguages, setEmployeeLanguages] = useState("")

	const { data: rolesData } = useRolePermissions({
		query: {
			limit: 10000,
		},
	});

	const { 
		isFetching: isFetchingTimezone,
		isFetchingNextPage: isFetchingMoreTimezone,
		isLoading: isLoadingTimezone,
		hasNextPage: timezoneHasNextPage,
		fetchNextPage: timezoneFetchNextPage, 
	} = useTimezoneInfiniteLists({
	query: {
		search: debounceFetchTimezone,
	},
	options: {
		onSuccess: (data: any) => {
		setTimezoneRows(data?.pages[0]?.totalRow);
		const mappedData = data?.pages?.map((group: any) => {
			return group?.rows?.map((timezone: { utc: string; id: number; name: string}) => {
				return {
				label: timezone.utc, value: timezone.name
				}

			})
		});
		const flattenArray = [].concat(...mappedData);
		setListTimezone(flattenArray)
		},
		getNextPageParam: (_lastPage: any, pages: any) => {
		if (timezoneRows && listTimezone.length < timezoneRows) {
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
		isLoading: isLoadingEmployee,
		hasNextPage: employeeHasNextPage,
		fetchNextPage: employeeFetchNextPage, 
	} = useEmployeeInfiniteLists({
	query: {
		search: debounceFetchEmployee,
		company: companyCode,
		limit: 10
	},
	options: {
		onSuccess: (data: any) => {
		setEmployeeRows(data?.pages[0]?.totalRow);
		const mappedData = data?.pages?.map((group: any) => {
			return group?.rows?.map((employee: { nik: string; name: string; id: number; languages: string }) => {
				return {
				label: employee.nik + ' - ' + employee.name, value: employee.id, language: employee?.languages  
				}
			}
		)})
		const flattenArray = [].concat(...mappedData);
        setListEmployee(flattenArray);
		},
		getNextPageParam: (_lastPage: any, pages: any) => {
		if (employeeRows && listEmployee.length < employeeRows) {
			return pages.length + 1;
		} else {
			return undefined;
		}
		},
	},
	});

	const { mutate: createUser } = useCreateUser({
		options: {
			onSuccess: () => {
				Router.push("/user-config");
			},
		},
	});

	const roles = rolesData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];
	const {
		data: languageData,
		isLoading: isLoadingLibraryLanguage,
		isFetching: isFetchingLibraryLanguage,
	  } = useAllLibraryLanguage({
		options: {},
		query: {
		//   search: search.languageSearch,
		  limit: 10000,
		}});
	const language = languageData?.rows?.map((row) => ({ id: row.id, value: row.id + ' - ' + row.name })) ?? [];

	// const { data: languageData } = useLanguages();
	// const language = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

	const active_status = [
		{ id: "ACTIVE", value: `<div key="1" style="color:green;">${lang[t].userList.create.template.button.active}</div>` },
		{ id: "INACTIVE", value: `<div key="2" style="color:red;">${lang[t].userList.create.template.button.inActive}</div>` },
	];

	const onSubmit = (data: any) => {
		const payload = {
			...data,
			company_id: companyCode
		}
		createUser(payload)
	};

	if(isLoadingTimezone || isLoadingEmployee){
		return <>loading data...</>
	}
	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/user-config")} />
					<Text variant={"h4"}>{lang[t].userList.create.template.headerTitle}</Text>
				</Row>
				
				<Spacer size={12} />

				<Card padding="20px">
					<Row justifyContent="space-between" alignItems="center" nowrap>
						<Dropdown
							label=""
							isHtml
							width={"185px"}
							items={active_status}
							placeholder={"Status"}
							handleChange={(text) => setValue("status", text)}
							noSearch
							defaultValue="ACTIVE"
						/>
						<Row>
							<Row gap="16px">
								<Button size="big" variant={"tertiary"} onClick={() => Router.push("/user-config")}>
								{lang[t].userList.list.button.cancel}
								</Button>
								<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
								{lang[t].userList.list.button.save}
								</Button>
							</Row>
						</Row>
					</Row>
				</Card>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">{lang[t].userList.create.template.accordion.employeeInformation}</Accordion.Header>
						<Accordion.Body>
								<Row width="100%" noWrap>
									<Col width="8%">
										<Dropdown
											label={lang[t].userList.create.template.field.title}
											width={"100%"}
											items={personTitle}
											noSearch
											defaultValue={personTitle[0]}
											placeholder={"Select"}
											handleChange={(value) => setValue("title", value)}
										/>
									</Col>
									<Spacer size={20}/>

									<Col width="41%">
										<Input
											width="180%"
											label={lang[t].userList.create.template.field.fullname}
											height="48px"
											required
											error={errors?.fullname?.message}
											noSearch
											placeholder={"e.g Grace"}
											{...register("fullname", { required: true })}
										/>
									</Col>
									<Spacer size={20}/>
									<Col width={'50%'}>
										<Controller
											control={control}
											name="employee_id"
											render={({ field: { onChange } }) => (
												<>
												<Label>{lang[t].userList.create.template.field.associatedEmployee}</Label>
												<Spacer size={4}/>
												<FormSelect
													style={{ width: "100%"}}
													height={"48px"}
													size={"large"}
													placeholder={"Select"}
													borderColor={"#AAAAAA"}
													arrowColor={"#000"}
													withSearch
													error={errors?.employee_id?.message}
													isLoading={isFetchingEmployee}
													isLoadingMore={isFetchingMoreEmployee}
													fetchMore={() => {
													if (employeeHasNextPage) {
														employeeFetchNextPage();
													}
													}}
													items={
													isFetchingEmployee && !isFetchingMoreEmployee
														? []
														: listEmployee
													}
													onChange={(value: any) => {
													onChange(value);
													setEmployeeLanguages(listEmployee.filter(employee => employee.value === value)[0]?.language)
													}}
													onSearch={(value: any) => {
													setSearchEmployee(value);
													}}
												/>
												</>
											)}
											/>
									</Col>
								</Row>
								<Spacer size={20}/>

						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">{lang[t].userList.create.template.accordion.generalInformation}</Accordion.Header>
						<Accordion.Body>
							<Col width="100%" gap="20px">
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label={lang[t].userList.create.template.field.email}
										height="48px"
										required
										error={errors?.email?.message}
										placeholder={"e.g grace@nabatisnack.co.id"}
										{...register("email", { required: true })}
									/>
									<Input
										width="100%"
										label={lang[t].userList.create.template.field.phonenumber}
										height="48px"
										required
										error={errors?.phone_number?.message}
										placeholder={"e.g 081234567890"}
										{...register("phone_number", { required: true })}
									/>
								</Row>
								<Row width="100%" gap="20px" noWrap>
								<Col width="100%">
									<Controller
									control={control}
									name="timezone"
									render={({ field: { onChange } }) => (
										<>
										<Label>{lang[t].userList.create.template.field.timezone}</Label>
										<Spacer size={4}/>
										<FormSelect
											style={{ width: "100%"}}
											height={"48px"}
											size={"large"}
											placeholder={"Select"}
											borderColor={"#AAAAAA"}
											arrowColor={"#000"}
											withSearch
											isLoading={isFetchingTimezone}
											isLoadingMore={isFetchingMoreTimezone}
											fetchMore={() => {
											if (timezoneHasNextPage) {
												timezoneFetchNextPage();
											}
											}}
											items={
											isFetchingTimezone && !isFetchingMoreTimezone
												? []
												: listTimezone
											}
											onChange={(value: any) => {
											onChange(value);
											}}
											onSearch={(value: any) => {
											setSearchTimezone(value);
											}}
										/>
										</>
									)}
									/>
								</Col>
									<Dropdown
										label={lang[t].userList.create.template.field.language}
										items={language}
										width={"100%"}
										value={employeeLanguages && employeeLanguages}
										placeholder={"Select"}
										handleChange={(value) => setValue("language", value)}
										noSearch
									/>
								</Row>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label={lang[t].userList.create.template.field.password}
										height="48px"
										required
										type={"password"}
										error={errors?.password?.message}
										placeholder={"Type Password"}
										{...register("password", { required: true })}
									/>
									<Input
										width="100%"
										label={lang[t].userList.create.template.field.confirmPassword}
										required
										height="48px"
										type={"password"}
										error={errors?.confirmPassword?.message}
										placeholder={"Type Password"}
										{...register("confirmPassword", { required: true })}
									/>
								</Row>
							</Col>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">{lang[t].userList.create.template.accordion.companyAccess}</Accordion.Header>
						<Accordion.Body>
						
						<Spacer size={20} />

						<EmptyState
							image={"/icons/empty-state.svg"}
							title={"No Company Access Yet"}
							subtitle={``}
							height={100}
						/>
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
const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export default CreateUserConfig;
