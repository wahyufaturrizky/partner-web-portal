import React from "react";
import { Text, Col, Row, Spacer, Dropdown, Button, Accordion, Input } from "pink-lava-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import Router from "next/router";

import ArrowLeft from "../../assets/icons/arrow-left.svg";

import { useCreateUser } from "../../hooks/user-config/useUser";
import { useRolePermissions } from "../../hooks/role/useRole";
import { useTimezone } from "../../hooks/timezone/useTimezone";
import { useLanguages } from "../../hooks/languages/useLanguages";

const schema = yup
	.object({
		fullname: yup.string().required("Full Name is Required"),
		roleId: yup.string().required("Role is Required"),
		email: yup.string().required("Email is Required"),
		phoneNumber: yup.string().required("Phone Number is Required"),
		timezone: yup.string().required("Timezone is Required"),
		language: yup.string().required("Language is Required"),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const CreateUserConfig: any = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});

	const { data: rolesData } = useRolePermissions({
		query: {
			limit: 10000,
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
	const { data: timezoneData } = useTimezone();
	const timezone = timezoneData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];
	const { data: languageData } = useLanguages();
	const language = languageData?.rows?.map((row) => ({ id: row.id, value: row.name })) ?? [];

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

	const onSubmit = (data) => createUser(data);
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
							<Col width="100%" gap="20px">
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Full Name"
										height="48px"
										noSearch
										placeholder={"e.g Grace"}
										{...register("fullname", { required: true })}
									/>
									<Dropdown
										label="Role"
										width={"536px"}
										items={roles}
										noSearch
										placeholder={"Select"}
										handleChange={(value) => setValue("roleId", value)}
									/>
								</Row>
							</Col>
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
										placeholder={"e.g grace@nabatisnack.co.id"}
										{...register("email", { required: true })}
									/>
									<Input
										width="100%"
										label="Phone Number"
										height="48px"
										placeholder={"e.g 081234567890"}
										{...register("phoneNumber", { required: true })}
									/>
								</Row>
								<Row width="100%" gap="20px" noWrap>
									<Dropdown
										label="Timezone"
										width={"100%"}
										items={timezone}
										placeholder={"Select"}
										handleChange={(value) => setValue("timezone", value)}
										noSearch
									/>
									<Dropdown
										label="Language"
										items={language}
										width={"100%"}
										placeholder={"Select"}
										handleChange={(value) => setValue("language", value)}
										noSearch
									/>
								</Row>
							</Col>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>
		</>
	);
};

const Span = styled.div`
	font-size: 14px;
	line-height: 18px;
	font-weight: normal;
	color: #ffe12e;
`;

const Record = styled.div`
	height: 54px;
	padding: 0px 20px;
	display: flex;
	align-items: center;
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateUserConfig;
