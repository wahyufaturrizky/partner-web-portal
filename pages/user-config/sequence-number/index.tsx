import usePagination from "@lucasmogari/react-pagination";
import Router, { useRouter } from "next/router";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";

const expData = [
  {
    id: 1,
    name: "PT. Pinus Merah Abadi",
    branch: "PMA Bandung Selatan",
  },
  {
    id: 2,
    name: "PT. Pinus Merah Abadi",
    branch: "PMA Bandung Timur",
  },
  {
    id: 3,
    name: "PT. Pinus Merah Abadi",
    branch: "PMA Bandung Barat",
  },
];

const SequenceNumber = () => {
  const router = useRouter();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
    },
  ];

  const data: any = [];
  expData?.map((field: any) => {
    data.push({
      key: field.id,
      company: field.name,
      branchName: field.branch,
      action: (
        <div>
          <Button
            size="small"
            onClick={() => {
              router.push(`/user-config/sequence-number/${field.id}`);
            }}
            variant="tertiary"
          >
            View Detail
          </Button>
        </div>
      ),
    });
  });
	
  const paginateField = data;

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <Col>
      <Text variant="h4">Sequence Number</Text>
      <Spacer size={20} />
      <Card>
        <Row justifyContent="space-between">
          <Row alignItems="center">
            <Search width="380px" placeholder="Search Branch Name" onChange={(e: any) => {}} />
          </Row>
          <Button
            size="big"
            variant={"primary"}
            onClick={() => Router.push("/user-config/sequence-number/create")}
          >
            Create
          </Button>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap="60px">
          <Table columns={columns} data={paginateField} rowSelection={rowSelection} />
          <Pagination pagination={[]} />
        </Col>
      </Card>
    </Col>
  );
};
const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default SequenceNumber;
