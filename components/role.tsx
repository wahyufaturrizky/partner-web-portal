import React, { useState } from "react";
import styled from "styled-components";
import { Row, Search, Text, Button, Col, Spacer, Table, Pagination, Lozenge } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useApprovalRolePermissions, useApproveRolePermission } from "../hooks/role/useRole";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../utils/utils";
import { queryClient } from "../pages/_app";
import { useRouter } from "next/router";
import { ModalRejectRole } from "./modals/ModalRejectRole";

const Role: any = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});
	const router = useRouter();

	const [search, setSearch] = useState("");
	const [isLoading, setLoading] = useState(true);
	const [modalReject, setModalReject] = useState({ open: false });

	const { data: fields, refetch: refetchFields } = useApprovalRolePermissions({
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

	const { mutate: approveRolePermission } = useApproveRolePermission({
		options: {
			onSuccess: () => {
				queryClient.refetchQueries(["approval-role-permissions"]);
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
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			field_name: field.name,
			approval_status: field.status,
			action: (
				<Button
					size="small"
					onClick={() => router.push(`/approval/role/${field.id}`)}
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

	const approve = () => {
		const payload = {
			ids: selectedRowKeys,
			approvalStatus: "APPROVED",
		};
		approveRolePermission(payload);
		setSelectedRowKeys([]);
	};

	const reject = (data) => {
		approveRolePermission(data);
		setModalReject({ open: false });
		setSelectedRowKeys([]);
	};

	return (
		<>
			<Card>
				<Row justifyContent="space-between">
					<Search
						width="450px"
						placeholder="Search Role Name"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Row gap="16px">
						<Button
							size="big"
							variant={"tertiary"}
							onClick={() => setModalReject({ open: true })}
							disabled={selectedRowKeys?.length < 1}
						>
							Reject
						</Button>
						<Button
							disabled={selectedRowKeys?.length < 1}
							size="big"
							variant={"primary"}
							onClick={approve}
						>
							Approve
						</Button>
					</Row>
				</Row>
			</Card>
			<Spacer size={10} />
			<Col>
				{!isLoading && (
					<Card style={{ padding: "16px 20px" }}>
						<Text variant="headingRegular" color="blue.darker">
							Total Waiting for Approval : {fields?.totalRow}{" "}
						</Text>
						<Spacer size={20} />
						<Col gap="60px">
							<Table columns={columns} data={paginateField} rowSelection={rowSelection} />
							<Pagination pagination={pagination} />
						</Col>
					</Card>
				)}
			</Col>
			<Spacer size={10} />
			{modalReject.open && (
				<ModalRejectRole
					visible={modalReject.open}
					onCancel={() => setModalReject({ open: false })}
					onOk={(data) => reject(data)}
					roleIds={selectedRowKeys}
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
