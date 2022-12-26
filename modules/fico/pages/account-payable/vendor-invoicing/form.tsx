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
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { useQueryMasterDebitCredit } from 'hooks/master-data/useMasterDebitCredit';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import { currencyFormater } from 'lib/currencyFormatter';
import { useQueryMasterPPH } from 'hooks/master-data/useMasterPPH';
import moment from 'moment';

export type ExpenseEntryFields = {
  idx: string;
  company_code: string,
  fiscal_year: string,
  document_number: string,
  line_item: number,
  gl_fiscal_year: number,
  transaction_typ: string,
  bus_transac_typ: string,
  ref_procedure: string,
  ref_org_unit: string,
  reference: string,
  balance_transac: string,
  transaction_cur: string,
  company_code_cu: string,
  co_object_curre: string,
  account_number: string,
  account_description: string,
  cost_center: string,
  profit_center: string,
  controll_area: string,
  amount_in_balan: string,
  amount_in_trans: string,
  amount_in_compa: string,
  amount_in_globa: string,
  debit_creditind: string,
  posting_period: number,
  period_year: string,
  posting_date: string,
  document_date: string,
  document_type: string,
  assignment: string,
  transaction: string,
  user_name: string,
  gl_account_type: string,
  chart_of_accoun: string,
  text: string,
  vendor: string,
  debit_type: boolean,
  type: string
}

export type VendorInvoicingFields = {
  id : number,
  doc_number : string,
  doc_type : string,
  company_code : string,
  company_code_cu : string,
  vdr_id : string,
  vdr_name : string,
  ivc_date : string,
  ivc_num : string,
  ivc_value : string,
  ivc_cur : string,
  tax_ivc_num : string,
  tax_ivc_date : string,
  ppn_code : string,
  ppn_desc : string,
  ppn_cond_amon : string,
  ppn_total : number,
  pph_code : string,
  pph_percentage : string,
  pph_wtax : string,
  pph_desc : string,
  pph_total : number,
  balance : number,
  status : number,
  fiscal_year : string,
  for_acdoca: ExpenseEntryFields[]
}

export const getPayload = (data: VendorInvoicingFields) => ({
  ...data,
  id: data.id || 0,
  doc_number: `${data.doc_number || 5100000000}`,
  doc_type: 'RE',
  company_code_cu: 'IDR',
  ivc_cur: 'IDR',
  ivc_value: `${data.ivc_value}`,
  ivc_date: moment(data.ivc_date).format('YYYY-MM-DD'),
  tax_ivc_date: moment(data.tax_ivc_date).format('YYYY-MM-DD'),
  pph_total: `${data.pph_total}`,
  ppn_total: `${data.ppn_total}`,
  fiscal_year: moment(data.ivc_date).format('YYYY'),
  balance: `${data.balance || 0}`,
  for_acdoca: data.for_acdoca.map((v) => ({
    ...v,
    document_number: data.doc_number,
    document_type: 'RE',
    posting_date: moment(data.ivc_date).format('YYYY-MM-DD'),
    period_year: moment(data.ivc_date).format('MMYYYY'),
    posting_period: Number(moment(data.ivc_date).format('MM')),
    ref_org_unit: `${data.company_code}${moment(data.ivc_date).format('YYYY')}`,
    ref_procedure: 'RMRP',
    reference: data.ivc_num,
    transaction_cur: 'IDR',
    transaction_typ: 'RMRP',
    balance_transac: 'IDR',
    bus_transac_typ: 'RMRP',
    // chart_of_accoun: 'PP00', // makesure
    // controll_area: 'PP00', // makesure
    co_object_curre: 'IDR',
    company_code: data.company_code,
    company_code_cu: 'IDR',
    vendor: data.vdr_id,
    type: 'vdrivc-journal',
  })),
});

export const FormVendorInvoicing = (props: IForm<VendorInvoicingFields>) => {
  const { form } = props;

  useEffect(() => {
    form.setValue('company_code', 'PP01');
  }, []);

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<VendorInvoicingFields>();
  const queryMasterVendor = useQueryMasterVendor({
    query: { search: getSearchValue('vdr_id'), company_code: getSearchValue('company_code') },
  });
  const queryMasterPPN = useQueryMasterPPN({
    query: { search: getSearchValue('ppn_code') },
  });
  const queryMasterPPH = useQueryMasterPPH({
    query: { req: getSearchValue('pph_code') },
  });

  const fields: IField<VendorInvoicingFields>[] = [
    {
      id: 'doc_number',
      type: 'text',
      label: 'Doc. Number',
      placeholder: '',
      disabled: true,
    },
    {
      id: 'vdr_id',
      type: 'dropdown',
      label: 'Vendor',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterVendor.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      validation: { required: '* required' },
    },
    {
      id: 'ivc_num',
      type: 'text',
      label: 'Invoice Number',
      placeholder: 'e.g 123456789',
      validation: { required: '* required' },
    },
    {
      id: 'ivc_date',
      type: 'datepicker',
      label: 'Invoice Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'ivc_value',
      type: 'currency',
      label: 'Invoice Value',
      placeholder: 'e.g 10.000.000',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'tax_ivc_num',
      type: 'text',
      label: 'Tax Invoice Number',
      placeholder: 'e.g 1234567890',
      validation: { required: '* required' },
    },
    {
      id: 'tax_ivc_date',
      type: 'datepicker',
      label: 'Tax Invoice Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'ppn_code',
      type: 'dropdown',
      label: 'PPN',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPPN.data?.map((v) => ({ id: v.id, value: v.text, ...v })),
      validation: { required: '* required' },
      onChange: ({ target }) => {
        const { condition_amoun } = target.selected;
        form.setValue('ppn_cond_amon', condition_amoun);
      },
    },
    {
      id: 'ppn_total',
      type: 'currency',
      label: 'PPN Amount',
      validation: { required: '* required' },
      disabled: true,
    },
    {
      id: 'pph_code',
      type: 'dropdown',
      label: 'PPH',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPPH.data?.map((v) => ({ id: v.wtax_code, value: `${v.wtax_code} - ${v.name}`, ...v })),
      validation: { required: '* required' },
      onChange: ({ target }) => {
        const { percentage_subj, wtax_rate } = target.selected;

        form.setValue('pph_percentage', percentage_subj);
        form.setValue('pph_wtax', wtax_rate);
      },
    },
    {
      id: 'pph_total',
      type: 'currency',
      label: 'PPH Amount',
      validation: { required: '* required' },
      disabled: true,
    },
    { id: '', type: '' },
    {
      id: 'balance',
      type: 'currency',
      label: 'Balance',
      disabled: true,
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
          <Accordion.Header variant="blue">Expense Entry</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormExpenseEntry form={form} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

/* A function that is used to create a Form Orders. */
const FormExpenseEntry = (props: IForm<VendorInvoicingFields>) => {
  const { form: formVendorInvoicing } = props;
  const form = useForm<ExpenseEntryFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    preparePayload(formVendorInvoicing.getValues('for_acdoca'));
  }, [
    formVendorInvoicing.getValues('for_acdoca'),
    formVendorInvoicing.getValues('ppn_code'),
    formVendorInvoicing.getValues('pph_code'),
    formVendorInvoicing.getValues('ivc_value'),
  ]);

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'G/L Account', dataIndex: 'account_number' },
    { title: 'G/L Description', dataIndex: 'account_description' },
    { title: 'D/C', dataIndex: 'debit_creditind', render: (value) => (value === 'S' ? 'Debit' : 'Credit') },
    { title: 'Amount', dataIndex: 'amount_in_balan', render: (value) => currencyFormater(value) },
    { title: 'Assignment', dataIndex: 'assignment' },
    { title: 'Cost Center', dataIndex: 'cost_center' },
    { title: 'Profit Center', dataIndex: 'profit_center' },
  ];

  const preparePayload = (newItems: ExpenseEntryFields[]) => {
    if (!newItems) return;

    const totalDetail = newItems.reduce((accumulator, item) => {
      if (item.debit_creditind === 'S') return accumulator + Number(item.amount_in_balan);
      return accumulator - Math.abs(Number(item.amount_in_balan));
    }, 0);

    const ppnPercentage = Number(formVendorInvoicing.getValues('ppn_cond_amon')) / 1000;
    const ppnTotal = (totalDetail * ppnPercentage) || 0;
    formVendorInvoicing.setValue('ppn_total', Number(ppnTotal.toFixed(2)));

    const pphPercentage = Number(formVendorInvoicing.getValues('pph_percentage')) / 100;
    const pphWtax = Number(formVendorInvoicing.getValues('pph_wtax')) / 100;
    const pphTotal = (totalDetail * pphPercentage * pphWtax) || 0;
    formVendorInvoicing.setValue('pph_total', Number(pphTotal.toFixed(2)));

    const ivcAmount = Number(formVendorInvoicing.getValues('ivc_value'));
    const balance = (ivcAmount - (totalDetail + ppnTotal - pphTotal)) || 0;
    formVendorInvoicing.setValue('balance', Number(balance.toFixed(2)));
  };

  const closeModals = () => setModals({});
  const doSubmit = () => {
    const values = form.getValues();
    const { for_acdoca = [] } = formVendorInvoicing.getValues();

    const newItems = [...for_acdoca, { ...values, idx: _.uniqueId() }];
    formVendorInvoicing.setValue('for_acdoca', newItems);

    closeModals();
  };

  const doDelete = () => {
    const { for_acdoca } = formVendorInvoicing.getValues();

    const newItems = for_acdoca.filter((v) => !selectedRowKeys.includes(v.idx || ''));
    formVendorInvoicing.setValue('for_acdoca', newItems);

    setSelectedRowKeys([]);
  };

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<ExpenseEntryFields>();
  const queryMasterGL = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('account_number'), company_code: formVendorInvoicing.getValues('company_code') },
  });
  const queryMasterDebitCredit = useQueryMasterDebitCredit({
    query: { req: getSearchValue('debit_type') },
  });
  const queryCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('cost_center'), company_code: formVendorInvoicing.getValues('company_code') },
  });
  const queryProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('profit_center'), company_code: formVendorInvoicing.getValues('company_code') },
  });

  const fields: IField<ExpenseEntryFields>[] = [
    {
      id: 'account_number',
      type: 'dropdown',
      label: 'G/L Account',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}`, account_description: v.text })),
      onChange: ({ target }) => {
        const { account_description } = target.selected;
        form.setValue('account_description', account_description);
      },
    },
    { id: '', type: '' },
    {
      id: 'debit_creditind',
      type: 'dropdown',
      label: 'D/C',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDebitCredit.data?.map((v) => ({ id: v.id, value: `${v.desc}` })),
    },
    {
      id: 'amount_in_balan',
      type: 'currency',
      label: 'Amount',
      placeholder: 'e.g. 10.000.000',
      validation: { required: '* required' },
      onChange: ({ target }) => {
        form.setValue('amount_in_compa', target.value);
        form.setValue('amount_in_globa', target.value);
        form.setValue('amount_in_trans', target.value);
      },
    },
    // {
    //   id: 'tax',
    //   type: 'number',
    //   label: 'Tax (%)',
    //   placeholder: 'e.g. 100',
    //   validation: { required: '* required' },
    // },
    {
      id: 'assignment',
      type: 'text',
      label: 'Assignment',
      placeholder: 'e.g. Assignment',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    // {
    //   id: 'value_date',
    //   type: 'datepicker',
    //   label: 'Value Date',
    //   placeholder: 'DD/MM/YYYY',
    //   validation: { required: '* required' },
    // },
    {
      id: 'cost_center',
      type: 'dropdown',
      label: 'Cost Center',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'profit_center',
      type: 'dropdown',
      label: 'Profit Center',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryProfitCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
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
            data={formVendorInvoicing.getValues('for_acdoca') || []}
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
