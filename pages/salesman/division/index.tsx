import React, { useState } from 'react'
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

import { ModalDeleteConfirmation } from "../../../components/elements/Modal/ModalConfirmationDelete";
import { downloadOptions } from '../../../components/pages/Salesman/constants'
import { ModalAddSalesDivision } from 'components/elements/Modal/ModalAddSalesDivision';

export default function SalesmanDivision() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState([])
  const [visible, setVisible] = useState({
    delete: false,
    create: false
  })

  const columns = [
    {
      title: "Division ID",
      dataIndex: "division_id",
      width: "30%"
    },
    {
      title: "Division Name",
      dataIndex: "division_name",
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

  const handleCreteaSales = (items: string[]) => {
    console.log(items)
  }

  return (
    <div>
      <Text variant="h4">Salesman List</Text>
      <Spacer size={20} />

      <Card>
        <Row justifyContent="space-between">
          <Search
            width="380px"
            placeholder="Search Division Id, Name, Product"
            onChange={({ target }: any) => { }}
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
          width="100%"
          loading={false}
          columns={columns}
          data={[
            { key: 'MCS-01010101', division_id: 'MCS-01010101', division_name: 'PRODUCT-GENERAL 1', product: 'FOOD' },
            { key: 'MCS-02020202', division_id: 'MCS-02020202', division_name: 'PRODUCT-GENERAL 2', product: 'FOOD' },
            { key: 'MCS-03030303', division_id: 'MCS-03030303', division_name: 'PRODUCT-GENERAL 3', product: 'FOOD' },
          ]}
        />
        <Spacer size={50} />
        <Pagination pagination={{}} />
      </Card>

      <ModalDeleteConfirmation
        totalSelected={selectedItems?.length}
        itemTitle={selectedItems?.map((label: string) => label)}
        visible={visible.delete}
        onCancel={() => setVisible({ ...visible, delete: false })}
        onOk={() => setVisible({ ...visible, delete: false })}
      />
      <ModalAddSalesDivision
        visible={visible.create}
        onCancel={() => setVisible({ ...visible, create: false })}
        onOk={(items: string[]) => handleCreteaSales(items)}
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
