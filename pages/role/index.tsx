import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { Button, Col, Lozenge, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { useDeletePermission, useRolePermissions } from "../../hooks/role/useRole";
import { STATUS_APPROVAL_TEXT, STATUS_APPROVAL_VARIANT } from "../../utils/utils";

const Role: any = () => {
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
	const [modalDetail, setModalDetailOpen] = useState({ open: false });
	const [modalCreate, setModalCreate] = useState({ open: false });
	const [modalDelete, setModalDelete] = useState({ open: false });

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = useRolePermissions({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const { mutate: deleteFields } = useDeletePermission({
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
			title: "Role Name",
			dataIndex: "field_name",
			width: "43%",
		},
		{
			title: "Status",
			dataIndex: "approval_status",
			render: (text) => (
				<Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
			),
			width: "42%",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "15%",
			align: "left",
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			field_name: field.name,
			approval_status: field.status,
			action: (
				<div style={{ display: "flex", justifyContent: "left" }}>
					<Button
						size="small"
						onClick={() => {
							router.push(`/role/${field.id}`);
						}}
						variant="tertiary"
					>
						View Detail
					</Button>
				</div>
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

	return (
		<>
			<Col>
				<Text variant={"h4"}>Role List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							placeholder="Search Role Name"
							onChange={(e) => setSearch(e.target.value)}
						/>
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
									router.push("/role/create");
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
							loading={isLoadingField}
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
					itemTitle={paginateField?.find((role) => role.key === selectedRowKeys[0])?.field_name}
					data={paginateField}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteFields({ id: selectedRowKeys })}
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

export default Role;
