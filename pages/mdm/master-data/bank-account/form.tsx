/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';
import { Form } from 'types/form';
import { useSearchDropdown } from 'hooks/helper/use-search-dropdown';
import { Field } from 'types/field';
import { errorMaxLength, errorRequired } from 'utils/errMsg';
import {
  Card, FormBuilder, Row,
} from 'components/pink-lava-ui';
import { useCompanyList, useCurrenciesMDM } from 'hooks/company-list/useCompany';
import { useMasterGLAccount } from 'hooks/mdm/master-data/use-gl-account';

export type MasterBankAccountFields = {
  id : number,
  company_id: string,
  house_bank: string,
  account_id: string,
  bank_account: string,
  bank_control: string,
  currency: string,
  gl_account: string,
  collect_account: string,
  description: string
}

export const getPayload = (data: MasterBankAccountFields) => ({
  ...data,
});

export const FormMasterBankAccount = (props: Form<MasterBankAccountFields>) => {
  const { form, type } = props;

  useEffect(() => {
    if (type === "create") {
      form.setValue("company_id", "KSNI");
    }
  }, [type]);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<MasterBankAccountFields>();
  const queryCompanyList = useCompanyList({
    query: {
      limit: 10000,
      search: getSearchValue("company_id"),
      sortOrder: "ASC",
    },
    options: {},
  });
  const queryCurrency = useCurrenciesMDM({
    query: {
      limit: 10000,
      search: getSearchValue("currency"),
    },
    options: {},
  });
  const serviceGLAccount = useMasterGLAccount();
  const queryGLAccount = serviceGLAccount.getList({
    query: {
      company_id: form.getValues('company_id'),
      search: getSearchValue('gl_account'),
      limit: 100,
    },
    onSuccess: () => null,
    onError: () => null,
  });

  const fields: Field<MasterBankAccountFields>[] = [
    {
      id: 'company_id',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryCompanyList.data?.rows.map((v) => ({
        ...v,
        id: v.code,
        value: `${v.code} - ${v.name}`,
      })),
      validation: { required: errorRequired() },
    },
    {
      id: 'house_bank',
      type: 'text',
      label: 'House Bank',
      placeholder: 'e.g BC001',
      validation: { required: errorRequired(), maxLength: errorMaxLength(5) },
    },
    {
      id: 'account_id',
      type: 'text',
      label: 'Account ID',
      placeholder: 'e.g 12345678',
      validation: { required: errorRequired(), maxLength: errorMaxLength(5) },
    },
    {
      id: 'bank_account',
      type: 'text',
      label: 'Bank Account',
      placeholder: 'e.g BCA',
      validation: { required: errorRequired(), maxLength: errorMaxLength(18) },
    },
    {
      id: 'bank_control',
      type: 'text',
      label: 'Bank Control Key',
      placeholder: 'e.g BC001',
      validation: { maxLength: errorMaxLength(2) },
    },
    {
      id: 'currency',
      type: 'dropdown',
      label: 'Currency',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryCurrency.data?.rows?.map((v) => ({ id: v.currency, value: `${v.currency} - ${v.currencyName}` })),
      validation: { required: errorRequired() },
    },
    {
      id: 'gl_account',
      type: 'dropdown',
      label: 'G/L Account',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryGLAccount.data?.data?.rows.map((v) => ({ id: v.gl_account, value: `${v.gl_account} - ${v.short_text}` })),
      validation: { required: errorRequired() },
      isLoading: queryCompanyList.isLoading,
    },
    {
      id: 'collect_account',
      type: 'dropdown',
      label: 'Collection Account',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryGLAccount.data?.data?.rows.map((v) => ({ id: v.gl_account, value: `${v.gl_account} - ${v.short_text}` })),
      validation: { required: errorRequired() },
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'e.g Bank BCA',
      validation: { required: errorRequired(), maxLength: errorMaxLength(50) },
      isLoading: queryCompanyList.isLoading,
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
    </div>
  );
};

export default FormMasterBankAccount;
