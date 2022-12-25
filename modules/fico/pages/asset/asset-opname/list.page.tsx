/* eslint-disable no-unused-vars */
import usePagination from '@lucasmogari/react-pagination';
import Router, { useRouter } from 'next/router';
import {
  Button,
  Col,
  Row,
  Search,
  Spacer,
} from 'pink-lava-ui';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import React, { useState } from 'react';
import DataTable from 'components/DataTable';
import _ from 'lodash';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { IModals, IMutate, IRowSelection } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { Text } from 'components/Text';
import { useRouterPath } from 'hooks/helper/useRouterPath/useRouterPath';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAssetOpname } from 'hooks/asset/useAssetOpname';
import { message } from 'antd';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Cost Center',
    dataIndex: 'cost_center',
  },
  {
    title: 'Plant',
    dataIndex: 'plant',
  },
  {
    title: 'Asset Number',
    dataIndex: 'id_ast_master',
  },
  {
    title: 'Asset Description',
    dataIndex: 'ast_desc',
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
  },
  {
    title: 'Total',
    dataIndex: 'total',
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
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

const AssetOpnameList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modals, setModals] = useState<IModals>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);

  const doSubmit = (prop) => {
    setModals({
      alert: {
        open: true,
        title: 'Submit Success',
        message: 'Asset Opname List has been successfully submitted',
        variant: 'success',
      },
    });
  };
  // const { mutate: doSubmit }: IMutate = submit({
  //   options: {
  //     onSuccess: () => {
  //       setModals({
  //         confirmation: { open: false, title: '', message: '' },
  //         alert: {
  //           open: true, title: 'Submit Success', message: 'Order number(s) has been successfully submited', variant: 'success',
  //         },
  //       });
  //       refetch();
  //       setSelectedRowKeys([]);
  //     },
  //   },
  // });

  const closeModals = () => setModals({});
  const onSubmitSelection = () => {
    setModals({
      ...modals,
      confirmation: {
        open: true,
        title: 'Confirm Submit',
        message: `Are you sure want to submit ${selectedRowKeys.length} Order Number(s) ?`,
        onOk: () => doSubmit(selectedRowKeys),
      },
    });
  };

  const rowSelection: IRowSelection = {
    selectionMessage: 'Order Number(s) are selected',
    selectionAction: <ButtonActionPopup onSubmit={onSubmitSelection} />,
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const { query } = useRouter();
  const service = useAssetOpname();
  const getAssetOpname = service.getList({
    onSuccess: (res) => {
      // pagination.setTotalItems(res.data.pagination.total_rows);
      setLoading(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
    query: {
      ...query,
      search,
      // page: pagination.page - 1,
      // size: pagination.itemsPerPage,
    },
  });
  const data = getAssetOpname.data?.data || [];

  // const data = [
  //   {
  //     id: 1, cost_center: 'P01G041021', plant: 'P100', asset_number: '4200001041', asset_description: 'HHT - Samsung M10 HO -> JEMBER', brand: 'SAMSUNG', total: 1, unit: 'PCS',
  //   },
  //   {
  //     id: 2, cost_center: 'P01G041022', plant: 'P100', asset_number: '4200001042', asset_description: 'IBM Server & Win 7 Pro 32Bit GT', brand: 'IBM', total: 1, unit: 'PCS',
  //   },
  //   {
  //     id: 3, cost_center: 'P01G041023', plant: 'P100', asset_number: '4200001043', asset_description: 'Printer LQ2190 GT/MT', brand: 'HP', total: 1, unit: 'PCS',
  //   },
  //   {
  //     id: 4, cost_center: 'P01G041024', plant: 'P100', asset_number: '4200001044', asset_description: 'PC Desktop & Windows 7 Home Basic 32Bit SA GT', brand: 'SAMSUNG', total: 1, unit: 'PCS',
  //   },
  // ];

  const { rootMenuPath } = useRouterPath();
  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push(`${rootMenuPath}`)} style={{ cursor: 'pointer' }} />
          <Text variant="h4">Asset Opname List</Text>
        </Row>
        <Spacer size={20} />
        <Card>
          <Row justifyContent="flex-end" alignItems="center">
            <Row gap="12px">
              {/* <Button
                size="big"
                variant="tertiary"
                onClick={() => Router.push(`${rootMenuPath}/1/detail`)}
              >
                View Opname Asset
              </Button>
              <Button
                size="big"
                variant="secondary"
                onClick={() => setModals({
                  ...modals,
                  alert: {
                    open: true, title: 'Success', message: 'Asset Opname List has been saved successfully', variant: 'success',
                  },
                })}
              >
                Save as Draft
              </Button>
              <Button
                size="big"
                variant="primary"
                onClick={() => setModals({
                  ...modals,
                  confirmation: {
                    open: true, title: 'Confirm Submit', message: 'Are you sure want to submit Asset Opname List ?', onOk: () => doSubmit({}),
                  },
                })}
              >
                Submit
              </Button> */}
            </Row>
          </Row>
        </Card>
        <Spacer size={10} />
        <Card padding="16px 20px" style={{ width: '100%' }}>
          <DataTable
            rowKey="id"
            data={data}
            columns={columns}
            pagination={pagination}
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

export default AssetOpnameList;
