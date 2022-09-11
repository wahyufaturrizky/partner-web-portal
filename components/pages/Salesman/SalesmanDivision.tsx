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
import styled from 'styled-components'
import usePagination from '@lucasmogari/react-pagination';
import dynamic from 'next/dynamic';

import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { downloadOptions } from 'components/pages/Salesman/constants'

const ModalAddSalesDivision = dynamic(() => import('components/elements/Modal/ModalAddSalesDivision'), {
  loading: () => <p>...loading</p>,
})

import { useProductList } from 'hooks/mdm/product-list/useProductList';
import {
  useCreateSalesmanDivision,
  useDeleteSalesmanDivision,
  useFetchSalesmanDivision,
  useUpdateSalesmanDivision
} from 'hooks/mdm/salesman/useSalesmanDivision'


export default function ComponentSalesmanDivision() {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const [search, setSearch] = useState<string>('')
  const [formsUpdate, setFormsUpdate] = useState<any>({})
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
      render: (items: any) => (
        <Button
          size="small"
          onClick={() => {
            setFormsUpdate({...items})
            setVisible({  ...visible, create: true })
          }}
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

  const { mutate: handleCreateSalesDivision }: { mutate: any } = useCreateSalesmanDivision({
    options: { onSuccess: () => {
      refetch()
      setVisible({ ...visible, create: false })
    } }
  })
  
  const { mutate: handleUpdateSalesDivision }: { mutate: any } = useUpdateSalesmanDivision({
    options: {
      onSuccess: () => {
        refetch()
        setVisible({ ...visible, create: false })
      }
    },
    id: formsUpdate?.id
  })

  const { data: { rows: listProducts } = {} } = useProductList({
    options: { onSuccess: () => {} },
    query: { company_id: 'KSNI' }
  })

  const _handleCreateSalesDivision = (items: {
    name: string, description?: string, itemSelected: string[]
  }) => {
    handleCreateSalesDivision({
      company: 'KSNI',
      divisi_name: items?.name,
      short_desc: items?.description,
      product: items?.itemSelected
    })
  }

  const _handleUpdateSalesDivision = (items: {
    name: string, description?: string, itemSelected: string[]
  }) => {
    handleUpdateSalesDivision({
      company: 'KSNI',
      divisi_name: items?.name,
      short_desc: items?.description,
      product: items?.itemSelected
    })
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
        listProducts={listProducts}
        visible={visible.create}
        formsUpdate={formsUpdate}
        onCancel={() => setVisible({ ...visible, create: false })}
        onOk={(items: {
          name: string,
          description?: string,
          itemSelected: string[]
        }) =>
          formsUpdate
            ? _handleUpdateSalesDivision(items)
            : _handleCreateSalesDivision(items)}
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
