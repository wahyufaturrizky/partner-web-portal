/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import Router from 'next/router';
import {
  Button, Col, Row, Spacer, Search,
} from 'pink-lava-ui';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FormBuilder, IField } from 'components/FormBuilder';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import _ from 'lodash';
import { COLORS } from 'styles/COLOR';
import { useForm } from 'react-hook-form';
import { IModals, IRowSelection } from 'interfaces/interfaces';
import {
  DS_ASSET_CLASS, DS_ASSET_NO, DS_BANK_ACCOUNT, DS_COLLECTOR, DS_COMPANY, DS_OUTLET, DS_PLANT, DS_SALES,
} from 'constants/datasources';
import { css } from '@emotion/css';
import DataTable from 'components/DataTable';
import usePagination from '@lucasmogari/react-pagination';
import { useARList } from 'hooks/account-receivable/useARList';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import moment from 'moment';
import { StatusPill } from 'components/StatusPill';
import { STATUS_VARIANT } from 'utils/utils';

type Props = {
  company_code: string;
  doc_date: string;
  post_date: string;
  sales: string;
  no_outlet: string;
  collector: string;
  bank_account: string;
  description: string;
}

const columns = [
  {
    title: 'Sales',
    dataIndex: 'sales_id',
    width: 150,
    fixed: 'left',
    // render: (value, row) => (
    //   <Text
    //     variant="small"
    //     hoverColor="pink.regular"
    //     onClick={() => Router.push(`${Router.pathname}/${value}`)}
    //     clickable
    //     underLineOnHover
    //   >
    //     {value}
    //   </Text>
    // ),
  },
  {
    title: 'Collector',
    dataIndex: 'collector_id',
    width: 150,
  },
  {
    title: 'Outlet',
    dataIndex: 'outlet_id',
    width: 150,
  },
  {
    title: 'Outlet Name',
    dataIndex: 'outlet_name',
    width: 150,
  },
  {
    title: 'Invoice Number',
    dataIndex: 'invoice_number',
    width: 150,
  },
  {
    title: 'I/R',
    dataIndex: 'invoice_type',
    width: 150,
  },
  {
    title: 'Invoice Date',
    dataIndex: 'Invoice',
    width: 150,
    render: (value) => moment(value?.Time).format('DD/MM/YYYY'),

  },
  {
    title: 'Invoice Value',
    dataIndex: 'invoice_value',
    width: 150,
  },
  {
    title: 'Total Payment',
    dataIndex: 'total_payment',
    width: 150,
  },
  {
    title: 'Discount Payment',
    dataIndex: 'discount_payment',
    width: 180,
  },
  {
    title: 'Cash Payment',
    dataIndex: 'cash_payment',
    width: 150,
  },
  {
    title: 'Cek/Giro Number',
    dataIndex: 'giro_number',
    width: 180,
  },
  {
    title: 'Cek/Giro Payment',
    dataIndex: 'giro_payment',
    width: 180,
  },
  {
    title: 'Transfer Number',
    dataIndex: 'transfer_number',
    width: 180,
  },
  {
    title: 'Transfer Payment',
    dataIndex: 'transfer_payment',
    width: 180,
  },
  {
    title: 'CNDN Number',
    dataIndex: 'cndn_number',
    width: 150,
  },
  {
    title: 'CNDN Payment',
    dataIndex: 'cndn_payment',
    width: 150,
  },
  {
    title: 'Return Number',
    dataIndex: 'return_number',
    width: 150,
  },
  {
    title: 'Return Payment',
    dataIndex: 'return_payment',
    width: 150,
  },
  {
    title: 'Down Payment Number',
    dataIndex: 'down_payment_number',
    width: 220,
  },
  {
    title: 'Down Payment',
    dataIndex: 'down_payment',
    width: 150,
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
  {
    title: 'Action',
    dataIndex: 'action',
    width: 200,
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.ar_id}`)}
        variant="tertiary"
      >
        View Detail
      </Button>
    ),
  },
];

const ButtonActionPopup = ({ onSubmitAR }) => (
  <Row gap="16px">
    <Button
      size="big"
      variant="primary"
      onClick={() => onSubmitAR()}
    >
      Submit
    </Button>
  </Row>
);

function AccountReceivable() {
  const form = useForm<Props>();
  const { formState: { isValid } } = form;
  const { id } = Router.query;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showData, setShowData] = useState(false);
  const [isFetch, setIsFetch] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const [modals, setModals] = useState<IModals>();

  const closeModals = () => setModals({});

  const onSubmitARSelection = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Submit',
        message: `Are you sure want to submit ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => submitARList.mutate(selectedRowKeys),
      },
    });
  };
  const rowSelection: IRowSelection = {
    selectionMessage: 'Order Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmitAR={onSubmitARSelection} />,
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const fields: IField<Props>[] = [
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      datasources: DS_COMPANY.map((v) => ({ id: v.id, value: v.name })),
      validation: { required: '* required' },
    },
    {
      id: '', type: '',
    },
    {
      id: 'doc_date',
      type: 'datepicker',
      label: 'Document Date',
      validation: { required: '* required' },
    },
    {
      id: 'post_date',
      type: 'datepicker',
      label: 'Posting Date',
      validation: { required: '* required' },
    },
    {
      id: 'sales',
      type: 'dropdown-texbox',
      label: 'Sales',
      placeholder: 'Select',
      datasources: DS_SALES.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'no_outlet',
      type: 'dropdown-texbox',
      label: 'No Outlet',
      placeholder: 'Select',
      datasources: DS_OUTLET.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'collector',
      type: 'dropdown-texbox',
      label: 'Collector',
      placeholder: 'Select',
      datasources: DS_COLLECTOR.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'bank_account',
      type: 'dropdown-texbox',
      label: 'Bank Acc.',
      placeholder: 'Select',
      datasources: DS_BANK_ACCOUNT.map((v) => ({ id: v.id, value: v.id, description: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Type here..',
      validation: { required: '* required' },
    },
    {
      id: '',
      type: 'custom',
      render: <Button
        className={css`
          margin-top: 20px;
          border-radius: 5px;
          height: 48px;
        
          :hover:enabled {
            background-color: #EB008B;
            color: #fff;
            border: 0;
          }
        `}
        variant="tertiary"
        size="big"
        // disabled={!isValid}
        onClick={() => {
          setShowData(true);
          setIsFetch(true);
        }}
      >
        Show Data
      </Button>,
    },
  ];

  const getPayload = (params: Props) => ({
    ...params,
  });

  const service = useARList();
  const { data: resList, refetch } = service.getList({
    onSuccess: (res) => {
      pagination.setTotalItems(res.data.pagination.total_rows);
      setLoading(false);
    },
    onError: (err) => {
      // message.error(err.message);
      console.log(err);
    },
    enabled: showData,
    query: {
      search,
      page: pagination.page - 1,
      size: pagination.itemsPerPage,
      company_code: form.getValues('company_code'),
      doc_date: form.getValues('doc_date'),
      post_date: form.getValues('post_date'),
      sales: form.getValues('sales'),
      no_outlet: form.getValues('no_outlet'),
      collector: form.getValues('collector'),
      bank_account: form.getValues('bank_account'),
      description: form.getValues('description'),
    },
  });
  const data = resList?.data.items || [];

  const submitARList = service.submit({
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
      // message.error(err.message);
    },
  });

  useEffect(() => {
    if (isFetch) {
      refetch();
      setIsFetch(false);
    }
  }, [isFetch]);

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Account Receivable</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="20px">
          <Row width="100%">
            <FormBuilder
              fields={fields}
              column={2}
              useForm={form}
            />
          </Row>
        </Card>

        <Spacer size={20} />

        {showData
          && (
          <Card padding="16px 20px" style={{ width: '100%' }}>
            <Row justifyContent="space-between" padding="20px 0" alignItems="center">
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
                onClick={() => Router.push(`${Router.pathname}/${selectedRowKeys}/create/`)}
                disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
              >
                Input
              </Button>
            </Row>
            <DataTable
              rowKey="ar_id"
              data={data || []}
              columns={columns}
              rowSelection={rowSelection}
              scroll={{ x: 1500 }}
              pagination={pagination}
              isLoading={isLoading}
            />
          </Card>
          )}

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
        visible={modals.alert.open}
        title={modals.alert.title}
        message={modals.alert.message}
        variant={modals.alert.variant}
        onOk={() => closeModals()}
      />
      )}
    </>
  );
}

const Span = styled.div`
  font-size: 14px;
  line-height: 18px;
  font-weight: normal;
  color: #ffe12e;
`;

const Card = styled.div<{ padding }>`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : '16px')};
`;

export default AccountReceivable;
