/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import {
  Row, Accordion,
} from 'pink-lava-ui';
import { FormBuilder, IField } from 'components/FormBuilder';
import { IForm } from 'interfaces/interfaces';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterCustomer } from 'hooks/master-data/useMasterCustomer';
import { useQueryMasterVendor } from 'hooks/master-data/useMasterVendor';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import moment from 'moment';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterControllArea } from 'hooks/master-data/useMasterControllArea';
import { useQueryMasterKurs } from 'hooks/master-data/useMasterKurs';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';

export type RevaluationForexFields = {
  company_code: string;
  valuation_key_date: string;
  valuation_area: string;
  document_date: string;
  reversal_posting_date: string;
  posting_date: string;
  reversal_posting_period: number;
  posting_period: number;
  currency_from: string;
  currency_to: string;
  document_number_from: string;
  document_number_to: string;
  fiscal_year_from: string;
  fiscal_year_to: string;
  vendor_from: string;
  vendor_to: string;
  customer_from: string;
  customer_to: string;
  gl_account_from: string;
  gl_account_to: string;
  variant: string;
}

export const getPayload = (data: RevaluationForexFields): RevaluationForexFields => {
  const payload = { ...data };
  return {
    ...payload,
    document_date: payload.document_date ? moment(payload.document_date).format('YYYY-MM-DD') : payload.document_date,
    posting_date: payload.posting_date ? moment(payload.posting_date).format('YYYY-MM-DD') : payload.posting_date,
    valuation_key_date: payload.valuation_key_date ? moment(payload.valuation_key_date).format('YYYY-MM-DD') : payload.valuation_key_date,
    reversal_posting_date: payload.reversal_posting_date ? moment(payload.reversal_posting_date).format('YYYY-MM-DD') : payload.reversal_posting_date,
    posting_period: Number(payload.posting_period) || payload.posting_period,
    reversal_posting_period: Number(payload.reversal_posting_period) || payload.reversal_posting_period,
  };
};
export const FormRevaluationForex = (props: IForm<RevaluationForexFields>) => {
  const { form } = props;
  const { getSearchValue, setSearchDropdown } = useSearchDropdown<RevaluationForexFields>();

  const serviceGeneralJournal = useGeneralJournal();
  const queryDocumentNumber = serviceGeneralJournal.getList({
    query: { search: getSearchValue('document_number_from') || getSearchValue('document_number_to') },
  });
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterControllArea = useQueryMasterControllArea({
    query: { search: getSearchValue('valuation_area'), company_code: form.getValues('company_code') },
  });
  const queryMasterCustomerFrom = useQueryMasterCustomer({
    query: { search: getSearchValue('customer_from'), company_code: form.getValues('company_code') },
  });
  const queryMasterCustomerTo = useQueryMasterCustomer({
    query: { search: getSearchValue('customer_to'), company_code: form.getValues('company_code') },
  });
  const queryMasterVendorFrom = useQueryMasterVendor({
    query: { search: getSearchValue('vendor_from'), company_code: form.getValues('company_code') },
  });
  const queryMasterVendorTo = useQueryMasterVendor({
    query: { search: getSearchValue('vendor_to'), company_code: form.getValues('company_code') },
  });
  const queryMasterGLFrom = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('gl_account_from'), company_code: form.getValues('company_code') },
  });
  const queryMasterGLTo = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('gl_account_to'), company_code: form.getValues('company_code') },
  });
  const queryMasterKurs = useQueryMasterKurs({
    query: { search: getSearchValue('currency_from') || getSearchValue('currency_to') },
  });

  const fields: Array<IField> = [
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      onChange: () => {
        form.reset({
          ...form.getValues(),
          valuation_area: undefined,
          customer_from: undefined,
          customer_to: undefined,
          vendor_from: undefined,
          vendor_to: undefined,
        });
      },
    },
    { id: '', type: '' },
    {
      id: 'valuation_key_date',
      type: 'datepicker',
      label: 'Valuation Key Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'valuation_area',
      type: 'dropdown',
      label: 'Valuation Area',
      placeholder: 'Select',
      datasources: queryMasterControllArea.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
  ];

  const fieldsPostingParameter: Array<IField> = [
    {
      id: 'document_date',
      type: 'datepicker',
      label: 'Document Date',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'reversal_posting_date',
      type: 'datepicker',
      label: 'Reversal Posting Date',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'posting_date',
      type: 'datepicker',
      label: 'Posting Date',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'reversal_posting_period',
      type: 'monthpicker',
      label: 'Reversal Posting Period',
      placeholder: 'MM',
      // validation: { required: '* required' },
    },
    {
      id: 'posting_period',
      type: 'monthpicker',
      label: 'Posting Period',
      placeholder: 'MM',
      // validation: { required: '* required' },
    },
  ];

  const fieldsCentralSelection: Array<IField> = [
    {
      id: 'currency_from',
      type: 'dropdown',
      label: 'Currency From',
      placeholder: 'Select',
      datasources: queryMasterKurs.data?.map((v) => ({ id: v.id, value: v.text })),
      // validation: { required: '* required' },
    },
    {
      id: 'currency_to',
      type: 'dropdown',
      label: 'Currency To',
      placeholder: 'Select',
      datasources: queryMasterKurs.data?.map((v) => ({ id: v.id, value: v.text })),
      // validation: { required: '* required' },
    },
    {
      id: 'document_number_from',
      type: 'dropdown',
      label: 'Document Number From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryDocumentNumber.data?.data?.map((v) => ({ id: v.document_number, value: v.document_number })),
    },
    {
      id: 'document_number_to',
      type: 'dropdown',
      label: 'Document Number To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryDocumentNumber.data?.data?.map((v) => ({ id: v.document_number, value: v.document_number })),
    },
    {
      id: 'fiscal_year_from',
      type: 'yearpicker',
      label: 'Fiscal Year From',
      placeholder: 'YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'fiscal_year_to',
      type: 'yearpicker',
      label: 'Fiscal Year To',
      placeholder: 'YYYY',
      // validation: { required: '* required' },
    },
  ];

  const fieldsLogOutput: Array<IField> = [
    {
      id: 'vendor_from',
      type: 'dropdown',
      label: 'Vendor From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterVendorFrom.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'vendor_to',
      type: 'dropdown',
      label: 'Vendor To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterVendorTo.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'customer_from',
      type: 'dropdown',
      label: 'Customer From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCustomerFrom.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'customer_to',
      type: 'dropdown',
      label: 'Customer To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCustomerTo.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'gl_account_from',
      type: 'dropdown',
      label: 'G/L Account From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGLFrom.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'gl_account_to',
      type: 'dropdown',
      label: 'G/L Account To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGLTo.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
  ];

  return (
    <>
      <Accordion style={{ maxHeight: '280px' }}>
        <Accordion.Item key={2}>
          <Accordion.Header variant="blue">General Selection</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fields}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Posting Parameter</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsPostingParameter}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Central Selection</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsCentralSelection}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Log Output</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsLogOutput}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
