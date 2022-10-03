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
import { useListCustomers, useDeleteCustomers } from '../../hooks/mdm/customers/useCustomersMDM'
import { ICDownload, ICUpload } from "../../assets";
import { ModalDeleteConfirmation } from '../../components/elements/Modal/ModalConfirmationDelete'
import { mdmDownloadService } from "../../lib/client";

export default function Customer() {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const router = useRouter()
  const [search, setSearch] = useState("");
  const [itemsSelected, setItemsSelected] = useState([]);
  const [visible, setVisible] = useState(false)

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

  const { data: listCustomers, isLoading, refetch } = useListCustomers({
    options: {
      onSuccess: (items: any) => {
        pagination.setTotalItems(items?.totalRow);
      },
      select: ({ rows, totalRow }: any) => {
        const data =  rows?.map((items: any) => {
          return {
            key: items?.id,
            id: items?.id,
            name: items?.name,
            group: items?.group?.name || '-', 
            salesman: items?.salesman?.name || '-'
          }
        }) 
        return { data, totalRow }
      }
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
  });

  const { mutate: deleteCustomer, isLoading: loadingDelete }: any = useDeleteCustomers({
    options: {
      onSuccess: () => {
        refetch()
        setItemsSelected([])
        setVisible(false)
      }
    }
  })

  const actDrowpdown = [
    {
      key: 1,
      value: (
        <ButtonAction>
          <ICDownload />
          <p style={{ margin: "0" }}>Download Template</p>
        </ButtonAction>
      ),
    },
    {
      key: 2,
      value: (
        <ButtonAction disabled>
          <ICUpload />
          <p style={{ margin: "0" }}>Upload Template</p>
        </ButtonAction>
      ),
    },
    {
      key: 3,
      value: (
        <ButtonAction>
          <ICDownload />
          <p style={{ margin: "0" }}>Download Data</p>
        </ButtonAction>
      ),
    },
  ]

  const rowSelection = {
    itemsSelected,
    onChange: (selected: any) => {
      setItemsSelected(selected)
    },
  }

  const handleDownloadFile = (id: any) => {
    mdmDownloadService(`/customer/download/MCS-0000012`, {params: {}}).then(res => {
      let dataUrl = window.URL.createObjectURL(new Blob([res?.data]));
      let tempLink = document.createElement("a");
      tempLink.href = dataUrl;
      tempLink.setAttribute("download", `customers_${id} ${new Date().getTime()}.xlsx`);
      tempLink.click();
    })
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
              onClick={() => setVisible(true)}
              disabled={itemsSelected?.length < 1}
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
              onClick={({ key }: any) => key === '1' && handleDownloadFile()}
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
            data={listCustomers?.data || []}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      <ModalDeleteConfirmation
        totalSelected={itemsSelected.length}
        visible={visible}
        itemTitle={listCustomers?.data?.find((item: any) => item.key === itemsSelected[0])?.name}
        isLoading={loadingDelete}
        onCancel={() => setVisible(false)}
        onOk={() => deleteCustomer({ delete: itemsSelected })}
      />
    </div>
  )
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

const ButtonAction = styled.button`
  background: transparent;
  border: 0;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

