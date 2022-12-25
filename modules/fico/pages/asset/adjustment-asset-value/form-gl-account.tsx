/* eslint-disable camelcase */
import usePagination from '@lucasmogari/react-pagination';
import { TableRowSelection } from 'antd/lib/table/interface';
import { IForm, IModals } from 'interfaces/interfaces';
import { currencyFormater } from 'lib/currencyFormatter';
import {
  Row, Spacer,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uniqueId } from 'lodash';
import { FormBuilder, IField } from 'components/FormBuilder';
import DataTable from 'components/DataTable';
import { ModalChildren } from 'components/modals/ModalChildren';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterDebitCredit } from 'hooks/master-data/useMasterDebitCredit';
import { useQueryMasterTax } from 'hooks/master-data/useMasterTax';
import { useQueryMasterAsset } from 'hooks/master-data/useMasterAsset';
import { useQueryMasterAssetClass } from 'hooks/master-data/useMasterAssetClass';
import { useQueryMasterCostCenterAsset } from 'hooks/master-data/useMasterCostCenterAsset';
import { Button } from 'components/Button';
import { AdjustmentAssetValueFields } from './form';

export type GLAccountFields = {
    idx: string,
    transaction_typ: string,
    gl_transaction: string,
    business_transa: string,
    bus_transac_typ: string,
    ref_procedure: string,
    gl_fiscal_year: number,
    ref_org_unit: string,
    reference_docum: string,
    ref_doc_line_it: number,
    balance_transac: string,
    transaction_cur: string,
    company_code_cu: string,
    global_currency: string,
    co_object_curre: string,
    account_number: string,
    account_name: string,
    cost_center: string,
    profit_center: string,
    controll_area: string,
    amount_in_balan: string | number,
    amount_in_trans: string,
    amount_in_compa: string,
    amount_in_globa: string,
    amount_in_co_ob: string,
    debit_creditind: string,
    posting_period: number,
    fiscal_year_var: string,
    period_year: number,
    posting_date: string,
    document_date: string,
    document_type: string,
    line_item: string,
    assignment: string,
    posting_key: string,
    item_category: string,
    user_name: string,
    depreciation_ar: number,
    asset: string,
    sub_number: string,
    asset_value_dat: string,
    asset_transacti: string,
    trans_type_cate: string,
    asset_class: string,
    acct_determinat: string,
    cost_estimate_n: number,
    time_stamp: string,
    chart_of_accoun: string,
    text: string,
    account_type: string,
    offsetting_acco: string,
    offsetting_type: string,
    object_class: string,
    document_item: number,
    orders: string,
    order_category: number,
    order_value: string,
    tax_code: string
}

export const FormGLAccount = (props: IForm<AdjustmentAssetValueFields>) => {
  const { form: formAdjustmentAsset } = props;
  const form = useForm<GLAccountFields>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'G/L Account', dataIndex: 'account_number' },
    { title: 'G/L Name', dataIndex: 'account_name' },
    { title: 'D/C', dataIndex: 'debit_creditind', render: (value) => (value === 'S' ? 'Debit' : 'Credit') },
    { title: 'Amount In Doc. Currency', dataIndex: 'amount_in_trans', render: (value) => currencyFormater(value) },
    { title: 'Ammount In Local Currency', dataIndex: 'amount_in_balan', render: (value) => currencyFormater(value) },
    { title: 'Tax Code', dataIndex: 'tax_code' },
    { title: 'Asset Number', dataIndex: 'asset' },
    { title: 'Asset Class', dataIndex: 'asset_class', render: (value) => queryMasterAssetClass.data?.find((v) => v.id_ast_class === value)?.name_ast_class },
    { title: 'Assignment', dataIndex: 'assignment' },
    { title: 'Text', dataIndex: 'text' },
    { title: 'Cost Center', dataIndex: 'cost_center' },
    { title: 'Order', dataIndex: 'order' },
  ];

  const closeModals = () => setModals({});
  const doSubmitTransaction = () => {
    const values = form.getValues();
    const { for_acdoca = [] } = formAdjustmentAsset.getValues();

    formAdjustmentAsset.setValue('for_acdoca', [...for_acdoca, { ...values, idx: uniqueId() }]);

    closeModals();
  };

  const doDeleteTransaction = () => {
    const { for_acdoca } = formAdjustmentAsset.getValues();

    formAdjustmentAsset.setValue('for_acdoca', for_acdoca.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<GLAccountFields>();
  const queryMasterAsset = useQueryMasterAsset({
    query: { req: getSearchValue('asset') },
  });
  const queryMasterAssetClass = useQueryMasterAssetClass({
    query: { req: getSearchValue('asset_class') },
  });
  const queryMasterGL = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('account_number'), company_code: formAdjustmentAsset.getValues('company_code') },
  });
  const queryMasterDebitCredit = useQueryMasterDebitCredit({
    query: { req: getSearchValue('debit_creditind') },
  });
  const queryMasterTax = useQueryMasterTax({
    query: { req: getSearchValue('tax_code') },
  });
  const queryMasterCostCenter = useQueryMasterCostCenterAsset({
    query: { req: getSearchValue('cost_center') },
  });

  const fields: IField<GLAccountFields>[] = [
    {
      id: 'account_number',
      type: 'dropdown',
      label: 'G/L Account',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: v.id, account_name: v.text })),
      onChange: ({ target }) => {
        form.setValue('account_name', target.selected?.account_name);
      },
    },
    {
      id: 'account_name',
      type: 'text',
      label: 'G/L Name',
      disabled: true,
    },
    {
      id: 'debit_creditind',
      type: 'dropdown',
      label: 'D/C',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDebitCredit.data?.map((v) => ({ id: v.id, value: `${v.desc}` })),
    },
    { id: '', type: '' },
    {
      id: 'amount_in_trans',
      type: 'currency',
      label: 'Ammount In Doc. Currency',
      placeholder: 'e.g. 100.000',
      validation: { required: '* required' },
      onChange: ({ target }) => {
        const rate = Number(formAdjustmentAsset.getValues('val_currency'));
        const localCurrency = Number(target.value) * rate;

        form.setValue('amount_in_balan', `${localCurrency}`);
        form.setValue('amount_in_co_ob', `${localCurrency}`);
        form.setValue('amount_in_compa', `${localCurrency}`);
        form.setValue('amount_in_globa', `${localCurrency}`);
      },
    },
    {
      id: 'amount_in_balan',
      type: 'currency',
      label: 'Ammount In Local Currency',
      placeholder: 'e.g. 100.000',
      validation: { required: '* required' },
      disabled: true,
    },
    {
      id: 'tax_code',
      type: 'dropdown',
      label: 'Tax',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterTax.data?.map((v) => ({ id: v.tax_code, value: `${v.tax_code} - ${v.description}` })),
    },
    {
      id: 'asset',
      type: 'dropdown',
      label: 'Asset Number',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAsset.data?.map((v) => ({ id: v.id, value: `${v.id}`, description: v.description })),
    },
    {
      id: 'asset_class',
      type: 'dropdown',
      label: 'Asset Class',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAssetClass.data?.map((v) => ({ id: v.id_ast_class, value: `${v.id_ast_class} - ${v.name_ast_class}` })),
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
      id: 'cost_center',
      type: 'dropdown',
      label: 'Cost Center',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.cost_center, value: `${v.cost_center}` })),
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
                onOk: form.handleSubmit(doSubmitTransaction),
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
            data={formAdjustmentAsset.getValues('for_acdoca') || []}
            pagination={pagination}
            rowSelection={rowSelection}
            scroll={{ x: 1800 }}
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
              useForm={form}
            />
          </Row>
        </ModalChildren>
      )}
    </>
  );
};
