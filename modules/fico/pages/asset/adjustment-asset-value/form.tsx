/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Row, Spacer } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import React from 'react';
import { Label } from 'components/Label';
import { useAdjustmentAssetValue } from 'hooks/asset/useAdjustmentAssetValue';
import { IForm } from 'interfaces/interfaces';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterKurs } from 'hooks/master-data/useMasterKurs';
import { FormGLAccount, GLAccountFields } from './form-gl-account';
import { FormAssetList, AssetListFields } from './form-asset-list';

export type AdjustmentAssetValueFields = {
  doc_number: string,
  doc_date: string,
  doc_type: string,
  period: string,
  posting_date: string,
  company_code: string,
  doc_number_ref: string,
  id_currency: string,
  name_currency: string,
  val_currency: number,
  reference_num: string,
  translat_date: string,
  header_text: string,
  cross_cc_number: string,
  trading_part_ba: string,
  balance: string,
  status: number,
  for_acdoca: Array<GLAccountFields>;
  value_adjusment: Array<AssetListFields>
}

export const getPayload = (data: AdjustmentAssetValueFields) => ({
  ...data,
  doc_number: data.doc_number || '190000005',
  id_currency: Number(data.id_currency),
  val_currency: `${data.val_currency}`,
  period: Number(data.period),
  for_acdoca: JSON.stringify(data.for_acdoca),
  value_adjusment: JSON.stringify(data.value_adjusment),
});

export const FormAdjustmentAssetValue = (props: IForm<AdjustmentAssetValueFields>) => {
  const { form } = props;

  const service = useAdjustmentAssetValue();
  const getDropdownDatasources = service.getDropdownDatasources();
  const datasources = getDropdownDatasources.data;

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AdjustmentAssetValueFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterKurs = useQueryMasterKurs({
    query: { search: getSearchValue('id_currency') },
  });

  const fields: IField<AdjustmentAssetValueFields>[] = [
    {
      id: 'doc_number',
      type: 'text',
      label: 'Doc. Number',
      placeholder: '',
      disabled: true,
    },
    {
      id: 'doc_type',
      type: 'text',
      label: 'Document Type',
      placeholder: '',
      disabled: true,
    },
    {
      id: 'doc_date',
      type: 'datepicker',
      label: 'Doc. Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'period',
      type: 'monthpicker',
      label: 'Period',
      placeholder: 'MM',
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
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'doc_number_ref',
      type: 'text',
      label: 'Document Number Ref.',
      placeholder: 'e.g. 123456',
      validation: { required: '* required' },
    },
    {
      id: 'id_currency',
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

        form.setValue('val_currency', Number(selected.rate));
      },
      flexWidth: 15,
    },
    {
      id: 'val_currency',
      type: 'currency',
      label: '',
      placeholder: '-',
      validation: { required: '* required' },
      flexWidth: 35,
      disabled: true,
    },
    {
      id: 'reference_num',
      type: 'text',
      label: 'Reference',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    {
      id: 'translat_date',
      type: 'datepicker',
      label: 'Translation Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'header_text',
      type: 'text',
      label: 'Header Text',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    {
      id: 'cross_cc_number',
      type: 'text',
      label: 'Cross-CC Number',
      placeholder: 'e.g. 123 456 789',
      validation: { required: '* required' },
    },
    {
      id: 'trading_part_ba',
      type: 'text',
      label: 'Trading Part. BA',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    {
      id: 'balance',
      type: 'currency',
      label: 'Balance',
      placeholder: '',
      disabled: true,
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
      <Label>G/L Account</Label>
      <Spacer size={10} />
      <FormGLAccount form={form} />

      <Divider dashed />
      <Label>Asset List</Label>
      <Spacer size={10} />
      <FormAssetList form={form} datasources={datasources} />
    </Card>
  );
};
