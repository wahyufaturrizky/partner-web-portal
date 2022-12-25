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
import { message } from 'antd';
import { useAssetCreate } from 'hooks/asset/useAssetCreate';

const AssetCreate = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useAssetCreate();
  const updateStatusAsset = service.updateStatus({
    onSuccess: (res, variable) => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Document number(s) has been successfully updated', variant: 'success',
        },
      });
      getAssetCreate.refetch();
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
        message: `Are you sure want to ${statusStr} ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => updateStatusAsset.mutate({ ids: selectedRowKeys, status }),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Document Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(1)} onReverse={() => doUpdateStatus(0)} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const visibility = row.ast_status === 1 ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const getAssetCreate = service.getList({
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
  const data = getAssetCreate.data?.data.assets || [];

  const { rootMenuPath } = useRouterPath();
  return (
    <>
      <Col>
        <Text variant="h4">Asset List</Text>
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
            rowKey="id"
            data={data}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 1200 }}
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

const columns = [
  {
    title: 'Asset Number',
    dataIndex: 'id',
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
    title: 'Asset Name',
    dataIndex: 'description',
  },
  {
    title: 'Cost Center',
    dataIndex: 'cost_center',
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title: 'Status',
    dataIndex: 'ast_status',
    render: (value) => {
      const status = value === 1 ? 'SUBMITTED' : 'DRAFT';
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
        onClick={() => Router.push(`${Router.pathname}/${row.id}`)}
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

export default AssetCreate;
