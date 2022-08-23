import React from 'react'
import styled from 'styled-components'
import { Table, Button, Input, Spacer, Dropdown, Row, Col } from 'pink-lava-ui'

import IconAdd from '../../../../assets/icons/ICAdd'

export default function Invoicing() {
  return (
    <div>
      <Label>Account Receivable</Label>
      <Spacer size={20} />
      <Row gap="16px" width="100%">
        <Col width="48%">
          <Dropdown
            label="Term of Payment"
            width="100%"
            actionLabel="Add New Term of Payment"
            isShowActionLabel
            handleClickActionLabel={() => { }}
            noSearch
          />
          <Spacer size={10} />
          <Input
            label="Credit Used"
            width="100%"
            height="50px"
            disabled
          />
        </Col>
        <Col width="48%">
          <Input
            label="Credit Balance"
            width="100%"
            height="50px"
            disabled
          />
          <Spacer size={10} />
          <Dropdown
            label="Income Account"
            width="100%"
            actionLabel="Add New Income Account"
            isShowActionLabel
            handleClickActionLabel={() => { }}
            noSearch
          />
        </Col>
      </Row>

      <Spacer size={30} />

      <Label>Account Payable</Label>
      <Spacer size={20} />
      <Row width="100%">
        <Col width="48%">
          <Dropdown
            label="Expense Account"
            width="100%"
            actionLabel="Add New Expense Account"
            isShowActionLabel
            handleClickActionLabel={() => { }}
            noSearch
          />
        </Col>
      </Row>

      <Spacer size={30} />

      <Label>Bank Account</Label>
      <Spacer size={20} />
      <Button size="big" variant={"primary"} onClick={() => { }}>
        <IconAdd /> Add Bank Account
      </Button>
      <Row width="100%">
        <Table />
      </Row>
    </div>
  )
}

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`