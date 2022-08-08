import React, { useState } from "react";
import Router from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Accordion, Button, Col, Dropdown, Input, Row, Spacer, Spin, Text } from "pink-lava-ui";

import ArrowLeft from "../../assets/arrow-left.svg";
import {
	useDeletePartnerConfigPermissionList,
	usePartnerConfigPermissionList,
	useUpdatePartnerConfigPermissionList,
} from "../../../hooks/user-config/usePermission";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import { useRolePermissions } from "../../../hooks/role/useRole";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
		menuId: yup.string().required("Associated Menu is Required"),
		activeStatus: yup.string().required(),
	})
	.required();

const defaultValue = {
	activeStatus: "Y",
};

const DetailUserConfigPermissionList: any = () => {
	const { permission_id } = Router.query;

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValue,
	});

	const [modalDelete, setModalDelete] = useState({ open: false });

	const { mutate: mutateUpdatePartnerConfigPermissionList } = useUpdatePartnerConfigPermissionList({
		options: {
			onSuccess: () => {
				window.alert("Permission partner success updated!");
				Router.back();
			},
			onError: (error: any) => {
				window.alert(error.errors.map((data: any) => `${data.label} ${data.message}`));
			},
		},
		partnerConfigPermissionListId: permission_id,
	});

	const { data: dataPartnerConfigPermissionList, isLoading: isLoadingPartnerConfigPermissionList } =
		usePartnerConfigPermissionList({
			partner_config_menu_list_id: permission_id,
			options: {
				onSuccess: (data: any) => {
					setValue("isSystemConfig", data?.isSystemConfig);
					setValue("menuId", data?.menuId);
					setValue("activeStatus", data?.activeStatus);
					setValue("name", data?.name);
				},
			},
		});

	const { data: menuLists } = useMenuLists({
		query: { limit: 0 },
		options: {
			refetchOnWindowFocus: "always",
		},
	});
	const menus = menuLists?.rows?.map((menu: any) => ({ id: menu.id, value: menu.name }));
	const onSubmit = (data: any) => mutateUpdatePartnerConfigPermissionList(data);

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

	const { mutate: deletePermissions } = useDeletePartnerConfigPermissionList({
		options: {
			onSuccess: () => {
				window.alert("Success deleted");
				Router.back();
			},
		},
	});

	const { data: fieldRole, isLoading: isLoadingFieldRole } = useRolePermissions();

	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.back()} />
					<Text variant={"h4"}>
						Permission Detail - {dataPartnerConfigPermissionList?.name || "Unknown"}
					</Text>
				</Row>
				<Spacer size={12} />
				<Card>
					<Row justifyContent="space-between" alignItems="center" nowrap>
						{isLoadingPartnerConfigPermissionList ? (
							<Spin ip="Loading..." />
						) : (
							<Dropdown
								label=""
								isHtml
								width={"185px"}
								items={activeStatus}
								placeholder={"Status"}
								handleChange={(text: any) => setValue("activeStatus", text)}
								noSearch
								defaultValue={dataPartnerConfigPermissionList?.activeStatus ?? "N"}
							/>
						)}

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
				{/* <Alert>
					<Text variant="subtitle2" color="white">
						“General” Associated Menu must be filled.
					</Text>
				</Alert>
				<Spacer size={20} /> */}

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
						{isLoadingPartnerConfigPermissionList ? (
							<Spin ip="Loading..." />
						) : (
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									<Input
										width="100%"
										label="Name"
										height="48px"
										defaultValue={dataPartnerConfigPermissionList?.name}
										placeholder={"e.g View Shipment"}
										{...register("name", { required: true })}
									/>
									<Dropdown
										label="Associated Menu"
										handleClickActionLabel={handleAddNewAssociated}
										isShowActionLabel
										actionLabel="Add New Associated Menu"
										width={"100%"}
										defaultValue={dataPartnerConfigPermissionList?.menuId}
										items={menus}
										placeholder={"Select"}
										handleChange={(value: any) => setValue("menuId", value)}
										noSearch
									/>
								</Row>
								<Row width="50%" gap="20px" noWrap>
									<Dropdown
										label="Is System Config"
										width={"100%"}
										items={valueIsSystemConfig}
										placeholder={"Select"}
										defaultValue={dataPartnerConfigPermissionList?.isSystemConfig}
										handleChange={(value: any) => setValue("isSystemConfig", value)}
										noSearch
									/>
								</Row>
							</Accordion.Body>
						)}
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">
							<Row gap="8px" alignItems="baseline">
								Associated Role <Span>(Auto added from roles)</Span>
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							<Accordion>
								<Accordion.Item key={1}>
									<Accordion.Header>Roles</Accordion.Header>
									<Accordion.Body padding="0px">
										{isLoadingFieldRole ? (
											<Spin tip="Loading roles..." />
										) : (
											fieldRole.rows.map((data: any) => (
												<Record borderTop key={data.id}>
													{data.name}

													<Button
														size="small"
														onClick={() => Router.push(`/role/${data.id}`)}
														variant="tertiary"
													>
														View Detail
													</Button>
												</Record>
											))
										)}
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>

			{modalDelete.open && (
				<ModalDeleteConfirmation
					itemTitle={Router.query.name}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deletePermissions({ id: [Number(permission_id)] })}
				/>
			)}
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

const Record = styled.div`
	height: 54px;
	padding: 0px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: ${(p) => (p.borderTop ? "0.5px solid #AAAAAA" : "none")};
`;

export default DetailUserConfigPermissionList;
