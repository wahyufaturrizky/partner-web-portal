import router from "next/router";
import {
	Accordion,
	Button,
	Col,
	Dropdown,
	Input,
	Modal,
	Row,
	Search,
	Spacer,
	Text,
	AccordionCheckbox,
	Table,
	Pagination,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import {
	useTemplateApproval,
	useCreateTemplateApproval,
	useTemplateApprovalLists,
	useFilterOptionApproval,
} from "../../../hooks/template-approval/useTemplateApproval";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import usePagination from "@lucasmogari/react-pagination";
import toast from "react-hot-toast";
import _, { forEach } from "lodash";

const schema = yup
	.object({
		name: yup.string().required("Name is Required"),
	})
	.required();

const CreateTemplateConfigApprovalList: any = () => {
	const [name, setName] = useState("");
	const [dropdownData, setDropdownData] = useState([]);
	const [dataStatus, setDataStatus] = useState();
	const [approvalIds, setApprovalIds] = useState([]);
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
	const [selectedRowKeysTableTemplateField, setSelectedRowKeysTableTemplateField] = useState(0);
	const [selectedRowTableTemplateField, setSelectedRowTableTemplateField] = useState([]);
	const [searchTemplate, setSearchTemplate] = useState("");
	const [selectedChecboxes, setSelectedChecboxes] = useState([])

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const publishStatus = [
		{ id: "PUBLISH", value: '<div key="published" style="color:green;">Published</div>' },
		{ id: "DRAFT", value: '<div key="draft" style="color:red;">Draft</div>' },
	];

	const handleChangeDropdownStatus = (value: any) => {
		setDataStatus(value);
	};

	const columnsTableTemplateApprovalField = [
		{
			title: "Field Name",
			dataIndex: "field_name",
		},
	];

	const { data: tableFieldApprovalData, isLoading: isLoadingApprovalData } =
		useTemplateApprovalLists({
			options: {
				onSuccess: (data) => {
					paginationTableTemplate.setTotalItems(data.totalRow);
				},
			},
			query: {
				// search: searchTemplate,
				page: paginationTableTemplate.page,
				limit: paginationTableTemplate.itemsPerPage,
			},
		});

	const dataTableApprovalField: any = [];
	tableFieldApprovalData?.rows?.map((field) => {
		dataTableApprovalField.push({
			key: field.id,
			field_id: field.id,
			field_name: field.name,
			field_key: field.id,
		});
	});
	const paginateTableTemplateRolesField = dataTableApprovalField;

	const onSelectChangeTableTemplateField = (value, rowSelected) => {
		setSelectedRowKeysTableTemplateField(value);
		setSelectedRowTableTemplateField(rowSelected);
	};

	const rowSelectionTableTemplateApprovalField = {
		type: "radio",
		selectedRowKeys: selectedRowKeysTableTemplateField,
		onChange: onSelectChangeTableTemplateField,
	};

	let id = 0;
	const { data: listDropdown, isLoading } = useTemplateApproval({
		id,
		options: {
			onSuccess: (data: any) => {
				setValue("name", data.name);
				setName(data.name);
				setDataStatus(data.status);
				let initDataDrop: any = [];
				let newSelectedChecboxes:any = [];
				data?.options.forEach((item) => {
					const obj = {
						name: item.name,
						list: [],
					};
					item.list.forEach((val) => {
						if (val.status) {
							obj.list.push(val.id);
						}
					});
					newSelectedChecboxes.push(obj);
					initDataDrop.push(item);
				});
				setSelectedChecboxes(newSelectedChecboxes)
				setDropdownData(initDataDrop);
			},
		},
	});

	const onSubmit = (data: any) => {
		let newArrCheckboxes: any = [];

		selectedChecboxes.forEach((item: any) => {
			item?.list.forEach((val: any) => {
				newArrCheckboxes.push(val);
			});
		});

		const payload = {
			...data,
			options: newArrCheckboxes,
			status: dataStatus,
		};
		if (payload.options.length == 0) {
			toast.error("Pilih checkbox terlebih dahulu");
			return;
		}
		createTemplateApproval(payload);
	};

	const { mutate: createTemplateApproval } = useCreateTemplateApproval({
		options: {
			onSuccess: () => {
				toast.success("template approval created successfully");
				router.back();
			},
		},
	});

	id = selectedRowKeysTableTemplateField;
	const {
		data: oneDropdown,
		refetch: refetchDropdown,
		isLoading: isLoadingCopyTemplate,
		isRefetching: isRefetchingCopyTemplate
	} = useTemplateApproval({
		id,
		options: {
			enabled: false,
			onSuccess: (data: any) => {
				let secondDataDrop: any = [];
				let newAppIds: any = [];
				let newSelectedChecboxes:any = [];
				data?.options.forEach((item) => {
					secondDataDrop.push(item);
					const obj = {
						name: item.name,
						list: [],
					};
					item.list.forEach((val) => {
						if (val.status) {
							obj.list.push(val.id);
							newAppIds.push(val.id);
						}
					});
					newSelectedChecboxes.push(obj);
				});
				setSelectedChecboxes(newSelectedChecboxes)
				setApprovalIds(newAppIds);
				setDropdownData(secondDataDrop);
			},
		},
	});

	let filter = searchTemplate;
	const {
		data: dropdownFilter,
		refetch: refetchDropdownFilter,
		isLoading: isLoadingDropdownFilter,
		isRefetching: isRefetchingDropdownFilter
	} = useFilterOptionApproval({
		id,
		filter,
		options: {
			enabled: false,
			onSuccess: (data: any) => {
				let secondDataDrop: any = [];
				data?.options.forEach((item) => {
					secondDataDrop.push(item);
				});
				setDropdownData(secondDataDrop);
			},
		},
	});
	
	const onChangeCheckbox = (newData, name) => {
		const indexName = selectedChecboxes.findIndex((item) => item.name == name);
		selectedChecboxes[indexName].list = newData;
		
		let newArrCheckboxes: any = [];

		selectedChecboxes.forEach((item: any) => {
			item?.list.forEach((val: any) => {
				newArrCheckboxes.push(val);
			});
		});
		setApprovalIds(newArrCheckboxes)
	};

	const handleAddCopyTemplate = () => {
		refetchDropdown();
		setStateModal({ ...stateModal, isShowModal: false });
	};

	const handleSearchFilter = async (e) => {
		await setSearchTemplate(e);
		refetchDropdownFilter();
	};

	return (
		<>
			<Col>
				<Row gap="4px">
					<Text variant={"h4"}>{name}</Text>
				</Row>
				<Card padding="20px">
					<Row justifyContent="space-between" alignItems="center" nowrap>
						{!isLoading && (
							<Dropdown
								width="185px"
								label=""
								isHtml
								loading={isLoading}
								items={publishStatus}
								placeholder={"Select"}
								handleChange={(value) => setDataStatus(value)}
								noSearch
								defaultValue={dataStatus}
							/>
						)}
						<Row gap="16px">
							<Button size="big" variant={"tertiary"} onClick={() => router.back()}>
								Cancel
							</Button>
							<Button size="big" variant={"primary"} onClick={handleSubmit(onSubmit)}>
								Save
							</Button>
						</Row>
					</Row>
				</Card>

				<Spacer size={20} />

				<Accordion>
					<Accordion.Item key={1}>
						<Accordion.Header variant="blue">General</Accordion.Header>
						<Accordion.Body>
							<Row width="50%" gap="20px" noWrap>
								<Col width="100%">
									<Input
										id="name"
										width="100%"
										label="Name"
										height="48px"
										placeholder={"e.g Approval Indonesia - FMCG Retail"}
										{...register("name", { required: true })}
										error={errors?.name?.message}
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
								Approval
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							<Row justifyContent="space-between">
								<Search
									width="380px"
									placeholder="Search Menu Name"
									// onChange={(e) => setSearchTemplate(e.target.value)}
									onChange={(e) => handleSearchFilter(e.target.value)}
								/>
								<Row gap="16px">
									<Button
										size="big"
										variant={"primary"}
										onClick={() =>
											setStateModal({
												...stateModal,
												isShowModal: true,
												titleModal: "Create Template Approval",
												widthModal: 1000,
											})
										}
									>
										Copy from another template
									</Button>
								</Row>
							</Row>
							<Spacer size={10} />
							{!isLoading &&
								!isLoadingCopyTemplate &&
								!isLoadingDropdownFilter &&
								!isRefetchingCopyTemplate &&
								!isRefetchingDropdownFilter &&
								dropdownData.map((menu, idx) => (
									<div key={menu.name}>
										<Spacer size={20} />
										<AccordionCheckbox
											key={menu.name}
											lists={menu?.list?.map((item) => ({
												id: item?.id,
												value: item?.name,
											}))}
											name={menu.name}
											checked={approvalIds}
											onChange={(newData) => {
												onChangeCheckbox(newData, menu.name)
											}}
										/>
									</div>
								))}
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
						<Button onClick={() => handleAddCopyTemplate()} variant="primary" size="big">
							{"Add"}
						</Button>
					</div>
				}
				content={
					<>
						<Spacer size={10} />
						<Table
							columns={columnsTableTemplateApprovalField}
							data={paginateTableTemplateRolesField}
							rowSelection={rowSelectionTableTemplateApprovalField}
						/>
						{!isLoadingApprovalData && <Pagination pagination={paginationTableTemplate} />}
						<Spacer size={14} />
					</>
				}
			/>
		</>
	);
};

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: ${(p) => (p.padding ? p.padding : "16px")};
`;

export default CreateTemplateConfigApprovalList;
