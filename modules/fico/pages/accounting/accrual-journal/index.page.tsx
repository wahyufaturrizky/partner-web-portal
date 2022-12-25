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
import { useReversalJournal } from 'hooks/accounting/useReversalJournal';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAccrualJournal } from 'hooks/accounting/useAccrualJournal';
import { message } from 'antd';
import moment from 'moment';

const columns = [
  {
    title: 'Document Number',
    dataIndex: 'document_number',
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
    title: 'Company Code',
    dataIndex: 'company_code',
  },
  {
    title: 'Company Name',
    dataIndex: 'company_name',
  },
  {
    title: 'Document Date',
    dataIndex: 'document_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Posting Date',
    dataIndex: 'posting_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Fiscal Year',
    dataIndex: 'fiscal_year',
  },
  {
    title: 'Reference',
    dataIndex: 'reference',
  },
  {
    title: 'Header Text',
    dataIndex: 'header_text',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
  {
    title: 'Reversal Reason',
    dataIndex: 'reversal_reason',
  },
  {
    title: 'Reversal Date',
    dataIndex: 'reversal_date',
    render: (value) => moment(value).format('YYYY-MM-DD'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 150,
    render: (prop, row) => {
      const status = row?.state === 'submit' ? 'SUBMITTED' : row?.state.toUpperCase();
      return <StatusPill variant={STATUS_VARIANT[status]} value={_.capitalize(status)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 150,
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`/accounting/accrual-journal/${row.document_number}`)}
        variant="tertiary"
      >
        View Detail
      </Button>
    ),
  },
  // {
  //   title: 'Action',
  //   dataIndex: 'action',
  //   render: (value, row) => (
  //     <Button
  //       size="small"
  //       onClick={() => Router.push(`${Router.pathname}/${row.document_number}/detail`)}
  //       variant="tertiary"
  //     >
  //       View Detail
  //     </Button>
  //   ),
  // },
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

const AccrualJournal = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useAccrualJournal();
  const submitAccrualJournal = service.submit({
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

  const closeModals = () => setModals({});
  const onSubmitSelection = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Submit',
        message: `Are you sure want to submit ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => submitAccrualJournal.mutate(selectedRowKeys),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Order Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={onSubmitSelection} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const visibility = row.state === 'submit' ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const { data: resList, refetch } = service.getList({
    onSuccess: (res) => {
      pagination.setTotalItems(res.total);
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

  // const data = [
  //   {
  //     ID: 1,
  //     document_number: '190000001',
  //     company_code: 'PP01',
  //     company_name: 'Kaldu Sari Nabati Indonesia',
  //     document_date: '10-04-2022',
  //     posting_date: '11-04-2022',
  //     reference: 'Reference',
  //     header_text: 'Header Text',
  //     currency: 'IDR',
  //     reversal_reason: '01',
  //     reversal_date: '11-04-2022',
  //     status: 'draft',
  //   },
  //   {
  //     ID: 2,
  //     document_number: '190000002',
  //     company_code: 'PP02',
  //     company_name: 'Pinus Merah Abadi',
  //     document_date: '10-04-2022',
  //     posting_date: '11-04-2022',
  //     reference: 'Reference',
  //     header_text: 'Header Text',
  //     currency: 'IDR',
  //     reversal_reason: '01',
  //     reversal_date: '11-04-2022',
  //     status: 'draft',
  //   },
  //   {
  //     ID: 3,
  //     document_number: '190000003',
  //     company_code: 'PP01',
  //     company_name: 'Kaldu Sari Nabati Indonesia',
  //     document_date: '10-04-2022',
  //     posting_date: '11-04-2022',
  //     reference: 'Reference',
  //     header_text: 'Header Text',
  //     currency: 'IDR',
  //     reversal_reason: '01',
  //     reversal_date: '11-04-2022',
  //     status: 'submitted',
  //   },
  //   {
  //     ID: 4,
  //     document_number: '190000004',
  //     company_code: 'PP02',
  //     company_name: 'Pinus Merah Abadi',
  //     document_date: '10-04-2022',
  //     posting_date: '11-04-2022',
  //     reference: 'Reference',
  //     header_text: 'Header Text',
  //     currency: 'IDR',
  //     reversal_reason: '01',
  //     reversal_date: '11-04-2022',
  //     status: 'submitted',
  //   },
  // ];

  return (
    <>
      <Col>
        <Text variant="h4">Accrual Journal</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Col>
              <Search
                width="380px"
                nameIcon="SearchOutlined"
                placeholder="Search Document Number, Company Code or Name"
                colorIcon={COLORS.grey.regular}
                onChange={_.debounce((e) => setSearch(e.target.value), 500)}
              />
            </Col>
            <Col>
              <Row gap="12px">
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => Router.push(`${Router.pathname}/running`)}
                >
                  Accrual Journal Running
                </Button>
                <Button
                  size="big"
                  variant="primary"
                  onClick={() => Router.push(`${Router.pathname}/create`)}
                >
                  Create
                </Button>
              </Row>
            </Col>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card padding="16px 20px" style={{ width: '100%' }}>
          <DataTable
            rowKey="document_number"
            data={data}
            columns={columns}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 2300 }}
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

export default AccrualJournal;
