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
import styled from 'styled-components';
import { COLORS } from 'styles/COLOR';
import DataTable from 'components/DataTable';
import { StatusPill } from 'components/StatusPill';
import { STATUS_ORDER_VARIANT } from 'utils/utils';
import _ from 'lodash';
import { ModalAlert } from 'components/modals/ModalAlert';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { IModals, IRowSelection } from 'interfaces/interfaces';
import { useBudget } from 'hooks/budget/useBudget';
import { message } from 'antd';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { Text } from 'components/Text';

const columns = [
  {
    title: 'Order Number',
    dataIndex: 'order_number',
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
    title: 'Order Description',
    dataIndex: 'description',
  },
  {
    title: 'Company',
    dataIndex: 'company_code',
  },
  {
    title: 'Order Type',
    dataIndex: 'order_type',
  },
  {
    title: 'Profit Center',
    dataIndex: 'profit_center',
  },
  {
    title: 'Cost Center',
    dataIndex: 'responsible_cc',
  },
  {
    title: 'Order Status',
    dataIndex: 'state',
    render: (prop, row) => {
      const orderStatus = row.order_status;
      // const state = row?.state;
      // const status = state === 'submitted' || state === 'submit' ? row?.order_status.toUpperCase() : state.toUpperCase();
      return <StatusPill variant={STATUS_ORDER_VARIANT[orderStatus.toUpperCase()]} value={_.capitalize(orderStatus)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
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

const ButtonActionPopup = ({ onSubmitBudget, onCloseBudget }) => (
  <Row gap="16px">
    <Button
      size="big"
      variant="tertiary"
      onClick={() => onCloseBudget()}
    >
      Close
    </Button>
    <Button
      size="big"
      variant="primary"
      onClick={() => onSubmitBudget()}
    >
      Submit
    </Button>
  </Row>
);

function CreateBudget() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const closeModals = () => setModals({});

  const onSubmitBudgetSelection = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Submit',
        message: `Are you sure want to submit ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => submitBudgets.mutate(selectedRowKeys),
      },
    });
  };

  const onCloseBudgetSelection = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Close',
        message: `Are you sure want to close ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => closeBudgets.mutate(selectedRowKeys),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Order Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmitBudget={onSubmitBudgetSelection} onCloseBudget={onCloseBudgetSelection} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const disabled = row.state.toLowerCase() === 'closed' || row.order_status.toLowerCase() === 'completed';
      const visibility = disabled ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const service = useBudget();
  const { data: resList, refetch } = service.getList({
    onSuccess: (data) => {
      pagination.setTotalItems(data.total);
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
  const { data } = resList || {};

  const closeBudgets = service.close({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Close Budget Success', message: 'Order number has been successfully closed', variant: 'success',
        },
      });
      refetch();
      setSelectedRowKeys([]);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const submitBudgets = service.submit({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Order number(s) has been successfully submited', variant: 'success',
        },
      });
      refetch();
      setSelectedRowKeys([]);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  return (
    <>
      <Col>
        <Text variant="h4">Create Budget List</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder="Search Order Number, Company Name, Order Type"
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
        <Card style={{ padding: '16px 20px', width: '100%' }}>
          <DataTable
            rowKey="ID"
            data={data}
            columns={columns}
            pagination={pagination}
            searchPlaceholder="Search Order Number, Company Name, Order Type, Status"
            rowSelection={rowSelection}
            scroll={{ x: 1400 }}
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
      {modals?.alert?.open && (
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
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default CreateBudget;
