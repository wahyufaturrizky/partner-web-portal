/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Row } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import React, { useEffect } from 'react';
import { IForm } from 'interfaces/interfaces';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { DS_CASH_TYPE, DS_HOUSE_BANK } from 'constants/datasources';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { useQueryMasterTax } from 'hooks/master-data/useMasterTax';
import { useQueryMasterBank } from 'hooks/master-data/useMasterBank';
import { useQueryMasterVendor } from 'hooks/master-data/useMasterVendor';
import { useQueryMasterCustomer } from 'hooks/master-data/useMasterCustomer';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import moment from 'moment';

export type CashBankFields = {
  company_code: string,
  cash_journal: string,
  business_transaction: string,
  amount: number,
  cash_type: string,
  tax_code: string,
  gl_account: string,
  house_bank: string,
  account_id: string,
  tax_report: string,
  text: string,
  receipt_recipient: string,
  vendor: string,
  customer: string,
  document_number: string,
  document_date: string,
  posting_date: string,
  net_amount: number,
  reference: string,
  business_area: string,
  assignment: string,
  tax_base_amount: number,
  cost_center: string,
  profit_center: string,
  order: string,
  activity_type: string,
  state: string
}

export const getPayload = (data: CashBankFields) => ({
  ...data,
  amount: Number(data.amount),
  net_amount: Number(data.net_amount),
  tax_base_amount: Number(data.tax_base_amount),
  posting_date: moment(data.posting_date).format('YYYY-MM-DD'),
  document_date: moment(data.document_date).format('YYYY-MM-DD'),
  order: `${data.order}`,
});

export const FormCashBank = (props: IForm<CashBankFields>) => {
  const { form } = props;

  useEffect(() => {
    form.setValue('company_code', 'PP01');
  }, []);

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<CashBankFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterGL = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('cash_journal'), company_code: form.getValues('company_code') },
  });
  const queryMasterTax = useQueryMasterTax({
    query: { req: getSearchValue('tax_code') },
  });
  const queryMasterBank = useQueryMasterBank({
    query: { search: getSearchValue('house_bank'), company_code: form.getValues('company_code') },
  });
  const queryMasterVendor = useQueryMasterVendor({
    query: { search: getSearchValue('vendor'), company_code: form.getValues('company_code') },
  });
  const queryMasterCustomer = useQueryMasterCustomer({
    query: { search: getSearchValue('customer'), company_code: form.getValues('company_code') },
  });
  const queryMasterCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('cost_center'), company_code: form.getValues('company_code') },
  });
  const queryMasterProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('customer'), company_code: form.getValues('company_code') },
  });
  // const queryMasterAccount = useQueryMasterAccount({
  //   query: { search: getSearchValue('cash_journal'), company_code: form.getValues('company_code') },
  // });
  // const queryMasterCashJournal = useQueryMasterCashJournal({
  //   query: { search: getSearchValue('cash_journal'), company_code: form.getValues('company_code') },
  // });

  const fields: IField<CashBankFields>[] = [
    {
      id: 'business_transaction',
      type: 'dropdown',
      label: 'Business Transaction',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'amount',
      type: 'currency',
      label: 'Amount',
      placeholder: 'e.g 1.000.000',
      validation: { required: '* required' },
    },
    {
      id: 'cash_type',
      type: 'dropdown',
      label: 'Cash Type',
      placeholder: 'Select',
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: DS_CASH_TYPE?.map((v) => ({ id: v.id, value: `${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'cash_journal',
      type: 'dropdown',
      label: 'Cash Journal',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'tax_code',
      type: 'dropdown',
      label: 'Tax Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterTax.data?.map((v) => ({ id: v.tax_code, value: `${v.tax_code} - ${v.description}` })),
      validation: { required: '* required' },
    },
    {
      id: 'gl_account',
      type: 'dropdown',
      label: 'G/L Account',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'house_bank',
      type: 'dropdown',
      label: 'House Bank',
      placeholder: 'Select',
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: DS_HOUSE_BANK?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'account_id',
      type: 'dropdown',
      label: 'Account ID',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterBank.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'tax_report',
      type: 'number',
      label: 'Tax Report (%)',
      placeholder: 'e.g 10',
      validation: { required: '* required' },
    },
    {
      id: 'receipt_recipient',
      type: 'text',
      label: 'Receipt Recipient',
      placeholder: 'e.g. Recipient',
      validation: { required: '* required' },
    },
    {
      id: 'text',
      type: 'text',
      label: 'Text',
      placeholder: 'e.g. Test Text 1',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'vendor',
      type: 'dropdown',
      label: 'Vendor',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterVendor.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'customer',
      type: 'dropdown',
      label: 'Customer',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCustomer.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'posting_date',
      type: 'datepicker',
      label: 'Posting Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'document_date',
      type: 'datepicker',
      label: 'Document Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'document_number',
      type: 'text',
      label: 'Document Number',
      disabled: true,
    },
    {
      id: 'net_amount',
      type: 'currency',
      label: 'Net Amount',
      placeholder: 'e.g 1.000.000',
      validation: { required: '* required' },
    },
    {
      id: 'reference',
      type: 'text',
      label: 'Reference',
      placeholder: 'e.g Reference',
      validation: { required: '* required' },
    },
    {
      id: 'business_area',
      type: 'dropdown',
      label: 'Business Area',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'assignment',
      type: 'text',
      label: 'Assignment',
      placeholder: 'e.g Assignment',
      validation: { required: '* required' },
    },
    {
      id: 'tax_base_amount',
      type: 'currency',
      label: 'Tax Base Amount',
      placeholder: 'e.g 1.000.000',
      validation: { required: '* required' },
    },
    {
      id: 'cost_center',
      type: 'dropdown',
      label: 'Cost Center',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'profit_center',
      type: 'dropdown',
      label: 'Profit Center',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterProfitCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'order',
      type: 'currency',
      label: 'Order',
      placeholder: 'e.g 10',
      // validation: { required: '* required' },
    },
  ];

  return (
    <Card padding="20px">
      <Row width="100%">
        <FormBuilder
          fields={fields}
          column={2}
          useForm={form}
        />
      </Row>
    </Card>
  );
};
