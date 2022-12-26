/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import Router from 'next/router';
import {
  Button, Col, Row, Spacer,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FormBuilder, IField } from 'components/FormBuilder';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import {
  DS_ASSET_CLASS, DS_ASSET_NO, DS_BANK_ACCOUNT, DS_COLLECTOR, DS_COMPANY, DS_OUTLET, DS_PLANT, DS_SALES,
} from 'constants/datasources';
import { css } from '@emotion/css';
import DataTable from 'components/DataTable';
import usePagination from '@lucasmogari/react-pagination';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { Divider } from 'components/Divider';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { DatePicker } from 'components/DatePicker';
import { RangeDatePicker } from 'components/RangeDatePicker';
import moment from 'moment';
import { STATUS_ORDER_VARIANT, STATUS_VARIANT } from 'utils/utils';
import { StatusPill } from 'components/StatusPill';
import { capitalize } from 'lodash';
import { useCashBank } from 'hooks/cash-bank/useCashBank';
import { message } from 'antd';

type Props = {
  company_code: string;
  cash_journal: string;
}

const columns = [
  {
    title: 'Document Number',
    dataIndex: 'document_number',
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
    title: 'Business Transaction',
    dataIndex: 'business_transaction',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
  {
    title: 'Cash Type',
    dataIndex: 'cash_type',
  },
  {
    title: 'Tax Code',
    dataIndex: 'tax_code',
  },
  {
    title: 'G/L Account',
    dataIndex: 'gl_account',
  },
  {
    title: 'House Bank',
    dataIndex: 'house_bank',
  },
  {
    title: 'Account ID',
    dataIndex: 'account_number',
  },
  {
    title: 'Tax Report',
    dataIndex: 'tax_report',
  },
  {
    title: 'Receipt Receipient',
    dataIndex: 'receipt_receipient',
  },
  {
    title: 'Text',
    dataIndex: 'text',
  },
  {
    title: 'Vendor',
    dataIndex: 'vendor',
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
  },
  {
    title: 'Posting Date',
    dataIndex: 'posting_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Document Date',
    dataIndex: 'document_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Net Amount',
    dataIndex: 'net_amount',
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
  },
  {
    title: 'Business Area',
    dataIndex: 'business_area',
  },
  {
    title: 'Assignment',
    dataIndex: 'assignment',
  },
  {
    title: 'Tax Base Amount',
    dataIndex: 'tax_base_amount',
  },
  {
    title: 'Cost Center',
    dataIndex: 'cost_center',
  },
  {
    title: 'Profit Center',
    dataIndex: 'profit_center',
  },
  {
    title: 'Order',
    dataIndex: 'order',
  },
  {
    title: 'Status',
    dataIndex: 'state',
    render: (value, row) => {
      const state = value;
      return <StatusPill variant={STATUS_VARIANT[state.toUpperCase()]} value={capitalize(state)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.uuid}`)}
        variant="tertiary"
      >
        View Detail
      </Button>
    ),
  },
];

function CashBankPage() {
  const form = useForm<Props>();
  const { formState: { isValid } } = form;

  const [showData, setShowData] = useState(false);
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const [modals, setModals] = useState<IModals>();
  const closeModals = () => setModals({});

  const service = useCashBank();
  const getCashBank = service.getList({
    enabled: showData,
    onSuccess: (res) => {
      if (res.status === 'error') throw Error(res.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
    query: {
      company_code: form.getValues('company_code'),
      cash_journal: form.getValues('cash_journal'),
      page: pagination.page - 1,
      size: pagination.itemsPerPage,
    },
  });
  const data = getCashBank.data?.data || [];

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<Props>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterGL = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('cash_journal'), company_code: form.getValues('company_code') },
  });

  const fields: IField<Props>[] = [
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
      flexWidth: 100,
    },
    {
      id: 'cash_journal',
      type: 'dropdown-texbox',
      label: 'Cash Journal',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: `${v.id}`, description: v.text })),
      disabled: !form.getValues('company_code'),
      validation: { required: '* required' },
      flexWidth: 100,
    },
    {
      id: '',
      type: 'custom',
      flexWidth: 100,
      render: <Button
        className={css`
          margin-top: -20px;
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
        disabled={!(form.getValues('company_code') && form.getValues('cash_journal'))}
        onClick={() => {
          if (showData) form.reset({});
          setShowData(!showData);
        }}
      >
        {showData ? 'Reset' : 'Show Data'}
      </Button>,
    },
  ];

  // const data = [
  //   {
  //     ID: 1, business_transaction: 'BANK HO2 SETORAN KAS BESAR', amount: '1.500.000', cash_type: 'Cash Receipt', tax_code: 'A0', gl_account: '11011020', house_bank: 'MD001-Mandiri',
  //   },
  //   {
  //     ID: 2, business_transaction: 'BEBAN RENOVASI BANGUNAN', amount: '1.000.000', cash_type: 'Cash Payment', tax_code: 'A1', gl_account: '41037050', house_bank: 'MD002-Mandiri',
  //   },
  //   {
  //     ID: 3, business_transaction: 'BIAYA SAMPLE FI', amount: '500.000', cash_type: 'Check Receipt', tax_code: 'A2', gl_account: '41031010', house_bank: 'BC001-BCA',
  //   },
  // ];
  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Cash & Bank</Text>
        </Row>
        <Spacer size={10} />
        <Card padding="20px">
          <Row width="100%" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Col className="w-[50%]">
              <Text variant="headingLarge" style={{ color: '#1A727A' }}>Balance Display for Display Period</Text>
            </Col>
            <Col className="w-[50%]">
              <RangeDatePicker picker="date" onChange={(e) => console.log(e)} />
            </Col>
          </Row>
          <Divider />
          <Row width="100%" style={{ justifyContent: 'space-between' }}>
            <Col style={{ width: '46%' }} gap="8px">
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="headingRegular">Opening Balance</Text>
                <Text variant="headingRegular">0</Text>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="headingRegular">Total Cash Receipt</Text>
                <Text variant="headingRegular">1.500.000</Text>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="headingRegular">Total Check Receipt</Text>
                <Text variant="headingRegular">500.000</Text>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="headingRegular">Total Cash Payment</Text>
                <Text variant="headingRegular" style={{ color: 'red' }}>- 1.500.000</Text>
              </Row>
              <Divider margin="10px 0" />
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="headingRegular">Closing Balance</Text>
                <Text variant="headingRegular">1.000.000</Text>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="headingRegular">Cash Therof</Text>
                <Text variant="headingRegular">500.000</Text>
              </Row>
            </Col>
            <Col style={{ width: '50%' }}>
              <Row width="100%">
                <FormBuilder
                  fields={fields}
                  column={1}
                  useForm={form}
                />
              </Row>
            </Col>
          </Row>
        </Card>

        <Spacer size={20} />

        {showData
          && (
          <Card padding="16px 20px" style={{ width: '100%' }}>
            <Row className="flex justify-end mb-3" width="100%">
              <Button
                size="big"
                variant="tertiary"
                onClick={() => Router.push(`${Router.pathname}/create`)}
              >
                + Add New
              </Button>
            </Row>
            <Row className="overflow-x-auto w-auto md:w-full">
              <div className="md:w-full">
                <DataTable
                  rowKey="ID"
                  data={data}
                  columns={columns}
                  pagination={pagination}
                  scroll={{ x: 3500 }}
                />
              </div>
            </Row>
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

export default CashBankPage;
