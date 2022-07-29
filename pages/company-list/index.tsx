import React, { useState } from "react";
import styled from "styled-components";
import { Text, Button, Col, Row, Spacer, Search, Table, Pagination, Lozenge } from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";

const fakeData = [
    {
        id: 1,
        name: 'Nabati Group',
        type: 'Holding',
        fields: 'FMCG',
        status: true
    },
    {
        id: 2,
        name: 'PT. Kaldu Sari Nabati',
        type: 'Company',
        fields: 'FMCG-Manufacturing',
        status: true
    },
    {
        id: 3,
        name: 'PT. Pinus Merah Abadi',
        type: 'Company',
        fields: 'Food & Beverages',
        status: false
    }
]

const CompanyList: any = () => {
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

  const columns = [
    {
      title: "Company Name",
      dataIndex: "name",
    },
    {
      title: "Company Type",
      dataIndex: "type",
    },
    {
      title: "Industry Fields",
      dataIndex: "fields",
    },
    {
      title: "Active",
      dataIndex: "active",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const data = [];
  fakeData?.map((field) => {
    console.log(field)
    data.push({
      key: field.id,
      name: field.name,
      type: field.type,
      fields: field.fields,
      active: field.status ? 'active' : 'inactive',
      action: (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button
            size="small"
            onClick={() => {
              router.push(`/partner-config-role-list/${field.id}`);
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Col>
        <Text variant={"h4"}>Company List</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between">
            <Search
              width="380px"
              placeholder="Search Role Name"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Row gap="16px">
              {/* <Button
                size="big"
                variant={"tertiary"}
                onClick={() => setModalDelete({ open: true })}
                disabled={rowSelection.selectedRowKeys?.length === 0}
              >
                Delete
              </Button> */}
              <Button
                size="big"
                variant={"primary"}
                onClick={() => {
                  router.push("/company-list/create");
                }}
              >
                + Add New Company
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
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default CompanyList;
