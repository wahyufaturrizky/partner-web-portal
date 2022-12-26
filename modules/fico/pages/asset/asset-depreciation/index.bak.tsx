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
import { IModals, IMutate, IRowSelection } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { StatusPill } from 'components/StatusPill';
import { STATUS_VARIANT } from 'utils/utils';
import { useReversalJournal } from 'hooks/accounting/useReversalJournal';
import { Text } from 'components/Text';
import { useRouterPath } from 'hooks/helper/useRouterPath/useRouterPath';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAssetDepreciation } from 'hooks/asset/useAssetDepreciation';
import { message } from 'antd';

const columns = [
  {
    title: 'Asset Number',
    dataIndex: 'asset_number',
    width: 150,
    fixed: 'left',
    render: (value, row) => (
      <Text
        variant="small"
        hoverColor="pink.regular"
        onClick={() => Router.push(`${Router.pathname}/${row.ID}`)}
        clickable
        underLineOnHover
      >
        {value}
      </Text>
    ),
  },
  {
    title: 'Sub Asset',
    dataIndex: 'sub_asset',
    width: 100,
  },
  {
    title: 'Asset Name',
    dataIndex: 'asset_name',
    width: 250,
  },
  {
    title: 'Cost Center',
    dataIndex: 'cost_center',
    width: 150,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 150,
    render: (prop, row) => {
      const status = row?.status.toUpperCase();
      return <StatusPill variant={STATUS_VARIANT[status]} value={_.capitalize(status)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 150,
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.ID}`)}
        variant="tertiary"
      >
        View Detail
      </Button>
    ),
  },
];

const ButtonActionPopup = ({ onSubmit }) => (
  <Row gap="16px">
    <Button
      size="big"
      variant="primary"
      onClick={() => onSubmit()}
    >
      Submit
    </Button>
  </Row>
);

const AssetDepreciation = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useAssetDepreciation();
  const submitAssetDepreciation = service.submit({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Order number(s) has been successfully submited', variant: 'success',
        },
      });
      getAssetDepreciation.refetch();
      setSelectedRowKeys([]);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});
  const onSubmitSelection = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Submit',
        message: `Are you sure want to submit ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => submitAssetDepreciation.mutate(selectedRowKeys),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Order Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={onSubmitSelection} />,
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const getAssetDepreciation = service.getList({
    onSuccess: (data) => {
      pagination.setTotalItems(data.total);
      setLoading(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
    query: {
      search,
      page: pagination.page - 1,
      size: pagination.itemsPerPage,
    },
  });
  // const { data } = resList || {};

  const data = [
    {
      ID: 1,
      asset_number: '4200001041',
      sub_asset: '0',
      asset_name: 'Test Asset 1',
      cost_center: 'P01G041021',
      location: 'P100',
      status: 'draft',
    },
    {
      ID: 2,
      asset_number: '4200001042',
      sub_asset: '1',
      asset_name: 'Test Asset 2',
      cost_center: 'P01G041022',
      location: 'P100',
      status: 'draft',
    },
    {
      ID: 3,
      asset_number: '4200001043',
      sub_asset: '0',
      asset_name: 'Test Asset 3',
      cost_center: 'P01G041023',
      location: 'P100',
      status: 'submitted',
    },
    {
      ID: 4,
      asset_number: '4200001044',
      sub_asset: '2',
      asset_name: 'Test Asset 4',
      cost_center: 'P01G041024',
      location: 'P100',
      status: 'submitted',
    },
  ];

  const { rootMenuPath } = useRouterPath();
  return (
    <>
      <Col>
        <Text variant="h4">Asset Depreciation</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Col>
              <Search
                width="380px"
                nameIcon="SearchOutlined"
                placeholder="Search Document Number, Company Code or Name"
                colorIcon={COLORS.grey.regular}
                onChange={_.debounce((e) => setSearch(e.target.value), 500)}
              />
            </Col>
            <Col>
              <Row gap="12px">
                <Button
                  size="big"
                  variant="primary"
                  onClick={() => Router.push(`${rootMenuPath}/create`)}
                >
                  Create
                </Button>
              </Row>
            </Col>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card padding="16px 20px" style={{ width: '100%' }}>
          <DataTable
            rowKey="ID"
            data={data}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 1500 }}
            isLoading={isLoading}
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

export default AssetDepreciation;
