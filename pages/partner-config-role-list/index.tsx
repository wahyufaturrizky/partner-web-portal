import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Table, Pagination, Lozenge } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import {
	usePartnerConfigRoleList,
	useDeletePartnerConfigRole,
} from "../../hooks/partner-config-role-list/usePartnerConfigRoleList";
import { useRouter } from "next/router";

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

	const [isLoading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [modalDelete, setModalDelete] = useState({ open: false });

	const { data: fields, refetch: refetchFields } = usePartnerConfigRoleList({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
				setLoading(false);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const { mutate: deleteFields } = useDeletePartnerConfigRole({
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
			action: (
				<div style={{ display: "flex", justifyContent: "left" }}>
					<Button
						size="small"
						onClick={() => {
							router.push(`/partner-config-role-list/${field.id}`);
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
				<Text variant={"h4"}>Patner Config Role List</Text>
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
									router.push("/partner-config-role-list/create");
								}}
							>
								Create
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				{!isLoading && (
					<Card style={{ padding: "16px 20px" }}>
						<Col gap="60px">
							<Table columns={columns} data={paginateField} rowSelection={rowSelection} />
							<Pagination pagination={pagination} />
						</Col>
					</Card>
				)}
			</Col>

			{modalDelete.open && (
				<ModalDeleteConfirmation
					totalSelected={selectedRowKeys?.length}
					itemTitle={paginateField?.find((role) => role.key === selectedRowKeys[0])?.field_name}
					data={paginateField}
					visible={modalDelete.open}
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

export default Role;
