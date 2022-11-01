import React, { useState } from "react";
import usePagination from "@lucasmogari/react-pagination";
import styled from "styled-components";
import { Col, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";

import { useNumberFormatLists } from "../../../hooks/formating/useNumber";
import { lang } from "lang";

export default function FormatingNumber() {
  const t = localStorage.getItem("lan") || "en-US";
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [search, setSearch] = useState("");

  const { data: fields, isLoading: isLoadingData } = useNumberFormatLists({
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
      title: lang[t].dateFormat.format,
      dataIndex: "format",
      width: "50%",
    },
    {
      title: lang[t].dateFormat.numberFormat,
      dataIndex: "numberFormat",
      width: "50%",
    },
  ];

  const data: any = [];
  fields?.rows?.map((field: any) => {
    data.push({
      key: field.id,
      format: field.format,
      numberFormat: field.numberFormat,
    });
  });
  return (
    <Col>
      <Text variant={"h4"}>{lang[t].dateFormat.numberFormat}</Text>
      <Spacer size={20} />
      <Card>
        <Row justifyContent="flex-start">
          <Search
            width="380px"
            placeholder="Search Number Format"
            onChange={({ target }: any) => setSearch(target.value)}
          />
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table loading={isLoadingData} columns={columns} data={data} />
          <Pagination pagination={pagination} />
        </Col>
      </Card>
    </Col>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;
