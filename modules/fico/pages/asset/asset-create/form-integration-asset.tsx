/* eslint-disable camelcase */
import { useForm } from 'react-hook-form';
import {
  Row, Spacer,
} from 'pink-lava-ui';
import { IForm, IModals } from 'interfaces/interfaces';
import usePagination from '@lucasmogari/react-pagination';
import React, { useState } from 'react';
import { TableRowSelection } from 'antd/lib/table/interface';
import { uniqueId } from 'lodash';
import { FormBuilder, IField } from 'components/FormBuilder';
import DataTable from 'components/DataTable';
import { ModalChildren } from 'components/modals/ModalChildren';
import { Checkbox } from 'components/Checkbox';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { Button } from 'components/Button';
import { AssetFields } from './form';

export type IntegrationAssetEquipmentFields = {
  idx: number | string;
  id: number | string;
  id_ast_master: string,
  eqp_number: string,
  eqp_category: string,
  eqp_object: string,
  syc_status: boolean,
  workflow_status: boolean,
  description_technical_object: string,
}

export const FormIntegrationAssetEquipment = (props: IForm<AssetFields>) => {
  const { form, datasources } = props;
  const formIntegration = useForm<IntegrationAssetEquipmentFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { getValues, setValue } = form;
  const {
    handleSubmit,
    getValues: getValuesIntegration,
    reset,
  } = formIntegration;

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    {
      title: 'Workflow', dataIndex: 'workflow_status', align: 'center', render: (value) => <Checkbox justifyContent="center" checked={value} disabled />,
    },
    {
      title: 'Sync', dataIndex: 'syc_status', align: 'center', render: (value) => <Checkbox justifyContent="center" checked={value} disabled />,
    },
    { title: 'Equipment Number', dataIndex: 'eqp_number', render: (value) => datasources?.eqp_number?.find((v) => v.id_eqp === value)?.name_eqp || value },
    { title: 'Category', dataIndex: 'eqp_category' },
    { title: 'Object Type', dataIndex: 'eqp_object' },
    // { title: 'Description of Technical Object', dataIndex: 'description_technical_object' },
  ];

  const closeModals = () => setModals({});
  const doSubmitTransaction = () => {
    const values = getValuesIntegration();
    const { integration_asset_equipment = [] } = getValues();

    setValue('integration_asset_equipment', [...integration_asset_equipment, { ...values, id: 0, idx: uniqueId() }]);

    closeModals();
  };

  const doDeleteTransaction = () => {
    const { integration_asset_equipment } = getValues();

    setValue('integration_asset_equipment', integration_asset_equipment.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const fields: IField<IntegrationAssetEquipmentFields>[] = [
    {
      id: 'workflow_status',
      type: 'checkbox',
      label: 'Workflow',
    },
    {
      id: 'syc_status',
      type: 'checkbox',
      label: 'Sync',
    },
    {
      id: 'eqp_number',
      type: 'dropdown',
      label: 'Equipment Number',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.eqp_number?.map((v) => ({ id: v.id_eqp, value: `${v.id_eqp} - ${v.name_eqp}` })),
    },
    {
      id: 'eqp_category',
      type: 'text',
      label: 'Category',
      placeholder: 'e.g Water',
      validation: { required: '* required' },
    },
    {
      id: 'eqp_object',
      type: 'text',
      label: 'Object Type',
      placeholder: 'e.g Good',
      validation: { required: '* required' },
    },
    // {
    //   id: 'description_technical_object',
    //   type: 'text',
    //   label: 'Description of Technical Object',
    //   placeholder: 'e.g Testing',
    //   validation: { required: '* required' },
    // },
  ];

  return (
    <>
      <Row width="100%" gap="4px">
        <Button
          size="big"
          variant="primary"
          onClick={() => {
            reset({});
            setModals({
              transaction: {
                open: true,
                title: 'Add New',
                onOk: handleSubmit(doSubmitTransaction),
              },
            });
          }}
        >
          {' '}
          Add New
        </Button>
        <Button size="big" variant="tertiary" onClick={() => doDeleteTransaction()} disabled={selectedRowKeys.length === 0}> Delete </Button>
      </Row>
      <Spacer size={10} />
      <Row className="overflow-x-auto w-auto md:w-full">
        <div className="w-[400%] md:w-full">
          <DataTable
            rowKey="idx"
            columns={columns}
            data={getValues('integration_asset_equipment') || []}
            pagination={pagination}
            rowSelection={rowSelection}
          />
        </div>
      </Row>
      {modals?.transaction && (
        <ModalChildren
          title={modals.transaction.title}
          visible={modals.transaction.open}
          width={800}
          onCancel={() => closeModals()}
          onOk={() => modals.transaction?.onOk?.()}
          textBtnOk="Save"
          textBtnCancel="Cancel"
        >
          <Row width="100%" padding="20px 0">
            <FormBuilder
              fields={fields}
              column={2}
              useForm={formIntegration}
            />
          </Row>
        </ModalChildren>
      )}
    </>
  );
};
