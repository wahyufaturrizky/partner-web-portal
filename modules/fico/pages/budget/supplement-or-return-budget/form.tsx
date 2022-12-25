/* eslint-disable react/no-unused-prop-types */
import {
  Row, Spacer,
} from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import DataTable from 'components/DataTable';
import usePagination from '@lucasmogari/react-pagination';
import { currencyFormater } from 'lib/currencyFormatter';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { ModalChildren } from 'components/modals/ModalChildren';
import { IModals } from 'interfaces/interfaces';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useBudget } from 'hooks/budget/useBudget';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterControllArea } from 'hooks/master-data/useMasterControllArea';
import { useQueryMasterOrderType } from 'hooks/master-data/useMasterOrderType';
import { DS_TRANSACTION_TYPE } from 'constants/datasources';
import { Button } from 'components/Button';

export type OrdersFields = {
  ID?: number,
  ammount: number,
  currency?: string,
  year: number,
}

export type SupplementOrReturnBudgetFields = {
  company_code: string,
  controll_area?: string,
  order_type?: string,
  order_number: string,
  description: string,
  object_class: string,
  profit_center: string,
  responsible_cc: string,
  requester_cc: string,
  plant: string,
  order_status: string,
  order_category: string,
  overhead_key: string,
  interest_profil: string,
  applicant: string,
  telephone: string,
  person_responsib: string,
  estimated_cost: number,
  mobile_phone: string,
  app_date: string,
  department: string,
  work_start: string,
  work_end: string,
  processing_grp: string,
  asset_class: string,
  capital_date: string,
  ammount: number,
  currency: string,
  year: string,
  ID: number,
  budget_id?: number,
  value_order_id: number,
  state: string,
  type: string,
  items: OrdersFields[]
}

export type FormSupplementOrReturnBudgetProps = {
  form: UseFormReturn<SupplementOrReturnBudgetFields>;
  type?: 'create' | 'update';
}

export const getPayload = (data: SupplementOrReturnBudgetFields) => ({
  budget_id: Number(data.budget_id),
  amounts: data?.items?.map((d) => Number(d.ammount)),
  years: data?.items?.map((d) => d.year),
  state: data.state,
  type: 'supplement',
});

export const FormSupplementOrReturnBudget = (props: FormSupplementOrReturnBudgetProps) => {
  // eslint-disable-next-line no-unused-vars
  const { form, type = 'create' } = props;
  const { getValues, setValue, reset } = form;

  const serviceBudget = useBudget();
  const getBudgetCompany = serviceBudget.getBudgetCompany({
    query: {
      company_code: getValues('company_code'),
      controll_area: getValues('controll_area'),
      order_type: getValues('order_type'),
    },
  });

  // eslint-disable-next-line no-unused-vars
  const resetDSBudget = () => {
    reset({
      budget_id: undefined,
      description: undefined,
      ammount: undefined,
    });
  };

  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });
  const getSearchValue = (field: keyof SupplementOrReturnBudgetFields) => {
    if (searchDropdown.field !== field) return null;
    return searchDropdown.search;
  };

  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterControllArea = useQueryMasterControllArea({
    query: { search: getSearchValue('controll_area'), company_code: form.getValues('company_code') },
  });
  const queryMasterOrderType = useQueryMasterOrderType({
    query: { search: getSearchValue('order_type') },
  });

  // const isFormUpdate = type === 'update';
  const fields: IField<SupplementOrReturnBudgetFields>[] = [
    {
      id: 'company_code',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      onChange: () => {
        form.reset({
          ...form.getValues(),
          controll_area: undefined,
          order_type: undefined,
          budget_id: undefined,
        });
      },
      // disabled: isFormUpdate,
    },
    {
      id: 'controll_area',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Controlling Area',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterControllArea.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      onChange: () => {
        form.reset({
          ...form.getValues(),
          order_type: undefined,
          budget_id: undefined,
        });
      },
      // disabled: isFormUpdate,
    },
    {
      id: 'order_type',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Type',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterOrderType.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      onChange: () => {
        form.reset({
          ...form.getValues(),
          budget_id: undefined,
        });
      },
      // disabled: isFormUpdate,
    },
    {
      id: 'type',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Transaction Type',
      placeholder: 'Select',
      datasources: DS_TRANSACTION_TYPE.map((v) => ({ id: v.id, value: v.name })),
    },
    {
      id: 'budget_id',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Number',
      placeholder: 'Select',
      isLoading: getBudgetCompany.isLoading,
      // disabled: isFormUpdate,
      datasources: getBudgetCompany.data?.data?.map((v) => ({ id: v.ID, value: v.order_number })),
      onChange: (e) => {
        const detail = getBudgetCompany.data?.data?.find((v) => v.ID === e.target.value);
        setValue('description', detail.description);
        setValue('currency', currencyFormater(detail.currency));
        setValue('ammount', detail.ammount);
      },
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
    {
      id: 'currency',
      type: 'text',
      label: 'Currency',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
    {
      id: 'ammount',
      type: 'currency',
      label: 'Amount',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
  ];

  return (
    <Card padding="20px">
      <Row width="100%">
        <FormBuilder
          fields={fields}
          column={2}
          useForm={form}
        />
      </Row>
      <Divider dashed />
      <FormTransaction form={form} />
    </Card>
  );
};

/* A function that is used to create a Form Orders. */
const FormTransaction = (props: FormSupplementOrReturnBudgetProps) => {
  const { form } = props;
  const formTransaction = useForm<OrdersFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { getValues, setValue } = form;
  const {
    handleSubmit: handleSubmitTransaction,
    reset: resetTransaction,
  } = formTransaction;

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'Year', dataIndex: 'year' },
    { title: 'Amount', dataIndex: 'ammount', render: (_, row) => currencyFormater(row.ammount) },
  ];

  const closeModals = () => setModals({});
  const doSubmitTransaction = (data) => {
    const { year, ammount } = data;
    const { items = [] } = getValues();

    const insertTransaction = [...items, { year, ammount }];
    setValue('items', insertTransaction);

    closeModals();
  };

  const doDeleteTransaction = () => {
    const { items } = getValues();

    setValue('items', items.filter((v) => !selectedRowKeys.includes(v.year || '')));
    setSelectedRowKeys([]);
  };

  const fieldsTransaction: IField<OrdersFields>[] = [
    {
      id: 'year',
      validation: { required: '* required' },
      type: 'yearpicker',
      label: 'Year',
      placeholder: 'YYYY',
    },
    {
      id: 'ammount',
      validation: { required: '* required' },
      type: 'currency',
      label: 'Amount',
      placeholder: 'e.g 10.000.000',
    },
  ];

  return (
    <>
      <Row width="100%" gap="4px">
        <Button
          size="big"
          variant="primary"
          onClick={() => {
            resetTransaction({ year: undefined, ammount: undefined });
            setModals({ ...modals, transaction: { open: true, title: 'Add Transaction', onOk: handleSubmitTransaction(doSubmitTransaction) } });
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
            rowKey="year"
            columns={columns}
            data={getValues('items') || []}
            pagination={pagination}
            rowSelection={rowSelection}
          />
        </div>
      </Row>
      {modals?.transaction && (
        <ModalChildren
          title={modals.transaction.title}
          visible={modals.transaction.open}
          onCancel={() => closeModals()}
          onOk={() => modals.transaction?.onOk?.()}
          textBtnOk="Save"
        >
          <FormBuilder
            fields={fieldsTransaction}
            column={1}
            useForm={formTransaction}
          />
        </ModalChildren>
      )}
    </>
  );
};
