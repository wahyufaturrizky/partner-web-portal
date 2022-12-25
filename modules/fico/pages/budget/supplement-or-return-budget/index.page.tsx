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
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals, IRowSelection } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { currencyFormater } from 'lib/currencyFormatter';
import { useSupplementReturnBudget } from 'hooks/budget/useSupplementOrReturnBudget';
import { message } from 'antd';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { Text } from 'components/Text';
import { capitalize, debounce } from 'lodash';
import { STATUS_VARIANT, STATUS_WORD } from 'utils/utils';
import { StatusPill } from 'components/StatusPill';

const columns = [
  {
    title: 'Internal Order Number',
    dataIndex: 'order_number',
    fixed: 'left',
    render: (value, row) => (
      <Text
        variant="small"
        hoverColor="pink.regular"
        onClick={() => Router.push(`${Router.pathname}/${value}`)}
        clickable
        underLineOnHover
      >
        {value}
      </Text>
    ),
  },
  {
    title: 'Description',
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
    title: 'Amount',
    dataIndex: 'ammount',
    render: (value) => currencyFormater(value),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: (value) => capitalize(value),
  },
  {
    title: 'Status',
    dataIndex: 'state',
    render: (value, row) => {
      const orderStatus = STATUS_WORD[value] ?? value;
      return <StatusPill variant={STATUS_VARIANT[orderStatus.toUpperCase()]} value={capitalize(orderStatus)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.order_number}`)}
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

const SupplementOrReturnBudget = () => {
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useSupplementReturnBudget();
  const submitSupplementReturn = service.submit({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Order number(s) has been successfully submited', variant: 'success',
        },
      });
      refetch();
      setSelectedRows([]);
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
        message: `Are you sure want to submit ${selectedRows.length} Order Number(s) ?`,
        onOk: () => submitSupplementReturn.mutate({
          budget_ids: selectedRows.map((row) => row.budget_id),
          list_type: selectedRows.map((row) => row.type),
          state: 'submit',
        }),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Order Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={onSubmitSelection} />,
    selectedRowKeys: selectedRows.map((row) => row.budget_id),
    getCheckboxProps: (row: any) => {
      const visibility = row.state === 'submit' ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
    onChange: (selected, row) => {
      setSelectedRows(row);
    },
  };

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

  return (
    <>
      <Col>
        <Text variant="h4">Supplement or Return Budget</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder="Search Order Number, Company Name, Order Type"
              colorIcon={COLORS.grey.regular}
              onChange={debounce((e) => setSearch(e.target.value), 500)}
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
            rowKey="budget_id"
            data={data}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 1700 }}
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

export default SupplementOrReturnBudget;
