import usePagination from "@lucasmogari/react-pagination";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Button,
  Col,
  DropdownMenu,
  FileUploadModal,
  Input,
  Modal,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
  Dropdown,
  Spin,
} from "pink-lava-ui";
import { ICDownload, ICUpload } from "../../assets";

export default function Customer() {
  const router = useRouter()

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customer_code",
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
    },
    {
      title: "Customer Group",
      dataIndex: "customer_group",
    },
    {
      title: "Salesman",
      dataIndex: "salesman",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  return (
    <div>
      <Col>
        <Text variant={"h4"}>Customer</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Customer, Salesman, etc"
            onChange={() => {}}
          />
          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() => {}}
              disabled={false}
            >
              Delete
            </Button>
            <DropdownMenu
              title={"More"}
              buttonVariant={"secondary"}
              buttonSize={"big"}
              textVariant={"button"}
              textColor={"pink.regular"}
              iconStyle={{ fontSize: "12px" }}
              onClick={() => {}}
              menuList={[
                {
                  key: 1,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Template</p>
                    </div>
                  ),
                },
                {
                  key: 2,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICUpload />
                      <p style={{ margin: "0" }}>Upload Template</p>
                    </div>
                  ),
                },
                {
                  key: 3,
                  value: (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ICDownload />
                      <p style={{ margin: "0" }}>Download Data</p>
                    </div>
                  ),
                },
              ]}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push('/customers/create')}
            >
              Create
            </Button>
          </Row>
        </Row>
      </Card>

      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={false}
            columns={columns}
            data={[]}
            rowSelection={() => {}}
          />
          <Pagination pagination={[]} />
        </Col>
      </Card>
    </div>
  )
}


const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

