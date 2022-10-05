import React from 'react'
import { Row, Col } from 'pink-lava-ui'
import { ICDelete, ICEdit } from "assets";

  const addressBodyField = {
    is_primary: false,
    address_type: "",
    street: "",
    country: "",
    province: "",
    city: "",
    district: "",
    zone: "",
    postal_code: "",
    longtitude: "",
    latitude: "",
    key: 0,
  };

  const defaultValuesCreate = {
    name: '',
    is_company: true,
    phone: '',
    tax_number: '',
    mobile: '',
    ppkp: false,
    website: '',
    email: '',
    language: '',
    customer_group: '',
    external_code: '',
    company_code: '',
    bank: [],
    contact: [],
    sales: {
      branch: 0,
      salesman: 0,
      term_payment: "",
      sales_order_blocking: false,
      billing_blocking: false,
      delivery_order_blocking: false
    },
    purchasing: {
      term_of_payment: "enum"
    },
    invoicing: {
      credit_limit: 0,
      expense_account: "",
      credit_balance: 0,
      tax_name: "",
      credit_used: 0,
      income_account: "",
      tax_city: "",
      tax_address: "",
      currency: ""
    },
    address: [addressBodyField],
  }

  const listTabItems = [
    { title: "Contact" },
    { title: "Addresses" },
    { title: "Sales" },
    { title: "Purchasing" },
    { title: "Invoicing" },
  ];

  const status = [
    { id: "ACTIVE", value: "Active" },
    { id: "INACTIVE", value: "Inactive" },
  ]

  const listSalesItems = [
    { label: 'Sales Order Blocking', value: 'sales_order_blocking' },
    { label: 'Invoice/Billing Blocking', value: 'billing_blocking' },
    { label: 'Delivery Order Blocking', value: 'delivery_order_blocking' }
  ]

  const columnsInvoicingTableBank = (removeBank) => [
    { title: "", dataIndex: "key" },
    { title: "", dataIndex: "id" },
    {
      title: "",
      dataIndex: "action",
      width: "15%",
      render: (_, { id }) => (
        <Row gap="16px" alignItems="center" nowrap>
          <Col>
            <ICEdit onClick={() => { }} />
          </Col>
          <Col>
            <ICDelete onClick={() => removeBank(id)} />
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
  ]

export {
  columnsInvoicingTableBank,
  listSalesItems,
  listTabItems,
  status,
  defaultValuesCreate,
  addressBodyField
}