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
import { GeneralJournalFields } from '../form';
import { GLAccountFields } from '../form-gl-account';

const columns = [
  { title: 'G/L Account', dataIndex: 'account_number' },
  { title: 'D/C', dataIndex: 'dc', render: (value) => capitalize(value) },
  { title: 'Amount In Doc. Currency', dataIndex: 'ammount', render: (value) => currencyFormater(value) },
  { title: 'Tax Code', dataIndex: 'tax' },
  { title: 'Assignment', dataIndex: 'assignment' },
  { title: 'Text', dataIndex: 'text' },
  { title: 'Cost Center', dataIndex: 'cost_center' },
  { title: 'Profit Center', dataIndex: 'profit_center' },
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
  const [generalJournal, setGeneralJournal] = useState<GeneralJournalFields>();
  const [glItems, setGLItems] = useState<GLAccountFields[]>([]);

  const service = useGeneralJournal();
  const getGeneralJournalByID = service.getByID({
    id,
    onSuccess: (res) => {
      setGeneralJournal(res.data || {});
      setGLItems(res.items || []);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});

  const listTab = [
    { title: 'Mutation Information', url: '#mutation' },
    // { title: 'Attachment', url: '#attachment' },
    // { title: 'Approval History', url: '#approval' },
  ];
  const [currentTab, setCurrentTab] = useState('Mutation Information');

  const fields: ILabelField[] = [
    { id: 'document_number', label: 'Document Number', value: generalJournal?.document_number as string },
    { id: 'doc_type', label: 'Doc. Type', value: generalJournal?.document_type as string },
    { id: 'document_date', label: 'Document Date', value: moment(generalJournal?.document_date).format('DD MMMM YYYY') as string },
    { id: 'company_code', label: 'Company Code', value: `${generalJournal?.company_code} - ${generalJournal?.company_name}` },
    { id: 'posting_date', label: 'Posting Date', value: moment(generalJournal?.posting_date).format('DD MMMM YYYY') as string },
    { id: 'currency', label: 'Currency', value: generalJournal?.currency || 'IDR' as string },
    { id: 'reference', label: 'Reference', value: generalJournal?.reference as string },
    { id: 'exchange_rate', label: 'Exchange Rate', value: moment(generalJournal?.exchange_rate).format('DD MMMM YYYY') as string },
    { id: 'header_text', label: 'Header', value: generalJournal?.header_text as string },
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
          <ArrowLeftIcon onClick={() => Router.back()} style={{ cursor: 'pointer' }} />
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
                <Row width="100%">
                  <Divider margin="30px 0" />
                  <Col width="100%">
                    <DataTable
                      rowKey="line_item"
                      columns={columns}
                      data={glItems}
                    />
                  </Col>
                </Row>
                {/* <Row width="100%">
                  <Divider margin="30px 0" />
                  <Col width="100%">
                    <DataTable
                      rowKey="ID"
                      columns={columnsApprovalHistory}
                      data={dataApprovalHistory}
                    />
                  </Col>
                </Row> */}
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
            Router.push('/accounting/general-journal');
          }}
        />
      )}
    </>
  );
}

export default DetailGeneralJournal;
