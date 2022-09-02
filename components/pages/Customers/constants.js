
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

  export { listTabItems, status, defaultValuesCreate, addressBodyField }