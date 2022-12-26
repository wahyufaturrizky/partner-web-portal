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
import { STATUS_ASSET_MUTATION_VARIANT, STATUS_VARIANT } from 'utils/utils';
import { Link } from 'components/Link';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';
import { Text } from 'components/Text';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useGrMutation } from 'hooks/asset/useGrMutation';
import { message } from 'antd';
import moment from 'moment';

const columns = [
  {
    title: 'Doc. Number',
    dataIndex: 'doc_number',
    fixed: 'left',
    render: (value, row) => (
      <Text
        variant="small"
        hoverColor="pink.regular"
        onClick={() => Router.push(`${Router.pathname}/${row.id}/detail`)}
        clickable
        underLineOnHover
      >
        {value}
      </Text>
    ),
  },
  {
    title: 'Doc. Date',
    dataIndex: 'doc_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Sent Date',
    dataIndex: 'sent_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Sender',
    dataIndex: 'sender',
  },
  {
    title: 'Receiver',
    dataIndex: 'receiver',
  },
  {
    title: 'Division From',
    dataIndex: 'sender_dvsn',
  },
  {
    title: 'Division To',
    dataIndex: 'receiver_dvsn',
  },
  {
    title: 'Vehicles Number',
    dataIndex: 'vehicles',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value, row) => {
      const statusDoc = value === 1 ? 'SUBMITTED' : 'DRAFT';
      const statusReceive = row.status_receive === 1 ? 'RECEIVED' : 'WAITING FOR RECEIVED';
      const status = statusDoc === 'SUBMITTED' ? statusReceive : statusDoc;

      return <StatusPill variant={STATUS_ASSET_MUTATION_VARIANT[status]} value={_.capitalize(status)} />;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (prop, row) => (
      <Button
        size="small"
        onClick={() => Router.push(`${Router.pathname}/${row.id}/detail`)}
        variant="tertiary"
      >
        View Detail
      </Button>
    ),
  },
];

const ButtonActionPopup = ({ onReceive, onReject }) => (
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
      onClick={() => onReceive()}
    >
      Receive
    </Button>
  </Row>
);

const GRAssetMutation = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const service = useGrMutation();
  const updateGrMutation = service.update({
    onSuccess: () => {
      setModals({
        confirmation: { open: false, title: '', message: '' },
        alert: {
          open: true, title: 'Update Success', message: 'Document Number(s) has been successfully updated', variant: 'success',
        },
      });
      getGrMutation.refetch();
      setSelectedRowKeys([]);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});
  const onSubmitSelection = ({ status }) => {
    const statusStr = status === 1 ? 'Receive' : 'Reject';
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Submit',
        message: `Are you sure want to ${statusStr} ${selectedRowKeys.length} Document Number(s) ?`,
        onOk: () => updateGrMutation.mutate({ id: selectedRowKeys[0], status_receive: status }),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Doc. Number(s) are selected',
    selectionAction: <ButtonActionPopup onReceive={() => onSubmitSelection({ status: 1 })} onReject={() => onSubmitSelection({ status: 0 })} />,
    selectedRowKeys,
    getCheckboxProps: (row: any) => {
      const disabled = row.status === 0 || (!selectedRowKeys.includes(row.id) && selectedRowKeys.length >= 1);
      const visibility = disabled ? 'hidden' : 'visible';
      return { disabled: visibility === 'hidden', style: { visibility } };
    },
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const getGrMutation = service.getList({
    onSuccess: (res) => {
      pagination.setTotalItems(res.data.pagination.total_rows);
      setLoading(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
    query: {
      search,
      page: pagination.page - 1,
      size: pagination.itemsPerPage,
    },
  });
  const data = getGrMutation.data?.data.assets || [];

  // const data = [
  //   {
  //     ID: 1, document_number: '190000004', document_date: '11-04-2022', sent_date: '11-04-2022', sender: 'P100', receiver: 'P101', division_from: 'E010101000', division_to: 'E010101001', vehicles_number: 'B 1234 NBT', status: 'waiting for received',
  //   },
  //   {
  //     ID: 2, document_number: '190000003', document_date: '11-04-2022', sent_date: '11-04-2022', sender: 'P100', receiver: 'P101', division_from: 'E010101000', division_to: 'E010101001', vehicles_number: 'B 1234 NBT', status: 'waiting for received',
  //   },
  //   {
  //     ID: 3, document_number: '190000002', document_date: '11-04-2022', sent_date: '11-04-2022', sender: 'P100', receiver: 'P101', division_from: 'E010101000', division_to: 'E010101001', vehicles_number: 'B 1234 NBT', status: 'waiting for received',
  //   },
  //   {
  //     ID: 4, document_number: '190000001', document_date: '11-04-2022', sent_date: '11-04-2022', sender: 'P100', receiver: 'P101', division_from: 'E010101000', division_to: 'E010101001', vehicles_number: 'B 1234 NBT', status: 'waiting for received',
  //   },
  // ];

  return (
    <>
      <Col>
        <Text variant="h4">GR Asset Mutation</Text>
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
            scroll={{ x: 2000 }}
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

export default GRAssetMutation;
