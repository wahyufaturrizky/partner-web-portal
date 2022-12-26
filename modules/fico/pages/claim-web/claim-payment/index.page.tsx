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
import { STATUS_ASSET_MUTATION_VARIANT, STATUS_VARIANT, STATUS_WORD } from 'utils/utils';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { message } from 'antd';
import moment from 'moment';
import { currencyFormater } from 'lib/currencyFormatter';
import { useClaimPayment } from 'hooks/claim-web/useClaimPayment';

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
    title: 'Company',
    dataIndex: 'company_code',
  },
  {
    title: 'Vendor',
    dataIndex: 'vdr_id',
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vdr_name',
    width: 200,
  },
  {
    title: 'Doc Date',
    dataIndex: 'ivc_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Posting Date',
    dataIndex: 'created_at',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Reference',
    dataIndex: 'ivc_num',
  },
  {
    title: 'Header Text',
    dataIndex: 'tax_ivc_num',
  },
  {
    title: 'Payment',
    dataIndex: 'tax_ivc_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value, row) => {
      const status = STATUS_WORD[value];

      return <StatusPill variant={STATUS_VARIANT[status]} value={_.capitalize(status)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 180,
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
    {/* <Button
      size="big"
      variant="tertiary"
      onClick={() => onReverse()}
    >
      Reverse
    </Button> */}
    <Button
      size="big"
      variant="primary"
      onClick={() => onSubmit()}
    >
      Submit
    </Button>
  </Row>
);

const VendorInvoicing = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useClaimPayment();
  const updateStatus = service.submit({
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
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(1)} onReverse={() => doUpdateStatus(0)} />,
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
  const data = getList.data?.data.datas || [];

  return (
    <>
      <Col>
        <Text variant="h4">Create Payment Request</Text>
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
            scroll={{ x: 1600 }}
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

export default VendorInvoicing;
