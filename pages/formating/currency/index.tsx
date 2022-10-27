import React, { useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import { Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import styled from "styled-components";


import { useCurrencyFormatLists } from "../../../hooks/formating/useCurrency";


export default function FormatingCurrency() {
	const pagination = usePagination({
		page: 1,
		itemsPerPage: 20,
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
			onSuccess: (data: any) => {
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
			dataIndex: "currencyCode",
			width: "35%",
		},
		{
			title: "Currency Name",
			dataIndex: "currency",
			width: "35%",
		},
		{
			title: "Currency Format",
			dataIndex: "currencyFormat",
		},
	];

	const data: any = [];
	fields?.rows?.map((field) => {
		data.push({
			key: field.id,
			currencyCode: field.currencyCode ? field.currencyCode : '-',
			currency: field.format,
			currencyFormat: field.currencyFormat,
		});
	});

  return (
    <Col>
    <Text variant={"h4"}>Currency Format</Text>
    <Spacer size={20} />
    <Card>
      <Row justifyContent="flex-start">
        <Search
          width="380px"
          placeholder="Search Currency or Currency Format"
          onChange={({ target }: any) => setSearch(target.value)}
        />
      </Row>
    </Card>
    <Spacer size={10} />
    <Card style={{ padding: "16px 20px" }}>
      <Col gap="60px">
        <Table loading={isLoadingField} columns={columns} data={data} />
        <Pagination pagination={pagination} />
      </Col>
    </Card>
  </Col>
  )
}


const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;