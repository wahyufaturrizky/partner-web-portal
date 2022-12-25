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
import { STATUS_VARIANT } from 'utils/utils';
import { useTax } from 'hooks/tax/useTaxVerification';
import { Text } from 'components/Text';
import { message } from 'antd';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import moment from 'moment';

const columns = [
  {
    title: 'Company Code',
    dataIndex: 'company_code',
    width: 150,
    fixed: 'none',
  },
  {
    title: 'Vendor',
    dataIndex: 'vdr_id',
    width: 150,
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vdr_name',
    width: 200,
  },
  {
    title: 'Invoice Date',
    dataIndex: 'ivc_date',
    width: 180,
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Create Date',
    dataIndex: 'created_at',
    width: 180,
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Fiscal Year',
    dataIndex: 'fiscal_year',
    width: 180,
  },
  {
    title: 'Invoice No',
    dataIndex: 'ivc_num',
    width: 180,
  },
  {
    title: 'Tax Invoice No',
    dataIndex: 'tax_ivc_num',
    width: 180,
  },
  {
    title: 'PPN Code',
    dataIndex: 'ppn_code',
    width: 180,
  },
  {
    title: 'PPN',
    dataIndex: 'ppn_total',
    width: 180,
  },
  {
    title: 'PPH Code',
    dataIndex: 'pph_code',
    width: 180,
  },
  {
    title: 'PPH',
    dataIndex: 'pph_total',
    width: 180,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 150,
    render: (prop) => {
      const status = prop === 1 ? 'SUBMIT' : 'SUBMIT';
      return <StatusPill variant={STATUS_VARIANT[status]} value={_.capitalize(status)} />;
    },
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

const TaxVerification = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useTax();
  const submitTaxVerification = service.submit({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Submit Success', message: 'Action has been successfully submited', variant: 'success',
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
  const doUpdateStatus = (status) => {
    const statusStr = status === 1 ? 'reject' : 'accept';
    const title = status === 1 ? 'Confirm Reject' : 'Confirm Accept';

    setModals({
      ...modals,
      confirmation: {
        open: true,
        title,
        message: `Are you sure want to ${statusStr} (${selectedRowKeys.length}) Tax ?`,
        onOk: () => submitTaxVerification.mutate({ ids: selectedRowKeys, status }),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Document Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(5)} onReject={() => doUpdateStatus(8)} />,
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
        <Text variant="h4">Tax Verification</Text>
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
          </Row>
        </Card>
        <Spacer size={10} />
        <Card padding="16px 20px" style={{ width: '100%' }}>
          <DataTable
            rowKey="id"
            data={data?.datas || []}
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

export default TaxVerification;
