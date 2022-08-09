import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/elements/Modal/ModalConfirmationDelete";
import { useConfigs, useDeleteConfig } from "../../hooks/config/useConfig";

const ModuleConfig: any = () => {
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
	const [parent, setParent] = useState("");

	const {
		data: configs,
		refetch: refetchConfig,
		isLoading: isLoadingConfigs,
	} = useConfigs({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
			parent,
		},
	});

	const { data: parentsData } = useConfigs({
		options: {},
		query: {
			search,
			page: 1,
			limit: 10000,
		},
	});

	const { mutate: deleteConfig } = useDeleteConfig({
		options: {
			onSuccess: () => {
				refetchConfig();
				setModalDelete({ open: false });
			},
		},
	});

	const columns = [
		{
			title: "Module Name",
			dataIndex: "module_name",
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

	const data = [];
	configs?.rows?.map((config: any) => {
		data.push({
			key: config.id,
			module_name: config.name,
			parent: config.parentName || "-",
			action: (
				<Button size="small" onClick={() => router.push(`/module-config/${config.id}`)} variant="tertiary">
					View Detail
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

	const parents = parentsData?.rows?.map((config: any) => ({ id: config.id, value: config.name }));
	if (parents?.length > 0) {
		parents.unshift({ id: "", value: "All" });
	}

	return (
		<>
			<Col>
				<Text variant={"h4"}>Module Config</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Row alignItems="center">
							<Search
								width="380px"
								placeholder="Search Module Name, Parent"
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Spacer size={16} />
							<Text variant="subtitle1" color="black.dark">
								Parent
							</Text>
							<Spacer size={8} />
							<Dropdown
								width="200px"
								label=""
								defaultValue={"All"}
								items={parents}
								placeholder={"Select"}
								handleChange={(value) => setParent(value)}
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
							<Button size="big" variant={"primary"} onClick={() => router.push("/module-config/create")}>
								Create
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table
							loading={isLoadingConfigs}
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
					itemTitle={
						paginateField?.find((config) => config.key === selectedRowKeys[0])?.module_name
					}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteConfig({ id: selectedRowKeys })}
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

export default ModuleConfig;
