import React, { useState } from "react";
import { Text, Col, Row, Alert, Spacer, Dropdown, Button, Accordion, Input } from "pink-lava-ui";
import styled from "styled-components";
import ArrowLeft from "../../assets/arrow-left.svg";
import Router from "next/router";
import { useCreatePermission } from "../../hooks/permission/usePermission";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMenuLists } from "../../hooks/menu-list/useMenuList";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
		menuId: yup.string().required("Associated Menu is Required"),
		activeStatus: yup.string().required(),
		isSystemConfig: yup.string().required(),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const CreatePermission: any = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});

	const { mutate: createPermission } = useCreatePermission({
		options: {
			onSuccess: () => {
				Router.push("/permission");
			},
		},
	});

	const { data: menuLists } = useMenuLists({
		query: { limit: 0, owner: "ZEUS" },
		options: {
			refetchOnWindowFocus: "always",
		},
	});
	const menus = menuLists?.rows?.map((menu) => ({ id: menu.id, value: menu.name }));
	const onSubmit = (data) => createPermission(data);

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

	const valueIsSystemConfig = [
		{
			id: true,
			value: "True",
		},
		{
			id: false,
			value: "False",
		},
	];

	const handleAddNewAssociated = () => {
		window.open("/menu-list/create", "_blank");
	};

	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/permission")} />
					<Text variant={"h4"}>Permission List</Text>
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
								<Button size="big" variant={"tertiary"} onClick={() => Router.push("/permission")}>
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
				{/* <Alert>
					<Text variant="subtitle2" color="white">
						“General” Associated Menu must be filled.
					</Text>
				</Alert>
				<Spacer size={20} /> */}

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
						<Accordion.Body>
							<Row width="100%" gap="20px" noWrap>
								<Input
									width="100%"
									label="Name"
									height="48px"
									placeholder={"e.g View Shipment"}
									{...register("name", { required: true })}
								/>
								<Dropdown
									label="Associated Menu"
									handleClickActionLabel={handleAddNewAssociated}
									isShowActionLabel
									actionLabel="Add New Associated Menu"
									width={"100%"}
									items={menus}
									placeholder={"Select"}
									handleChange={(value) => setValue("menuId", value)}
									noSearch
								/>
							</Row>
							<Row width="50%" gap="20px" noWrap>
								<Dropdown
									label="Is System Config"
									width={"100%"}
									items={valueIsSystemConfig}
									placeholder={"Select"}
									handleChange={(value) => setValue("isSystemConfig", value)}
									noSearch
								/>
							</Row>
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

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreatePermission;
