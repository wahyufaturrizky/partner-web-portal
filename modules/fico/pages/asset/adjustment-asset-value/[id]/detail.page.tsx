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
import _ from 'lodash';
import { currencyFormater } from 'lib/currencyFormatter';
import usePagination from '@lucasmogari/react-pagination';
import { Divider } from 'components/Divider';
import moment from 'moment';
import { DetailSkeleton } from 'components/skeleton/DetailSkeleton';
import { useRouterPath } from 'hooks/helper/useRouterPath/useRouterPath';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAdjustmentAssetValue } from 'hooks/asset/useAdjustmentAssetValue';
import { message } from 'antd';

const columns = [
  { title: 'G/L Account', dataIndex: 'gl_account' },
  { title: 'D/C', dataIndex: 'dc', render: (prop, row) => _.capitalize(row.dc) },
  { title: 'Amount In Doc. Currency', dataIndex: 'ammount_doc_currency', render: (prop, row) => currencyFormater(row.ammount_doc_currency) },
  { title: 'Tax Code', dataIndex: 'tax_code' },
  { title: 'Assignment', dataIndex: 'assignment' },
  { title: 'Text', dataIndex: 'text' },
  { title: 'Cost Center', dataIndex: 'cost_center' },
  { title: 'Profit Center', dataIndex: 'profit_center' },
];

const columnsApprovalHistory = [
  {
    title: '', dataIndex: 'status', render: (prop, row) => `${_.capitalize(row.status)} by`, width: 150,
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

function DetailAdjustmentAssetValue() {
  const router = useRouter();
  const { id } = router.query;

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();

  const service = useAdjustmentAssetValue();
  const getAdjustmentAssetValueByID = service.getByID({
    id,
    onSuccess: () => {
      // console.log(res);
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

  const fields: Array<ILabelField> = [
    { id: 'document_number', label: 'Doc. Number', value: '190000001' },
    { id: 'document_type', label: 'Document Type', value: 'SA' },
    { id: 'document_date', label: 'Document Date', value: '23 August 2022' },
    { id: 'period', label: 'Period', value: '08' },
    { id: 'posting_date', label: 'Posting Date', value: '24 August 2022' },
    { id: 'company_code', label: 'Company Code', value: 'KSNI' },
    { id: 'document_number', label: 'Document Number', value: '190000001' },
    { id: 'currency', label: 'Currency', value: 'IDR 10.000.000' },
    { id: 'reference', label: 'Reference', value: 'P101' },
    { id: 'header_text', label: 'Header Text', value: 'E0100001001' },
    { id: 'trading_part_ba', label: 'Trading Part. BA', value: 'HO Bandung' },
  ];

  const data = [
    {
      ID: 1, gl_account: '11011070', dc: 'Credit', ammount_doc_currency: 500000, tax_code: 'V0', assignment: 'Assignment', text: 'Text Item', cost_center: 'E010101001', profit_center: 'D01E100001',
    },
    {
      ID: 2, gl_account: '41048030', dc: 'Debit', ammount_doc_currency: 500000, tax_code: 'V0', assignment: 'Assignment', text: 'Text Item', cost_center: 'E010101001', profit_center: 'D01E100001',
    },
    {
      ID: 3, gl_account: '11011030', dc: 'Debit', ammount_doc_currency: 500000, tax_code: 'A1', assignment: 'Assignment', text: 'Text Item', cost_center: 'E010101001', profit_center: 'D01E100003',
    },
    {
      ID: 4, gl_account: '11011010', dc: 'Debit', ammount_doc_currency: 500000, tax_code: 'V0', assignment: 'Assignment', text: 'Text Item', cost_center: 'E010101001', profit_center: 'D01E100001',
    },
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

  if (getAdjustmentAssetValueByID.isLoading) {
    return <DetailSkeleton />;
  }

  const { rootMenuPath, pathArray } = useRouterPath();

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push(`${rootMenuPath}`)} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`View Adjustment Asset Value ${id || 'Loading..'}`}</Text>
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
                <Row justifyContent="center" width="100%">
                  <Text variant="h4">Delivery Note</Text>
                </Row>
                <Spacer size={40} />
                <Row gap="12px">
                  <LabelBuilder
                    column={2}
                    fields={fields}
                  />
                </Row>
                <Row width="100%">
                  <Spacer size={40} />
                  <div style={{ width: '100%' }}>
                    <DataTable
                      rowKey="ID"
                      columns={columns}
                      data={data}
                    />
                  </div>
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

export default DetailAdjustmentAssetValue;
