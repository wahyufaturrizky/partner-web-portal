import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Row } from 'pink-lava-ui';
import { useBudget } from 'hooks/budget/useBudget';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterControllArea } from 'hooks/master-data/useMasterControllArea';
import { useQueryMasterOrderType } from 'hooks/master-data/useMasterOrderType';
import { errorMaxValue, errorMinValue } from 'constants/errorMsg';

export type TransferBudgetFields = {
  ID: number,
  budget_from_id?: number,
  budget_to_id?: number,
  company_code: string,
  controll_area?: string,
  order_type: string,
  order_number_from: string,
  order_number_to: string,
  description_from?: string,
  description_to?: string,
  available_ammount?: number,
  currency?: string,
  amount: number,
  year: string,
  state: string,
}

type FormTransferBudgetProps = {
  form: UseFormReturn<TransferBudgetFields>;
}

export const getPayload = (data: TransferBudgetFields) => ({
  budget_from_id: data.budget_from_id,
  budget_to_id: data.budget_to_id,
  amount: Number(data.amount),
  year: data.year,
  state: data.state,
});

export const FormTransferBudget = (props: FormTransferBudgetProps) => {
  const { form } = props;
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
  const resetBudgetFromTo = () => {
    reset({
      ...form.getValues(),
      budget_from_id: undefined,
      budget_to_id: undefined,
      description_from: undefined,
      currency: undefined,
      available_ammount: undefined,
    });
  };

  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  const getSearchValue = (field: keyof TransferBudgetFields) => {
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

  const fields: IField<TransferBudgetFields>[] = [
    {
      id: 'company_code',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      onChange: () => {
        resetBudgetFromTo();
      },
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
        resetBudgetFromTo();
      },
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
        resetBudgetFromTo();
      },
    },
    {
      id: '', type: '', label: '', placeholder: '', validation: {},
    },
    {
      id: 'budget_from_id',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Number From',
      datasources: getBudgetCompany.data?.data?.map((v) => ({ id: v.ID, value: `${v.order_number} - ${v.description}` })),
      placeholder: 'Select',
      isLoading: getBudgetCompany.isLoading,
      onChange: (e) => {
        const detail = getBudgetCompany.data?.data?.find((v) => v.ID === e.target.value);
        setValue('description_from', detail.description);
        setValue('currency', detail.currency);
        setValue('available_ammount', detail.ammount);
      },
    },
    {
      id: 'budget_to_id',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Number To',
      datasources: getBudgetCompany.data?.data?.map((v) => ({ id: v.ID, value: `${v.order_number} - ${v.description}` })),
      placeholder: 'Select',
      isLoading: getBudgetCompany.isLoading,
      onChange: (e) => {
        const detail = getBudgetCompany.data?.data?.find((v) => v.ID === e.target.value);
        setValue('description_to', detail.description);
      },
    },
    {
      id: 'description_from',
      type: 'text',
      label: 'Description From',
      placeholder: '',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
    {
      id: 'description_to',
      type: 'text',
      label: 'Description To',
      placeholder: '',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
    {
      id: 'currency',
      type: 'text',
      label: 'Currency',
      placeholder: '',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
    {
      id: 'available_ammount',
      type: 'currency',
      label: 'Available Amount',
      placeholder: '',
      isLoading: getBudgetCompany.isLoading,
      disabled: true,
    },
    {
      id: 'year',
      validation: { required: '* required' },
      type: 'yearpicker',
      label: 'Year',
      placeholder: 'YYYY',
    },
    {
      id: 'amount',
      validation: {
        required: '* required',
        min: errorMinValue(1),
        max: errorMaxValue(form.getValues('available_ammount') || 0, '* value must be less or equal than the available amount'),
      },
      type: 'currency',
      label: 'Amount',
      placeholder: 'e.g 10.000.000',
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
    </Card>
  );
};
