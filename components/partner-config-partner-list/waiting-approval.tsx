import React, { useState } from "react";
import styled from "styled-components";
import {
	Text,
	Row,
	Search,
	Spacer,
	Button,
	Col,
	Table,
	Pagination,
	Lozenge,
	Spin,
	EmptyState,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { STATUS_APPROVAL_VARIANT, STATUS_APPROVAL_TEXT } from "../../utils/utils";
import { usePartnerConfigLists } from "../../hooks/partner-config-list/usePartnerConfigList";

const WaitingPartner: any = () => {
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

	const { data: partners, isLoading } = usePartnerConfigLists({
		options: {
			onSuccess: (data) => {
				pagination.setTotalItems(data.totalRow);
			},
		},
		query: {
			search,
			page: pagination.page,
			limit: pagination.itemsPerPage,
			status: "WAITING",
		},
	});

	const columns = [
		{
			title: "Partner Name",
			dataIndex: "partner_name",
			width: "28%",
		},
		{
			title: "Company Type",
			dataIndex: "company_type",
			width: "28%",
		},
		{
			title: "Status",
			dataIndex: "status",
			render: (text) => (
				<Lozenge variant={STATUS_APPROVAL_VARIANT[text]}>{STATUS_APPROVAL_TEXT[text]}</Lozenge>
			),
			width: "28%",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "15%",
		},
	];

	const data = [];
	const isEmpty = partners?.rows?.length === 0;
	partners?.rows?.map((partner) => {
		data.push({
			key: partner.id,
			partner_name: partner.name,
			company_type: partner.partnerType.name,
			status: partner.status,
			action: (
				<Button
					size="small"
					onClick={() => {
						router.push(`/partner-config-partner-list/${partner.id}`);
					}}
					variant="tertiary"
				>
					View Detail
				</Button>
			),
		});
	});
	const paginateField = data;

	return (
		<>
			<Card>
				<Row justifyContent="space-between">
					<Search
						width="450px"
						placeholder="Search Partner Name, Partner Type"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Row gap="16px" justifyContent="flex-end">
						<Button
							size="big"
							variant={"primary"}
							onClick={() => {
								router.push("/partner-config-partner-list/create");
							}}
						>
							+ Create New Partner
						</Button>
					</Row>
				</Row>
			</Card>
			<Spacer size={10} />
			<Col>
				{isLoading ? (
					<Center>
						<Spin tip="Loading data..." />
					</Center>
				) : (
					<Card style={{ minHeight: "574px", padding: "16px 20px" }}>
						<Text variant="headingRegular" color="blue.darker">
							{search ? `Search Result` : `Total Waiting for Approval Partner`} :{" "}
							{partners?.totalRow}{" "}
						</Text>
						<Spacer size={20} />
						{isEmpty ? (
							<EmptyState
								image={"/empty-state.svg"}
								title={"The Data You Are Looking for Cannot be Found"}
								description={`Don't worry you can Create a new partner`}
								height={400}
							/>
						) : (
							<Col gap="60px">
								<Table columns={columns} data={paginateField} />
								<Pagination pagination={pagination} />
							</Col>
						)}
					</Card>
				)}
			</Col>
			<Spacer size={10} />
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

export default WaitingPartner;
