import Router, { useRouter } from "next/router";
import {
	Accordion,
	Button,
	Checkbox,
	Col,
	Dropdown,
	Input,
	Row,
	Spacer,
	Switch,
	Table,
	Text,
	Spin,
} from "pink-lava-ui";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { usePermissions } from "../../../hooks/permission/usePermission";
import { useProcessLists } from "../../../hooks/business-process/useProcess";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useConfigs } from "../../../hooks/config/useConfig";
import {
  useDeletePartnerConfigApprovalList,
	usePartnerConfigApprovalList,
	useUpdatePartnerConfigApprovalList,
} from "../../../hooks/user-config/useApproval";
import { lang } from "lang";

export interface ConfigModuleList {}

const DetailUserConfigApproval: any = () => {
	const router = useRouter();

	const t = localStorage.getItem("lan") || "en-US";
	const { approval_id } = router.query;
	const [dataListDropdownModul, setDataListDropdownModul] = useState(null);
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [dataListDropdownProcess, setDataListDropdownProcess] = useState(null);
	const [dataListDropdownPermission, setDataListDropdownPermission] = useState(null);
	const [isSendEmailNotif, setisSendEmailNotif] = useState(false);
	const [approvalStages, setApprovalStages] = useState([]);
	const [stateFieldInput, setStateFieldInput] = useState({
		name: "",
		numberOfApprovalStage: 1,
	});
	const { name, numberOfApprovalStage } = stateFieldInput;

	const handleChangeDropdown = (value: any, name: any) => {
		if (name === "module") {
			setDataListDropdownModul(value);
		} else if (name === "process") {
			setDataListDropdownProcess(value);
		} else {
			setDataListDropdownPermission(value);
		}
	};

	const { mutate: deleteApproval } = useDeletePartnerConfigApprovalList({
		options: {
			onSuccess: () => {
				window.alert("Success deleted");
				Router.back();
			},
		},
	});
	console.log(approval_id)
	const { data: dataPartnerConfigApprovalList, isLoading: isLoadingPartnerConfigApprovalList } =
		usePartnerConfigApprovalList({
			partner_config_approval_list_id: approval_id,
			options: {
				onSuccess: (data: any) => {
					setisSendEmailNotif(data?.isEmailNotification);
					setStateFieldInput({
						name: data?.name,
						numberOfApprovalStage: data?.stages,
					});
					handleChangeDropdown(data?.moduleId, "module");
					handleChangeDropdown(data?.processId, "process");
					handleChangeDropdown(data?.partnerPermissionId, "permission");
				},
			},
		});

	const handleChangeInput = (e) => {
		if (e.target.id === "numberOfApprovalStage") {
			if (e.target.value > 0) {
				setStateFieldInput({
					...stateFieldInput,
					[e.target.id]: e.target.value,
				});
			}
		} else {
			setStateFieldInput({
				...stateFieldInput,
				[e.target.id]: e.target.value,
			});
		}
	};

	const {
		mutate: mutateUpdatePartnerConfigApprovalList,
		isLoading: isLoadingUpdatePartnerConfigApprovalList,
	} = useUpdatePartnerConfigApprovalList({
		partnerConfigApprovalListId: approval_id,
		options: {
			onSuccess: (data: any) => {
				if (data) {
					window.alert("Permission approval success updated!");
					Router.back();
				}
			},
			onError: (error: any) => {
				if (error?.data) {
					window.alert(error.data.errors && error.data.errors[0].message);
				} else {
					window.alert(error.data.message);
				}
			},
		},
	});

	const { data: dataConfigsModule, isLoading: isLoadingConfigModule } = useConfigs({
		options: {
			refetchOnWindowFocus: "always",
		},
	});

	const { data: fieldsListProcess, isLoading: isLoadingFieldListProcess } = useProcessLists({
		options: {
			refetchOnWindowFocus: "always",
		},
	});

	const { data: fieldsPermissionList, isLoading: isLoadingFieldsPermissionList } = usePermissions({
		options: {
			refetchOnWindowFocus: "always",
		},
	});

	const handleCreateProcessList = () => {
		const isEmptyField = Object.keys(stateFieldInput).find(
			(thereIsEmptyField) => stateFieldInput && stateFieldInput[thereIsEmptyField] === ""
		);

		if (!isEmptyField) {
			const data: any = {
				name: name,
				module_id: dataListDropdownModul,
				process_id: dataListDropdownProcess,
				partner_permission_id: dataListDropdownPermission,
				approval_stages: approvalStages.map((dataApprovalStages) => ({
					is_mandatory: dataApprovalStages.is_mandatory,
				})),
				is_email_notification: isSendEmailNotif,
			};
			mutateUpdatePartnerConfigApprovalList(data);
		} else {
			window.alert(`field ${isEmptyField} must be fill!`);
		}
	};

	const handleDirectAssociated = (name: any) => {
		window.open(`/${name}/create`, "_blank");
	};

	const columnsAssociatedRoles = [
		{
			title: "Roles",
			dataIndex: "roles_field",
		},
		{
			title: "Default Stage",
			dataIndex: "default_stage_field",
			render: (value: any) => (
				<Dropdown
					width="100%"
					loading={isLoadingConfigModule}
					items={[{ id: 1, value: "stage 1" }]}
					placeholder={"Select"}
					noSearch
				/>
			),
		},
		{
			title: "Action",
			dataIndex: "action",
		},
	];

	const columnsAssociatedUsers = [
		{
			title: "Users",
			dataIndex: "users_field",
		},
		{
			title: "Roles",
			dataIndex: "roles_field",
		},
		{
			title: "Stages",
			dataIndex: "stages_field",
		},
	];

	useEffect(() => {
		let tempApprovalStages: any = [];

		Array.apply(null, { length: numberOfApprovalStage }).map((data, index) => {
			tempApprovalStages.push({ is_mandatory: false, id: index });
		});

		setApprovalStages(tempApprovalStages);
	}, [numberOfApprovalStage]);

	return (
		<>
			<Col>
				<Row gap="4px" alignItems="center">
					
					<Text variant={"h4"}>
						Approval Partner Detail - {dataPartnerConfigApprovalList?.name || "Unknown"}
					</Text>
				</Row>
				<Card>
					<Row justifyContent="space-between" alignItems="center" nowrap>
						{isLoadingPartnerConfigApprovalList ? (
							<Spin tip="loading..." />
						) : (
							<Row alignItems="center" gap="4px">
								<Switch
									defaultChecked={isSendEmailNotif}
									checked={isSendEmailNotif}
									onChange={() => setisSendEmailNotif(!isSendEmailNotif)}
								/>
								<div
									style={{ cursor: "pointer" }}
									onClick={() => setisSendEmailNotif(!isSendEmailNotif)}
								>
									<Text variant={"h6"}>{lang[t].approvalList.toggle.emailNotification}</Text>
								</div>
							</Row>
						)}

						<Row>
							<Row gap="16px">
								<Button
									size="big"
									variant={"tertiary"}
									onClick={() => setModalDelete({ open: true })}
								>
									{lang[t].approvalList.tertier.delete}
								</Button>
								<Button size="big" variant={"primary"} onClick={handleCreateProcessList}>
									{isLoadingUpdatePartnerConfigApprovalList ? "loading..." : lang[t].approvalList.primary.save}
								</Button>
							</Row>
						</Row>
					</Row>
				</Card>

				<Spacer size={20} />

				{isLoadingPartnerConfigApprovalList ? (
					<Spin tip="loading..." />
				) : (
					<Accordion>
						<Accordion.Item key={1}>
							<Accordion.Header variant="blue">{lang[t].approvalList.accordion.general}</Accordion.Header>
							<Accordion.Body>
								<Row width="100%" gap="20px" noWrap>
									{/* TODO: HIDE AFTER INCLUDING IN SPRINT */}
									{/* <Row alignItems="center" gap="4px">
									<Checkbox checked={isApproval} onChange={() => setIsApproval(!isApproval)} />
									<div style={{ cursor: "pointer" }} onClick={() => setIsApproval(!isApproval)}>
										<Text variant={"h6"}>Approval</Text>
									</div>
								</Row> */}
								</Row>
								<Row width="100%" gap="20px" noWrap>
									<Col width="100%">
										<Input
											id="name"
											defaultValue={name}
											width="100%"
											label={lang[t].approvalList.approvalName}
											height="48px"
											placeholder={"e.g Shipment and Delivery"}
											onChange={handleChangeInput}
										/>
									</Col>
									<Col width="100%">
										<Dropdown
											width="100%"
											label={lang[t].approvalList.filterbar.module}
											id="Module"
											loading={isLoadingConfigModule}
											items={
												dataConfigsModule &&
												dataConfigsModule?.rows.map((data) => ({ id: data.id, value: data.name }))
											}
											defaultValue={dataListDropdownModul}
											placeholder={"Select"}
											handleChange={(value) => handleChangeDropdown(value, "module")}
											noSearch
										/>

										<Text
											onClick={() => handleDirectAssociated("config")}
											clickable
											variant="headingSmall"
											color="pink.regular"
										>
											Go to Associated Module
										</Text>
										{/* <div style={{ cursor: "pointer" }} onClick={() => {}}>
										<Text variant="headingSmall" color="pink.regular">
											Go to Associated Modul >
										</Text>
									</div> */}
									</Col>
								</Row>
								<Row width="100%" gap="20px" noWrap>
									<Col width="100%">
										<Dropdown
											width="100%"
											label={lang[t].approvalList.filterbar.process}
											loading={isLoadingFieldListProcess}
											items={
												fieldsListProcess &&
												fieldsListProcess?.rows.map((data: any) => ({ id: data.id, value: data.name }))
											}
											placeholder={"Select"}
											defaultValue={dataListDropdownProcess}
											handleChange={(value: any) => handleChangeDropdown(value, "process")}
											noSearch
										/>

										<Text
											onClick={() => handleDirectAssociated("process")}
											variant="headingSmall"
											color="pink.regular"
											clickable
										>
											Go to Associated Process
										</Text>
									</Col>
									<Col width="100%">
										<Dropdown
											width="100%"
											label={lang[t].approvalList.filterbar.permission}
											loading={isLoadingFieldsPermissionList}
											items={
												fieldsPermissionList &&
												fieldsPermissionList?.rows.map((data) => ({
													id: data.id,
													value: data.name,
												}))
											}
											defaultValue={dataListDropdownPermission}
											placeholder={"Select"}
											handleChange={(value: any) => handleChangeDropdown(value, "permission")}
											noSearch
										/>

										<Text
											onClick={() => handleDirectAssociated("permission")}
											variant="headingSmall"
											color="pink.regular"
											clickable
										>
											Go to Associated Permission
										</Text>
										{/* <div style={{ cursor: "pointer" }} onClick={() => {}}>
										<Text variant="headingSmall" color="pink.regular">
											Go to Associated Modul >
										</Text>
									</div> */}
									</Col>
								</Row>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">{lang[t].approvalList.accordion.approval}</Accordion.Header>
						<Accordion.Body>
							<Row width="100%" gap="20px" noWrap>
								{/* TODO: HIDE AFTER INCLUDING IN SPRINT */}
								{/* <Row alignItems="center" gap="4px">
									<Checkbox checked={isApproval} onChange={() => setIsApproval(!isApproval)} />
									<div style={{ cursor: "pointer" }} onClick={() => setIsApproval(!isApproval)}>
										<Text variant={"h6"}>Approval</Text>
									</div>
								</Row> */}
							</Row>
							<Row width="100%" gap="20px" noWrap>
								{isLoadingPartnerConfigApprovalList ? (
									<Spin tip="loading..." />
								) : (
									<Col width="50%">
										<Input
											id="numberOfApprovalStage"
											width="100%"
											label={lang[t].approvalList.emptyState.approval}
											height="48px"
											defaultValue={numberOfApprovalStage}
											placeholder={"e.g 1"}
											onChange={handleChangeInput}
											type="number"
										/>

										<Text clickable variant="headingSmall">
											Choose mandatory approval stages
										</Text>

										<Spacer size={24} />

										<Row gap="24px">
											{approvalStages.map((data: any, index) => (
												<Col key={index}>
													<Row alignItems="center">
														<Checkbox
															checked={data.is_mandatory}
															onChange={() => {
																const temp: any = approvalStages.map((subdata: any) => {
																	if (data.id === subdata.id) {
																		return { ...subdata, is_mandatory: !data.is_mandatory };
																	} else {
																		return subdata;
																	}
																});

																setApprovalStages(temp);
															}}
														/>
														<div
															style={{ cursor: "pointer" }}
															onClick={() => {
																const temp: any = approvalStages.map((subdata: any) => {
																	if (data.id === subdata.id) {
																		return { ...subdata, is_mandatory: !data.is_mandatory };
																	} else {
																		return subdata;
																	}
																});

																setApprovalStages(temp);
															}}
														>
															<Text variant={"h6"}>Stage {index + 1}</Text>
														</div>
													</Row>
												</Col>
											))}
										</Row>
									</Col>
								)}
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">{lang[t].approvalList.accordion.associatedRole}</Accordion.Header>
						<Accordion.Body>
							<Table
								data={[
									{
										key: 1,
										roles_field: "",
										default_stage_field: "",
										action: (
											<div style={{ display: "flex", justifyContent: "left" }}>
												<Button size="small" onClick={() => {}} variant="tertiary">
													View Detail
												</Button>
											</div>
										),
									},
								]}
								columns={columnsAssociatedRoles}
							/>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Associated Users</Accordion.Header>
						<Accordion.Body>
							<Table
								data={[
									{
										key: 1,
										users_field: "",
										roles_field: "",
										stage_field: "",
									},
								]}
								columns={columnsAssociatedUsers}
							/>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>

			{modalDelete.open && (
				<ModalDeleteConfirmation
					itemTitle={Router.query.name}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteApproval({ id: [Number(approval_id)] })}
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

export default DetailUserConfigApproval;
