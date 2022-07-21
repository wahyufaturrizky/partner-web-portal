import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import {
	Button,
	Col,
	Dropdown,
	Lozenge,
	Pagination,
	Row,
	Search,
	Spacer,
	Table,
	Text,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { useDeletePermission, usePermissions } from "../../hooks/permission/usePermission";
import { STATUS_APPROVAL_TEXT, STATUS_APPROVAL_VARIANT } from "../../utils/utils";

const Permission: any = () => {
	const router = useRouter();
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [dataListDropdownIsSystemConfig, setDataListDropdownIsSystemConfig] = useState(null);

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

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingFields,
	} = usePermissions({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
			sysConfigSearch: dataListDropdownIsSystemConfig,
		},
	});

	const { mutate: deletePermissions } = useDeletePermission({
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
			title: "Permission Name",
			dataIndex: "field_name",
		},
		{
			title: "System Config",
			dataIndex: "field_is_system_config",
			render: (text) => `${text}`,
		},
		{
			title: "Status",
			dataIndex: "approval_status",
			render: (text) => (
				<Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
			),
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
			field_is_system_config: field.isSystemConfig,
			approval_status: field.status,
			action: (
				<Button
					size="small"
					onClick={() => {
						router.push(`/permission/${field.id}`);
					}}
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

	const handleChangeDropdownIsSystemConfig = (value) => {
		setDataListDropdownIsSystemConfig(value);
	};

	const handleClearDropdownIsSystemConfig = (name) => {
		setDataListDropdownIsSystemConfig(null);
	};

	return (
		<>
			<Col>
				<Text variant={"h4"}>Permission List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Row alignItems="center">
							<Search
								width="380px"
								placeholder="Search Permission Name"
								onChange={(e) => setSearch(e.target.value)}
							/>

							<Spacer size={24} />
							<Text variant="subtitle1" color="black.dark">
								Is system config
							</Text>

							<Spacer size={8} />

							<Dropdown
								width="130px"
								label=""
								allowClear
								onClear={handleClearDropdownIsSystemConfig}
								items={valueIsSystemConfig}
								placeholder={"Select"}
								handleChange={handleChangeDropdownIsSystemConfig}
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
								onClick={() => {
									router.push("/permission/create");
								}}
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
							loading={isLoadingFields}
							columns={columns}
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
					itemTitle={paginateField?.find((config) => config.key === selectedRowKeys[0])?.field_name}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deletePermissions({ id: selectedRowKeys })}
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

export default Permission;
