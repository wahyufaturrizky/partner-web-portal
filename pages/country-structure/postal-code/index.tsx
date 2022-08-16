import usePagination from "@lucasmogari/react-pagination";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text, DropdownMenu } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";

import DownloadSvg from "../../../assets/icons/ic-download.svg";
import UploadSvg from "../../../assets/icons/ic-upload.svg";
import SyncSvg from "../../../assets/icons/ic-sync.svg";


import { ModalCreatePostalCode } from "../../../components/elements/Modal/ModalCreatePostalCode";
import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { ModalDetailPostalCode } from "../../../components/elements/Modal/ModalDetailPostalCode";
import { useDeletePostalCode, usePostalCodes } from "../../../hooks/mdm/postal-code/usePostalCode";

const CountryPostalCode = () => {
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
		isLoading,
		refetch: refetchPostalCode,
	} = usePostalCodes({
		options: {
			onSuccess: (data: any) => {
				pagination.setTotalItems(data?.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const data: any = [];
	fields?.rows?.map((field: any) => {
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

	const onSelectChange = (selectedRowKeys: any) => {
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
								placeholder="Search Postal Code ID. Postal Code, etc"
								onChange={({ target }: React.ChangeEvent<HTMLInputElement>) =>
									setSearch(target.value)
								}
							/>
							<Dropdown
								width="200px"
								allowClear
								items={[
									{ id: 1, value: "Indonesia" },
									{ id: 2, value: "Malaysia" },
									{ id: 3, value: "Singapore" },
								]}
								placeholder={"Country"}
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
						<DropdownMenu
							title={"More"}
							buttonVariant={"secondary"}
							buttonSize={"big"}
							textVariant={"button"}
							textColor={"pink.regular"}
							iconStyle={{ fontSize: "12px" }}
							menuList={[
								{
									key: 1,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>Download Template</p>
										</div>
									),
								},
								{
									key: 2,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<UploadSvg />
											<p style={{ margin: "0" }}>Upload Template</p>
										</div>
									),
								},
								{
									key: 3,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<DownloadSvg />
											<p style={{ margin: "0" }}>Download Data</p>
										</div>
									),
								},
								{
									key: 4,
									value: (
										<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
											<SyncSvg />
											<p style={{ margin: "0" }}>Sync Data</p>
										</div>
									),
								},
							]}
						/>
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
							loading={isLoading}
							rowSelection={rowSelection}
							columns={columns}
							data={data || []}
						/>
						<Pagination pagination={pagination} />
					</Col>
				</Card>
			</Col>

			<ModalDeleteConfirmation
				totalSelected={selectedRowKeys?.length}
				itemTitle={paginateField?.find((menu: any) => menu.key === selectedRowKeys[0])?.country_name}
				visible={modalDelete.open}
				onCancel={() => setModalDelete({ open: false })}
				onOk={() => mutateDeletePostalCode({ ids: selectedRowKeys })}
			/>

			{modalCreate.open && (
				<ModalCreatePostalCode
					visible={modalCreate.open}
					onCancel={() => setModalCreate({ open: false })}
				/>
			)}

			{modalDetail.open && (
				<ModalDetailPostalCode
					dataModal={modalDetail.dataDetail}
					visible={modalDetail.open}
					onCancel={() => setModalDetail({ open: false })}
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

export default CountryPostalCode;
