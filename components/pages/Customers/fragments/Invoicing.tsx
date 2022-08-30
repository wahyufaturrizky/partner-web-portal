import React from 'react'
import styled from 'styled-components'
import {
  Table,
  Button,
  Input,
  Spacer,
  Dropdown,
  Dropdown2,
  Row,
  Col,
} from 'pink-lava-ui'
import { ICDelete, ICEdit } from "../../../../assets";

import ModalAddBankAccount from '../../../elements/Modal/ModalAddBankAccount'
import IconAdd from '../../../../assets/icons/ICAdd'

export default function Invoicing(props: any) {
  const {
    setValueInvoicing,
    register,
    visible,
    setVisible,
    onHandleEdit,
    handleSubmitBankAccount,
    registerBankAccount,
    errorsBankAccount,
    handleAddItemBankAccount,
    fieldsBankAccount,
    removeBankAccount,
  } = props

  const columns = [
    { title: "", dataIndex: "key" },
    { title: "", dataIndex: "id" },
    {
      title: "",
      dataIndex: "action",
      width: "15%",
      render: (_: any, record: any) => (
        <Row gap="16px" alignItems="center" nowrap>
          <Col>
            <ICEdit onClick={() => onHandleEdit(record)}/>
          </Col>
          <Col>
            <ICDelete onClick={() => removeBankAccount(record.key)} />
          </Col>
        </Row>
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

  const listFakeIncomeAccount = [
    { value: 'RP. 2.000.000 - Payment', id: 'payment' },
    { value: 'RP. 5.000.000 - Income', id: 'income' },
    { value: 'RP. 10.000.000 - Bonus', id: 'bonus' },
  ]

  return (
    <div>
      <Label>Account Receivable</Label>
      <Spacer size={20} />
      <Row gap="16px" width="100%">
        <Col width="48%">
          <Input
            label="Credit Limit"
            width="100%"
            height="50px"
            required
            {...register('invoicing.credit_limit', {
              // required: 'credit limit must be filled'
            })}
          />
          <Spacer size={10} />
          <Input
            label="Credit Used"
            width="100%"
            height="50px"
            disabled
            {...register('invoicing.credit_used')}
          />
        </Col>
        <Col width="48%">
          <Input
            label="Credit Balance"
            width="100%"
            height="50px"
            disabled
            errors={errorsBankAccount}
            {...register('invoicing.credit_balance')}
          />
          <Spacer size={10} />
          <Dropdown2
            label="Income Account"
            width="100%"
            actionLabel="Add New Income Account"
            isShowActionLabel
            items={listFakeIncomeAccount}
            handleClickActionLabel={() => { }}
            handleChange={(value: string) =>
              setValueInvoicing("invoicing.income_account", value)}
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
            items={listFakeIncomeAccount}
            handleChange={(value: string) =>
              setValueInvoicing("invoicing.expense_account", value)}
          />
        </Col>
      </Row>

      <Spacer size={30} />

      <Label>Bank Account</Label>
      <Spacer size={20} />
      <Button
        size="big"
        variant={"primary"}
        onClick={() => setVisible(!visible)}
      >
        <IconAdd /> Add Bank Account
      </Button>
      <Spacer size={20} />
      <Table
        columns={columns.filter(
          (filtering) => filtering?.dataIndex !== "id" && filtering?.dataIndex !== "key"
        )}
        data={fieldsBankAccount}
        width="100%"
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
            {...register('invoicing.tax_name')}
          />
          <Spacer size={20} />
        </Col>
        <Row gap="16px" width="100%">
          <Col width="48%">
            <Dropdown2
              label="Tax City"
              width="100%"
              actionLabel="Add New Tax City"
              isShowActionLabel
              items={listFakeIncomeAccount}
              handleClickActionLabel={() => { }}
              handleChange={(value: any) => {
                setValueInvoicing('invoicing.tax_city', value)
              }}
            />
          </Col>
          <Col width="48%">
            <Input
              label="Tax Address"
              width="100%"
              placeholder="e.g Jalan Soekarano Hatta No.1"
              height="48px"
              {...register('invoicing.tax_address')}
            />
          </Col>
        </Row>
      </Row>
  
      <Spacer size={30} />

      <Label>Currency</Label>
      <Spacer size={10} />
      <Row gap="16px" width="100%">
        <Col width="48%">
          <Dropdown
            label="Currency Code"
            width="100%"
            actionLabel="Add New Currency Code"
            isShowActionLabel
            items={listFakeIncomeAccount}
            handleClickActionLabel={() => { }}
            handleChange={(value: any) => {
              setValueInvoicing('invoicing.currency', value)
            }}
          />
        </Col>
      </Row>

      {/* modal create list-bank */}
      <ModalAddBankAccount
        errorsBankAccount={errorsBankAccount}
        handleAddItemBankAccount={handleAddItemBankAccount}
        handleSubmitBankAccount={handleSubmitBankAccount}
        registerBankAccount={registerBankAccount}
        visible={visible}
        onCancel={() => setVisible(!visible)}
      />
    </div>
  )
}

const Label = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #1E858E;
`