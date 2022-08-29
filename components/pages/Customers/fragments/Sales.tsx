import React, { useState } from 'react'
import {
  Row,
  Col,
  Dropdown2,
  Spacer,
  Checkbox,
  Text
} from 'pink-lava-ui'
import styled from 'styled-components'

export default function Sales(props: any) {
  const { setValueSales } = props
  const [orderInformation, setOrderInformation] = useState<any>({
    sales: false,
    invoice: false,
    delivery: false,
  })
  const listSalesItems = [
    { id: 'sales', label: 'Sales Order Blocking', value: 'sales_order_blocking' },
    { id: 'invoice', label: 'Invoice/Billing Blocking', value: 'billing_blocking' },
    { id: 'delivery', label: 'Delivery Order Blocking', value: 'delivery_order_blocking' },
  ]

  const listFakeBranch = [
    { value: 'items-1', id: 'items-1' },
    { value: 'items-2', id: 'items-2' },
    { value: 'items-3', id: 'items-3' },
    { value: 'items-4', id: 'items-4' },
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
        <Dropdown2
          label="Term of Payment" 
          width="100%"
          actionLabel="Add New Term of Payment"
          isShowActionLabel
          items={listFakeBranch}
          handleClickActionLabel={() => { }}
          handleChange={(value: string) => setValueSales("sales.term_payment", value)}
          onSearch={(search: string) => {}}
          required
        />
        </Col>
        <Col width="48%">
          <Dropdown2
            actionLabel="Add New Salesman"
            label="Salesman"
            width="100%"
            isShowActionLabel
            items={listFakeBranch}
            handleClickActionLabel={() => { }}
            handleChange={(value: string) => setValueSales("sales.salesman", value)}
            onSearch={(search: string) => { }}
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
