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

import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useMenuLists } from "../../../hooks/menu-config/useMenuConfig";
import { usePartnerConfigPermissionLists, useDeletePartnerConfigPermissionList} from "../../../hooks/user-config/usePermission";

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
					<HeaderFilter>
						<Search
							placeholder="Search Permission Name"
							onChange={(e) => setSearch(e.target.value)}
						/>

						<Dropdown
							width="100%"
							allowClear
							onClear={handleClearDropdownMenu}
							loading={isLoadingMenuList}
							items={
								fieldsMenuList &&
								fieldsMenuList?.rows.map((data: any) => ({ id: data.id, value: data.name }))
							}
							placeholder="Menu"
							handleChange={handleChangeDropdownMenu}
							noSearch
							rounded
						/>
						<Dropdown
							width="100%"
							allowClear
							onClear={handleClearDropdownIsSystemConfig}
							handleChange={handleChangeDropdownIsSystemConfig}
							items={valueIsSystemConfig}
							placeholder="Is System Config"
							noSearch
							rounded
						/>
					</HeaderFilter>
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

const HeaderFilter = styled.div`
	display: flex;
	background-color: #fff;
	border-radius: 24px;
	padding: 16px 24px;
	justify-content: space-between;
	gap: 1rem;

`

export default UserConfigPermission;
