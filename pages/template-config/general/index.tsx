import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Dropdown, Table, Pagination } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { ModalDeleteConfirmation } from "../../../components/modals/ModalDeleteConfirmation";
import {
	useDeleteTemplateGeneral,
	useTemplateGenerals,
} from "../../../hooks/template-general/useTemplateGeneral";
import { useSectors } from "../../../hooks/sector/useSector";
import { useRouter } from "next/router";

const Config: any = () => {
	const router = useRouter();
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [isLoading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [modalDelete, setModalDelete] = useState({ open: false });
	const [parent, setParent] = useState("");

	const { data: templateGenerals, refetch } = useTemplateGenerals({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
				setLoading(false);
			},
		},
		query: {
			...(parent ? { sector_id: parent } : {}),
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
		},
	});

	const { data: sectorsData } = useSectors({
		options: {},
		query: {
			limit: 10000,
		},
	});

	const { mutate: deleteConfig } = useDeleteTemplateGeneral({
		options: {
			onSuccess: () => {
				refetch();
				setModalDelete({ open: false });
			},
		},
	});

	const columns = [
		{
			title: "Template Name",
			dataIndex: "name",
		},
		{
			title: "Country",
			dataIndex: "country",
		},
		{
			title: "Sector",
			dataIndex: "sector",
		},
		{
			title: "Industry",
			dataIndex: "industry",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: 160,
		},
	];

	const data = [];
	templateGenerals?.rows?.map((template) => {
		data.push({
			key: template.id,
			name: template.name,
			country: template?.country?.name,
			sector: template?.sector?.name,
			industry: template.industry?.name,
			action: (
				<Button
					size="small"
					onClick={() => router.push(`/template-config/general/${template.id}`)}
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

	const sectors = sectorsData?.rows?.map((sector: any) => ({ id: sector.id, value: sector.name }));
	if (sectors?.length > 0) {
		sectors.unshift({ id: "", value: "All" });
	}

	return (
		<>
			<Col>
				<Text variant={"h4"}>Template List</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="space-between">
						<Row alignItems="center">
							<Search
								width="380px"
								placeholder="Search Template Name, Country, Sector, Industry"
								onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
									setSearch(e.target.value)
								}
							/>
							<Spacer size={16} />
							<Text variant="subtitle1" color="black.dark">
								Sector
							</Text>
							<Spacer size={8} />
							<Dropdown
								width="200px"
								label=""
								defaultValue={"All"}
								items={sectors}
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
							<Button
								size="big"
								variant={"primary"}
								onClick={() => router.push("/template-config/general/create")}
							>
								Create
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

			{modalDelete.open && (
				<ModalDeleteConfirmation
					totalSelected={selectedRowKeys?.length}
					itemTitle={paginateField?.find((config) => config.key === selectedRowKeys[0])?.name}
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

export default Config;
