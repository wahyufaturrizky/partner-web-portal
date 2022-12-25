/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import {
  Row,
} from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQueryMasterGiroNumber } from 'hooks/master-data/useMasterGiroNumber';
import {
  DS_COLLECTOR, DS_OUTLET, DS_SALES,
} from 'constants/datasources';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterDPNumber } from 'hooks/master-data/useMasterDPNumber';

export interface IAccountReceivable {
  sales_id: string;
  outlet_id: string;
  collector_id: string;
  invoice_number: number;
  invoice_type: string;
  invoice_date: string;
  invoice_value: number | string;
  total_payment: number;
  discount_payment: number;
  cash_payment: number;
  giro_number: number;
  giro_payment: string;
  transfer_number: number;
  transfer_payment: string;
  cndn_number: number;
  cndn_num: number;
  cndn_payment: string;
  return_number: string;
  return_payment: string;
  down_payment_number: string;
  down_payment: string;
}

interface IFormAccountReceivable {
  form: UseFormReturn<IAccountReceivable>;
  type?: 'create' | 'update';
}

export const FormAccountReceivable = (props: IFormAccountReceivable) => {
  const { form } = props;
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<IAccountReceivable>();
  const queryMasterGiroNumber = useQueryMasterGiroNumber({
    query: { search: getSearchValue('giro_number') },
  });
  const queryMasterDPNumber = useQueryMasterDPNumber({
    query: { search: getSearchValue('down_payment_number') },
  });

  const fields: Array<IField> = [
    {
      id: 'sales_id',
      type: 'dropdown-texbox',
      label: 'Sales',
      placeholder: 'Select',
      datasources: DS_SALES.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      disabled: true,
    },
    {
      id: 'outlet_id',
      type: 'dropdown-texbox',
      label: 'No Outlet',
      placeholder: 'Select',
      datasources: DS_OUTLET.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      disabled: true,
    },
    {
      id: 'collector_id',
      type: 'dropdown-texbox',
      label: 'Collector',
      placeholder: 'Select',
      datasources: DS_COLLECTOR.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      disabled: true,
    },
    {
      id: 'invoice_number',
      type: 'text',
      label: 'Invoice Number',
      placeholder: '5584020',
      disabled: true,
    },
    {
      id: 'invoice_type',
      type: 'text',
      label: 'I/R',
      placeholder: 'Invoice',
      disabled: true,
    },
    {
      id: 'invoice_date.Time',
      type: 'datepicker',
      label: 'Invoice Date',
      disabled: true,
    },
    {
      id: 'invoice_value',
      type: 'currency',
      label: 'Invoice Value',
      placeholder: '2.500.000',
      disabled: true,
    },
    {
      id: 'total_payment',
      type: 'currency',
      label: 'Total Payment',
      disabled: true,
    },
    {
      id: 'discount_payment',
      type: 'currency',
      label: 'Discount Payment',
      // validation: { required: '* required' },
    },
    {
      id: 'cash_payment',
      type: 'currency',
      label: 'Cash Payment',
      // validation: { required: '* required' },
    },
    {
      id: 'giro_number',
      type: 'dropdown',
      label: 'Cek/Giro Number',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGiroNumber.data?.map((v) => ({ id: v.giro_number, value: v.giro_number, label: v.giro_amount })),
      onChange: ({ target }) => {
        form.setValue('giro_payment', target.selected?.label);
      },
      // validation: { required: '* required' },
    },
    {
      id: 'giro_payment',
      type: 'currency',
      label: 'Cek/Giro Payment',
      // validation: { required: '* required' },
    },
    {
      id: 'transfer_number',
      type: 'number',
      label: 'Transfer Number',
      // validation: { required: '* required' },
    },
    {
      id: 'transfer_payment',
      type: 'currency',
      label: 'Transfer Payment',
      // validation: { required: '* required' },
    },
    {
      id: 'cndn_number',
      type: 'number',
      label: 'CNDN',
      // validation: { required: '* required' },
    },
    {
      id: 'cndn_payment',
      type: 'currency',
      label: 'CNDN Payment',
      // validation: { required: '* required' },
    },
    {
      id: 'return_number',
      type: 'number',
      label: 'Return Number',
      // validation: { required: '* required' },
    },
    {
      id: 'return_payment',
      type: 'currency',
      label: 'Return Payment',
      // validation: { required: '* required' },
    },
    {
      id: 'down_payment_number',
      type: 'dropdown',
      label: 'Down Payment Number',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDPNumber.data?.map((v) => ({ id: v.doc_number, value: v.doc_number, label: v.doc_amount })),
      onChange: ({ target }) => {
        form.setValue('down_payment', target.selected?.label);
      },
      // validation: { required: '* required' },
    },
    {
      id: 'down_payment',
      type: 'currency',
      label: 'Down Payment',
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
