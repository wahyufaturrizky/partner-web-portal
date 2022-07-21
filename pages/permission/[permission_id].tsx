import { yupResolver } from "@hookform/resolvers/yup";
import Router, { useRouter } from "next/router";
import {
	Accordion,
	Alert,
	Button,
	Col,
	Dropdown,
	Input,
	Row,
	Spacer,
	Spin,
	Text,
} from "pink-lava-ui";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import ArrowLeft from "../../assets/arrow-left.svg";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { useMenuLists } from "../../hooks/menu-list/useMenuList";
import {
	useDeletePermission,
	usePermission,
	useUpdatePermission,
} from "../../hooks/permission/usePermission";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
		menuId: yup.string().required("Associated Menu is Required"),
	})
	.required();

const PermissionDetail: any = () => {
	const router = useRouter();
	const { permission_id } = router.query;
	const [modalDelete, setModalDelete] = useState({ open: false });

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const { data: permissionRole, isSuccess: isSuccessPermission } = usePermission({
		permission_id,
		options: {
			onSuccess: (data) => {
				const permission = data.permission;
				setValue("name", permission.name);
				setValue("menuId", permission.menuId);
				setValue("activeStatus", permission.activeStatus ?? "N");
				setValue("isSystemConfig", permission.isSystemConfig);
			},
		},
	});

	const { mutate: updatePermission } = useUpdatePermission({
		permission_id,
		options: {
			onSuccess: () => {
				Router.push("/permission");
			},
		},
	});

	const { data: menuList } = useMenuLists({
		options: {
			enabled: isSuccessPermission,
			refetchOnWindowFocus: "always",
		},
		query: { limit: 0 },
	});

	const { permission, roles } = permissionRole || {};
	const { rows: menus } = menuList || {};
	const mapMenus = menus?.map((menu) => ({
		id: menu.id,
		value: menu.name,
	}));

	const { mutate: deletePermission } = useDeletePermission({
		options: {
			onSuccess: () => {
				setModalDelete({ open: false });
				router.push("/permission");
			},
		},
	});

	const onSubmit = (data) => updatePermission(data);

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
			{!permission ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<>
					<Col>
						<Row gap="4px" alignItems="center">
							<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/permission")} />
							<Text variant={"h4"}>{permission?.name}</Text>
						</Row>
						<Spacer size={12} />
						<Card padding="20px">
							<Row justifyContent="space-between" alignItems="center" nowrap>
								<Dropdown
									label=""
									width={"185px"}
									items={activeStatus}
									placeholder={"Status"}
									handleChange={(text) => setValue("activeStatus", text)}
									noSearch
									isHtml
									defaultValue={permission?.activeStatus ?? "N"}
								/>
								<Row>
									<Row gap="16px">
										<Button
											size="big"
											variant={"tertiary"}
											onClick={() => setModalDelete({ open: true })}
										>
											Delete
										</Button>
										<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
											Save
										</Button>
									</Row>
								</Row>
							</Row>
						</Card>

						<Spacer size={20} />
						{permission?.reasonRejection && (
							<>
								<Alert>
									<Text variant="subtitle2" color="white">
										{permission?.reasonRejection}
									</Text>
								</Alert>
								<Spacer size={20} />
							</>
						)}

						<Accordion>
							<Accordion.Item key={1}>
								<Accordion.Header variant="blue">General</Accordion.Header>
								<Accordion.Body>
									<Row width="100%" gap="20px" noWrap>
										<Input
											width="100%"
											label="Name"
											height="48px"
											placeholder={"e.g Sales"}
											defaultValue={permission?.name}
											{...register("name", { required: true })}
										/>
										<Dropdown
											label="Associated Menu"
											width={"100%"}
											items={mapMenus}
											placeholder={"Select"}
											noSearch
											defaultValue={permission?.menuId}
											handleChange={(value) => setValue("menuId", value)}
											handleClickActionLabel={handleAddNewAssociated}
											isShowActionLabel
											actionLabel="Add New Associated Menu"
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
											defaultValue={`${permission?.isSystemConfig}`}
										/>
									</Row>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

						<Spacer size={20} />

						{roles?.length > 0 && (
							<Accordion>
								<Accordion.Item key={1}>
									<Accordion.Header variant="blue">
										<Row gap="8px" alignItems="baseline">
											Associated Role <Span>Auto added from roles</Span>
										</Row>
									</Accordion.Header>
									<Accordion.Body>
										<Accordion>
											<Accordion.Item key={1}>
												<Accordion.Header>Roles</Accordion.Header>
												<Accordion.Body padding="0px">
													{roles?.map((role) => (
														<Record key={role.id}>{role.name}</Record>
													))}
												</Accordion.Body>
											</Accordion.Item>
										</Accordion>
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						)}
					</Col>

					{modalDelete.open && (
						<ModalDeleteConfirmation
							visible={modalDelete.open}
							onCancel={() => setModalDelete({ open: false })}
							onOk={() => deletePermission({ id: [permission_id] })}
							itemTitle={permission?.name}
						/>
					)}
				</>
			)}
		</>
	);
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

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

const Record = styled.div`
	height: 54px;
	padding: 0px 20px;
	display: flex;
	align-items: center;
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

export default PermissionDetail;
