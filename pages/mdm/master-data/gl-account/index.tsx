/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Router from 'next/router';
import React, { useState } from 'react';
import { capitalize, debounce } from 'lodash';
import moment from 'moment';
import { Modal } from 'types/modal';
import { useConfigPagination } from 'hooks/pagination/use-config-pagination';
import { useMasterGLAccount } from 'hooks/mdm/master-data/use-gl-account';
import {
  Button, Card, Col, DataTable, message, ModalAlert, ModalConfirmation, Row, Search, Spacer, Text,
} from 'components/pink-lava-ui';

const columns = [
  {
    title: 'G/L Account',
    dataIndex: 'gl_account',
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
    dataIndex: 'company_id',
  },
  {
    title: 'Chart of Account',
    dataIndex: 'chart_of_account',
  },
  {
    title: 'Account Group',
    dataIndex: 'account_group',
  },
  {
    title: 'Short Text',
    dataIndex: 'short_text',
  },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   render: (value, row) => <StatusPill variant={STATUS_AP_VARIANT[value]} value={STATUS_AP_WORDING[value]} />,
  // },
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

const ButtonActionPopup = ({ onDelete }) => (
  <Row gap="16px">
    <Button
      size="big"
      variant="primary"
      style={{ background: 'red' }}
      onClick={() => onDelete()}
    >
      DELETE
    </Button>
  </Row>
);

const MasterGLAccount = () => {
  const menuTitle = 'G/L Account';
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<Modal>();
  const pagination = useConfigPagination();

  const service = useMasterGLAccount();
  const deleteData = service.deleteData({
    onSuccess: (res, variable) => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Delete Success', message: `${menuTitle}(s) has been successfully deleted`, variant: 'success',
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
  const doDelete = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm DELETE',
        message: `Are you sure want to DELETE ${selectedRowKeys.length} ${menuTitle}(s) ?`,
        onOk: () => deleteData.mutate({ ids: selectedRowKeys }),
      },
    });
  };

  const rowSelection = {
    selectionMessage: `${menuTitle}(s) are selected`,
    selectionAction: <ButtonActionPopup onDelete={() => doDelete()} />,
    selectedRowKeys,
    // getCheckboxProps: (row: any) => {
    //   const visibility = ![0, 1].includes(row.status) ? 'hidden' : 'visible';
    //   return { disabled: visibility === 'hidden', style: { visibility } };
    // },
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const getList = service.getList({
    onSuccess: (res) => {
      pagination.setTotalItems(res.data.pagination.total_rows);
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
  const data = getList.data?.data.rows || [];

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
        <Spacer size={20} />
        <Text variant="h4">{`Master ${menuTitle}`}</Text>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="space-between" alignItems="center">
            <Search
              width="380px"
              nameIcon="SearchOutlined"
              placeholder="Search Document Number, Company Code or Name"
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
            isLoading={getList.isFetching}
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

export default MasterGLAccount;
