/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unused-prop-types */
import { Row, Button } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { css } from '@emotion/css';
import { FormBuilder, IField } from 'components/FormBuilder';
import React from 'react';
import {
  DS_BANK_ACCOUNT, DS_COLLECTOR, DS_COMPANY, DS_OUTLET, DS_SALES,
} from 'constants/datasources';
import { IForm } from 'interfaces/interfaces';

export type AccountReceivableFields = {
  company_code: string;
  doc_date: string;
  post_date: string;
  sales: string;
  no_outlet: string;
  collector: string;
  bank_account: string;
  description: string;
}

export const FormAccountReceivable = (props: IForm<AccountReceivableFields>) => {
  const { form } = props;

  const fields: IField<AccountReceivableFields>[] = [
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      datasources: DS_COMPANY.map((v) => ({ id: v.id, value: v.name })),
      validation: { required: '* required' },
    },
    {
      id: '', type: '',
    },
    {
      id: 'doc_date',
      type: 'datepicker',
      label: 'Document Date',
      validation: { required: '* required' },
    },
    {
      id: 'post_date',
      type: 'datepicker',
      label: 'Posting Date',
      validation: { required: '* required' },
    },
    {
      id: 'sales',
      type: 'dropdown-texbox',
      label: 'Sales',
      placeholder: 'Select',
      datasources: DS_SALES.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'no_outlet',
      type: 'dropdown-texbox',
      label: 'No Outlet',
      placeholder: 'Select',
      datasources: DS_OUTLET.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'collector',
      type: 'dropdown-texbox',
      label: 'Collector',
      placeholder: 'Select',
      datasources: DS_COLLECTOR.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'bank_account',
      type: 'dropdown-texbox',
      label: 'Bank Acc.',
      placeholder: 'Select',
      datasources: DS_BANK_ACCOUNT.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Type here..',
      validation: { required: '* required' },
    },
    {
      id: '',
      type: 'custom',
      render: <Button
        className={css`
          margin-top: 24px;
          border-radius: 5px;
          height: 48px;
        
          :hover:enabled {
            background-color: #EB008B;
            color: #fff;
            border: 0;
          }
        `}
        variant="tertiary"
        size="big"
        // disabled={!isValid}
      >
        Show Data
      </Button>,
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
