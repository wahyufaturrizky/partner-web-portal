import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import { Button, Col, Pagination, Row, Search, Spacer, Spin, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../../components/modals/ModalDeleteConfirmation";
import {
	useTemplateApprovalLists,
	useDeleteTemplateApproval,
} from "../../../hooks/template-approval/useTemplateApproval";
import { COLORS } from "../../../styles/COLOR";

const MenuTemplateConfigApprovalList: any = () => {
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

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = useTemplateApprovalLists({
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

	const { mutate: deleteFields, isLoading: isLoadingDeleteProcessList } = useDeleteTemplateApproval(
		{
			options: {
				onSuccess: () => {
					refetchFields();
					setModalDelete({ open: false });
					setSelectedRowKeys([]);
				},
			},
		}
	);

	const columns = [
		{
			title: "Name",
			dataIndex: "field_name",
		},
		{
			title: "Action",
			dataIndex: "action",
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			field_name: field.name,
			field_module: field?.module?.name,
			action: (
				<Button
					size="small"
					onClick={() => {
						Router.push(`approval/${field.id}`);
					}}
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

	return (
		<>
			<Col>
				<Text variant={"h4"}>Approval Template List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							nameIcon="SearchOutlined"
							placeholder="Search Name"
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
							<Button size="big" variant={"primary"} onClick={() => Router.push("approval/create")}>
								Create
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
					totalSelected={selectedRowKeys?.length}
					itemTitle={paginateField?.find((menu) => menu.key === selectedRowKeys[0])?.field_name}
					visible={modalDelete.open}
					isLoading={isLoadingDeleteProcessList}
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

export default MenuTemplateConfigApprovalList;
