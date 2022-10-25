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
import { useTimezone } from "../../hooks/timezone/useTimezone";
import { useLanguages } from "../../hooks/languages/useLanguages";
import { useTimezoneInfiniteLists } from "hooks/mdm/branch/useBranch";
import useDebounce from "lib/useDebounce";

const schema = yup
	.object({
		// title: yup.string().required("Title is Required"),
		fullname: yup.string().required("Full Name is Required"),
		// roleId: yup.string().required("Associated Employee is Required"),
		email: yup.string().required("Email is Required"),
		phoneNumber: yup.string().required("Phone Number is Required"),
		// timezone: yup.string().required("Timezone is Required"),
		// language: yup.string().required("Language is Required"),
		password: yup.string().required("Password is Required"),
		confirmPassword: yup.string().required("Password is Required").oneOf([yup.ref('password')], 'Passwords does not match'),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const personTitle = [{
	id: "Mr.",
	value: "Mr."
}, {
	id: "Mrs.",
	value: "Mrs."
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
	// const { register, control, handleSubmit } = useForm();
	console.log(errors, '<<<error')
	const [searchTimezone, setSearchTimezone] = useState("")
	const debounceFetchTimezone = useDebounce(searchTimezone, 1000);
	const [timezoneRows, setTimezoneRows] = useState(null)
	const [listTimezone, setListTimezone] = useState<any[]>([])

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
			setListTimezone(data?.pages[0]?.rows?.map((timezone: { utc: string; id: number; }) => {
			  return {
				label: timezone.utc, value: timezone.id
			  }
			}))
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

	const { mutate: createUser } = useCreateUser({
		options: {
			onSuccess: () => {
				Router.push("/user-config");
			},
		},
	});

	const roles = rolesData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];
	const { data: languageData } = useLanguages();
	const language = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

	const onSubmit = (data) => {
		console.log(data, '<<<<data')
		// createUser(data)
	};

	if(isLoadingTimezone){
		return <>loading data...</>
	}
	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/user")} />
					<Text variant={"h4"}>Create User</Text>
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
								<Button size="big" variant={"tertiary"} onClick={() => Router.push("/user-config")}>
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
						<Accordion.Header variant="blue">Employee Information</Accordion.Header>
						<Accordion.Body>
								<Row width="100%" noWrap>
									<Col width="8%">
										<Dropdown
											label="Title"
											width={"100%"}
											items={personTitle}
											noSearch
											defaultValue={personTitle[1]}
											placeholder={"Select"}
											handleChange={(value) => setValue("title", value)}
										/>
									</Col>
									<Spacer size={20}/>

									<Col width="41%">
										<Input
											width="180%"
											label="Full Name"
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
										<Dropdown
											label="Associated Employee"
											width={"100%"}
											items={roles}
											noSearch
											placeholder={"Select"}
											handleChange={(value) => setValue("roleId", value)}
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
						<Accordion.Header variant="blue">General Information</Accordion.Header>
						<Accordion.Body>
							<Col width="100%" gap="20px">
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Email"
										height="48px"
										required
										error={errors?.email?.message}
										placeholder={"e.g grace@nabatisnack.co.id"}
										{...register("email", { required: true })}
									/>
									<Input
										width="100%"
										label="Phone Number"
										height="48px"
										required
										error={errors?.phoneNumber?.message}
										placeholder={"e.g 081234567890"}
										{...register("phoneNumber", { required: true })}
									/>
								</Row>
								<Row width="100%" gap="20px" noWrap>
								<Col width="100%">
									<Controller
									control={control}
									name="timezone"
									render={({ field: { onChange } }) => (
										<>
										<Label>Timezone</Label>
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
										label="Language"
										items={language}
										width={"100%"}
										placeholder={"Select"}
										handleChange={(value) => setValue("language", value)}
										noSearch
									/>
								</Row>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Password"
										height="48px"
										required
										type={"password"}
										error={errors?.password?.message}
										placeholder={"Type Password"}
										{...register("password", { required: true })}
									/>
									<Input
										width="100%"
										label="Confirm Password"
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

export default CreateUserConfig;
