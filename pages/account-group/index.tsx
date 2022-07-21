import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Dropdown, Table, Pagination } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { ModalCreateAccountGroup } from "../../components/modals/ModalCreateAccountGroup";
import { ModalDetailAccountGroup } from "../../components/modals/ModalDetailAccountGroup";
import {
	useAccountGroups,
	useCreateAccountGroup,
	useDeleteAccountGroup,
	useUpdateAccountGroup,
} from "../../hooks/account-group/useAccountGroup";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";

const AccountGroup: any = () => {
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
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [modalDetail, setModalDetail] = useState({ open: false });
	const [modalCreate, setModalCreate] = useState({ open: false });
	const [modalDelete, setModalDelete] = useState({ open: false });

	const columns = [
		{
			title: "Account Group ID",
			dataIndex: "account_group_id",
		},
		{
			title: "Account Group Name",
			dataIndex: "account_group_name",
		},
		{
			title: "Parent",
			dataIndex: "parent",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: 160,
		},
	];

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const {
		data: accountGroup,
		refetch: refetchAccountGroup,
		isLoading: isLoadingAccountGroup,
	} = useAccountGroups({
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

	const { mutate: createAccountGroup } = useCreateAccountGroup({
		options: {
			onSuccess: (data) => {
				if (data) {
					refetchAccountGroup();
					setModalCreate({ open: false });
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

	const { mutate: deleteAccountGroup } = useDeleteAccountGroup({
		options: {
			onSuccess: () => {
				refetchAccountGroup();
				setModalDelete({ open: false });
				setSelectedRowKeys([]);
			},
			onError: (error) => {
				alert(error?.message);
			},
		},
	});

	const { mutate: updateAccountGroup } = useUpdateAccountGroup({
		accountGroupId: modalDetail?.data?.id ?? null,
		options: {
			onSuccess: () => {
				refetchAccountGroup();
				setModalDetail({ open: false });
			},
		},
	});

	const data = [];
	accountGroup?.rows?.map((account) => {
		data.push({
			key: account.id,
			account_group_id: account.id,
			account_group_name: account.groupName,
			parent: account?.parents?.groupName ?? "-",
			action: (
				<Button
					size="small"
					onClick={() => setModalDetail({ open: true, data: account })}
					variant="tertiary"
				>
					View Detail
				</Button>
			),
		});
	});

	const paginateField = data;

	return (
		<>
			<Col>
				<Text variant={"h4"}>Account Group</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Row alignItems="center">
							<Search
								width="380px"
								placeholder="Search Account Group ID, Name, Parent"
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Spacer size={16} />
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
							<Button size="big" variant={"primary"} onClick={() => setModalCreate({ open: true })}>
								Create
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table
							loading={isLoadingAccountGroup}
							columns={columns}
							data={paginateField}
							rowSelection={rowSelection}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</Card>
			</Col>

			{modalDetail.open && (
				<ModalDetailAccountGroup
					visible={modalDetail.open}
					defaultValue={modalDetail.data}
					onCancel={() => setModalDetail({ open: false })}
					onOk={(data) => updateAccountGroup(data)}
					// error={errorUpdate}
				/>
			)}

			{modalCreate.open && (
				<ModalCreateAccountGroup
					visible={modalCreate.open}
					onCancel={() => setModalCreate({ open: false })}
					onOk={(data) => createAccountGroup(data)}
					// error={error}
				/>
			)}

			{modalDelete.open && (
				<ModalDeleteConfirmation
					totalSelected={selectedRowKeys.length}
					itemTitle={
						paginateField?.find((field) => field.account_group_id === selectedRowKeys[0])
							?.account_group_name
					}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteAccountGroup({ ids: selectedRowKeys })}
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

export default AccountGroup;
