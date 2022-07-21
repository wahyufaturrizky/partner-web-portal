import usePagination from "@lucasmogari/react-pagination";
import { Button, Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import {
	useFields,
	useUpdateField,
	useCreateField,
	useDeleteField,
} from "../../hooks/field/useField";
import { ModalDetailField } from "../../components/modals/ModalDetailField";
import { ModalRegisterField } from "../../components/modals/ModalRegisterField";

const Field: any = () => {
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
	const [modalDetail, setModalDetailOpen] = useState({ open: false });
	const [modalCreate, setModalCreate] = useState({ open: false });
	const [modalDelete, setModalDelete] = useState({ open: false });

	const { data: fields, refetch: refetchFields } = useFields({
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

	const { mutate: updateField, error: errorUpdate } = useUpdateField({
		fieldId: modalDetail?.data?.id ?? null,
		options: {
			onSuccess: () => {
				refetchFields();
				setModalDetailOpen({ open: false });
			},
		},
	});

	const { mutate: createField, error } = useCreateField({
		options: {
			onSuccess: () => {
				refetchFields();
				setModalCreate({ open: false });
			},
		},
	});

	const { mutate: deleteFields } = useDeleteField({
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
			title: "Field Id",
			dataIndex: "field_id",
			width: "28%",
		},
		{
			title: "Field Name",
			dataIndex: "field_name",
			width: "28%",
		},
		{
			title: "Key",
			dataIndex: "field_key",
			width: "28%",
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
			field_id: field.id,
			field_name: field.name,
			field_key: field.key,
			action: (
				<Button
					size="small"
					onClick={() => setModalDetailOpen({ open: true, data: field })}
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
				<Text variant={"h4"}>Field</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Search
							width="380px"
							placeholder="Search Field ID, Name, Key"
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
							<Button size="big" variant={"primary"} onClick={() => setModalCreate({ open: true })}>
								Register
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				{!isLoading && (
					<Card style={{ padding: "16px 20px" }}>
						<Col gap="60px">
							<Table columns={columns} data={paginateField} rowSelection={rowSelection} />
							<Pagination pagination={pagination} />
						</Col>
					</Card>
				)}
			</Col>

			{modalDetail.open && (
				<ModalDetailField
					visible={modalDetail.open}
					defaultValue={modalDetail.data}
					onCancel={() => setModalDetailOpen({ open: false })}
					onOk={(data) => updateField(data)}
					error={errorUpdate}
				/>
			)}

			{modalCreate.open && (
				<ModalRegisterField
					visible={modalCreate.open}
					onCancel={() => setModalCreate({ open: false })}
					onOk={(data) => createField(data)}
					error={error}
				/>
			)}

			{modalDelete.open && (
				<ModalDeleteConfirmation
					totalSelected={selectedRowKeys.length}
					itemTitle={
						paginateField?.find((field) => field.field_id === selectedRowKeys[0])?.field_name
					}
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

export default Field;
