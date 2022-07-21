import usePagination from "@lucasmogari/react-pagination";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { ModalCreatePostalCode } from "../../components/modals/ModalCreatePostalCode";
import { ModalDeleteConfirmation } from "../../components/modals/ModalDeleteConfirmation";
import { ModalDetailPostalCode } from "../../components/modals/ModalDetailPostalCode";
import { useDeletePostalCode, usePostalCodes } from "../../hooks/postal-code/usePostalCode";

const PostalCode = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [search, setSearch] = useState("");
	const [isLoading, setLoading] = useState(true);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [modalCreate, setModalCreate] = useState({ open: false });
	const [modalDetail, setModalDetail] = useState({ open: false, dataDetail: null });
	const columns = [
		{
			title: "Postal Code ID",
			dataIndex: "postal_code_id",
		},
		{
			title: "Postal Code",
			dataIndex: "postal_code",
		},
		{
			title: "Country Name",
			dataIndex: "country_name",
		},
		{
			title: "Action",
			dataIndex: "action",
		},
	];

	const {
		data: fields,
		isLoading: isLoadingFields,
		refetch: refetchPostalCode,
	} = usePostalCodes({
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

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			postal_code_id: field?.codeText,
			postal_code: field?.country,
			country_name: field?.countryRecord?.name,
			action: (
				<Button
					size="small"
					onClick={() => setModalDetail({ open: true, dataDetail: field })}
					variant="tertiary"
				>
					View Detail
				</Button>
			),
		});
	});

	const paginateField = data;

	const onSelectChange = (selectedRowKeys) => {
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const { mutate: mutateDeletePostalCode } = useDeletePostalCode({
		options: {
			onSuccess: () => {
				refetchPostalCode();
				setModalDelete({ open: false });
			},
		},
	});

	return (
		<>
			<Col>
				<Text variant={"h4"}>Postal Code</Text>
				<Spacer size={20} />
				<Card className="">
					<Row justifyContent="space-between">
						<Row gap="16px">
							<Search
								width="380px"
								nameIcon="SearchOutlined"
								placeholder="Search Name"
								onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
									setSearch(target.value)
								}
							/>
							<Dropdown
								width="200px"
								label=""
								allowClear
								// onClear={handleClearDropdownApproval}
								// loading={isLoadingieldsProcessLists}
								items={[
									{ id: 1, value: "Indonesia" },
									{ id: 2, value: "Malaysia" },
									{ id: 3, value: "Singapore" },
								]}
								placeholder={"Country"}
								// handleChange={handleChangeDropdown}
								noSearch
								rounded
							/>
						</Row>
						<Row gap="16px">
							<Button
								size="big"
								variant="tertiary"
								onClick={() => setModalDelete({ open: true })}
								disabled={!(selectedRowKeys.length > 0)}
							>
								Delete
							</Button>
							<Button size="big" variant="primary" onClick={() => setModalCreate({ open: true })}>
								Create
							</Button>
						</Row>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card>
					<Col gap="60px">
						<Table
							loading={isLoadingFields}
							rowSelection={rowSelection}
							columns={columns}
							data={data ?? []}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</Card>
			</Col>

			<ModalDeleteConfirmation
				totalSelected={selectedRowKeys?.length}
				itemTitle={paginateField?.find((menu) => menu.key === selectedRowKeys[0])?.country_name}
				visible={modalDelete.open}
				onCancel={() => setModalDelete({ open: false })}
				onOk={() => mutateDeletePostalCode({ ids: selectedRowKeys })}
			/>

			{modalCreate.open && (
				<ModalCreatePostalCode
					visible={modalCreate.open}
					// defaultValue={modalDetail.data}
					onCancel={() => setModalCreate({ open: false })}
					// onOk={(data) => updateField(data)}
					// error={errorUpdate}
				/>
			)}

			{modalDetail.open && (
				<ModalDetailPostalCode
					dataModal={modalDetail.dataDetail}
					visible={modalDetail.open}
					// defaultValue={modalDetail.data}
					onCancel={() => setModalDetail({ open: false })}
					// onOk={(data) => updateField(data)}
					// error={errorUpdate}
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

export default PostalCode;
