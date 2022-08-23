import React, { useState } from 'react'
import { Row, Col, Dropdown, Spacer, Checkbox, Text } from 'pink-lava-ui'
import styled from 'styled-components'

export default function Sales() {
  const [isPrimary, setIsPrimary] = useState('sales-1')
  const listSalesItems = [
    { label: 'Sales Order Blocking', value: 'sales-1' },
    { label: 'Invoice/Billing Blocking', value: 'sales-2' },
    { label: 'Delivery Order Blocking', value: 'sales-3' },
  ]

  return (
    <div>
      <Label>Sales</Label>
      <Spacer size={20} />
      <Row gap="10px" width="100%">
        <Col width="48%">
          <Dropdown
            label="Branch"
            width="100%"
            actionLabel="Add New Branch"
            isShowActionLabel
            handleClickActionLabel={() => { }}
            noSearch 
          />
          <Spacer size={20} />
          <Dropdown 
            label="Term of Payment" 
            width="100%"
            actionLabel="Add New Term of Payment"
            isShowActionLabel
            handleClickActionLabel={() => { }}
            noSearch  
          />
        </Col>
        <Col width="48%">
          <Dropdown
            actionLabel="Add New Salesman"
            label="Salesman"
            width="100%"
            isShowActionLabel
            handleClickActionLabel={() => {}}
            noSearch
          />
        </Col>
      </Row>
      <Spacer size={50} />

      <Label>Sales Order Information</Label>
      <Spacer size={20} />
      {
        listSalesItems.map(({ label, value }, index) => (
          <>
            <Row key={index} alignItems="center">
              <Checkbox checked={isPrimary === value} onChange={() => setIsPrimary(value)} />
              <div style={{ cursor: "pointer" }}>
                <Text>{label}</Text>
              </div>
            </Row>
            <Spacer size={15} />
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
