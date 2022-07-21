import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import { Button, Col, Pagination, Row, Search, Spacer, Table, Tabs, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { useDeleteMenuList, useMenuLists } from "../../hooks/menu-list/useMenuList";
import { COLORS } from "../../styles/COLOR";

const MenuList: any = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");
	const [defaultActiveKey, setDefaultActiveKey] = useState("All");
	const [modalDelete, setModalDelete] = useState({ open: false });

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = useMenuLists({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query:
			defaultActiveKey === "All"
				? {
						search,
						page: pagination.page,
						limit: pagination.itemsPerPage,
				  }
				: {
						search,
						page: pagination.page,
						limit: pagination.itemsPerPage,
						type: defaultActiveKey === "Menu" ? "menu" : "process",
				  },
	});

	const { mutate: deleteFields } = useDeleteMenuList({
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
			title: "Menu Name",
			dataIndex: "field_name",
			width: "43%",
		},
		{
			title: "Type",
			dataIndex: "field_type",
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
			field_type: field.type,
			action: (
				<Button
					size="small"
					onClick={() =>
						Router.push({
							pathname: "/menu-list/detail",
							query: field,
						})
					}
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

	const handleChangeTabs = (e) => {
		setDefaultActiveKey(e);
	};

	const listTab = [
		{
			title: "All",
		},
		{
			title: "Menu",
		},
		{
			title: "Process",
		},
	];

	return (
		<>
			<Col>
				<Text variant={"h4"}>Menu List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							nameIcon="SearchOutlined"
							placeholder="Search Menu Name"
							colorIcon={COLORS.grey.regular}
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
								onClick={() => Router.push("/menu-list/create")}
							>
								Create
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Tabs
						defaultActiveKey={defaultActiveKey}
						listTabPane={listTab}
						onChange={handleChangeTabs}
					/>
					<Col gap="60px">
						<Table
							loading={isLoadingField}
							columns={columns.filter(
								(filtering) =>
									filtering.dataIndex !== "id" &&
									filtering.dataIndex !== "screen" &&
									filtering.dataIndex !== "created_at" &&
									filtering.dataIndex !== "modified_by" &&
									filtering.dataIndex !== "modified_at" &&
									filtering.dataIndex !== "deleted_by" &&
									filtering.dataIndex !== "deleted_at" &&
									filtering.dataIndex !== "process_name" &&
									filtering.dataIndex !== "created_by"
							)}
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
					itemTitle={paginateField?.find((menu) => menu.key === selectedRowKeys[0])?.field_name}
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

export default MenuList;
