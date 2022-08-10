import usePagination from "@lucasmogari/react-pagination";
import Router from "next/router";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";

export default function UserConfigSequenceNumber() {

	const columns = [
		{
			title: "Branch Name",
			dataIndex: "branch_name",
			width: "43%",
		},
		{
			title: "Action",
			dataIndex: "action",
			width: "15%",
		},
	];

  return (
    <Col>
    <Text variant="h4">Sequence Number</Text>
    <Spacer size={20} />
    <Card>
      <Row justifyContent="space-between">
        <Row alignItems="center">
          <Search
            width="380px"
            placeholder="Search Branch Name"
            onChange={(e: any) => {}}
          />
        </Row>
        <Button size="big" variant={"primary"} onClick={() => Router.push("/user-config/sequence-number/create")}>
          Create
        </Button>
      </Row>
    </Card>
    <Spacer size={10} />
    <Card style={{ padding: "16px 20px" }}>
      <Col gap="60px">
        <Table columns={columns}/>
        <Pagination pagination={[]} />
      </Col>
    </Card>
  </Col>
  )
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`
