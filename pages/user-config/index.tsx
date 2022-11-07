import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import usePagination from "@lucasmogari/react-pagination";
import {
  Text,
  Button,
  Col,
  Row,
  Spacer,
  Search,
  Table,
  Pagination,
	DropdownMenu,
  Lozenge } from "pink-lava-ui";

	import DownloadSvg from "../../assets/icons/ic-download.svg";
	import UploadSvg from "../../assets/icons/ic-upload.svg";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { useUsers, useDeleteUser } from "../../hooks/user-config/useUser";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../../utils/constant";
import { lang } from "lang";

const UserConfigUser: any = () => {
	const router = useRouter();
	const t = localStorage.getItem("lan") || "en-US";

	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");
	const [modalDelete, setModalDelete] = useState({ open: false });

	const {
		data: users,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = useUsers({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const { mutate: deleteFields } = useDeleteUser({
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
			title: lang[t].userList.list.table.employeeId,
			dataIndex: "key",
		},
		{
			title: lang[t].userList.list.table.name,
			dataIndex: "name",
		},
		{
			title: lang[t].userList.list.table.status,
			dataIndex: "status",
			render: (text: any) => (
				<Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
			),
		},
		{
			title: lang[t].userList.list.table.action,
			dataIndex: "action",
			width: "20%",
		},
	];

	const data: any = [];
	users?.rows?.map((user: any) => {
		data.push({
			key: user.id,
			name: user.fullname,
			email: user.email,
			role: user?.userRole?.name,
			status: user.status,
			action: (
				<Button
					size="small"
					onClick={() => router.push(`/user-config/${user.id}`)}
					variant="tertiary"
				>
					{lang[t].userList.list.button.detail}
				</Button>
			),
		});
	});

	const paginateField = data;
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const onSelectChange = (selectedRowKeys: any) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	return (
		<>
			<Col>
				<Text variant={"h4"}>{lang[t].userList.list.headerTitle}</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							placeholder={lang[t].userList.list.field.searchBar}
							onChange={(e: any) => setSearch(e.target.value)}
						/>
						<Row gap="16px">
							<Button
								size="big"
								variant={"tertiary"}
								onClick={() => setModalDelete({ open: true })}
								disabled={rowSelection.selectedRowKeys?.length === 0}
							>
								{lang[t].userList.list.button.delete}
							</Button>
							<DropdownMenu
								title={lang[t].userList.list.button.more}
								buttonVariant="secondary"
								buttonSize="big"
								textVariant="button"
								textColor="pink.regular"
								menuList={[
								{
									key: 1,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>{lang[t].userList.list.button.download}</p>
										</div>
									),
								},
								{
									key: 2,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<UploadSvg />
											<p style={{ margin: "0" }}>{lang[t].userList.list.button.upload}</p>
										</div>
									),
								}]}
							/>
							<Button
								size="big"
								variant={"primary"}
								onClick={() => router.push("/user-config/create")}
							>
								{lang[t].userList.list.button.create}
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
					totalSelected={selectedRowKeys.length}
					itemTitle={paginateField?.find((user: any) => user.key === selectedRowKeys[0])?.name}
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

export default UserConfigUser;
