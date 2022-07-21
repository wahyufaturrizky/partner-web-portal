import React, { useState } from "react";
import { Text, Col, Row, Spin, Spacer, Dropdown2, Button, Accordion, Input } from "pink-lava-ui";
import styled from "styled-components";
import Router, { useRouter } from "next/router";
import ArrowLeft from "../../../assets/arrow-left.svg";
import {
	usePermission,
	useUpdatePermission,
	useApprovePermission,
} from "../../../hooks/permission/usePermission";
import { useMenuLists } from "../../../hooks/menu-list/useMenuList";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { queryClient } from "../../_app";
import { ModalRejectPermission } from "../../../components/modals/ModalRejectPermission";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
		menuId: yup.string().required("Associated Menu is Required"),
	})
	.required();

const PermissionDetail: any = () => {
	const router = useRouter();
	const { permission_id } = router.query;
	const [modalReject, setModalReject] = useState({ open: false });

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
			},
		},
	});

	const { mutate: updatePermission } = useUpdatePermission({
		permission_id,
		options: {
			onSuccess: () => {
				Router.push("/approval");
			},
		},
	});

	const { data: menuList } = useMenuLists({
		options: {
			enabled: isSuccessPermission,
		},
		query: { limit: 0 },
	});

	const { permission, roles } = permissionRole || {};
	const { rows: menus } = menuList || {};
	const mapMenus = menus?.map((menu) => ({
		id: menu.id,
		value: menu.name,
	}));

	const { mutate: approvePermission } = useApprovePermission({
		options: {
			onSuccess: () => {
				queryClient.refetchQueries(["approval-super-users"]);
			},
		},
	});

	const onSubmit = (data) => {
		const payload = {
			ids: [permission_id],
			approvalStatus: "APPROVED",
		};
		approvePermission(payload);
		updatePermission(data);
	};

	const reject = (data) => {
		approvePermission(data);
		setModalReject({ open: false });
		Router.push("/approval");
	};

	const activeStatus = [
		{ id: "Y", value: '<div key="1" style="color:green;">Active</div>' },
		{ id: "N", value: '<div key="2" style="color:red;">Non Active</div>' },
	];

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
							<ArrowLeft style={{ cursor: "pointer" }} onClick={() => Router.push("/approval")} />
							<Text variant={"h4"}>{permission?.name}</Text>
						</Row>
						<Spacer size={12} />
						<Card padding="20px">
							<Row justifyContent="space-between" alignItems="center" nowrap>
								<Dropdown2
									label=""
									width={"185px"}
									items={activeStatus}
									placeholder={"Status"}
									handleChange={(text) => setValue("activeStatus", text)}
									noSearch
									isHtml
									defaultValue={permission?.activeStatus ?? "N"}
									disabled={true}
								/>
								<Row>
									<Row gap="16px">
										<Button
											size="big"
											variant={"secondary"}
											onClick={() => setModalReject({ open: true })}
										>
											Reject
										</Button>
										<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
											Approve
										</Button>
									</Row>
								</Row>
							</Row>
						</Card>

						{/* <Spacer size={20} />
        <Alert><Text variant="subtitle2" color="white">“General” Associated Menu must be filled.</Text></Alert> */}
						<Spacer size={20} />

						<Accordion>
							<Accordion.Item key={1}>
								<Accordion.Header variant="blue">General</Accordion.Header>
								<Accordion.Body>
									<Row width="100%" gap="20px" noWrap>
										<Input
											disabled={true}
											width="100%"
											label="Name"
											height="48px"
											placeholder={"e.g Sales"}
											defaultValue={permission?.name}
											{...register("name", { required: true })}
										/>
										<Dropdown2
											disabled={true}
											label="Associated Menu"
											width={"100%"}
											items={mapMenus}
											placeholder={"Select"}
											noSearch
											defaultValue={permission?.menuId}
											handleChange={(value) => setValue("menuId", value)}
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

					{modalReject.open && (
						<ModalRejectPermission
							visible={modalReject.open}
							onCancel={() => setModalReject({ open: false })}
							onOk={(data) => reject(data)}
							permissionId={[permission_id]}
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
