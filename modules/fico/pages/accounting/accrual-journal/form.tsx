/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Row } from 'pink-lava-ui';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Card } from 'components/Card';
import { Divider } from 'components/Divider';
import { DS_REVERSAL_REASON } from 'constants/datasources';
import { useQueryMasterDocumentType } from 'hooks/master-data/useMasterDocumentType';
import { IForm } from 'interfaces/interfaces';
import { errorMaxValue, errorMinValue } from 'constants/errorMsg';
import moment from 'moment';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterKurs } from 'hooks/master-data/useMasterKurs';
import { FormGLAccount, GLAccountFields } from './form-gl-account';

export type AccrualJournalFields = {
  company_code : string,
  company_currency : string,
  document_number : string,
  document_type: string,
  accrue_period : number,
  document_date : string,
  posting_date : string,
  reference : string,
  header_text : string,
  currency : string,
  rate : number,
  reversal_date : string,
  fiscal_year : string,
  reversal_reason : string,
  reversal_reason_description: string,
  cross_cc_number : string,
  balance: number,
  gl_accounts : string[],
  posting_keys : string[],
  amounts : number[],
  tax_codes : string[],
  asset_numbers : string[],
  dc : string[],
  assignments : string[],
  texts : string[],
  cost_centers : string[],
  profit_centers : string[],
  order_list : string[],
  state : string,
  items?: GLAccountFields[]
}

export const getPayload = (data: AccrualJournalFields) => {
  const payload = { ...data };
  delete payload.items;

  return {
    ...payload,
    accrue_period: Number(payload.accrue_period),
    document_number: `${payload.document_number}`,
    document_date: moment(payload.document_date).format('YYYY-MM-DD'),
    posting_date: moment(payload.posting_date).format('YYYY-MM-DD'),
    reversal_date: moment(payload.reversal_date).format('YYYY-MM-DD'),
    fiscal_year: moment(payload.document_date).format('YYYY'),
  };
};

export const FormAccrualJournal = (props: IForm<AccrualJournalFields>) => {
  const { form } = props;

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AccrualJournalFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterKurs = useQueryMasterKurs({
    query: { search: getSearchValue('currency') },
  });
  const queryMasterDocumentType = useQueryMasterDocumentType({
    query: { search: getSearchValue('document_type') },
  });

  const fields: IField<AccrualJournalFields>[] = [
    {
      id: 'document_number',
      type: 'number',
      label: 'Document Number',
      disabled: true,
    },
    {
      id: 'accrue_period',
      type: 'monthpicker',
      label: 'Accrue Period',
      placeholder: 'MM',
      validation: { required: '* required ' },
    },
    {
      id: 'document_date',
      type: 'datepicker',
      label: 'Document Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'document_type',
      type: 'dropdown',
      label: 'Document Type',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDocumentType.data?.map((v) => ({ id: v.id, value: v.text })),
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
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}`, ...v })),
      onChange: ({ target }) => {
        const { selected } = target;
        form.setValue('company_currency', selected.currency);
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
      id: 'header_text',
      type: 'text',
      label: 'Header Text',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
    {
      id: 'reversal_date',
      type: 'datepicker',
      label: 'Reversal Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'cross_cc_number',
      type: 'text',
      label: 'Cross CC Number',
      placeholder: 'Type here...',
      validation: { required: '* required' },
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
    {
      id: 'reversal_reason',
      type: 'dropdown',
      label: 'Reversal Reason',
      placeholder: 'Select',
      datasources: DS_REVERSAL_REASON.map((v) => ({ id: v.id, value: `${v.id} - ${v.name}`, label: v.name })),
      // onChange: ({ target }) => {
      //   setValue('reversal_reason_description', target.label);
      // },
      // flexWidth: 50,
    },
    {
      id: 'reversal_reason_description',
      type: '',
      label: '',
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
      <FormGLAccount form={form} />
    </Card>
  );
};
