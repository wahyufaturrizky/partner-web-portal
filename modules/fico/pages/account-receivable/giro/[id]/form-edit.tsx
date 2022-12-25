/* eslint-disable react/no-unused-prop-types */
import { Row } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import React from 'react';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { IForm } from 'interfaces/interfaces';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import { useQueryMasterCustomer } from 'hooks/master-data/useMasterCustomer';

export type EditCekGiroFields = {
  company_code: string,
  profit_center: string,
  customer_id: string,
  giro_date: string,
  giro_number: number,
  giro_name: string,
  bank_name: string,
  bank_account_name: string,
  type: string,
  giro_amount: number,
  due_date: string,
  cash_date: string,
  status: number,
}

export const FormCreateCekGiro = (props: IForm<EditCekGiroFields>) => {
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<EditCekGiroFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('profit_center') },
  });
  const queryMasterCustomer = useQueryMasterCustomer({
    query: { search: getSearchValue('customer_id') },
  });

  const transactionType = [
    { id: 'Giro', name: 'Giro' },
    { id: 'Cek', name: 'Cek' },
  ];
  const { form } = props;
  const { getValues } = form;
  const formStatus = getValues('status') === 2;

  const fields: IField<EditCekGiroFields>[] = [
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      disabled: formStatus,
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'profit_center',
      type: 'dropdown',
      label: 'Profit Center',
      placeholder: 'Select',
      disabled: formStatus,
      datasources: queryMasterProfitCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'customer_id',
      type: 'dropdown-texbox',
      label: 'Customer No',
      placeholder: 'Select',
      datasources: queryMasterCustomer.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: formStatus,
    },
    {
      id: 'type',
      type: 'dropdown',
      label: 'Type',
      placeholder: 'Select',
      datasources: transactionType.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      disabled: formStatus,
    },
    {
      id: 'cash_date',
      type: 'datepicker',
      label: 'Cash Date',
      placeholder: 'DD/MM/YYYY',
      disabled: formStatus,
    },
    {
      id: 'giro_date',
      type: 'datepicker',
      label: 'Date Receipt Of Cek/Giro',
      placeholder: 'DD/MM/YYYY',
      disabled: formStatus,
    },
    {
      id: 'giro_name',
      type: 'text',
      label: 'Cek/Giro Name',
      placeholder: 'e.g John Doe',
      disabled: formStatus,
    },
    {
      id: 'giro_number',
      type: 'number',
      label: 'No Cek/Giro',
      placeholder: 'e.g 1',
      disabled: formStatus,
    },
    {
      id: 'bank_name',
      type: 'text',
      label: 'Bank Name',
      placeholder: 'e.g Bank Mandiri',
      disabled: formStatus,
    },
    {
      id: 'bank_account_name',
      type: 'text',
      label: 'Bank Account Name',
      placeholder: 'e.g John Doe',
      disabled: formStatus,
    },
    {
      id: 'giro_amount',
      type: 'currency',
      label: 'Value Cek/Giro',
      placeholder: 'e.g 1234656',
      disabled: formStatus,
    },
    {
      id: 'due_date',
      type: 'datepicker',
      label: 'Due Date',
      placeholder: 'DD/MM/YYYY',
      disabled: formStatus,
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
    </Card>
  );
};
