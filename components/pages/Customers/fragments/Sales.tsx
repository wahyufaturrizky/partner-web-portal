import React, { useState } from 'react'
import {
  Row,
  Col,
  Spacer,
  Checkbox,
  Text,
  Dropdown
} from 'pink-lava-ui'
import styled from 'styled-components'
import { Controller } from 'react-hook-form';

import { useTermOfPayments } from 'hooks/mdm/term-of-payment/useTermOfPayment';
import { useBranchList } from 'hooks/mdm/branch/useBranch';
import { useFetchListSalesman } from 'hooks/mdm/salesman/useSalesman';

export default function Sales(props: any) {
  const { control } = props
  const [orderInformation, setOrderInformation] = useState<any>({
    sales: false,
    invoice: false,
    delivery: false,
  })
  const [search, setSearch] = useState({
    branch: '',
    termOfPayment: '',
    salesman: ''
  })

  const { data: listSalesman } = useFetchListSalesman({
    options: { onSuccess: () => {} },
    query: { status: 0, search: search.salesman }
  })

  const { data: listTermOfPayment } = useTermOfPayments({
    options: { onSuccess: () => { } },
    query: { company_id: "KSNI", search: search.termOfPayment }
  })

  const { data: listBranch } = useBranchList({
    options: { onSuccess: () => { } },
    query: { company_id: "KSNI", search: search.branch }
  })

  return (
    <div>
      <Label>Sales</Label>
      <Spacer size={20} />
      <Row gap="10px" width="100%">
        <Col width="48%">
          <Controller
            control={control}
            name="sales.branch"
            render={({ field: { onChange } }) => (
              <>
                <Dropdown
                  label="Branch"
                  width="100%"
                  actionLabel="Add New Branch"
                  items={listBranch?.rows?.map((item: any) => {
                    return {
                      value: item?.name,
                      id: item?.branchId
                    }
                  })}
                  handleChange={onChange}
                  onSearch={(value: string) => setSearch({ ...search, branch: value })}
                  required
                />
              </>
            )}
          />
        <Spacer size={20} />
        <Controller
          control={control}
          name="sales.term_payment"
          render={({ field: { onChange } }) => (
            <Dropdown
              label="Term of Payment"
              width="100%"
              actionLabel="Add New Term of Payment"
              isShowActionLabel
              noSearch
              items={listTermOfPayment?.rows?.map((item: any) => {
                return {
                  value: item?.name,
                  id: item?.topId
                }
              })}
              handleChange={onChange}
              onSearch={(value: string) => setSearch({ ...search, termOfPayment: value })}
              required
            />
          )} />
        </Col>
        <Col width="48%">
          <Controller
            control={control}
            name="sales.salesman"
            render={({ field: { onChange } }) => (
              <Dropdown
                actionLabel="Add New Salesman"
                label="Salesman"
                width="100%"
                isShowActionLabel
                items={listSalesman?.rows?.map((items: any) => {
                  return {
                    value: items?.division,
                    id: items?.id
                  }
                })}
                handleChange={onChange}
                handleClickActionLabel={() => window.open('/salesman/create')}
                onSearch={(value: string) => setSearch({ ...search, salesman: value })}
                required
            />
          )}/>
        </Col>
      </Row>
      <Spacer size={50} />

      <Label>Sales Order Information</Label>
      <Spacer size={20} />
      {
        listSalesItems?.map(({ label, value, id }, index) => (
          <>
            <Row key={index} alignItems="center">
              <Checkbox
                checked={orderInformation[id]}
                onChange={(checked: any) => {
                  setOrderInformation({ ...orderInformation, [id]: checked })
                  setValueSales(`sales.${value}`, checked)
                }}
              />
              <Text>{label}</Text>
            </Row>
            <Spacer size={10} />
          </>
        ))
      }
    </div>
  )
}

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`
