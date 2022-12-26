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
import { capitalize, debounce } from 'lodash';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals, IMutate, IRowSelection } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { StatusPill } from 'components/StatusPill';
import {
  STATUS_AP_VARIANT, STATUS_AP_WORDING, STATUS_ASSET_MUTATION_VARIANT, STATUS_VARIANT, STATUS_WORD,
} from 'utils/utils';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAssetMutation } from 'hooks/asset/useAssetMutation';
import { message } from 'antd';
import moment from 'moment';
import { currencyFormater } from 'lib/currencyFormatter';
import { useVendorInvoicing } from 'hooks/account-payable/useVendorInvoicing';

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
    title: 'Request Date',
    dataIndex: 'request_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Amount',
    dataIndex: 'ivc_value',
    render: (value) => currencyFormater(value),
  },
  {
    title: 'Currency',
    dataIndex: 'ivc_cur',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value, row) => <StatusPill variant={STATUS_AP_VARIANT[value]} value={STATUS_AP_WORDING[value]} />,
  },
  {
    title: 'Action',
    dataIndex: 'action',
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

const VendorInvoicing = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useVendorInvoicing();
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
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(1)} onReverse={() => doUpdateStatus(0)} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const visibility = ![0, 1].includes(row.status) ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
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

  // const data = [
  //   {
  //     id: 1, document_number: '190000001', request_date: '2022-11-08', amount: 2000000, currency: 'IDR', status: 'draft',
  //   },
  //   {
  //     id: 2, document_number: '190000002', request_date: '2022-11-08', amount: 2000000, currency: 'IDR', status: 'submitted',
  //   },
  //   {
  //     id: 3, document_number: '190000003', request_date: '2022-11-08', amount: 2000000, currency: 'IDR', status: 'draft',
  //   },
  //   {
  //     id: 4, document_number: '190000004', request_date: '2022-11-08', amount: 2000000, currency: 'IDR', status: 'submitted',
  //   },
  // ];

  return (
    <>
      <Col>
        <Text variant="h4">Vendor Invoicing</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder="Search Document Number, Company Code or Name"
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

export default VendorInvoicing;
