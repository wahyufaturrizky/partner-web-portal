import React, { useState } from 'react'
import {
  Row,
  Col,
  Dropdown2,
  Spacer,
  Checkbox,
  Text,
  Dropdown
} from 'pink-lava-ui'
import styled from 'styled-components'
import { useTermOfPayments } from '../../../../hooks/mdm/term-of-payment/useTermOfPayment';

export default function Sales(props: any) {
  const { setValueSales } = props
  const [orderInformation, setOrderInformation] = useState<any>({
    sales: false,
    invoice: false,
    delivery: false,
  })

  const { data: getDataTermOfPayment } = useTermOfPayments({
    options: { onSuccess: () => { } },
    query: { company_id: "KSNI" }
  })

  const listItemsOfPayment = getDataTermOfPayment?.rows?.map
    (({ topId, name }: any) => { return { value: name, id: topId } })


  const listSalesItems = [
    { id: 'sales', label: 'Sales Order Blocking', value: 'sales_order_blocking' },
    { id: 'invoice', label: 'Invoice/Billing Blocking', value: 'billing_blocking' },
    { id: 'delivery', label: 'Delivery Order Blocking', value: 'delivery_order_blocking' },
  ]
  const listFakeBranch = [
    { value: 'example-branch-1', id: 1 },
    { value: 'example-branch-2', id: 2 },
    { value: 'example-branch-3', id: 3 },
    { value: 'example-branch-4', id: 4 },
  ]
  const listFakeSalesman = [
    { value: 'Billa yuvila', id: 1 },
    { value: 'Gween sticky', id: 2 },
    { value: 'Lecredec', id: 3 },
  ]

  return (
    <div>
      <Label>Sales</Label>
      <Spacer size={20} />
      <Row gap="10px" width="100%">
        <Col width="48%">
          <Dropdown2
            label="Branch"
            width="100%"
            actionLabel="Add New Branch"
            isShowActionLabel
            items={listFakeBranch}
            handleClickActionLabel={() => { }}
            handleChange={(value: string) => setValueSales("sales.branch", value)}
            onSearch={(search: string) => {}}
            required
          />
        <Spacer size={20} />
        <Dropdown
          label="Term of Payment" 
          width="100%"
          actionLabel="Add New Term of Payment"
          isShowActionLabel
          noSearch
            items={listItemsOfPayment}
          handleClickActionLabel={() => window.open('/term-of-payment/create')}
          handleChange={(value: string) => setValueSales("sales.term_payment", value)}
          required
        />
        </Col>
        <Col width="48%">
          <Dropdown
            actionLabel="Add New Salesman"
            label="Salesman"
            width="100%"
            isShowActionLabel
            items={listFakeSalesman}
            handleClickActionLabel={() => window.open('/salesman/create')}
            handleChange={(value: string) => setValueSales("sales.salesman", value)}
            required
          />
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
