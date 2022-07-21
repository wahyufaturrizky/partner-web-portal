import usePagination from "@lucasmogari/react-pagination";
import { Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { useNumberFormatLists } from "../../hooks/number-format/useNumberFormat";

const NumberFormat: any = () => {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 10,
		maxPageItems: Infinity,
		numbers: true,
		arrows: true,
		totalItems: 100,
	});

	const [search, setSearch] = useState("");

	const { data: fields, isLoading: isLoadingData } = useNumberFormatLists({
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
			title: "Format",
			dataIndex: "format",
			width: "50%",
		},
		{
			title: "Number Format",
			dataIndex: "numberFormat",
			width: "50%",
		},
	];

	const data = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			format: field.format,
			numberFormat: field.numberFormat,
		});
	});

	const paginateField = data;

	return (
		<>
			<Col>
				<Text variant={"h4"}>Number Format</Text>
				<Spacer size={20} />
				<Card>
					<Row justifyContent="flex-start">
						<Search
							width="380px"
							placeholder="Search Number Format"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</Row>
				</Card>
				<Spacer size={10} />
				<Card style={{ padding: "16px 20px" }}>
					<Col gap="60px">
						<Table loading={isLoadingData} columns={columns} data={paginateField} />
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

export default NumberFormat;
