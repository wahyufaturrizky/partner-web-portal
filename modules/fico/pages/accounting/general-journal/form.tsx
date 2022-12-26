/* eslint-disable react/no-unused-prop-types */
import { Row } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import React, { useEffect } from 'react';
import { IForm } from 'interfaces/interfaces';
import moment from 'moment';
import { errorMaxLength, errorMaxValue, errorMinValue } from 'constants/errorMsg';
import { useQueryMasterKurs } from 'hooks/master-data/useMasterKurs';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { FormGLAccount, GLAccountFields } from './form-gl-account';

export type GeneralJournalFields = {
  company_code: string,
  company_name: string,
  company_currency: string;
  fiscal_year: string,
  document_number: string,
  header_text: string,
  reference: string,
  currency: string,
  posting_period: number,
  posting_date: string,
  document_type: string,
  document_date: string,
  exchange_rate: string,
  rate: number,
  state: string,
  type: string,
  balance: number,
  items?: GLAccountFields[],

  gl_accounts: string[],
  posting_keys: string[],
  dc: string[],
  assignments: string[],
  texts: string[],
  amounts: number[],
  tax_codes: string[],
  cost_centers: string[],
  profit_centers: string[],
  order_list: string[],
  local_currencies?: number[],
}

export const getPayload = (data: GeneralJournalFields) => {
  const payload = { ...data };
  delete payload.items;
  delete payload.local_currencies;

  return {
    ...payload,
    document_number: `${payload.document_number}`,
    document_date: moment(payload.document_date).format('YYYY-MM-DD'),
    posting_date: moment(payload.posting_date).format('YYYY-MM-DD'),
    posting_period: Number(moment(payload.posting_date).format('M')),
    fiscal_year: moment(payload.document_date).format('YYYY'),
    exchange_rate: moment(data.exchange_rate).format('YYYY-MM-DD'),
  };
};

export const FormGeneralJournal = (props: IForm<GeneralJournalFields>) => {
  const { form } = props;

  useEffect(() => {
    const rate = form.getValues('rate');
    const items = form.getValues('items');
    const companyCurrency = form.getValues('company_currency');
    const selectedCurrency = form.getValues('currency');

    const newItems = items?.map((item) => {
      let localCurrency = item.ammount;
      if (companyCurrency !== selectedCurrency) localCurrency = item.ammount * rate;

      return {
        ...item, local_currency: parseFloat(localCurrency.toFixed(2)),
      };
    });

    form.setValue('items', newItems);
  }, [form.getValues('rate')]);

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<GeneralJournalFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterKurs = useQueryMasterKurs({
    query: { search: getSearchValue('currency') },
  });

  const fields: IField<GeneralJournalFields>[] = [
    {
      id: 'document_number',
      type: 'text',
      label: 'Document Number',
      disabled: true,
    },
    {
      id: 'document_type',
      type: 'text',
      label: 'Document Type',
      placeholder: 'SA',
      disabled: true,
    },
    {
      id: 'document_date',
      type: 'datepicker',
      label: 'Document Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
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
    {
      id: 'posting_date',
      type: 'datepicker',
      label: 'Posting Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'currency',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Currency',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
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
      validation: { required: '* required', maxLength: errorMaxLength(10) },
    },
    {
      id: 'exchange_rate',
      type: 'datepicker',
      label: 'Exchange Rate',
      validation: { required: '* required' },
    },
    {
      id: 'header_text',
      type: 'text',
      label: 'Header Text',
      placeholder: 'Type here...',
      // validation: { required: '* required' },
    },
    {
      id: 'balance',
      type: 'currency',
      label: 'Balance',
      disabled: true,
      validation: {
        required: '* please complete G/L table',
        max: errorMaxValue(0, '* balance must be 0'),
        min: errorMinValue(0, '* balance must be 0'),
      },
    },
    { id: '', type: '' },
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
      <FormGLAccount form={form} />
    </Card>
  );
};
