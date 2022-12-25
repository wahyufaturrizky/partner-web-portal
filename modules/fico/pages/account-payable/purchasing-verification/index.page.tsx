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
import { capitalize, debounce } from 'lodash';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals, IMutate, IRowSelection } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { StatusPill } from 'components/StatusPill';
import { STATUS_AP_VARIANT, STATUS_AP_WORDING, STATUS_VARIANT } from 'utils/utils';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { message } from 'antd';
import moment from 'moment';
import { usePurchasingVerification } from 'hooks/account-payable/usePurchasingVerification';
import { currencyFormater } from 'lib/currencyFormatter';

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
    title: 'Company Code',
    dataIndex: 'company_code',
  },
  {
    title: 'Vendor',
    dataIndex: 'vdr_id',
  },
  {
    title: 'Vendor Name',
    dataIndex: 'vdr_name',
  },
  {
    title: 'Invoice Date',
    dataIndex: 'invoice_date',
    render: (value) => moment(value).format('YYYY/MM/DD'),
  },
  {
    title: 'Created Date',
    dataIndex: 'created_date',
    render: (value) => moment(value).format('YYYY/MM/DD'),
  },
  {
    title: 'Doc. Year',
    render: (value, row) => moment(row.invoice_date).format('YYYY'),
  },
  {
    title: 'Invoice No.',
    dataIndex: 'ivc_num',
  },
  {
    title: 'Tax Invoice No.',
    dataIndex: 'tax_ivc_num',
  },
  // {
  //   title: 'Gross Value',
  //   dataIndex: 'gross_value',
  //   render: (value) => currencyFormater(value),
  // },
  // {
  //   title: 'Special G/L',
  //   dataIndex: 'special_gl',
  // },
  // {
  //   title: 'Attachment',
  //   dataIndex: 'attachment',
  // },
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
      Approve
    </Button>
  </Row>
);

const PurchasingVerification = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = usePurchasingVerification();
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
    const statusStr = status === 8 ? 'reject' : 'verify';
    const title = 'Confirm Purchasing Verification';

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
    selectionAction: <ButtonActionPopup onSubmit={() => doUpdateStatus(2)} onReject={() => doUpdateStatus(8)} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const visibility = ![1, 2].includes(row.status) ? 'hidden' : 'visible';
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
  //     id: 1, document_number: '190000001', company_code: 'KSNI', vendor_code: '10017', vendor_name: 'CONNEL BERSAUDARA CHEMINDO', invoice_date: '2022-11-08', created_date: '2022-11-07', doc_year: 2022, invoice_number: '1851366082', tax_invoice_number: '181751366082', gross_value: 1000000, special_gl: '', attachment: '-', status: 'draft',
  //   },
  //   {
  //     id: 2, document_number: '190000001', company_code: 'KSNI', vendor_code: '10017', vendor_name: 'CONNEL BERSAUDARA CHEMINDO', invoice_date: '2022-11-08', created_date: '2022-11-07', doc_year: 2022, invoice_number: '1851366082', tax_invoice_number: '181751366082', gross_value: 1000000, special_gl: '', attachment: '-', status: 'draft',
  //   },
  //   {
  //     id: 3, document_number: '190000001', company_code: 'KSNI', vendor_code: '10017', vendor_name: 'CONNEL BERSAUDARA CHEMINDO', invoice_date: '2022-11-08', created_date: '2022-11-07', doc_year: 2022, invoice_number: '1851366082', tax_invoice_number: '181751366082', gross_value: 1000000, special_gl: '', attachment: '-', status: 'draft',
  //   },
  //   {
  //     id: 4, document_number: '190000001', company_code: 'KSNI', vendor_code: '10017', vendor_name: 'CONNEL BERSAUDARA CHEMINDO', invoice_date: '2022-11-08', created_date: '2022-11-07', doc_year: 2022, invoice_number: '1851366082', tax_invoice_number: '181751366082', gross_value: 1000000, special_gl: '', attachment: '-', status: 'draft',
  //   },
  // ];

  return (
    <>
      <Col>
        <Text variant="h4">Purchasing Verification</Text>
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
            {/* <Button
              size="big"
              variant="primary"
              onClick={() => Router.push(`${Router.pathname}/create`)}
            >
              Create
            </Button> */}
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
            scroll={{ x: 2300 }}
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

export default PurchasingVerification;
