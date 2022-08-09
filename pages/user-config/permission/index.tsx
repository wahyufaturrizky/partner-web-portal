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
	Lozenge,
	Dropdown,
} from "pink-lava-ui";

import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../../../utils/constant";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import {
  usePartnerConfigPermissionLists,
	useDeletePartnerConfigPermissionList,
} from "../../../hooks/user-config/usePermission";
import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";

const UserConfigPermission: any = () => {
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
	const [dataListDropdownMenu, setDataListDropdownMenu] = useState(null);
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

	const { data: fieldsMenuList, isLoading: isLoadingMenuList } = useMenuLists({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
	});

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingFields,
	} = usePartnerConfigPermissionLists({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
			sysConfigSearch: dataListDropdownIsSystemConfig,
			menuId: dataListDropdownMenu,
		},
	});

	const { mutate: deletePermissions } = useDeletePartnerConfigPermissionList({
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
			title: "Associated Menu",
			dataIndex: "field_menu",
			render: (text: any) => text.name,
		},
		{
			title: "System Config",
			dataIndex: "field_is_system_config",
			render: (text: any) => `${text}`,
		},
		{
			title: "Status",
			dataIndex: "approval_status",
			render: (text: any) => (
				<Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
			),
		},
		{
			title: "Action",
			dataIndex: "action",
		},
	];

	const data: any[] = [];
	fields?.rows?.map((field: any) => {
		data.push({
			key: field.id,
			field_name: field.name,
			field_menu: field.menu,
			field_is_system_config: field.isSystemConfig,
			approval_status: field.status,
			action: (
				<Button
					size="small"
					onClick={() => {
						router.push(`/partner-config-permission-list/${field.id}`);
					}}
					variant="tertiary"
				>
					View Detail
				</Button>
			),
		});
	});

	const paginateField: any = data;
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const onSelectChange = (selectedRowKeys: any) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleChangeDropdownMenu = (value: any) => {
		setDataListDropdownMenu(value);
	};

	const handleClearDropdownMenu = (name: any) => {
		setDataListDropdownMenu(null);
	};

	const handleChangeDropdownIsSystemConfig = (value: any) => {
		setDataListDropdownIsSystemConfig(value);
	};

	const handleClearDropdownIsSystemConfig = (name: any) => {
		setDataListDropdownIsSystemConfig(null);
	};

	return (
		<>
			<Col>
				<Text variant={"h4"}>Partner Config Permission List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Row alignItems="center">
							<Search
								width="380px"
								placeholder="Search Permission Name"
								onChange={(e) => setSearch(e.target.value)}
							/>

							<Spacer size={8} />
							<Text variant="subtitle1" color="black.dark">
								Menu
							</Text>

							<Spacer size={8} />

							<Dropdown
								width="130px"
								label=""
								allowClear
								onClear={handleClearDropdownMenu}
								loading={isLoadingMenuList}
								items={
									fieldsMenuList &&
									fieldsMenuList?.rows.map((data: any) => ({ id: data.id, value: data.name }))
								}
								placeholder={"Select"}
								handleChange={handleChangeDropdownMenu}
								noSearch
								rounded
							/>

							<Spacer size={8} />
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
									router.push("/user-config/permission/create");
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
					itemTitle={paginateField?.find((config: any) => config.key === selectedRowKeys[0])?.field_name}
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

export default UserConfigPermission;
