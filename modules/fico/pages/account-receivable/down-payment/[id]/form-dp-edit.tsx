/* eslint-disable no-unused-vars */
import usePagination from '@lucasmogari/react-pagination';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useForm } from 'react-hook-form';
import {
  Button, Row, Spacer,
} from 'pink-lava-ui';
import React, { useEffect, useState } from 'react';
import { IForm, IModals } from 'interfaces/interfaces';
import { TableRowSelection } from 'antd/lib/table/interface';
import { FormBuilder, IField } from 'components/FormBuilder';
import DataTable from 'components/DataTable';
import { ModalChildren } from 'components/modals/ModalChildren';
import { uniqueId } from 'lodash';
import moment from 'moment';
import { EditDownPaymentFields } from './form-edit';

export type DPAccountFields = {
  line_item: string,
  amount_doc: number,
  amount_loc: number,
  tax_code: string,
  tax_amount: number,
  po_type: string,
  po_item: string,
  assign: string,
  text: string,
  payment_reference: string,
  payment_block: string,
  payment_method: string,
  profit_center: number,
  due_date: string,
  order: string,
  dp_detail_id: number,
};

export const FormDownPayment = (props: IForm<EditDownPaymentFields>) => {
  const { form: formDownPayment, type } = props;
  const form = useForm<DPAccountFields>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const TRANSACTION_TYPE = [
    { id: 'A01', name: 'A01' },
    { id: 'A02', name: 'A02' },
  ];

  const { getValues: getValuesDP, setValue: setValueGeneralJournal } = formDownPayment;

  const {
    handleSubmit,
    getValues,
    reset,
  } = form;

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount_doc',
      width: 100,
      fixed: 'none',
    },
    {
      title: 'Ammount In Local Currency',
      dataIndex: 'amount_loc',
      width: 250,
    },
    {
      title: 'Tax Code',
      dataIndex: 'tax_code',
      width: 100,
    },
    {
      title: 'Tax Ammount',
      dataIndex: 'tax_amount',
      width: 150,
    },
    {
      title: 'Purchase Order',
      dataIndex: 'po_type',
      width: 150,
    },
    {
      title: 'Purchase Order Item',
      dataIndex: 'po_item',
      width: 200,
    },
    {
      title: 'Assigment',
      dataIndex: 'assign',
      width: 150,
    },
    {
      title: 'Text',
      dataIndex: 'text',
      width: 150,
    },
    {
      title: 'Payment Reference',
      dataIndex: 'payment_reference',
      width: 200,
    },
    {
      title: 'Payment Block',
      dataIndex: 'payment_block',
      width: 150,
    },
    {
      title: 'Payment Methode',
      dataIndex: 'payment_method',
      width: 200,
    },
    {
      title: 'Profit Center',
      dataIndex: 'profit_center',
      width: 150,
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      width: 150,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      width: 150,
    },
  ];

  const closeModals = () => setModals({});

  const preparePayload = (newItems) => {
    setValueGeneralJournal('amount_doc', newItems.map((item) => item.amount_doc ?? null));
    setValueGeneralJournal('amount_loc', newItems.map((item) => item.amount_loc ?? null));
    setValueGeneralJournal('tax_code', newItems.map((item) => item.tax_code ?? null));
    setValueGeneralJournal('tax_amount', newItems.map((item) => item.tax_amount ?? null));
    setValueGeneralJournal('po_type', newItems.map((item) => item.po_type ?? null));
    setValueGeneralJournal('po_item', newItems.map((item) => item.po_item ?? null));
    setValueGeneralJournal('assign', newItems.map((item) => item.assign ?? null));
    setValueGeneralJournal('text', newItems.map((item) => item.text ?? null));
    setValueGeneralJournal('payment_reference', newItems.map((item) => item.payment_reference ?? null));
    setValueGeneralJournal('payment_block', newItems.map((item) => item.payment_block ?? null));
    setValueGeneralJournal('payment_method', newItems.map((item) => item.payment_method ?? null));
    setValueGeneralJournal('profit_center', newItems.map((item) => item.profit_center ?? null));
    setValueGeneralJournal('due_date', newItems.map((item) => item.due_date ?? null));
    setValueGeneralJournal('order', newItems.map((item) => item.order ?? null));
  };

  const doSubmitTransaction = () => {
    const values = getValues();
    const { items = [] } = getValuesDP();

    const newItems = [...items, {
      ...values,
      due_date: moment(items[0]?.due_date).format('YYYY-MM-DD'),
      line_item: uniqueId(),
    }];

    setValueGeneralJournal('items', newItems);
    preparePayload(newItems);

    closeModals();
  };

  const doDeleteTransaction = () => {
    const { items } = getValuesDP();

    const newItems = items.filter((v) => !selectedRowKeys.includes(v.dp_detail_id || ''));
    setValueGeneralJournal('items', newItems);
    preparePayload(newItems);
    setSelectedRowKeys([]);
  };

  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  const getSearchValue = (field: keyof DPAccountFields) => {
    if (searchDropdown.field !== field) return null;
    return searchDropdown.search;
  };

  // const queryMasterGL = useQueryMasterGeneralLedger({
  //   query: { search: getSearchValue('account_number'), company_code: formGeneralJournal.getValues('company_id') },
  // });
  // const queryMasterPPN = useQueryMasterPPN({
  //   query: { search: getSearchValue('tax') },
  // });
  // const queryMasterCostCenter = useQueryMasterCostCenter({
  //   query: { search: getSearchValue('cost_center'), company_code: formGeneralJournal.getValues('company_id') },
  // });
  // const queryMasterProfitCenter = useQueryMasterProfitCenter({
  //   query: { search: getSearchValue('profit_center'), company_code: formGeneralJournal.getValues('company_id') },
  // });

  const fields: IField<DPAccountFields>[] = [
    {
      id: 'amount_doc',
      type: 'currency',
      label: 'Amount In Doc. Currency',
      placeholder: 'e.g 500.000',
      validation: { required: '* required' },
    },
    {
      id: 'amount_loc',
      type: 'currency',
      label: 'Ammount In Local Currency',
      placeholder: 'e.g 123456',
      validation: { required: '* required' },
    },
    {
      id: 'tax_code',
      type: 'dropdown',
      label: 'Tax Code',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: TRANSACTION_TYPE.map((v) => ({ id: v.id, value: v.name })),
    },
    {
      id: 'tax_amount',
      type: 'currency',
      label: 'Tax Ammount',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'po_type',
      type: 'text',
      label: 'Purchase Order',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'po_item',
      type: 'text',
      label: 'Purchase Order Item',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'assign',
      type: 'text',
      label: 'Assigment',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'text',
      type: 'text',
      label: 'Text',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'payment_reference',
      type: 'text',
      label: 'Payment Reference',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'payment_block',
      type: 'text',
      label: 'Payment Block',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'payment_method',
      type: 'text',
      label: 'Payment Methode',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'profit_center',
      type: 'text',
      label: 'Profit Center',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
    {
      id: 'due_date',
      type: 'datepicker',
      label: 'Due Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'order',
      type: 'text',
      label: 'Order',
      placeholder: 'e.g Reason',
      validation: { required: '* required' },
    },
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
      <Row width="100%">
        <div style={{ width: '100%' }}>
          <DataTable
            rowKey="dp_detail_id"
            columns={columns}
            data={getValuesDP('items') || []}
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
