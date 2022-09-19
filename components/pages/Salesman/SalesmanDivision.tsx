import React, { useState } from 'react'
import {
  FileUploadModal,
  DropdownMenu,
  Pagination,
  Spacer,
  Search,
  Button,
  Table,
  Row,
  Text,
} from 'pink-lava-ui'
import styled from 'styled-components'
import usePagination from '@lucasmogari/react-pagination';

import { queryClient } from "pages/_app";
import { mdmDownloadService } from 'lib/client';
import { ModalDeleteConfirmation } from "components/elements/Modal/ModalConfirmationDelete";
import { downloadOptions } from 'components/pages/Salesman/constants'
import ModalAddSalesDivision from 'components/elements/Modal/ModalAddSalesDivision'
import { useProductList } from 'hooks/mdm/product-list/useProductList';
import {
  useUploadDocumentSalesDivision,
  useCreateSalesmanDivision,
  useDeleteSalesmanDivision,
  useFetchSalesmanDivision,
  useUpdateSalesmanDivision
} from 'hooks/mdm/salesman/useSalesmanDivision'


const downloadFileSalesDivision = (params: any) =>
  mdmDownloadService("/sales-division/template/download", { params }).then((res) => {
    let dataUrl = window.URL.createObjectURL(new Blob([res.data]));
    let tempLink = document.createElement("a");
    tempLink.href = dataUrl;
    tempLink.setAttribute("download", `sales_division${new Date().getTime()}.xlsx`);
    tempLink.click();
  });

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
  const [singleTitle, setSingleTitile] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [visible, setVisible] = useState({
    delete: false,
    create: false,
    upload: false,
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
            setFormsUpdate({ ...items })
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
    onChange: async (value: any) => {
      const findName = await data?.rows?.find((el: any) => el.id === value[0])
      setSelectedItems(value)
      setSingleTitile(findName?.divisiName)
    }
  }

  const isLabelConfirmationDelete = (): any => {
    if (selectedItems.length > 1) {
      selectedItems?.map((label: string) => label)
    } else {
      return singleTitle
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

  const { mutate: handleUploadDocuments } = useUploadDocumentSalesDivision({
    options: {
      onSuccess: () => {
        refetch()
        setVisible({ ...visible, upload: false })
        queryClient.invalidateQueries(["sales-division"]);
      }
    }
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

  const _handleDropdownMore = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        return downloadFileSalesDivision({ company_id: 'KSNI', with_data: 'n' })
      case '2':
        return setVisible({ ...visible, upload: true })
      case '3':
        return downloadFileSalesDivision({ company_id: 'KSNI', with_data: 'y' })
      default:
        return null
    }
  }

  const submitDocumentsUploader = (file: any) => {
    const formData: any = new FormData();
    formData.append("upload_file", file);
    handleUploadDocuments(formData)
  }

  return (
    <div>
      <Text variant="h4">Sales Division</Text>
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
              onClick={(value: any) => _handleDropdownMore(value)}
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
        itemTitle={isLabelConfirmationDelete()}
        onCancel={() => setVisible({ ...visible, delete: false })}
        onOk={() => handleDeleteDivision({ ids: selectedItems })}
      />

      {/* modal add sales division */}
      <ModalAddSalesDivision
        listProducts={listProducts}
        visible={visible.create}
        resetFormsUpdate={() => setFormsUpdate(null)}
        formsUpdate={formsUpdate}
        onCancel={() => setVisible({ ...visible, create: false })}
        onOk={(items: {
          name: string,
          description?: string,
          itemSelected: string[]
        }) => visible.create
          ? _handleCreateSalesDivision(items)
          : _handleUpdateSalesDivision(items)}
      />

      {/* modal upload documents */}
      <FileUploadModal
        visible={visible.upload}
        setVisible={() => setVisible({ ...visible, upload: false })}
        onSubmit={submitDocumentsUploader}
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
