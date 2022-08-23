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
						router.push(`/user-config/permission//${field.id}`);
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
					<Row alignItems="center">
						<Search
							width="380px"
							placeholder="Search Permission Name"
							onChange={(e: any) => setSearch(e.target.value)}
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
							variant={"primary"}
							onClick={() => {
								router.push("/user-config/permission/create");
							}}
						>
							Create
						</Button>
					</Row>
					</HeaderFilter>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table
							loading={isLoadingFields}
							columns={columns}
							data={paginateField}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</Card>
			</Col>
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
