
export interface FormValues {
  profile_picture?: string;
  customer: PropsFormsCustomes
  contact: PropsFormsContact
};

export interface PropsFormSales {
  branch: number
  salesman: number
  term_payment: string
  sales_order_blocking: boolean
  billing_blocking: boolean
  delivery_order_blocking: boolean
}

export interface PropsFormsCustomes {
  name: string
  is_company: boolean
  phone: string
  tax_number: string
  mobile: string
  ppkp: boolean
  website: string
  email: string
  language: number
  customer_group: number
  external_code: string
  company_code: string
}

export interface PropsFormsBank {
  bank_name: string
  account_number: number
  account_name: string
}

export interface PropsFormsContact {
  name: string
  role: string
  email: string
}

export interface PropsFormsAddresses {
  is_primary: boolean
  address_type: string
  street: string
  country: number
  postal_code: string
  longtitude: string
  latitude: string
  lvl_1: number
  lvl_2: number
  lvl_3: number
  lvl_4: number
  lvl_5: number
  lvl_6: number
  lvl_7: number
  lvl_8: number
  lvl_9: number
  lvl_10: number
}

export interface PropsFormsPurchasing {
  term_of_payment: string
}

export interface PropsFormsInvoicing {
  credit_limit: number
  expense_account: string
  credit_balance: number
  tax_name: string
  credit_used: number
  income_account: string
  tax_city: string
  tax_address: string
  currency: string
}
export interface PropsAllForms {
  sales: PropsFormSales
  customer: PropsFormsCustomes
  bank: PropsFormsBank[]
  contact: PropsFormsContact[]
  address: PropsFormsAddresses[]
  purchasing: PropsFormsPurchasing
  invoicing: PropsFormsInvoicing
}
