import React, { useState } from 'react'
import styled from 'styled-components'
import { Table, Button, Input, Spacer, Dropdown, Row, Col, TextArea } from 'pink-lava-ui'

import ModalAddBankAccount from '../../../elements/Modal/ModalAddBankAccount'
import IconAdd from '../../../../assets/icons/ICAdd'

export default function Invoicing() {
  const [visible, setVisible] = useState(false)
  const columns = [
    {
      title: "",
      dataIndex: "action",
      width: "15%",
      render: () => (
        <div>
          <Button>+</Button>
          <Button>-</Button>
        </div>
      )
    },
    {
      title: "Bank Name",
      dataIndex: "bank_name",
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
    },
  ];

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
      <Button size="big" variant={"primary"} onClick={() => setVisible(!visible)}>
        <IconAdd /> Add Bank Account
      </Button>
      <Spacer size={20} />
      <Table columns={columns} width="100%" />
      <ModalAddBankAccount 
        visible={visible}
        onSubmit={() => setVisible(!visible)} 
        onCancel={() => setVisible(!visible)}
      />

      <Spacer size={30} />
      
      <Label>Taxes</Label>
      <Spacer size={20} />
      <Row width="100%">
        <Col width="48%">
          <Input
            label="Tax Name"
            width="100%"
            height="48px"
            placeholder="e.g Tax Items"
          />
          <Spacer size={20} />
        </Col>
        <Row gap="16px" width="100%">
          <Col width="48%">
            <Dropdown
              label="Tax City"
              width="100%"
              actionLabel="Add New Tax City"
              isShowActionLabel
              handleClickActionLabel={() => { }}
              noSearch
            />
          </Col>
          <Col width="48%">
            <TextArea
              label="Tax Name"
              width="100%"
              placeholder="e.g Jalan Soekarano Hatta No.1"
              height="48px"
            />
          </Col>
        </Row>
      </Row>
  
      <Spacer size={30} />

      <Label>Currency</Label>
      <Row gap="16px" width="100%">
        <Col width="48%">
          <Dropdown
            label="Currency Code"
            width="100%"
            actionLabel="Add New Currency Code"
            isShowActionLabel
            handleClickActionLabel={() => { }}
            noSearch
          />
        </Col>
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