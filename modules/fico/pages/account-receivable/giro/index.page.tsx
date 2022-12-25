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
import { Link } from 'components/Link';
import { useGiro } from 'hooks/account-receivable/useGiro';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';
import { Text } from 'components/Text';
import { message } from 'antd';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import moment from 'moment';

const columns = [
  {
    title: 'Company Code',
    dataIndex: 'company_code',
    width: 200,
    fixed: 'none',
  },
  {
    title: 'Profit Center',
    dataIndex: 'profit_center',
    width: 150,
  },
  {
    title: 'Number Cek / Giro',
    dataIndex: 'giro_number',
    width: 250,
    render: (value, row) => (
      <Text
        variant="small"
        hoverColor="pink.regular"
        onClick={() => Router.push(`${Router.pathname}/${row?.girocek_id}`)}
        clickable
        underLineOnHover
      >
        {value}
      </Text>
    ),
  },
  {
    title: 'Cek / Giro',
    dataIndex: 'type',
    width: 150,
  },
  // {
  //   title: 'Id Number',
  //   dataIndex: 'id_number',
  //   width: 150,
  // },
  {
    title: 'Customer',
    dataIndex: 'customer_id',
    width: 150,
  },
  // {
  //   title: 'Customer Name',
  //   dataIndex: 'customer_name',
  //   width: 150,
  // },
  {
    title: 'Bank Account',
    dataIndex: 'bank_account_name',
    width: 150,
  },
  {
    title: 'Bank Name',
    dataIndex: 'bank_name',
    width: 150,
  },
  {
    title: 'Cek / Giro Name',
    dataIndex: 'giro_name',
    width: 150,
  },
  {
    title: 'Ammount',
    dataIndex: 'giro_amount',
    width: 150,
  },
  {
    title: 'Giro Date',
    dataIndex: 'giro_date',
    width: 150,
    render: (value) => moment(value?.Time).format('DD/MM/YYYY'),
  },
  // {
  //   title: 'Currency',
  //   dataIndex: 'currency',
  //   width: 150,
  // },
  {
    title: 'Due Date',
    dataIndex: 'due_date',
    width: 150,
    render: (value) => moment(value?.Time).format('DD/MM/YYYY'),
  },
  // {
  //   title: 'Cash Date',
  //   dataIndex: 'cash_date',
  //   width: 150,
  //   render: (value) => moment(value?.Time).format('DD/MM/YYYY')
  // },
  {
    title: 'Document Posting',
    dataIndex: 'created_time',
    width: 180,
    render: (value) => moment(value?.Time).format('DD/MM/YYYY'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 150,
    render: (prop) => {
      const status = prop;
      return <StatusPill variant={STATUS_VARIANT[status === 1 ? 'Draft' : 'Submit']} value={status === 1 ? 'Draft' : 'Submit'} />;
    },
  },
  // {
  //   title: 'Status D/P',
  //   dataIndex: 'status_dp',
  //   width: 150,
  //   render: (prop, row) => {
  //     const status = row?.state.toUpperCase();
  //     return <StatusPill variant={STATUS_VARIANT[status]} value={_.capitalize(status)} />;
  //   },
  // },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 150,
    render: (value, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.girocek_id}/detail`)}
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

const CekGiro = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useGiro();
  const submitCekGiro = service.submit({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Document number(s) has been successfully submited', variant: 'success',
        },
      });
      refetch();
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
        message: `Are you sure want to submit ${selectedRowKeys.length} Document Number(s) ?`,
        onOk: () => submitCekGiro.mutate(selectedRowKeys),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Document Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={onSubmitSelection} />,
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const { data: resList, refetch } = service.getList({
    onSuccess: (res) => {
      pagination.setTotalItems(res.data.pagination.total_items);
      setLoading(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
    query: {
      search,
      page: 1,
      size: pagination.itemsPerPage,
    },
  });
  const { data } = resList || {};

  return (
    <>
      <Col>
        <Text variant="h4">Cek/Giro List</Text>
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
            rowKey="girocek_id"
            data={data?.items || []}
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

export default CekGiro;
