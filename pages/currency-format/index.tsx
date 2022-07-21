import usePagination from "@lucasmogari/react-pagination";
import { Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { useCurrencyFormatLists } from "../../hooks/currency-format/useCurrencyFormat";

const CurrencyFormat: any = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");

	const {
		data: fields,
		refetch: refetchFields,
		isLoading: isLoadingField,
	} = useCurrencyFormatLists({
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

	const columns = [
		{
			title: "Currency",
			dataIndex: "currency",
			width: "50%",
		},
		{
			title: "Currency Format",
			dataIndex: "currencyFormat",
			width: "50%",
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			currency: field.format,
			currencyFormat: field.currencyFormat,
		});
	});

	const paginateField = data;

	return (
		<>
			<Col>
				<Text variant={"h4"}>Currency Format</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="flex-start">
						<Search
							width="380px"
							placeholder="Search Currency Format"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table loading={isLoadingField} columns={columns} data={paginateField} />
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

export default CurrencyFormat;
