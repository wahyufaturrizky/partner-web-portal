import usePagination from '@lucasmogari/react-pagination';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useForm } from 'react-hook-form';
import {
  Row, Spacer,
} from 'pink-lava-ui';
import React, { useEffect, useState } from 'react';
import { IForm, IModals } from 'interfaces/interfaces';
import { TableRowSelection } from 'antd/lib/table/interface';
import { currencyFormater } from 'lib/currencyFormatter';
import { capitalize, uniqueId } from 'lodash';
import { FormBuilder, IField } from 'components/FormBuilder';
import { useQueryMasterGeneralLedger } from 'hooks/master-data/useMasterGeneralLedger';
import { DS_DEBIT_CREDIT } from 'constants/datasources';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import DataTable from 'components/DataTable';
import { ModalChildren } from 'components/modals/ModalChildren';
import { useQueryMasterPPN } from 'hooks/master-data/useMasterPPN';
import { Button } from 'components/Button';
import { GeneralJournalFields } from './form';

export type GLAccountFields = {
  line_item: string,
  dc: string,
  debit_type: boolean,
  account_number: string,
  account_name: string,
  ammount: number,
  cost_center: string,
  profit_center: string,
  local_currency: number,
  tax: string,
  assignment: string,
  text: string,
  orders: string,
  state: string,
  type: string,
};

export const FormGLAccount = (props: IForm<GeneralJournalFields>) => {
  const { form: formGeneralJournal, type } = props;
  const form = useForm<GLAccountFields>();

  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    // Default Value
    if (type === 'create') {
      formGeneralJournal.setValue('company_code', 'PP01');
    }
  }, []);

  useEffect(() => {
    preparePayload(formGeneralJournal.getValues('items'));
  }, [formGeneralJournal.getValues('items'), formGeneralJournal.getValues('rate')]);

  const { getValues: getValuesGeneralJournal, setValue: setValueGeneralJournal } = formGeneralJournal;
  const {
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = form;

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'G/L Account', dataIndex: 'account_number' },
    { title: 'G/L Name', dataIndex: 'account_name' },
    { title: 'D/C', dataIndex: 'dc', render: (value) => capitalize(value) },
    { title: 'Amount In Doc. Currency', dataIndex: 'ammount', render: (value) => currencyFormater(value) },
    { title: 'Ammount In Local Currency', dataIndex: 'local_currency', render: (value) => currencyFormater(value) },
    { title: 'Tax Code', dataIndex: 'tax' },
    { title: 'Assignment', dataIndex: 'assignment' },
    { title: 'Text', dataIndex: 'text' },
    { title: 'Cost Center', dataIndex: 'cost_center' },
    { title: 'Profit Center', dataIndex: 'profit_center' },
    { title: 'Order', dataIndex: 'orders' },
  ];

  const closeModals = () => setModals({});

  const preparePayload = (newItems) => {
    if (!newItems) return;

    setValueGeneralJournal('gl_accounts', newItems.map((item) => item.account_number ?? null));
    setValueGeneralJournal('posting_keys', newItems.map((item) => item.account_number ?? null));
    setValueGeneralJournal('dc', newItems.map((item) => item.dc ?? null));
    setValueGeneralJournal('assignments', newItems.map((item) => item.assignment ?? null));
    setValueGeneralJournal('texts', newItems.map((item) => item.text ?? null));
    setValueGeneralJournal('tax_codes', newItems.map((item) => item.tax ?? null));
    setValueGeneralJournal('amounts', newItems.map((item) => item.ammount ?? null));
    setValueGeneralJournal('cost_centers', newItems.map((item) => item.cost_center ?? null));
    setValueGeneralJournal('profit_centers', newItems.map((item) => item.profit_center ?? null));
    setValueGeneralJournal('order_list', newItems.map((item) => item.orders ?? null));
    setValueGeneralJournal('local_currencies', newItems.map((item) => item.local_currency ?? null));

    const balance = newItems.reduce((accumulator, item) => {
      if (item.dc === 'debit') return accumulator + item.ammount;
      return accumulator - Math.abs(item.ammount);
    }, 0);
    setValueGeneralJournal('balance', balance);
  };

  const doSubmitTransaction = () => {
    const values = getValues();
    const { items = [] } = getValuesGeneralJournal();

    const newItems = [...items, { ...values, line_item: uniqueId() }];
    setValueGeneralJournal('items', newItems);
    preparePayload(newItems);

    closeModals();
  };

  const doDeleteTransaction = () => {
    const { items } = getValuesGeneralJournal();

    const newItems = items?.filter((v) => !selectedRowKeys.includes(v.line_item || ''));
    setValueGeneralJournal('items', newItems);
    preparePayload(newItems);

    setSelectedRowKeys([]);
  };

  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  const getSearchValue = (field: keyof GLAccountFields) => {
    if (searchDropdown.field !== field) return null;
    return searchDropdown.search;
  };

  const companyCode = 'PP01'; // hardcode
  // const companyCode = formGeneralJournal.getValues('company_code');
  const queryMasterGL = useQueryMasterGeneralLedger({
    query: { search: getSearchValue('account_number'), company_code: companyCode },
  });
  const queryMasterPPN = useQueryMasterPPN({
    query: { search: getSearchValue('tax') },
  });
  const queryMasterCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('cost_center'), company_code: companyCode },
  });
  const queryMasterProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('profit_center'), company_code: companyCode },
  });

  const fields: IField<GLAccountFields>[] = [
    {
      id: 'account_number',
      type: 'dropdown',
      label: 'G/L Account',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterGL.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}`, label: v.text })),
      onChange: ({ target }) => {
        setValue('account_name', target.label);
      },
    },
    // { id: '', type: '' },
    // {
    //   id: 'account_name',
    //   type: 'text',
    //   label: 'G/L Name',
    //   disabled: true,
    // },
    {
      id: 'dc',
      type: 'dropdown',
      label: 'D/C',
      placeholder: 'Select',
      datasources: DS_DEBIT_CREDIT.map((v) => ({ id: v.id, value: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'ammount',
      type: 'currency',
      label: 'Amount In Doc. Currency',
      placeholder: 'e.g 500.000',
      validation: { required: '* required' },
      onChange: ({ target }) => {
        const { value } = target;
        const rate = formGeneralJournal.getValues('rate');
        const companyCurreny = formGeneralJournal.getValues('company_currency');
        const selectedCurrency = formGeneralJournal.getValues('currency');

        if (companyCurreny !== selectedCurrency) form.setValue('local_currency', value * rate);
        else form.setValue('local_currency', value);
      },
    },
    {
      id: 'local_currency',
      type: 'currency',
      label: 'Amount In Local Currency',
      placeholder: 'e.g 500.000',
      // validation: { required: '* required' },
      disabled: true,
    },
    {
      id: 'tax',
      type: 'dropdown',
      label: 'Tax Code',
      placeholder: 'Select',
      // validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPPN.data?.map((v) => ({ id: v.id, value: v.text })),
    },
    {
      id: 'assignment',
      type: 'text',
      label: 'Assignment',
      placeholder: 'e.g Assignment',
      // validation: { required: '* required' },
    },
    {
      id: 'text',
      type: 'text',
      label: 'Text Item',
      placeholder: 'e.g Text Item',
      // validation: { required: '* required' },
    },
    // { id: '', type: '' },
    {
      id: 'cost_center',
      type: 'dropdown',
      label: 'Cost Center',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'profit_center',
      type: 'dropdown',
      label: 'Profit Center',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterProfitCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'orders',
      type: 'text',
      label: 'Order',
      placeholder: 'e.g Order',
    },
    { id: '', type: '' },
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
        <div className="md:w-full">
          <DataTable
            rowKey="line_item"
            columns={columns}
            data={formGeneralJournal.getValues('items') || []}
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
