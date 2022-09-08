import React, { useEffect, useState } from 'react'
import {
  Search,
  Row,
  Button,
  Table,
  Pagination,
  DropdownMenu,
  Text,
  Spacer
} from 'pink-lava-ui'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import usePagination from '@lucasmogari/react-pagination';

import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { downloadOptions } from 'components/pages/Salesman/constants'
import { ModalAddSalesDivision } from 'components/elements/Modal/ModalAddSalesDivision';
import { useDeleteSalesmanDivision, useFetchSalesmanDivision } from 'hooks/mdm/salesman/useSalesmanDivision'


export default function ComponentSalesmanDivision() {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [visible, setVisible] = useState({
    delete: false,
    create: false
  });


  const columns = [
    {
      title: "Division ID",
      dataIndex: "code",
      width: "30%"
    },
    {
      title: "Division Name",
      dataIndex: "divisiName",
      width: "30%"
    },
    {
      title: "Product",
      dataIndex: "product",
      width: "20%"
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <Button
          size="small"
          onClick={() => router.push({
            pathname: '/salesman/[salesman_id]',
            query: {
              status: 'active',
              salesman_id: 123,
            },
          })}
          variant="tertiary"
        >
          View Detail
        </Button>
      )
    },
  ]

  const rowSelection = {
    selectedItems,
    onChange: (value: any) => {
      setSelectedItems(value)
    }
  }


  const { data, isLoading, refetch } =
  useFetchSalesmanDivision({
    options: {
      onSuccess: ({ totalRow }: any) => pagination.setTotalItems(totalRow)
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    }
  })

  const { mutate: handleDeleteDivision }: { mutate: any } =
  useDeleteSalesmanDivision({
    options: {
      onSuccess: () => {
        setVisible({ ...visible, delete: false })
        refetch()
      }
    }
  })

  const handleCreateSales = (items: string[]) => { }

  return (
    <div>
      <Text variant="h4">Salesman List</Text>
      <Spacer size={20} />
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="380px"
            placeholder="Search Division Id, Name, Product"
            onChange={({ target }: any) => setSearch(target.value)}
          />
          <FlexElement>
            <Button
              disabled={selectedItems.length < 1}
              onClick={() => setVisible({ ...visible, delete: true })}
              variant="tertiary"
            >
              Delete
            </Button>
            <DropdownMenu
              title="More"
              buttonVariant="secondary"
              buttonSize="big"
              textVariant="button"
              textColor="pink.regular"
              onClick={(e: any) => { }}
              menuList={downloadOptions()}
            />
            <Button onClick={() => setVisible({ ...visible, create: true })} variant="primary">
              Create
            </Button>
          </FlexElement>
        </Row>
      </Card>
      <Spacer size={10} />
      <Card>
        <Table
          rowSelection={rowSelection}
          loading={isLoading}
          columns={columns}
          data={data?.rows?.map((item: any) => ({ ...item, key: item?.id }))}
          />
        <Spacer size={50} />
        <Pagination pagination={pagination} />
      </Card>

      {/* modal delete items */}
      <ModalDeleteConfirmation
        visible={visible.delete}
        totalSelected={selectedItems?.length}
        isLoading={isLoading}
        itemTitle={selectedItems?.map((label: string) => label)}
        onCancel={() => setVisible({ ...visible, delete: false })}
        onOk={() => handleDeleteDivision({ ids: selectedItems })}
      />

      {/* modal add sales division */}
      <ModalAddSalesDivision
        visible={visible.create}
        onCancel={() => setVisible({ ...visible, create: false })}
        onOk={(items: string[]) => handleCreateSales(items)}
      />
    </div>
  )
}

const FlexElement = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;
