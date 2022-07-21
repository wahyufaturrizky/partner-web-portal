import Router from "next/router";
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
} from "pink-lava-ui";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useConfigs } from "../../hooks/config/useConfig";
import { useCreatePartnerConfigApprovalList } from "../../hooks/partner-config-approval/usePartnerConfigApproval";
import { usePermissions } from "../../hooks/permission/usePermission";
import { useProcessLists } from "../../hooks/process/useProcess";

export interface ConfigModuleList {}

const CreatePartnerConfigApproval: any = () => {
	const [dataListDropdownModul, setDataListDropdownModul] = useState(null);
	const [dataListDropdownProcess, setDataListDropdownProcess] = useState(null);
	const [dataListDropdownPermission, setDataListDropdownPermission] = useState(null);
	const [isSendEmailNotif, setisSendEmailNotif] = useState(false);
	const [approvalStages, setApprovalStages] = useState([]);
	const [stateFieldInput, setStateFieldInput] = useState({
		name: "",
		numberOfApprovalStage: 1,
	});
	const { name, numberOfApprovalStage } = stateFieldInput;

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
		mutate: mutateCreatePartnerConfigApprovalList,
		isLoading: isLoadingCreatePartnerConfigApprovalList,
	} = useCreatePartnerConfigApprovalList({
		options: {
			onSuccess: (data) => {
				if (data) {
					window.alert("Process created successfully");
					Router.back();
				}
			},
			onError: (error) => {
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
			const data = {
				name: name,
				module_id: dataListDropdownModul,
				process_id: dataListDropdownProcess,
				partner_permission_id: dataListDropdownPermission,
				approval_stages: approvalStages.map((dataApprovalStages) => ({
					is_mandatory: dataApprovalStages.is_mandatory,
				})),
				is_email_notification: isSendEmailNotif,
			};
			mutateCreatePartnerConfigApprovalList(data);
		} else {
			window.alert(`field ${isEmptyField} must be fill!`);
		}
	};

	const handleChangeDropdown = (value, name) => {
		if (name === "module") {
			setDataListDropdownModul(value);
		} else if (name === "process") {
			setDataListDropdownProcess(value);
		} else {
			setDataListDropdownPermission(value);
		}
	};

	const handleDirectAssociated = (name) => {
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
			render: (value) => (
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
		let tempApprovalStages = [];

		Array.apply(null, { length: numberOfApprovalStage }).map((data, index) => {
			tempApprovalStages.push({ is_mandatory: false, id: index });
		});

		setApprovalStages(tempApprovalStages);
	}, [numberOfApprovalStage]);

	return (
		<>
			<Col>
				<Row gap="4px">
					<Text variant={"h4"}>Create Approval</Text>
				</Row>
				<Card padding="20px">
					<Row justifyContent="space-between" alignItems="center" nowrap>
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
								<Text variant={"h6"}>Email Notification</Text>
							</div>
						</Row>

						<Row>
							<Row gap="16px">
								<Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
									Cancel
								</Button>
								<Button size="big" variant={"primary"} onClick={handleCreateProcessList}>
									{isLoadingCreatePartnerConfigApprovalList ? "loading..." : "Save"}
								</Button>
							</Row>
						</Row>
					</Row>
				</Card>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
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
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Shipment and Delivery"}
										onChange={handleChangeInput}
									/>
								</Col>
								<Col width="100%">
									<Dropdown
										width="100%"
										label="Module"
										id="Module"
										loading={isLoadingConfigModule}
										items={
											dataConfigsModule &&
											dataConfigsModule?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
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
										label="Process"
										loading={isLoadingFieldListProcess}
										items={
											fieldsListProcess &&
											fieldsListProcess?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
										placeholder={"Select"}
										handleChange={(value) => handleChangeDropdown(value, "process")}
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
										label="Permission"
										loading={isLoadingFieldsPermissionList}
										items={
											fieldsPermissionList &&
											fieldsPermissionList?.rows.map((data) => ({ id: data.id, value: data.name }))
										}
										placeholder={"Select"}
										handleChange={(value) => handleChangeDropdown(value, "permission")}
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

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Approval</Accordion.Header>
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
								<Col width="50%">
									<Input
										id="numberOfApprovalStage"
										width="100%"
										label="How Many Approval Stage?"
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
										{approvalStages.map((data, index) => (
											<Col key={index}>
												<Row alignItems="center">
													<Checkbox
														checked={data.is_mandatory}
														onChange={() => {
															const temp = approvalStages.map((subdata) => {
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
															const temp = approvalStages.map((subdata) => {
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
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">Associated Roles</Accordion.Header>
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

export default CreatePartnerConfigApproval;
