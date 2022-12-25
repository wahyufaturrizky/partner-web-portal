/* eslint-disable no-unused-vars */
import Router, { useRouter } from 'next/router';
import {
  Col, Row, Text, Spacer,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import { Tabs } from 'components/Tabs';
import { ILabelField, LabelBuilder } from 'components/LabelBuilder';
import {
  Case, If, Switch, Then,
} from 'react-if';
import DataTable from 'components/DataTable';
import { capitalize } from 'lodash';
import { currencyFormater } from 'lib/currencyFormatter';
import usePagination from '@lucasmogari/react-pagination';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { Divider } from 'components/Divider';
import moment from 'moment';
import { DetailSkeleton } from 'components/skeleton/DetailSkeleton';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';
import { message } from 'antd';
import { useDownPayment } from 'hooks/account-receivable/useDownPayment';
import { DownPaymentFields } from '../form';
import { DPAccountFields } from '../form-gl-account';

const columns = [
  {
    title: 'Amount In Doc. Currency', dataIndex: 'amount_doc', render: (value) => currencyFormater(value), width: 250, fixed: 'none',
  },
  {
    title: 'Ammount In Local Currency', dataIndex: 'amount_loc', render: (value) => currencyFormater(value), width: 250,
  },
  { title: 'Tax Code', dataIndex: 'tax_code', width: 200 },
  { title: 'Tax Ammount', dataIndex: 'tax_amount', width: 200 },
  { title: 'Purchase Order', dataIndex: 'po_type', width: 200 },
  { title: 'Purchase Order Item', dataIndex: 'po_item', width: 200 },
  { title: 'Assigment', dataIndex: 'assign', width: 200 },
  { title: 'Text', dataIndex: 'text', width: 200 },
  { title: 'Payment Reference', dataIndex: 'payment_reference', width: 200 },
  { title: 'Payment Block', dataIndex: 'payment_block', width: 200 },
  { title: 'Payment Methode', dataIndex: 'payment_method', width: 200 },
  { title: 'Profit Center', dataIndex: 'profit_center', width: 200 },
  {
    title: 'Due Date', dataIndex: 'due_date', width: 150, render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  { title: 'Order', dataIndex: 'order', width: 150 },
];

const columnsApprovalHistory = [
  {
    title: '', dataIndex: 'status', render: (prop, row) => `${capitalize(row.status)} by`, width: 150,
  },
  { title: 'Name', dataIndex: 'employee_name' },
  { title: 'Position', dataIndex: 'position' },
  {
    title: 'Approve On', dataIndex: 'approve_on', render: (prop, row) => (row.approve_on ? moment(row.approve_on).format('DD MMMM YYYY') : '-'), width: 200,
  },
];

const columnsAttachment = [
  {
    title: 'No', dataIndex: 'no', render: (value, row, index) => (index + 1), width: 10,
  },
  { title: 'Name', dataIndex: 'attachment_name' },
  {
    title: 'Action',
    render: () => (
      <Row gap="12px">
        <Text color="pink.regular" variant="small" clickable underLineOnHover>Download</Text>
        <Text color="pink.regular" variant="small" clickable underLineOnHover>View</Text>
      </Row>
    ),
    width: 200,
  },
];

function DetailGeneralJournal() {
  const router = useRouter();
  const { id } = router.query;

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [downPayment, setdownPayment] = useState<DownPaymentFields>();
  const [dpItems, setDPItems] = useState<DPAccountFields[]>([]);

  const service = useDownPayment();
  const getGeneralJournalByID = service.getByID({
    id,
    onSuccess: (res) => {
      const dp = res.data.items.dp || {};
      const data = {
        ...dp,
        doc_date: dp.posting_date.Time,
        doc_date_obj: dp.posting_date,

        posting_date: dp.posting_date.Time,
        posting_date_obj: dp.posting_date,
      };
      setdownPayment(data || {});
      setDPItems(res.data.items.dp_detail || []);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});

  const listTab = [
    { title: 'Mutation Information', url: '#mutation' },
    { title: 'Attachment', url: '#attachment' },
    { title: 'Approval History', url: '#approval' },
  ];
  const [currentTab, setCurrentTab] = useState('Mutation Information');

  const fields: ILabelField[] = [
    { id: 'document_number', label: 'Document Number', value: downPayment?.doc_number as number },
    { id: 'doc_type', label: 'Doc. Type', value: downPayment?.doc_type as string },
    { id: 'document_date', label: 'Document Date', value: moment(downPayment?.doc_date).format('DD MMMM YYYY') as string },
    { id: 'company_code', label: 'Company Code', value: downPayment?.company_code as string },
    { id: 'posting_date', label: 'Posting Date', value: moment(downPayment?.posting_date).format('DD MMMM YYYY') as string },
    { id: 'currency', label: 'Currency', value: downPayment?.currency_id || 'IDR' as string },
    { id: 'reference', label: 'Reference', value: downPayment?.reference as string },
    { id: 'header_text', label: 'Header', value: downPayment?.header_text as string },
  ];

  const dataApprovalHistory = [
    {
      ID: 1, status: 'created', employee_name: 'Yusuf M. Tafsirry', position: 'Staff ITBP', approve_on: '2022-01-31',
    },
    {
      ID: 2, status: 'approved', employee_name: 'Taufan Arahmansyah', position: 'Supervisor ITBP', approve_on: '2022-01-31',
    },
    {
      ID: 3, status: 'approved', employee_name: 'Hendrick', position: 'Manager ITBP', approve_on: null,
    },
  ];

  const dataAttachment = [
    { no: 1, attachment_name: 'PDF' },
    { no: 2, attachment_name: 'Word' },
    { no: 3, attachment_name: 'Excel' },
  ];

  if (getGeneralJournalByID.isLoading) {
    return <DetailSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/account-receivable/down-payment')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`View General Journal ${id || 'Loading..'}`}</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="5px 10px">
          <Tabs
            defaultActiveKey={currentTab}
            listTabPane={listTab}
            onChange={(e) => setCurrentTab(e)}
          />
          <Row padding="10px">
            <Switch>
              <Case condition={currentTab === 'Mutation Information'}>
                <Row gap="12px">
                  <LabelBuilder
                    column={2}
                    fields={fields}
                  />
                </Row>
                <Divider margin="30px 0" />
                <Card padding="0" style={{ width: '100%' }}>
                  <DataTable
                    rowKey="line_item"
                    columns={columns}
                    data={dpItems}
                    scroll={{ x: 1500 }}
                  />
                </Card>
                <Row width="100%">
                  <Divider margin="30px 0" />
                  <Col width="100%">
                    <DataTable
                      rowKey="ID"
                      columns={columnsApprovalHistory}
                      data={dataApprovalHistory}
                    />
                  </Col>
                </Row>
              </Case>
              <Case condition={currentTab === 'Attachment'}>
                <Row width="100%">
                  <Col width="100%">
                    <DataTable
                      rowKey="no"
                      columns={columnsAttachment}
                      data={dataAttachment}
                    />
                  </Col>
                </Row>
              </Case>
              <Case condition={currentTab === 'Approval History'}>
                <Row width="100%">
                  <Col width="100%">
                    <DataTable
                      rowKey="ID"
                      columns={columnsApprovalHistory.filter((v) => v.title !== 'Position')}
                      data={dataApprovalHistory}
                    />
                  </Col>
                </Row>
              </Case>
            </Switch>
          </Row>
        </Card>
      </Col>
      {modals?.confirmation && (
        <ModalConfirmation
          title={modals.confirmation.title}
          message={modals.confirmation.message}
          visible={modals.confirmation.open}
          onCancel={() => closeModals()}
          onOk={() => modals.confirmation?.onOk?.()}
        />
      )}
      {modals?.alert && (
        <ModalAlert
          visible={modals.alert.open}
          title={modals.alert.title}
          message={modals.alert.message}
          variant={modals.alert.variant}
          onOk={() => {
            closeModals();
            Router.push('/account-receivable/down-payment');
          }}
        />
      )}
    </>
  );
}

export default DetailGeneralJournal;
