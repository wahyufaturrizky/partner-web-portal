import React, { useState } from 'react'
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
import { Controller } from 'react-hook-form';
import IconAdd from 'assets/icons/ICAdd'


import ModalAddBankAccount from 'components/elements/Modal/ModalAddBankAccount'
import { useCurrenciesMDM } from 'hooks/company-list/useCompany';
import { columnsInvoicingTableBank } from '../constants';

export default function Invoicing(props: any) {
  const {
    fieldsBank,
    errorsFormBank,
    handleBankSubmit,
    isSubmitSuccessful,
    onHandleBankSubmit,
    bankRegister,
    removeBank,

    control,
    register,
  } = props
  const [search, setSearch] = useState({
    currency: '',
    taxAddress: '',
    taxCity: '',
    expanse: '',
    income: ''
  })
  const [visible, setVisible] = useState(false)

  const listFakeIncomeAccount = [
    { value: 'RP. 2.000.000 - Payment', id: 'payment' },
    { value: 'RP. 5.000.000 - Income', id: 'income' },
    { value: 'RP. 10.000.000 - Bonus', id: 'bonus' },
  ]

  const listFakeTaxCity = [
    { value: 'DIY Yogyakarta', id: 'yogyakarta' },
    { value: 'Jakarta', id: 'jakarta' },
    { value: 'Lampung', id: 'lampung' },
    { value: 'Bandung', id: 'bandung' },
  ]

  const { data: listCurrencies } = useCurrenciesMDM({
    options: { onSuccess: () => {} },
    query: { search: search.currency }
  })

  const _listCurrencies = listCurrencies?.rows?.map((items: any) => ({
      id: items?.currency,
      value: items?.currencyName
    }))

  const _columnsInvoicingTableBank =
    columnsInvoicingTableBank(removeBank).filter(
      ({ dataIndex }) => dataIndex !== "id" && dataIndex !== "key"
  )

  return (
    <div>
      <Label>Account Receivable</Label>
      <Spacer size={20} />
      <Row gap="16px" width="100%">
        <Col width="48%">
          <Input
            label="Credit Limit"
            width="100%"
            type="number"
            height="50px"
            {...register('invoicing.credit_limit')}
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
            {...register('invoicing.credit_balance')}
          />
          <Spacer size={10} />
          <Controller
            control={control}
            name="invoicing.income_account"
            render={({ field: { onChange } }) => (
              <Dropdown
                label="Income Account"
                noSearch
                width="100%"
                actionLabel="Add New Income Account"
                isShowActionLabel
                handleChange={onChange}
                items={_columnsInvoicingTableBank}
                handleClickActionLabel={() => { }}
              />
            )}/>
        </Col>
      </Row>
      <Spacer size={30} />
      <Label>Account Payable</Label>
      <Spacer size={20} />
      <Row width="100%">
        <Col width="48%">
          <Controller
            control={control}
            name="invoicing.expense_account"
            render={({ field: { onChange } }) => (
              <Dropdown
                label="Expense Account"
                width="100%"
                actionLabel="Add New Expense Account"
                isShowActionLabel
                handleChange={onChange}
                noSearch
                items={listFakeIncomeAccount}
            />
          )} />
        </Col>
      </Row>
      <Spacer size={30} />
      <Label>Bank Account</Label>
      <Spacer size={20} />
      <Button
        size="big"
        variant="primary"
        onClick={() => setVisible(true)}>
        <IconAdd /> Add Bank Account
      </Button>
      <Spacer size={20} />
      <Table
        width="100%"
        data={fieldsBank || []}
        columns={_columnsInvoicingTableBank}
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
            <Controller
              control={control}
              name="invoicing.tax_city"
              render={({ field: { onChange } }) => (
                <Dropdown
                  label="Tax City"
                  width="100%"
                  actionLabel="Add New Tax City"
                  isShowActionLabel
                  items={listFakeTaxCity}
                  handleClickActionLabel={() => { }}
                  handleChange={onChange}
                />
              )} />
            
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
          <Controller
            control={control}
            name="invoicing.currency"
            render={({ field: { onChange } }) => (
              <>
                <Dropdown
                  label="Currency Code"
                  width="100%"
                  actionLabel="Add New Currency Code"
                  isShowActionLabel
                  items={_listCurrencies}
                  onSearch={(value: string) => setSearch({ ...search, currency: value })}
                  handleClickActionLabel={() => window.open('/')}
                  handleChange={onChange}
                />
              </>
            )}
          />
        </Col>
      </Row>

      {/* modal create list-bank */}
      <ModalAddBankAccount
        onCancel={() => setVisible(false)}
        visible={visible}
        fieldsBank={fieldsBank}
        handleBankSubmit={handleBankSubmit}
        errorsFormBank={errorsFormBank}
        onHandleBankSubmit={onHandleBankSubmit}
        bankRegister={bankRegister}
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