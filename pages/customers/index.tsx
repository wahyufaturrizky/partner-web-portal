import { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  Button,
  Col,
  DropdownMenu,
  Pagination,
  Row,
  Search,
  Spacer,
  Table,
  Text,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import { useListCustomers } from '../../hooks/mdm/customers/useCustomersMDM'
import { ICDownload, ICUpload } from "../../assets";

export default function Customer() {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const router = useRouter()
  const [search, setSearch] = useState("");
  const [itemsSelected, setItemsSelected] = useState([]);

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
    },
    {
      title: "Customer Group",
      dataIndex: "group",
    },
    {
      title: "Salesman",
      dataIndex: "salesman",
    },
    {
      title: "Action",
      dataIndex: "id",
      width: "15%",
      align: "left",
      render: (id: any) => (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <Button
            size="small"
            onClick={() => router.push(`/customers/${id}`)}
            variant="tertiary"
          >
            View Detail
          </Button>
        </div>
      )
    },
  ];

  const { data: listCustomers, isLoading } = useListCustomers({
    options: {},
    query: {
      search
    },
  });

  const actDrowpdown = [
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
  ]

  const rowSelection = {
    itemsSelected,
    onChange: (selected: any) => {
      setItemsSelected(selected);
    },
  }

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
            onChange={({ target }: any) => setSearch(target.value)}
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
              menuList={actDrowpdown}
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
      <Spacer size={20} />
      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoading}
            columns={columns}
            data={listCustomers?.rows || []}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
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

