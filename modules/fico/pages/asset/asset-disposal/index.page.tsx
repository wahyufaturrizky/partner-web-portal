/* eslint-disable no-unused-vars */
import usePagination from '@lucasmogari/react-pagination';
import Router from 'next/router';
import {
  Button,
  Col,
  Row,
  Search,
  Spacer,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { COLORS } from 'styles/COLOR';
import DataTable from 'components/DataTable';
import _ from 'lodash';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals, IRowSelection } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { StatusPill } from 'components/StatusPill';
import { STATUS_ASSET_MUTATION_VARIANT } from 'utils/utils';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAssetDisposal } from 'hooks/asset/useAssetDisposal';
import { message } from 'antd';
import moment from 'moment';

const columns = [
  {
    title: 'Doc. Number',
    dataIndex: 'doc_number',
    fixed: 'left',
    render: (value, row) => (
      <Text
        variant="small"
        hoverColor="pink.regular"
        onClick={() => Router.push(`${Router.pathname}/${row.id}`)}
        clickable
        underLineOnHover
      >
        {value}
      </Text>
    ),
  },
  {
    title: 'Doc. Date',
    dataIndex: 'doc_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Sent Date',
    dataIndex: 'sent_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Sender',
    dataIndex: 'sender',
  },
  {
    title: 'Receiver',
    dataIndex: 'receiver',
  },
  {
    title: 'Division From',
    dataIndex: 'sender_dvsn',
  },
  {
    title: 'Division To',
    dataIndex: 'receiver_dvsn',
  },
  {
    title: 'Vehicles Number',
    dataIndex: 'vehicles',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value, row) => {
      const statusDoc = value === 1 ? 'SUBMITTED' : 'DRAFT';

      return <StatusPill variant={STATUS_ASSET_MUTATION_VARIANT[statusDoc]} value={_.capitalize(statusDoc)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.ID}/detail`)}
        variant="tertiary"
      >
        View Detail
      </Button>
    ),
  },
];

const ButtonActionPopup = ({ onSubmit, onReverse }) => (
  <Row gap="16px">
    <Button
      size="big"
      variant="tertiary"
      onClick={() => onReverse()}
    >
      Reverse
    </Button>
    <Button
      size="big"
      variant="primary"
      onClick={() => onSubmit()}
    >
      Submit
    </Button>
  </Row>
);

const AssetDisposal = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useAssetDisposal();
  const updateStatusAssetDisposal = service.updateStatus({
    onSuccess: (res, variable) => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Document number(s) has been successfully updated', variant: 'success',
        },
      });
      getAssetDisposal.refetch();
      setSelectedRowKeys([]);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});
  const doUpdateStatus = (status) => {
    const statusStr = status === 1 ? 'submit' : 'reverse';
    const title = status === 1 ? 'Confirm Submit' : 'Confirm Reverse';

    setModals({
      ...modals,
      confirmation: {
        open: true,
        title,
        message: `Are you sure want to ${statusStr} ${selectedRowKeys.length} Document Number(s) ?`,
        onOk: () => updateStatusAssetDisposal.mutate({ ids: selectedRowKeys, status }),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Document Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(1)} onReverse={() => doUpdateStatus(0)} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const visibility = row.status === 1 ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const getAssetDisposal = service.getList({
    onSuccess: (res) => {
      pagination.setTotalItems(res.data.pagination.total_rows);
      setLoading(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
  });
  const data = getAssetDisposal?.data?.data.assets || [];

  // const data = [
  //   {
  //     ID: 1, asset_number: '190000004', sub_asset: 0, asset_name: 'Test Asset 1', asset_value: 'Test Asset 1', cost_center: 'P01G041021', profit_center: 'P01G041022', status: 'draft',
  //   },
  //   {
  //     ID: 2, asset_number: '190000003', sub_asset: 1, asset_name: 'Test Asset 2', asset_value: 'Test Asset 2', cost_center: 'P01G041022', profit_center: 'P01G041023', status: 'draft',
  //   },
  //   {
  //     ID: 3, asset_number: '190000002', sub_asset: 0, asset_name: 'Test Asset 3', asset_value: 'Test Asset 3', cost_center: 'P01G041023', profit_center: 'P01G041024', status: 'submitted',
  //   },
  //   {
  //     ID: 4, asset_number: '190000001', sub_asset: 2, asset_name: 'Test Asset 4', asset_value: 'Test Asset 4', cost_center: 'P01G041024', profit_center: 'P01G041025', status: 'submitted',
  //   },
  // ];

  return (
    <>
      <Col>
        <Text variant="h4">Asset Disposal</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder="Search Document Number, Company Code or Name"
              colorIcon={COLORS.grey.regular}
              onChange={_.debounce((e) => setSearch(e.target.value), 500)}
            />
            <Button
              size="big"
              variant="primary"
              onClick={() => Router.push(`${Router.pathname}/create`)}
            >
              Create
            </Button>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card padding="16px 20px" style={{ width: '100%' }}>
          <DataTable
            rowKey="id"
            data={data}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            isLoading={isLoading}
            scroll={{ x: 2000 }}
          />
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

export default AssetDisposal;
