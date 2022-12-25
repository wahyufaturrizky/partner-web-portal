/* eslint-disable react/no-unused-prop-types */
import { Row } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import React, { useEffect } from 'react';
import { DS_OUTLET } from 'constants/datasources';
import { IForm } from 'interfaces/interfaces';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { useQueryMasterKurs } from 'hooks/master-data/useMasterKurs';
import moment from 'moment';
import { FormPO, DPAccountFields } from './form-po';

export type DownPaymentFields = {
  company_code: string,
  company_currency: string,
  doc_number: number,
  doc_type: string,
  doc_date: string,
  doc_date_obj: { Time: string },
  period: number,
  posting_date: string,
  posting_date_obj: { Time: string },
  currency_id: string,
  rate: number,
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

export const getPayload = (data: DownPaymentFields) => ({
  ...data,
  doc_number: `${data.doc_number}`,
  taxreporting_date: moment(data.taxreporting_date).format('YYYY-MM-DD'),
  translation_date: moment(data.translation_date).format('YYYY-MM-DD'),
  posting_date: moment(data.posting_date).format('YYYY-MM-DD'),
  period: Number(data.period),
  outlet_id: Number(data.outlet_id),
  gl_id: Number(data.gl_id),
  doc_date: moment(data.doc_date).format('YYYY-MM-DD'),
});

export const FormDownPayment = (props: IForm<DownPaymentFields>) => {
  const { form } = props;
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<DownPaymentFields>();
  useEffect(() => {
    form.setValue('doc_type', 'RE');
    form.setValue('company_code', 'PP01');
  }, []);
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterGeneralLedger = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('gl_id') },
  });
  const queryMasterKurs = useQueryMasterKurs({
    query: { search: getSearchValue('currency_id') },
  });

  const fields: IField<DownPaymentFields>[] = [
    {
      id: 'doc_number',
      type: 'text',
      label: 'Document Number',
      placeholder: 'e.g 12345679',
      disabled: true,
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
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}`, ...v })),
      onChange: ({ target }) => {
        const { selected } = target;
        form.setValue('company_currency', selected.currency);
      },
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
      datasources: queryMasterKurs.data?.map((v) => ({
        ...v, id: v.id, value: v.text, rate: v.value,
      })),
      onChange: ({ target }) => {
        const { selected } = target;

        form.setValue('rate', Number(selected.rate));
      },
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
      type: 'dropdown',
      label: 'Outlet',
      disabled: false,
      validation: { required: '* required' },
      datasources: DS_OUTLET.map((v) => ({ id: v.id, value: `${v.id} - ${v.name}` })),
    },
    {
      id: 'gl_id',
      type: 'dropdown',
      label: 'G/L Account',
      placeholder: 'Select',
      disabled: false,
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGeneralLedger.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}`, description: v.text })),
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
      <FormPO form={form} />
    </Card>
  );
};
