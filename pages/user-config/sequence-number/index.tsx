import usePagination from "@lucasmogari/react-pagination";
import Router, { useRouter } from "next/router";
import { Button, Col, Dropdown, Pagination, Row, Search, Spacer, Table, Text } from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import { useCompanyList } from "../../../hooks/company-list/useCompany";
import { useAllSequenceNumber } from "../../../hooks/sequence-number/useSequenceNumber";

const SequenceNumber = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
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

  const {
    data: fields,
    refetch: refetchFields,
    isLoading: isLoadingData,
  } = useAllSequenceNumber({
    options: {
      onSuccess: (data) => {
        pagination.setTotalItems(data.totalRow);
        // setIsLoading(false);
        console.log(data, "data response");
      },
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
  });

  const {
    data: fieldsCompany,
    refetch: refetchFieldsCompany,
    isLoading: isLoadingDataCompany,
  } = useCompanyList({
    options: {
      onSuccess: (data) => {
        pagination.setTotalItems(data.totalRow);
        // setIsLoading(false);
        console.log(data, "COMPANUES");
      },
    },
  });

  const handleCompanyId = (companyId) => {
    const company = fieldsCompany.rows.find((item) => item.id == companyId);
    if (company) return company.name;
  };

  const data: any = [];
  !isLoadingDataCompany &&
    !isLoadingData &&
    fields.rows?.map((field: any) => {
      data.push({
        key: field.id,
        company: handleCompanyId(field.companyId),
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
            <Search
              width="380px"
              placeholder="Search Branch Name"
              onChange={(e) => setSearch(e.target.value)}
            />
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
          <Pagination pagination={pagination} />
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
