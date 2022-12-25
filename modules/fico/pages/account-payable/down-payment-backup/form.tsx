/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Row, Spacer, Accordion } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import DataTable from 'components/DataTable';
import usePagination from '@lucasmogari/react-pagination';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalChildren } from 'components/modals/ModalChildren';
import { IForm, IModals } from 'interfaces/interfaces';
import _ from 'lodash';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { Button } from 'components/Button';
import { useQueryMasterVendor } from 'hooks/master-data/useMasterVendor';
import { useQueryMasterPPN } from 'hooks/master-data/useMasterPPN';

export type ListPOFields = {
  idx: string;
  item: string,
  material: string,
  description: string,
  net_price: number,
  down_payment: number,
  payment_remaining: number,
}

export type DownPaymentFields = {
  company_code: string,
  document_number: number,
  vendor: string,
  invoice_date: string,
  invoice_number: string,
  amount: number,
  tax_invoice_number: string,
  tax_invoice_date: string,
  ppn: string,
  ppn_amount: number,
  status: boolean,
  list_po: ListPOFields[]
}

export const getPayload = (data: DownPaymentFields) => ({
  ...data,
  document_number: `${data.document_number || 1900000005}`,
  list_po: JSON.stringify(data.list_po),
});

export const FormDownPayment = (props: IForm<DownPaymentFields>) => {
  const { form } = props;

  useEffect(() => {
    form.setValue('company_code', 'PP01');
  }, []);

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<DownPaymentFields>();
  const queryMasterVendor = useQueryMasterVendor({
    query: { search: getSearchValue('vendor'), company_code: getSearchValue('company_code') },
  });
  const queryMasterPPN = useQueryMasterPPN({
    query: { search: getSearchValue('ppn') },
  });

  const fields: IField<DownPaymentFields>[] = [
    {
      id: 'document_number',
      type: 'text',
      label: 'Doc. Number',
      placeholder: '',
      disabled: true,
    },
    {
      id: 'vendor',
      type: 'dropdown',
      label: 'Vendor',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterVendor.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'invoice_number',
      type: 'number',
      label: 'Invoice Number',
      placeholder: 'e.g 123456789',
      validation: { required: '* required' },
    },
    {
      id: 'invoice_date',
      type: 'datepicker',
      label: 'Invoice Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'amount',
      type: 'currency',
      label: 'Invoice Value',
      placeholder: 'e.g 10.000.000',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'tax_invoice_number',
      type: 'number',
      label: 'Tax Invoice Nymber',
      placeholder: 'e.g 1234567890',
      validation: { required: '* required' },
    },
    {
      id: 'tax_invoice_date',
      type: 'datepicker',
      label: 'Tax Invoice Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'ppn',
      type: 'dropdown',
      label: 'PPN',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPPN.data?.map((v) => ({ id: v.id, value: v.text })),
      validation: { required: '* required' },
    },
    {
      id: 'ppn_amount',
      type: 'currency',
      label: 'PPN Amount',
      placeholder: 'e.g 10.000.000',
      validation: { required: '* required' },
    },
  ];

  return (
    <div className="w-full">
      <Card padding="20px">
        <Row width="100%">
          <FormBuilder
            fields={fields}
            column={2}
            useForm={form}
          />
        </Row>
      </Card>
      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">List PO</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormListPO form={form} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

/* A function that is used to create a Form Orders. */
const FormListPO = (props: IForm<DownPaymentFields>) => {
  const { form: formVendorInvoicing } = props;
  const form = useForm<ListPOFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'Item', dataIndex: 'item' },
    { title: 'Material', dataIndex: 'material' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Net Price', dataIndex: 'net_price' },
    { title: 'Down Payment', dataIndex: 'down_payment' },
    { title: 'Payment Remaining', dataIndex: 'payment_remaining' },
  ];

  const closeModals = () => setModals({});
  const doSubmit = () => {
    const values = form.getValues();
    const { list_po = [] } = formVendorInvoicing.getValues();

    formVendorInvoicing.setValue('list_po', [...list_po, { ...values, idx: _.uniqueId() }]);

    closeModals();
  };

  const doDelete = () => {
    const { list_po } = formVendorInvoicing.getValues();

    formVendorInvoicing.setValue('list_po', list_po.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const fields: IField<ListPOFields>[] = [
    {
      id: 'item',
      type: 'number',
      label: 'Item',
      validation: { required: '* required' },
    },
    {
      id: 'material',
      type: 'text',
      label: 'Material',
      validation: { required: '* required' },
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'net_price',
      type: 'currency',
      label: 'Net Price',
      placeholder: 'e.g. 10.000.000',
      validation: { required: '* required' },
    },
    {
      id: 'down_payment',
      type: 'currency',
      label: 'Down Payment',
      placeholder: 'e.g. 10.000.000',
      validation: { required: '* required' },
      onChange: (e) => {
        const netPrice = form.getValues('net_price') || 0;
        const downPayment = e.target.value || 0;
        const paymentRemaining = netPrice - downPayment;

        form.setValue('payment_remaining', paymentRemaining);
      },
    },
    {
      id: 'payment_remaining',
      type: 'currency',
      label: 'Payment Remaining',
      placeholder: 'e.g. 10.000.000',
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
        <div className="w-[400%] md:w-full">
          <DataTable
            rowKey="idx"
            columns={columns}
            data={formVendorInvoicing.getValues('list_po') || []}
            pagination={pagination}
            rowSelection={rowSelection}
            // scroll={{ x: 1500 }}
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
