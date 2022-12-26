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
import { useAssetOpname } from 'hooks/asset/useAssetOpname';
import { message } from 'antd';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';

const columns = [
  {
    title: 'No',
    dataIndex: 'ID',
    width: 50,
  },
  {
    title: 'Cost Center',
    dataIndex: 'cost_center',
    width: 150,
  },
  {
    title: 'Plant',
    dataIndex: 'plant',
    width: 100,
  },
  {
    title: 'Asset Number',
    dataIndex: 'asset_number',
    width: 150,
  },
  {
    title: 'Asset Description',
    dataIndex: 'asset_description',
    width: 200,
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    width: 150,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: 50,
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: 'Condition',
    dataIndex: 'condition',
    width: 100,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: 100,
  },
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

function DetailAssetOpname() {
  const router = useRouter();
  const { id } = router.query;

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();

  const service = useAssetOpname();
  const getAssetOpname = service.getByID({
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
    { id: 'budget_year', label: 'Budget Year', value: '190000001' },
    { id: 'doc_number', label: 'Doc. Number', value: '78/AP/SMT/NAS/01/22' },
    { id: 'budget_month', label: 'Budget Month', value: 'January' },
    { id: 'doc_date', label: 'Doc. Date', value: '31 January 2022' },
    { id: 'budget_type', label: 'Budget Type', value: 'Material' },
    { id: 'created_by', label: 'Created By', value: 'Yusuf M. Tafsiry' },
  ];

  const data = [
    {
      ID: 1, cost_center: 'P01GO41021', plant: 'P100', asset_number: '4200001041', asset_description: 'HHT Samsung M10 HO -> JEMBER', brand: 'HHT', total: 1, unit: 'PCS', condition: 'Baik', location: 'P100', description: 'Opname OK',
    },
    {
      ID: 2, cost_center: 'P01G041022', plant: 'P100', asset_number: '4200001042', asset_description: 'IBM Server & Win 7 Pro 32Bit GT', brand: 'IBM', total: 1, unit: 'PCS', condition: 'Baik', location: 'P100', description: 'Opname OK',
    },
    {
      ID: 3, cost_center: 'P01G041023', plant: 'P100', asset_number: '4200001043', asset_description: 'Printer LQ2190 GT/MT', brand: 'HP', total: 1, unit: 'PCS', condition: 'Baik', location: 'P100', description: 'Opname OK',
    },
    {
      ID: 4, cost_center: 'P01G041024', plant: 'P100', asset_number: '4200001044', asset_description: 'PC Desktop & Windows 7 Home Basic 32Bit SA GT', brand: 'SAMSUNG', total: 1, unit: 'PCS', condition: 'Baik', location: 'P100', description: 'Opname OK',
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

  if (getAssetOpname.isLoading) {
    return <DetailSkeleton />;
  }

  const { rootMenuPath, pathArray } = useRouterPath();

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push(`${rootMenuPath}/list`)} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`View Asset Opname ${id || 'Loading..'}`}</Text>
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
                  <Spacer size={40} />
                  <div style={{ width: '100%' }}>
                    <DataTable
                      rowKey="ID"
                      columns={columns}
                      data={data}
                      scroll={{ x: 1900 }}
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

export default DetailAssetOpname;
