/* eslint-disable max-len */
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
import { STATUS_DOWN_PAYMENT_VARIANT } from 'utils/utils';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { message } from 'antd';
import moment from 'moment';
import { currencyFormater } from 'lib/currencyFormatter';
import { useInvoiceBilling } from 'hooks/account-payable/useInvoiceBilling';

const columns = [
  {
    title: 'Doc. Number',
    dataIndex: 'document_number',
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
    title: 'Request Date',
    dataIndex: 'request_date',
    render: (value) => moment(value).format('YYYY/MM/DD'),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (value) => currencyFormater(value),
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value, row) => {
      const status = value.toUpperCase();

      return <StatusPill variant={STATUS_DOWN_PAYMENT_VARIANT[status]} value={_.capitalize(status)} />;
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

const ButtonActionPopup = ({ onSubmit, onReject }) => (
  <Row gap="16px">
    <Button
      size="big"
      variant="tertiary"
      onClick={() => onReject()}
    >
      Reject
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

const InvoiceBilling = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useInvoiceBilling();
  const updateStatus = service.updateStatus({
    onSuccess: (res, variable) => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Document number(s) has been successfully updated', variant: 'success',
        },
      });
      getList.refetch();
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
        onOk: () => updateStatus.mutate({ ids: selectedRowKeys, status }),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Document Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(1)} onReject={() => doUpdateStatus(0)} />,
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const getList = service.getList({
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
  // const data = getList.data?.data.assets || [];

  const data = [
    {
      id: 1, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'draft',
    },
    {
      id: 2, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'tax verif',
    },
    {
      id: 3, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'accounting submit',
    },
    {
      id: 4, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'payment',
    },
    {
      id: 5, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'completed',
    },
    {
      id: 6, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'submitted',
    },
    {
      id: 7, document_number: '190000001', request_date: '2022-11-08', amount: 10000000, currency: 'IDR', status: 'rejected',
    },
  ];

  return (
    <>
      <Col>
        <Text variant="h4">Invoice Billing</Text>
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
            // scroll={{ x: 1600 }}
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

export default InvoiceBilling;
