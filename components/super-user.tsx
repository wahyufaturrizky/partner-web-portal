import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { Row, Search, Button, Col, Pagination, Table, Lozenge, Text, Spacer } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import {
	useApprovalSuperUsers,
	useApproveSuperUser,
	useSuperUsers,
} from "../hooks/super-user/useSuperUser";
import { queryClient } from "../pages/_app";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../utils/utils";
import { ModalRejectSuperUser } from "./modals/ModalRejectSuperUser";

const SuperUser: any = () => {
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
	const [isLoading, setLoading] = useState(true);
	const [modalReject, setModalReject] = useState({ open: false });

	const { data: users, refetch: refetchFields } = useApprovalSuperUsers({
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

	const { mutate: approveSuperUser } = useApproveSuperUser({
		options: {
			onSuccess: () => {
				queryClient.refetchQueries(["approval-super-users"]);
			},
		},
	});

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			width: "16%",
		},
		{
			title: "Email",
			dataIndex: "email",
			width: "16%",
		},
		{
			title: "Role",
			dataIndex: "role",
			width: "16%",
		},
		{
			title: "Partner",
			dataIndex: "partner",
			width: "16%",
		},
		{
			title: "Status",
			dataIndex: "status",
			render: (text) => (
				<Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
			),
			width: "16%",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "16%",
		},
	];

	const data = [];
	users?.rows?.map((user) => {
		data.push({
			key: user.id,
			name: user.fullname,
			email: user.email,
			role: user?.userRole?.name,
			partner: user.partner,
			status: user.status,
			action: (
				<Button
					size="small"
					onClick={() => router.push(`/approval/super-user/${user.id}`)}
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
		approveSuperUser(payload);
		setSelectedRowKeys([]);
	};

	const reject = (data) => {
		approveSuperUser(data);
		setModalReject({ open: false });
		setSelectedRowKeys([]);
	};

	return (
		<>
			<Card>
				<Row justifyContent="space-between">
					<Search
						width="450px"
						placeholder="Search Name, Email, Role, Partner, Status"
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
							Total Waiting for Approval : {users?.totalRow}{" "}
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
				<ModalRejectSuperUser
					visible={modalReject.open}
					onCancel={() => setModalReject({ open: false })}
					onOk={(data) => reject(data)}
					userIds={selectedRowKeys}
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

export default SuperUser;
