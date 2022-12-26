/* eslint-disable camelcase */
import {
  Row, Spacer,
} from 'pink-lava-ui';
import usePagination from '@lucasmogari/react-pagination';
import { TableRowSelection } from 'antd/lib/table/interface';
import { IForm, IModals } from 'interfaces/interfaces';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uniqueId } from 'lodash';
import { FormBuilder, IField } from 'components/FormBuilder';
import DataTable from 'components/DataTable';
import { ModalChildren } from 'components/modals/ModalChildren';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterAsset } from 'hooks/master-data/useMasterAsset';
import { useQueryMasterDebitCredit } from 'hooks/master-data/useMasterDebitCredit';
import { useQueryMasterTax } from 'hooks/master-data/useMasterTax';
import { currencyFormater } from 'lib/currencyFormatter';
import { useQueryMasterUom } from 'hooks/master-data/useMasterUom';
import { Button } from 'components/Button';
import { AdjustmentAssetValueFields } from './form';

export type AssetListFields = {
    idx: string,
    id_ast_master: string,
    id_adjst: number,
    ast_desc: string,
    dc: string,
    ammount_doc: string,
    ammount_loc: string,
    tax_id: string,
    quantity: number,
    uom: string,
    assignment: string,
    text: string,
    material: string,
    order_number: string,
    order_id: number,
    status: number,
    order_value: string
}

export const FormAssetList = (props: IForm<AdjustmentAssetValueFields>) => {
  const { form: formAdjustmentAsset } = props;
  const form = useForm<AssetListFields>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { getValues, setValue } = formAdjustmentAsset;

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'Asset Number', dataIndex: 'id_ast_master' },
    { title: 'Asset Description', dataIndex: 'ast_desc' },
    { title: 'D/C', dataIndex: 'dc', render: (value) => (value === 'S' ? 'Debit' : 'Credit') },
    { title: 'Amount In Doc. Currency', dataIndex: 'ammount_doc', render: (value) => currencyFormater(value) },
    { title: 'Ammount In Local Currency', dataIndex: 'ammount_loc', render: (value) => currencyFormater(value) },
    { title: 'Tax Code', dataIndex: 'tax_id' },
    { title: 'Qty', dataIndex: 'quantity' },
    { title: 'Uom', dataIndex: 'uom' },
    { title: 'Assignment', dataIndex: 'assignment' },
    { title: 'Text', dataIndex: 'text' },
    { title: 'Material', dataIndex: 'material' },
    { title: 'Order', dataIndex: 'order' },
  ];

  const closeModals = () => setModals({});
  const doSubmit = () => {
    const values = form.getValues();
    const { value_adjusment = [] } = getValues();

    setValue('value_adjusment', [...value_adjusment, { ...values, id_adjst: 0, idx: uniqueId() }]);

    closeModals();
  };

  const doDelete = () => {
    const { value_adjusment } = getValues();

    setValue('value_adjusment', value_adjusment.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AssetListFields>();
  const queryMasterAsset = useQueryMasterAsset({
    query: { req: getSearchValue('id_ast_master') || getSearchValue('material') },
  });
  const queryMasterDebitCredit = useQueryMasterDebitCredit({
    query: { req: getSearchValue('dc') },
  });
  const queryMasterTax = useQueryMasterTax({
    query: { req: getSearchValue('tax_id') },
  });
  const queryMasterUom = useQueryMasterUom({
    query: { req: getSearchValue('uom') },
  });

  const fields: IField<AssetListFields>[] = [
    {
      id: 'id_ast_master',
      type: 'dropdown',
      label: 'Asset Number',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAsset.data?.map((v) => ({ id: v.id, value: `${v.id}`, description: v.description })),
      onChange: ({ target }) => {
        form.setValue('ast_desc', target.selected?.description);
      },
    },
    {
      id: 'ast_desc',
      type: 'text',
      label: 'Asset Description',
      disabled: true,
    },
    {
      id: 'dc',
      type: 'dropdown',
      label: 'D/C',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDebitCredit.data?.map((v) => ({ id: v.id, value: `${v.desc}` })),
    },
    { id: '', type: '' },
    {
      id: 'ammount_doc',
      type: 'currency',
      label: 'Ammount In Doc. Currency',
      placeholder: 'e.g. 100.000',
      validation: { required: '* required' },
      onChange: ({ target }) => {
        const rate = Number(formAdjustmentAsset.getValues('val_currency'));
        const localCurrency = Number(target.value) * rate;

        form.setValue('ammount_loc', `${localCurrency}`);
      },
    },
    {
      id: 'ammount_loc',
      type: 'currency',
      label: 'Ammount In Local Currency',
      placeholder: 'e.g. 100.000',
      validation: { required: '* required' },
      disabled: true,
    },
    {
      id: 'tax_id',
      type: 'dropdown',
      label: 'Tax',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterTax.data?.map((v) => ({ id: v.tax_code, value: `${v.tax_code} - ${v.description}` })),
    },
    {
      id: 'quantity',
      type: 'number',
      label: 'Qty',
      placeholder: 'e.g. 100',
      validation: { required: '* required' },
    },
    {
      id: 'uom',
      type: 'dropdown',
      label: 'UoM',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterUom.data?.map((v) => ({ id: v.id_uom, value: `${v.id_uom} - ${v.name_uom}` })),
    },
    {
      id: 'assignment',
      type: 'text',
      label: 'Assignment',
      placeholder: 'e.g. Assignment',
      validation: { required: '* required' },
    },
    {
      id: 'text',
      type: 'text',
      label: 'Text',
      placeholder: 'e.g. Text',
      validation: { required: '* required' },
    },
    {
      id: 'material',
      type: 'dropdown',
      label: 'Material',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAsset.data?.map((v) => ({ id: v.id, value: `${v.id}`, description: v.description })),
    },
    {
      id: 'order_value',
      type: 'text',
      label: 'Order',
      disabled: true,
    },
  ];

  return (
    <>
      <Row width="100%" gap="4px">
        <Button
          size="big"
          variant="primary"
          onClick={() => {
            form.reset({});
            setModals({
              transaction: {
                open: true,
                title: 'Add New',
                onOk: form.handleSubmit(doSubmit),
              },
            });
          }}
        >
          {' '}
          Add New
        </Button>
        <Button size="big" variant="tertiary" onClick={() => doDelete()} disabled={selectedRowKeys.length === 0}> Delete </Button>
      </Row>
      <Spacer size={10} />
      <Row className="overflow-x-auto w-auto md:w-full">
        <div className="min-w-[1000px] md:w-full">
          <DataTable
            rowKey="ID"
            columns={columns}
            data={getValues('value_adjusment') || []}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 1500 }}
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
          <Row width="100%">
            <FormBuilder
              fields={fields}
              column={2}
              useForm={form}
            />
          </Row>
        </ModalChildren>
      )}
    </>
  );
};
