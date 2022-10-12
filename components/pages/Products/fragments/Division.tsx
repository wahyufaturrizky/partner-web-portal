import React, { useState } from 'react'
import { Spacer, Text, Button, Col, AccordionCheckbox, Row, Search, Spin } from 'pink-lava-ui'
import { useCreateSalesmanDivision, useFetchSalesmanDivision } from 'hooks/mdm/salesman/useSalesmanDivision';
import ModalAddSalesDivision from 'components/elements/Modal/ModalAddSalesDivision';
import { useProductList } from 'hooks/mdm/product-list/useProductList';
import usePagination from '@lucasmogari/react-pagination';
import { useRouter } from 'next/router';
import useDebounce from 'lib/useDebounce';


export default function Division({ setValue, salesDivision }: any) {
  const router = useRouter();
  const [searchDivision, setSearchDivision] = useState("")
  const debounceFetchProductBrand = useDebounce(searchDivision, 1000);

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const { data, isLoading, refetch } =
  useFetchSalesmanDivision({
    options: {
      onSuccess: ({ totalRow }: any) => pagination.setTotalItems(totalRow)
    },
    query: {
      search: debounceFetchProductBrand,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    }
  })
  
  const { data: { rows: listProducts } = {} } = useProductList({
    options: { onSuccess: () => {} },
    query: { company_id: 'KSNI' }
  })

  const { mutate: handleCreateSalesDivision }: { mutate: any } = useCreateSalesmanDivision({
    options: { onSuccess: () => {
      refetch()
      setVisible({ ...visible, create: false })
    } }
  })

  const [visible, setVisible] = useState({
    create: false,
  });

  const {
    data: branchData,
  } = useFetchSalesmanDivision({
    options: {},
    query: {
      limit: 10000,
      search: searchDivision
    },
  });

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


  return (
    <div>
      <Text variant="headingMedium" color="blue.darker">Sales Division</Text>
      <Spacer size={14} />
      <Row width="100%" justifyContent="space-between" noWrap>
        <Row>
          <Button
            size="big"
            variant="primary"
            onClick={() => setVisible({...visible, create: true})}
          >
            Create New Divison
          </Button>
        </Row>
        <Search
          width="486px"
          placeholder={`Search Branch`}
          onChange={(e: any) => setSearchDivision(e.target.value)}
        />
      </Row>
      <Spacer size={20} />
      <Col gap="20px">
        {isLoading ? 
          <Spin tip="Loading data..." />
        : 
        <AccordionCheckbox
          key={'1'}
          lists={data?.rows?.map((item: any) => ({
            id: item?.id,
            value: item?.divisiName,
          }))}
          name={'Divison'}
          checked={salesDivision?.ids}
          onChange={(data: any) => {
            setValue("sales_division", {
              ids: data
            })
          }}
        />}
      </Col>

      <ModalAddSalesDivision
        listProducts={listProducts}
        visible={visible.create}
        onCancel={() => setVisible({ ...visible, create: false })}
        onOk={(items: any) => _handleCreateSalesDivision(items)}
      />
    </div>
  )
}
