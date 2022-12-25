import { Row, Accordion } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { IForm } from 'interfaces/interfaces';
import { useState } from 'react';
import { useQueryMasterDocumentType } from 'hooks/master-data/useMasterDocumentType';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useAccrualJournal } from 'hooks/accounting/useAccrualJournal';

export type AccrualJournalRunningFields = {
  document_number_from: number;
  document_number_to: number;
  company_code: string;
  fiscal_year: string;
  period: string;
  document_type_from: string;
  document_type_to: string;
  posting_date_from: string;
  posting_date_to: string;
  entry_date_from: string;
  entry_date_to: string;
  settlement_period_from: string;
  settlement_period_to: string;
}

export const FormAccrualJournalRunning = (props: IForm<AccrualJournalRunningFields>) => {
  const { form } = props;
  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });
  const service = useAccrualJournal();

  const getSearchValue = (field: keyof AccrualJournalRunningFields) => {
    if (searchDropdown.field !== field) return null;
    return searchDropdown.search;
  };

  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterDocumentTypeFrom = useQueryMasterDocumentType({
    query: { search: getSearchValue('document_type_from') },
  });
  const queryMasterDocumentTypeTo = useQueryMasterDocumentType({
    query: { search: getSearchValue('document_type_to') },
  });
  const queryDocumentNumber = service.getList({
    onSuccess: () => {},
    onError: () => {},
    query: { search: getSearchValue('document_number_from') || getSearchValue('document_number_to') },
  });

  const fields: IField<AccrualJournalRunningFields>[] = [
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: v.text })),
    },
    { id: '', type: '' },
    {
      id: 'document_number_from',
      type: 'dropdown',
      label: 'Document Number From',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryDocumentNumber.data?.data?.map((v) => ({ id: v.document_number, value: v.document_number })),
    },
    {
      id: 'document_number_to',
      type: 'dropdown',
      label: 'Document Number To',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryDocumentNumber.data?.data?.map((v) => ({ id: v.document_number, value: v.document_number })),
    },
    {
      id: 'fiscal_year',
      type: 'yearpicker',
      label: 'Fiscal Year',
      placeholder: 'YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'period',
      type: 'monthpicker',
      label: 'Period',
      placeholder: 'MM',
      // validation: { required: '* required' },
    },
  ];

  const fieldsGeneralSelection: IField<AccrualJournalRunningFields>[] = [
    {
      id: 'document_type_from',
      type: 'dropdown',
      label: 'Document Type From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDocumentTypeFrom.data?.map((v) => ({ id: v.id, value: v.text })),
    },
    {
      id: 'document_type_to',
      type: 'dropdown',
      label: 'Document Type To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDocumentTypeTo.data?.map((v) => ({ id: v.id, value: v.text })),
    },
    {
      id: 'posting_date_from',
      type: 'datepicker',
      label: 'Posting Date From',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'posting_date_to',
      type: 'datepicker',
      label: 'Posting Date To',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'entry_date_from',
      type: 'datepicker',
      label: 'Entry Date From',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'entry_date_to',
      type: 'datepicker',
      label: 'Entry Date To',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
  ];

  const fieldsFurtherSelection: IField<AccrualJournalRunningFields>[] = [
    {
      id: 'settlement_period_from',
      type: 'monthpicker',
      label: 'Settlement Period From',
      // validation: { required: '* required' },
    },
    {
      id: 'settlement_period_to',
      type: 'monthpicker',
      label: 'Settlement Period To',
      // validation: { required: '* required' },
    },
  ];

  return (
    <>
      <Card padding="20px">
        <Row width="100%">
          <FormBuilder
            fields={fields}
            column={2}
            useForm={form}
          />
        </Row>
      </Card>
      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">General Selection</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsGeneralSelection}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Further Selection</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsFurtherSelection}
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
