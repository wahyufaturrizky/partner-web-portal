/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Accordion, Row, Button } from 'pink-lava-ui';
import { FormBuilder, IField } from 'components/FormBuilder';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ModalChildren } from 'components/modals/ModalChildren';
import { IForm, IModals } from 'interfaces/interfaces';
import DataTable from 'components/DataTable';
import { ModalAlert } from 'components/modals/ModalAlert';
import { DS_REVERSAL_REASON } from 'constants/datasources';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterDocumentType } from 'hooks/master-data/useMasterDocumentType';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';
import { useReversalJournal } from 'hooks/accounting/useReversalJournal';
import moment from 'moment';

export type ReversalJournalFields = {
  company_code : string,
  document_number_from : string,
  document_number_to : string,

  document_type_from : string,
  document_type_to : string,

  document_date_from : string,
  document_date_to : string,
  posting_date_from : string,
  posting_date_to : string,
  reference_number_from : string,
  reference_number_to : string,
  fiscal_year_from : string,
  fiscal_year_to : string,
  reversal_reason : string,
  reversal_reason_description: string,
  posting_date : string,
  posting_period : string,
  tax_reporting_date : string,
  state : string
}

export const getPayload = (data: ReversalJournalFields) => ({
  ...data,
  document_date_from: moment(data.document_date_from).format('YYYY-MM-DD'),
  document_date_to: moment(data.document_date_from).format('YYYY-MM-DD'),
  posting_date_from: moment(data.posting_date_from).format('YYYY-MM-DD'),
  posting_date_to: moment(data.posting_date_to).format('YYYY-MM-DD'),
  posting_date: moment(data.posting_date).format('YYYY-MM-DD'),
  tax_reporting_date: moment(data.tax_reporting_date).format('YYYY-MM-DD'),
  posting_period: Number(data.posting_period) || data.posting_period,
});

type Props = IForm<ReversalJournalFields> & {
  doSubmitTestRun?: () => void
}

export const FormReversalJournal = (props: Props) => {
  const { form, doSubmitTestRun } = props;
  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  // const { configPagination } = useConfigPagination();
  // const pagination = usePagination(configPagination);

  const [modals, setModals] = useState<IModals>({});

  const closeModals = () => setModals({});
  // const doSubmitTestRun = () => setModals({
  //   alert: { open: true, title: 'Submit Success', message: 'Test Run has been successfully submitted' },
  // });
  const service = useReversalJournal();
  const testRun = service.postTestRun({
    onSuccess: () => {
      setModals({
        transaction: { open: true, title: 'Test Run', onOk: () => doSubmitTestRun?.() },
      });
    },
  });

  const getSearchValue = (field: keyof ReversalJournalFields) => {
    if (searchDropdown.field !== field) return null;
    return searchDropdown.search;
  };

  const serviceGeneralJournal = useGeneralJournal();
  const queryDocumentNumberFrom = serviceGeneralJournal.getList({
    query: { search: getSearchValue('document_number_from') },
  });
  const queryDocumentNumberTo = serviceGeneralJournal.getList({
    query: { search: getSearchValue('document_number_to') },
  });
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterDocumentTypeFrom = useQueryMasterDocumentType({
    query: { search: getSearchValue('document_type_from') },
  });
  const queryMasterDocumentTypeTo = useQueryMasterDocumentType({
    query: { search: getSearchValue('document_type_to') },
  });

  const fieldsDocumentDetail: IField<ReversalJournalFields>[] = [
    {
      id: 'document_number_from',
      type: 'dropdown',
      label: 'Document Number From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryDocumentNumberFrom.data?.data?.map((v) => ({ id: v.document_number, value: v.document_number })),
    },
    {
      id: 'document_number_to',
      type: 'dropdown',
      label: 'Document Number To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryDocumentNumberTo.data?.data?.map((v) => ({ id: v.document_number, value: v.document_number })),
    },
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    { id: '', type: '', label: '' },
    {
      id: 'fiscal_year_from',
      type: 'yearpicker',
      label: 'Fiscal Year From',
      // validation: { required: '* required' },
    },
    {
      id: 'fiscal_year_to',
      type: 'yearpicker',
      label: 'Fiscal Year To',
      // validation: { required: '* required' },
    },
  ];

  const fieldsGeneralSelection: IField<ReversalJournalFields>[] = [
    {
      id: 'document_type_from',
      type: 'dropdown',
      label: 'Document Type From',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDocumentTypeFrom.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'document_type_to',
      type: 'dropdown',
      label: 'Document Type To',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDocumentTypeTo.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
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
      id: 'document_date_from',
      type: 'datepicker',
      label: 'Entry Date From',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'document_date_to',
      type: 'datepicker',
      label: 'Entry Date To',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'reference_number_from',
      type: 'number',
      label: 'Reference Number From',
      placeholder: 'Type here...',
      // validation: { required: '* required' },
    },
    {
      id: 'reference_number_to',
      type: 'number',
      label: 'Reference Number To',
      placeholder: 'Type here...',
      // validation: { required: '* required' },
    },
  ];

  const fieldsGeneralSelectionTwo: IField<ReversalJournalFields>[] = [
    {
      id: 'reversal_reason',
      type: 'dropdown',
      label: 'Reversal Reason',
      placeholder: 'Select',
      datasources: DS_REVERSAL_REASON.map((v) => ({ id: v.id, value: `${v.id} - ${v.name}`, label: v.name })),
      // onChange: ({ target }) => {
      //   form.setValue('reversal_reason_description', target.label);
      // },
      flexWidth: 50,
    },
    {
      id: 'reversal_reason_description',
      type: '',
      label: '',
      disabled: true,
    },
    {
      id: 'posting_date',
      type: 'datepicker',
      label: 'Posting Date',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: 'posting_period',
      type: 'monthpicker',
      label: 'Posting Period',
      placeholder: 'MM',
      // validation: { required: '* required' },
    },
    {
      id: 'tax_reporting_date',
      type: 'datepicker',
      label: 'Tax Reporting Date',
      placeholder: 'DD/MM/YYYY',
      // validation: { required: '* required' },
    },
    {
      id: '',
      type: 'custom',
      render: <ButtonStyled
        variant="tertiary"
        size="small"
        onClick={() => {
          testRun.mutate(getPayload(form.getValues()));
        }}
      >
        {testRun.isLoading ? 'Loading...' : 'TEST RUN'}
      </ButtonStyled>,
    },
  ];

  const columns = [
    {
      title: 'Document Number',
      dataIndex: 'document_number',
      fixed: 'left',
    },
    {
      title: 'Company Code',
      dataIndex: 'company_code',
    },
    {
      title: 'Fiscal Year',
      dataIndex: 'fiscal_year',
    },
    {
      title: 'Doc. Type',
      dataIndex: 'document_type',
      width: 150,
    },
    {
      title: 'Posting Date',
      dataIndex: 'posting_date',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Doc. Date',
      dataIndex: 'document_date',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
  ];

  // const data = [
  //   {
  //     ID: 1, document_number: '19000001', company_code: 'PP01', fiscal_year: '2021', document_type: 'SA', posting_date: '10-04-2022', document_date: '11-04-2022', reference: 'Payment Cash', message: 'Document was already reversed',
  //   },
  //   {
  //     ID: 2, document_number: '19000002', company_code: 'PP02', fiscal_year: '2021', document_type: 'SA', posting_date: '10-04-2022', document_date: '11-04-2022', reference: 'Payment Cash', message: 'Ok',
  //   },
  // ];

  return (
    <>
      <Accordion>
        <Accordion.Item key={1}>
          <Accordion.Header variant="blue">Document Detail</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsDocumentDetail}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

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
          <Accordion.Header variant="blue">General Selection</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsGeneralSelectionTwo}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {modals?.transaction && (
        <ModalChildren
          title={modals.transaction.title}
          visible={modals.transaction.open}
          width={1200}
          onCancel={() => closeModals()}
          onOk={() => modals.transaction?.onOk?.()}
          textBtnOk="Submit"
          textBtnCancel="Cancel"
        >
          <Row width="100%">
            <div style={{ width: '100%' }}>
              <DataTable
                rowKey="ID"
                data={testRun.data?.items || []}
                columns={columns}
                scroll={{ x: 1500 }}
              />
            </div>
          </Row>
        </ModalChildren>
      )}
      {modals?.alert && (
        <ModalAlert
          title={modals.alert.title}
          variant={modals.alert.variant}
          message={modals.alert.message}
          visible={modals.alert.open}
          onOk={() => closeModals()}
        />
      )}
    </>
  );
};

const ButtonStyled = styled(Button)`
  border-radius: 5px;
  height: 48px;

  :hover {
    background-color: #EB008B;
    color: #fff;
    border: 0;
  }
`;
