import React, { useState } from "react";
import styled from "styled-components";
import {
	Text,
	Button,
	Spin,
	Col,
	Row,
	Spacer,
	Search,
	Table,
	Pagination,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { useRouter } from "next/router";
import { useCoa, useDeleteCoa } from "../../../hooks/finance-config/useCoaTemplate";

const FinanceConfigCoATemplate: any = () => {
	const router = useRouter();

	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [isLoading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [modalDelete, setModalDelete] = useState({ open: false });

	const columns = [
		{
			title: "Name",
			dataIndex: "field_name",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "15%",
			align: "left",
		},
	];

	const { data: fields, refetch: refetchFields } = useCoa({
		options: {
			onSuccess: (data: any) => {
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

	const { mutate: deleteFields } = useDeleteCoa({
		options: {
			onSuccess: () => {
				refetchFields();
				setModalDelete({ open: false });
			},
		},
	});

	const data: any = [];
	fields?.rows?.map((field: any) => {
		data.push({
			key: field.id,
			field_name: field.name,
			approval_status: field.status,
			action: (
				<div style={{ display: "flex", justifyContent: "left" }}>
					<Button
						size="small"
						onClick={() => {
							router.push(`/coa-template/${field.id}`);
						}}
						variant="tertiary"
					>
						View Detail
					</Button>
				</div>
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
			{isLoading ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Text variant={"h4"}>CoA Template</Text>
					<Spacer size={20} />
					<Card>
						<Row justifyContent="space-between">
							<Search
								width="380px"
								placeholder="Search Name"
								onChange={(e: any) => setSearch(e.target.value)}
							/>
							<Row gap="16px">
								<Button
									size="big"
									variant="tertiary"
									onClick={() => setModalDelete({ open: true })}
									disabled={rowSelection.selectedRowKeys?.length === 0}
								>
									Delete
								</Button>
								<Button
									size="big"
									variant={"primary"}
									onClick={() => {
										router.push(`/finance-config/coa-template/create`);
									}}
								>
									Create
								</Button>
							</Row>
						</Row>
					</Card>
					<Spacer size={10} />
					{!isLoading && (
						<Card style={{ padding: "16px 20px" }}>
							<Spacer size={10} />
							<Col gap="60px">
								<Table columns={columns} data={paginateField} rowSelection={rowSelection} />
								<Pagination pagination={pagination} />
							</Col>
						</Card>
					)}
				</Col>
			)}

			{modalDelete.open && (
				<ModalDeleteConfirmation
					totalSelected={selectedRowKeys?.length}
					itemTitle={
						paginateField?.find((element: any) => element.key === selectedRowKeys[0])?.field_name
					}
					visible={modalDelete.open}
					onCancel={() => setModalDelete({ open: false })}
					onOk={() => deleteFields({ ids: selectedRowKeys })}
				/>
			)}
		</>
	);
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

export default FinanceConfigCoATemplate;
