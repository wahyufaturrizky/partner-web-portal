/* eslint-disable no-unused-vars */
import Router, { useRouter } from 'next/router';
import {
  Col, Row, Text, Spacer, Button,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
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
import { useGrMutation } from 'hooks/asset/useGrMutation';
import { message } from 'antd';

const columns = [
  // { title: 'Company Code', dataIndex: 'company_code' },
  { title: 'Asset Number', dataIndex: 'id_ast_master' },
  { title: 'Sub Number', dataIndex: 'sub_number' },
  { title: 'Type', dataIndex: 'type' },
  { title: 'Brand', dataIndex: 'brand' },
  { title: 'Old CC', dataIndex: 'cost_center' },
  { title: 'New CC', dataIndex: 'cost_center_n' },
  { title: 'Location', dataIndex: 'location' },
  { title: 'Plant', dataIndex: 'plant' },
  { title: 'New User', dataIndex: 'new_user' },
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

function DetailGRAssetMutation() {
  const router = useRouter();
  const { id } = router.query;

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();

  const service = useGrMutation();
  const getGrMutationByID = service.getByID({
    id,
    onSuccess: () => {
      // console.log(res);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  const { data } = getGrMutationByID.data || {};

  const closeModals = () => setModals({});

  const listTab = [
    { title: 'Surat Jalan', url: '#surat_jalan' },
    // { title: 'Attachment', url: '#attachment' },
  ];
  const [currentTab, setCurrentTab] = useState('Surat Jalan');

  const fields: Array<ILabelField> = [
    { id: 'document_number', label: 'Document Number', value: data?.doc_number },
    { id: 'vehicles_number', label: 'Vehicles Number', value: data?.vehicles },
    { id: 'document_date', label: 'Document Date', value: moment(data?.doc_date).format('DD MMMM YYYY') },
    { id: 'address', label: 'Address', value: data?.address },
    { id: 'division_from', label: 'Division From', value: data?.sender_dvsn },
    { id: 'division_to', label: 'Division To', value: data?.receiver_dvsn },
    { id: 'sender', label: 'Sender', value: data?.sender },
    { id: 'receiver', label: 'Receiver', value: data?.receiver },
    { id: 'sent_date', label: 'Sent Date', value: moment(data?.sent_date).format('DD MMMM YYYY') },
    { id: 'phone_number', label: 'Phone Number', value: data?.phone_number },
  ];

  // const data = [
  //   {
  //     ID: 1, company_code: 'PP01', asset_number: '4200001045', sub_number: 0, asset_description: 'HHT Samsung M10 HO -> JEMBER', type: 'HHT', brand: 'Samsung', old_cc: 'P01G041023', new_cc: 'E010101001', location: 'A100', plant: 'P101', new_user: 'Yusuf',
  //   },
  //   {
  //     ID: 2, company_code: 'PP01', asset_number: '4300001172', sub_number: 1, asset_description: 'IBM Server & Win 7 Pro 32Bit GT', type: 'Server', brand: 'IBM', old_cc: 'P01G041023', new_cc: 'E010101001', location: 'A100', plant: 'P101', new_user: 'Yusuf',
  //   },
  //   {
  //     ID: 3, company_code: 'PP01', asset_number: '4300001173', sub_number: 2, asset_description: 'Printer LQ2190 GT/MT', type: 'Printer', brand: 'Samsung', old_cc: 'P01G041023', new_cc: 'E010101001', location: 'A100', plant: 'P101', new_user: 'Yusuf',
  //   },
  //   {
  //     ID: 4, company_code: 'PP01', asset_number: '4300001189', sub_number: 3, asset_description: 'Finger Scan X100 C GT', type: 'Finger Scan', brand: 'Samsung', old_cc: 'P01G041023', new_cc: 'E010101001', location: 'A100', plant: 'P101', new_user: 'Yusuf',
  //   },
  // ];

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

  if (getGrMutationByID.isLoading) {
    return <DetailSkeleton />;
  }

  const { rootMenuPath, pathArray } = useRouterPath();

  return (
    <>
      <Col>
        <Row justifyContent="space-between">
          <Row gap="4px" alignItems="center">
            <ArrowLeftIcon onClick={() => Router.push(`${rootMenuPath}`)} style={{ cursor: 'pointer' }} />
            <Text variant="h4">{`View GR Asset Mutation ${id || 'Loading..'}`}</Text>
          </Row>
          <Row gap="12px" alignItems="center">
            <Button
              size="big"
              variant="tertiary"
              style={{ backgroundColor: 'white', borderColor: 'red', color: 'red' }}
              onClick={() => Router.push(`${Router.pathname}`)}
            >
              Reject
            </Button>
            <Button
              size="big"
              variant="primary"
              onClick={() => Router.push(`${Router.pathname}`)}
            >
              Approve
            </Button>
          </Row>
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
              <Case condition={currentTab === 'Surat Jalan'}>
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
                <Spacer size={40} />
                <Row width="100%">
                  <div style={{ width: '100%' }}>
                    <DataTable
                      rowKey="id"
                      columns={columns}
                      data={data?.arr_ast_h_mutation}
                      scroll={{ x: 1500 }}
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
            Router.push('/asset/gr-mutation');
          }}
        />
      )}
    </>
  );
}

export default DetailGRAssetMutation;
