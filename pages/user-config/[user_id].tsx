import React, { useState } from "react";
import { Text, Col, Row, Spacer, Dropdown, Button, Accordion, Input, FormSelect, EmptyState } from "pink-lava-ui";
import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import Router, { useRouter } from "next/router";

import ArrowLeft from "../../assets/icons/arrow-left.svg";

import {  useDeleteUser, useUpdateUser, useUser } from "../../hooks/user-config/useUser";
import { useRolePermissions } from "../../hooks/role/useRole";
import { useLanguages } from "../../hooks/languages/useLanguages";
import { useTimezoneInfiniteLists } from "hooks/mdm/branch/useBranch";
import useDebounce from "lib/useDebounce";
import { useEmployeeInfiniteLists } from "hooks/mdm/employee-list/useEmployeeListMDM";
import { lang } from "lang";

const phoneRegex = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
const schema = yup
	.object({
		fullname: yup.string().required("Full Name is Required"),
		email: yup.string().email("Must be Valid Email").required("Email is Required"),
		phone_number: yup.string().matches(phoneRegex, "Must be Valid Phone Number").required("Phone Number is Required"),
	})
	.required();

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

const UpdateUserConfig: any = () => {
    const router = useRouter();
    const { user_id } = router.query;
	const t = localStorage.getItem("lan") || "en-US";
	const companyCode = localStorage.getItem("companyCode");
	const [defaultValues, setDefaultValues] = useState({})

	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValues,
	});
	const [searchTimezone, setSearchTimezone] = useState("")
	const [searchEmployee, setSearchEmployee] = useState("")

	const debounceFetchTimezone = useDebounce(searchTimezone, 1000);
	const debounceFetchEmployee = useDebounce(searchEmployee, 1000);

	const [timezoneRows, setTimezoneRows] = useState(null)
	const [employeeRows, setEmployeeRows] = useState(null)
	
	const [listTimezone, setListTimezone] = useState<any[]>([])
	const [listEmployee, setListEmployee] = useState<any[]>([])
	const [employeeLanguages, setEmployeeLanguages] = useState("")


    const {
        data: UserData,
        isLoading: isLoadingUser,
        isFetching: isFetchingUser,
      } = useUser({
        user_id: user_id && user_id,
        options: {
          onSuccess: (data: any) => {
			setDefaultValues({
				id: data?.id,
				title: data?.title,
				fullname: data?.fullname,
				employee_id: data?.employeeId,
				email: data?.email,
				phone_number: data?.phoneNumber,
				timezone: data?.timezone,
				language: data?.language,
				status: data?.status
			})
          },
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

	const { mutate: updateUser } = useUpdateUser({
		user_id,
		options: {
			onSuccess: () => {
				Router.push("/user-config");
			},
		},
	});
	const { mutate: deleteUser } = useDeleteUser({
		options: {
			onSuccess: () => {
				Router.push("/user-config");
			},
		},
	});


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
		const updatedData = {
			// id: data?.id ? data?.id : defaultValues?.id,
			title: data?.title ? data?.title : defaultValues?.title,
			fullname: data?.fullname ? data?.fullname : defaultValues?.fullname,
			employee_id: data?.employee_id ? data?.employee_id : defaultValues?.employee_id,
			email: data?.email ? data?.email : defaultValues?.email,
			phone_number: data?.phone_number ? data?.phone_number : defaultValues?.phone_number,
			timezone: data?.timezone ? data?.timezone : defaultValues?.timezone,
			language: data?.language ? data?.language : defaultValues?.language,
			status: data?.status ? data?.status : defaultValues?.status,
		}
		updateUser(updatedData)
	};

	if(isLoadingTimezone || isLoadingEmployee || isLoadingUser){
		return <>loading data...</>
	}
	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/user-config")} />
					<Text variant={"h4"}>{defaultValues?.fullname}</Text>
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
							defaultValue={defaultValues?.status}
						/>
						<Row>
							<Row gap="16px">
								<Button size="big" variant={"tertiary"} onClick={() => deleteUser({ids: [user_id]})}>
									{lang[t].userList.list.button.delete}
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
											defaultValue={defaultValues?.title}
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
											defaultValue={defaultValues?.fullname}
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
													defaultValue={listEmployee?.filter(employee => employee?.value === defaultValues?.employee_id)[0]}
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
										defaultValue={defaultValues?.email}
										error={errors?.email?.message}
										placeholder={"e.g grace@nabatisnack.co.id"}
										{...register("email", { required: true })}
									/>
									<Input
										width="100%"
										label={lang[t].userList.create.template.field.phonenumber}
										height="48px"
										required
										defaultValue={defaultValues?.phone_number}
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
											defaultValue={listTimezone?.filter(timezone => timezone?.value === defaultValues?.timezone)[0].label}
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
										defaultValue={defaultValues?.language}
										placeholder={"Select"}
										handleChange={(value) => setValue("language", value)}
										noSearch
									/>
								</Row>
								<Row width="100%" gap="20px" noWrap>
									<Button size="big" variant={"tertiary"} onClick={() => Router.push("https://accounts.edot.id/infopribadi")}>
										Reset Password
									</Button>
								</Row>
							</Col>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Company Access</Accordion.Header>
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

export default UpdateUserConfig;
