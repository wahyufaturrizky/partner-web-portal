/* eslint-disable react/no-unused-prop-types */
import { Row } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import React, { useEffect } from 'react';
import { DS_CURRENCY, DS_OUTLET } from 'constants/datasources';
import { IForm } from 'interfaces/interfaces';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { FormDownPayment, DPAccountFields } from './form-gl-account';

export type DownPaymentFields = {
  company_code: string,
  doc_number: number,
  doc_type: string,
  doc_date: string,
  doc_date_obj: { Time: string },
  period: number,
  posting_date: string,
  posting_date_obj: { Time: string },
  currency_id: number,
  reference: string,
  translation_date: string,
  header_text: string,
  taxreporting_date: string,
  trading_part: string,
  outlet_id: number,
  gl_id: number,
  status: string,
  items: DPAccountFields[],

  amount_doc: number,
  amount_loc: string,
  tax_code: string,
  tax_amount: number,
  po_type: string,
  po_item: string,
  assign: string,
  text: string,
  payment_reference: string,
  payment_block: string,
  payment_method: string,
  profit_center: string,
  due_date: string,
  order: string,
  // gl_accounts: string[],
  // posting_keys: string[],
  // dc: string[],
  // assignments: string[],
  // texts: string[],
  // tax_codes: string[],
  // cost_centers: string[],
  // profit_centers: string[],
  // order_list: string[],
}

export const FormGeneralJournal = (props: IForm<DownPaymentFields>) => {
  const { form } = props;
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<DownPaymentFields>();
  useEffect(() => {
    form.setValue('doc_type', 'DC');
  }, []);
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterGeneralLedger = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('gl_id') },
  });

  const fields: IField<DownPaymentFields>[] = [
    {
      id: 'doc_number',
      type: 'text',
      label: 'Document Number',
      placeholder: 'e.g 12345679',
      disabled: false,
    },
    {
      id: 'doc_type',
      type: 'text',
      label: 'Document Type',
      placeholder: 'SA',
      disabled: true,
    },
    {
      id: 'company_code',
      type: 'dropdown-texbox',
      label: 'Company Code',
      placeholder: 'Select',
      disabled: false,
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: v.id, description: v.text })),
    },
    { id: '', type: '' },
    {
      id: 'doc_date',
      type: 'datepicker',
      label: 'Document Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'period',
      type: 'yearpicker',
      label: 'Period',
      placeholder: 'YYYY',
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
      id: 'currency_id',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Currency',
      placeholder: 'Select',
      datasources: DS_CURRENCY.map((v) => ({ id: v.id, value: v.name })),
    },
    {
      id: 'reference',
      type: 'text',
      label: 'Reference',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    {
      id: 'translation_date',
      type: 'datepicker',
      label: 'Translation Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    // {
    //   id: 'exchange_rate',
    //   type: 'datepicker',
    //   label: 'Exchange Rate',
    //   placeholder: 'DD/MM/YYYY',
    //   validation: { required: '* required' },
    // },
    {
      id: 'header_text',
      type: 'text',
      label: 'Header Text',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    {
      id: 'taxreporting_date',
      type: 'datepicker',
      label: 'Tax Reporting Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'trading_part',
      type: 'text',
      label: 'Trading Part. BA',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'outlet_id',
      type: 'dropdown-texbox',
      label: 'Outlet',
      disabled: false,
      validation: { required: '* required' },
      datasources: DS_OUTLET.map((v) => ({ id: v.id, value: v.name })),
    },
    {
      id: 'gl_id',
      type: 'dropdown-texbox',
      label: 'G/L Account',
      placeholder: 'Select',
      disabled: false,
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGeneralLedger.data?.map((v) => ({ id: v.id, value: v.id, description: v.text })),
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
      <Divider dashed />
      <FormDownPayment form={form} />
    </Card>
  );
};
