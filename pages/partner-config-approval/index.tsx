import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import {
	useDeletePartnerConfigApprovalList,
	usePartnerConfigApprovalLists,
} from "../../hooks/partner-config-approval/usePartnerConfigApproval";
import { useProcessLists } from "../../hooks/process/useProcess";
import { COLORS } from "../../styles/COLOR";

const PartnerConfigApprovalList: any = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");
	const [dataListDropdownProcess, setDataListDropdownProcess] = useState(null);
	const [modalDelete, setModalDelete] = useState({ open: false });

	const { data: dataFieldsProcessLists, isLoading: isLoadingieldsProcessLists } = useProcessLists();

	console.log("dataFieldsProcessLists", dataFieldsProcessLists);
	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = usePartnerConfigApprovalLists({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
			process_id: dataListDropdownProcess,
		},
	});

	const { mutate: deleteFields, isLoading: isLoadingDeleteProcessList } =
		useDeletePartnerConfigApprovalList({
			options: {
				onSuccess: () => {
					refetchFields();
					setModalDelete({ open: false });
					setSelectedRowKeys([]);
				},
			},
		});

	const columns = [
		{
			title: "Approval Name",
			dataIndex: "field_name",
		},
		{
			title: "Process",
			dataIndex: "",
		},
		{
			title: "Module",
			dataIndex: "field_module",
		},
		{
			title: "Action",
			dataIndex: "action",
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			field_name: field.name,
			field_module: field?.module?.name,
			action: (
				<Button
					size="small"
					onClick={() => Router.push(`/partner-config-approval/${field.id}`)}
					variant="tertiary"
				>
					View Detail
				</Button>
			),
		});
	});

	const paginateField = data;
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleChangeDropdown = (value) => {
		setDataListDropdownProcess(value);
	};

	const handleClearDropdownApproval = () => {
		setDataListDropdownProcess(null);
	};

	return (
		<>
			<Col>
				<Text variant={"h4"}>Partner Config Approval List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Row alignItems="center">
							<Search
								width="380px"
								nameIcon="SearchOutlined"
								placeholder="Search Approval Name"
								colorIcon={COLORS.grey.regular}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Spacer size={16} />
							<Text variant="subtitle1" color="black.dark">
								Process
							</Text>
							<Spacer size={8} />
							<Dropdown
								width="200px"
								label=""
								allowClear
								onClear={handleClearDropdownApproval}
								loading={isLoadingieldsProcessLists}
								items={
									dataFieldsProcessLists &&
									dataFieldsProcessLists?.rows.map((data) => ({ id: data.id, value: data.name }))
								}
								placeholder={"Select"}
								handleChange={handleChangeDropdown}
								noSearch
								rounded
							/>
						</Row>
						<Row gap="16px">
							<Button
								size="big"
								variant={"tertiary"}
								onClick={() => setModalDelete({ open: true })}
								disabled={rowSelection.selectedRowKeys?.length === 0}
							>
								Delete
							</Button>
							<Button
								size="big"
								variant={"primary"}
								onClick={() => Router.push("/partner-config-approval/create")}
							>
								Create
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table
							loading={isLoadingField}
							columns={columns.filter(
								(filtering) =>
									filtering.dataIndex !== "id" &&
									filtering.dataIndex !== "created_at" &&
									filtering.dataIndex !== "modified_by" &&
									filtering.dataIndex !== "modified_at" &&
									filtering.dataIndex !== "deleted_by" &&
									filtering.dataIndex !== "deleted_at" &&
									filtering.dataIndex !== "created_by"
							)}
							data={paginateField}
							rowSelection={rowSelection}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</Card>
			</Col>

			{modalDelete.open && (
				<ModalDeleteConfirmation
					totalSelected={selectedRowKeys?.length}
					itemTitle={paginateField?.find((menu) => menu.key === selectedRowKeys[0])?.field_name}
					visible={modalDelete.open}
					isLoading={isLoadingDeleteProcessList}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteFields({ ids: selectedRowKeys })}
				/>
			)}
		</>
	);
};

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

export default PartnerConfigApprovalList;
