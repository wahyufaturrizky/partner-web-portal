import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import {
	Accordion,
	Button,
	Col,
	Dropdown,
	Input,
	Modal,
	Pagination,
	Row,
	Search,
	Spacer,
	Table,
	Text,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { useConfigs } from "../../../hooks/config/useConfig";
import { useRolePermissions } from "../../../hooks/role/useRole";
import { useCreateTemplateRoleList } from "../../../hooks/template-role/useTemplateRole";

export interface ConfigModuleList {}

const CreateMenuTemplateConfigRoleList: any = () => {
	const [dataListStatus, setDataListStatus] = useState(1);
	const [searchTemplate, setSearchTemplate] = useState("");
	const [dataTemplateFieldRole, setDataTemplateFieldRole] = useState([]);
	const [selectedRowKeysTableTemplateField, setSelectedRowKeysTableTemplateField] = useState([]);
	const [selectedRowTableTemplateField, setSelectedRowTableTemplateField] = useState([]);
	const [selectedTemplateFieldRowKeys, setSelectedTemplateFieldRowKeys] = useState([]);
	const [stateFieldInput, setStateFieldInput] = useState({
		name: "",
	});
	const { name } = stateFieldInput;
	const [stateModal, setStateModal] = useState({
		isShowModal: false,
		titleModal: "",
		dataModal: null,
		widthModal: null,
	});
	const { isShowModal, titleModal, dataModal, widthModal } = stateModal;
	const paginationTableTemplate = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const handleChangeInput = (e) => {
		setStateFieldInput({
			...stateFieldInput,
			[e.target.id]: e.target.value,
		});
	};

	const { mutate: createTemplateRoleList, isLoading: isLoadingCreateTemplateRoleList } =
		useCreateTemplateRoleList({
			options: {
				onSuccess: (data) => {
					if (data) {
						window.alert("template role created successfully");
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

	const {
		data: dataConfigsModule,
		refetch: refetchConfigModule,
		isLoading: isLoadingConfigModule,
	} = useConfigs();

	const {
		data: tableFieldRolesData,
		refetch: refetchFieldRolesData,
		isLoading: isLoadingRolesData,
	} = useRolePermissions({
		options: {
			onSuccess: (data) => {
				paginationTableTemplate.setTotalItems(data.totalRow);
			},
		},
		query: {
			search: searchTemplate,
			page: paginationTableTemplate.page,
			limit: paginationTableTemplate.itemsPerPage,
		},
	});

	const dataTableRolesField = [];
	tableFieldRolesData?.rows?.map((field) => {
		dataTableRolesField.push({
			key: field.id,
			field_id: field.id,
			field_name: field.name,
			field_key: field.id,
		});
	});

	const paginateTableTemplateRolesField = dataTableRolesField;

	const handleCreateProcessList = () => {
		const isEmptyField = Object.keys(stateFieldInput).find(
			(thereIsEmptyField) => stateFieldInput && stateFieldInput[thereIsEmptyField] === ""
		);

		if (!isEmptyField) {
			if (dataTemplateFieldRole.length !== 0) {
				const data = {
					name: name,
					status: dataListStatus === 1 ? "DRAFT" : "PUBLISH",
					roles: dataTemplateFieldRole.map((data) => data.key),
				};
				createTemplateRoleList(data);
			} else {
				window.alert("data copy role of template can't be empty");
			}
		} else {
			window.alert(`field ${isEmptyField} must be fill!`);
		}
	};

	const handleChangeDropdownStatus = (value) => {
		setDataListStatus(value);
	};

	const columns = [
		{
			title: "Template",
			dataIndex: "template_role_field",
		},
	];

	const onSelectChangeTableTemplateField = (value, rowSelected) => {
		setSelectedRowKeysTableTemplateField(value);
		setSelectedRowTableTemplateField(rowSelected);
	};

	const rowSelectionTableTemplateRoleField = {
		selectedRowKeys: selectedRowKeysTableTemplateField,
		onChange: onSelectChangeTableTemplateField,
	};

	const onSelectChangeTemplateField = (value) => {
		setSelectedTemplateFieldRowKeys(value);
	};

	const rowSelectionTemplateField = {
		selectedRowKeys: selectedTemplateFieldRowKeys,
		onChange: onSelectChangeTemplateField,
	};

	const handleRemoveTemplateField = () => {
		let tempDataTemplateList = [];

		tempDataTemplateList = dataTemplateFieldRole?.filter(
			(field) => !rowSelectionTemplateField.selectedRowKeys.includes(field.key)
		);

		onSelectChangeTableTemplateField(tempDataTemplateList.map((data) => data.key));
		setDataTemplateFieldRole(tempDataTemplateList);
	};

	const columnsTableTemplateRoleField = [
		{
			title: "Field Name",
			dataIndex: "field_name",
		},
	];

	const handleSelectedField = () => {
		const tempDataTemplateRole = [];
		dataTableRolesField?.map((field) => {
			if (rowSelectionTableTemplateRoleField.selectedRowKeys.includes(field.key)) {
				tempDataTemplateRole.push({
					key: field.key,
					template_role_field: field.field_name,
					template_role_field_id: field.field_id,
					template_role_field_key: field.field_key,
				});

				setDataTemplateFieldRole(tempDataTemplateRole);
				setStateModal({ ...stateModal, isShowModal: false });
			} else {
				setDataTemplateFieldRole(
					selectedRowTableTemplateField.map((data) => ({
						template_role_field: data.field_name,
						template_role_field_id: data.key,
						key: data.key,
					}))
				);
				setStateModal({ ...stateModal, isShowModal: false });
			}
		});
	};

	return (
		<>
			<Col>
				<Row gap="4px">
					<Text variant={"h4"}>Role Template List</Text>
				</Row>
				<Card padding="20px">
					<Row justifyContent="space-between" alignItems="center" nowrap>
						<Dropdown
							width="185px"
							label=""
							allowClear
							loading={isLoadingConfigModule}
							items={[
								{ id: 1, value: "Draft" },
								{ id: 2, value: "Published" },
							]}
							defaultValue="Draft"
							placeholder={"Select"}
							handleChange={handleChangeDropdownStatus}
							noSearch
						/>
						<Row gap="16px">
							<Button size="big" variant={"tertiary"} onClick={() => Router.back()}>
								Cancel
							</Button>
							<Button size="big" variant={"primary"} onClick={handleCreateProcessList}>
								{isLoadingCreateTemplateRoleList ? "loading..." : "Save"}
							</Button>
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
							<Row width="50%" gap="20px" noWrap>
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
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">
							<Row gap="8px" alignItems="baseline">
								Role
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							<Row justifyContent="space-between">
								<Search
									width="380px"
									placeholder="Search Menu Name"
									onChange={(e) => setSearchTemplate(e.target.value)}
								/>
								<Row gap="16px">
									<Button size="big" variant={"tertiary"} onClick={handleRemoveTemplateField}>
										Remove
									</Button>
									<Button
										size="big"
										variant={"primary"}
										onClick={() =>
											setStateModal({
												...stateModal,
												isShowModal: true,
												titleModal: "Create Template Role",
												widthModal: 1000,
											})
										}
									>
										Copy from another template
									</Button>
								</Row>
							</Row>
							<Spacer size={10} />
							<Table
								columns={columns}
								data={dataTemplateFieldRole}
								rowSelection={rowSelectionTemplateField}
							/>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>

			<Modal
				width={widthModal}
				visible={isShowModal}
				onCancel={() => setStateModal({ ...stateModal, isShowModal: false })}
				title={titleModal}
				footer={
					<div
						style={{
							display: "flex",
							marginBottom: "12px",
							marginRight: "12px",
							justifyContent: "flex-end",
							gap: "12px",
						}}
					>
						<Button
							onClick={() => setStateModal({ ...stateModal, isShowModal: false })}
							variant="tertiary"
							size="big"
						>
							Cancel
						</Button>
						<Button onClick={handleSelectedField} variant="primary" size="big">
							{"Add"}
						</Button>
					</div>
				}
				content={
					<>
						<Spacer size={10} />
						<Table
							columns={columnsTableTemplateRoleField.filter(
								(filtering) => filtering.dataIndex !== "field_key"
							)}
							data={paginateTableTemplateRolesField}
							rowSelection={rowSelectionTableTemplateRoleField}
						/>
						<Pagination pagination={paginationTableTemplate} />
						<Spacer size={14} />
					</>
				}
			/>
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

export default CreateMenuTemplateConfigRoleList;
