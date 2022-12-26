/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from "react";
import { Form } from "types/form";
import { useSearchDropdown } from "hooks/helper/use-search-dropdown";
import { Field } from "types/field";
import { errorMaxLength, errorRequired } from "utils/errMsg";
import {
  Accordion, Card, FormBuilder, Row, Spacer,
} from "components/pink-lava-ui";
import { useCompanyList } from "hooks/company-list/useCompany";
import { DS_GLAccountGroup, DS_GLAccountType, DS_GLStatusGroup } from 'constants/datasources';
import { useCurrenciesMDM } from 'hooks/mdm/country-structure/useCurrencyMDM';
import { useTaxes } from 'hooks/mdm/Tax/useTax';

export type MasterGLAccountFields = {
  id: number;
  company_id: string;
  company_id_number?: number;
  chart_of_account: string;
  gl_account: string;
  balance_sheet: boolean | string;
  pl_statmt_account: boolean | string;
  account_group: string;
  field_status: string;
  recon_acct_for: boolean | string;
  tax_category: string;
  acct_currency: string;
  relevant_to_cas: boolean | string;
  post_auto_only: boolean | string;
  line_item_display: boolean | string;
  open_item_manage: boolean | string;
  sort_key: boolean | string;
  posting_without: boolean | string;
  balances_in_loc: boolean | string;
  blocked_for_pos: boolean | string;
  blocked_for_plan: boolean | string;
  gl_account_type: string;
  last_change: string;
  short_text: string;
  gl_acct_long_text: string;
  gl_long_text: string;
};

export const getPayload = (data: MasterGLAccountFields): MasterGLAccountFields => ({
  ...data,
  company_id_number: undefined, // deleted object

  last_change: data.last_change ?? "",
  pl_statmt_account: data.pl_statmt_account ? 'X' : '',
  balance_sheet: data.balance_sheet ? 'X' : '',
  relevant_to_cas: data.relevant_to_cas ? 'X' : '',
  balances_in_loc: data.balances_in_loc ? 'X' : '',
  posting_without: data.balances_in_loc ? 'X' : '',
  recon_acct_for: data.recon_acct_for ? 'X' : '',
  post_auto_only: data.post_auto_only ? 'X' : '',
  line_item_display: data.line_item_display ? 'X' : '',
  blocked_for_pos: data.blocked_for_pos ? 'X' : '',
  blocked_for_plan: data.blocked_for_plan ? 'X' : '',
  open_item_manage: data.open_item_manage ? 'X' : '',
});

export const FormMasterGLAccount = (props: Form<MasterGLAccountFields>) => {
  const { form, type } = props;

  useEffect(() => {
    if (type === "create") {
      form.setValue("acct_currency", "IDR");
      form.setValue("pl_statmt_account", true);
    }
  }, [type]);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<MasterGLAccountFields>();
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
      search: getSearchValue("acct_currency"),
    },
    options: {},
  });
  const queryTax = useTaxes({
    query: {
      limit: 10000,
      search: getSearchValue("tax_category"),
      // company_id: localStorage.getItem("companyId"),
    },
    options: {},
  });
  // const queryDetailCompany = useCompany({
  //   id: form.getValues('company_id_number'),
  //   options: {},
  // });
  // const queryMasterPPN = useQueryMasterPPN({
  //   query: { search: getSearchValue('ppn_code') },
  // });
  // const queryMasterPPH = useQueryMasterPPH({
  //   query: { req: getSearchValue('pph_code') },
  // });

  const fields: Field<MasterGLAccountFields>[] = [
    {
      id: "company_id",
      type: "dropdown",
      label: "Company Code",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryCompanyList.data?.rows.map((v) => ({
        ...v,
        id: v.code,
        value: `${v.code} - ${v.name}`,
      })),
      validation: { required: "* required" },
      onChange: ({ target: { selected } }) => {
        form.setValue("company_id_number", selected.id);
      },
    },
    {
      id: "chart_of_account",
      type: "dropdown",
      label: "Chart of Accounts",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      // datasources: queryMasterVendor.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      // validation: { required: "* required" },
    },
    {
      id: "gl_account",
      type: "text",
      label: "G/L Account",
      placeholder: "e.g 123456789",
      validation: { required: "* required" },
    },
  ];

  const fieldsControlCoA: Field<MasterGLAccountFields>[] = [
    {
      id: "gl_account_type",
      type: "dropdown",
      label: "G/L Account Type",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: DS_GLAccountType.map((v) => ({ id: v.id, value: `${v.id} - ${v.name}` })),
      validation: { required: "* required" },
    },
    {
      id: "account_group",
      type: "dropdown",
      label: "G/L Account Group",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: DS_GLAccountGroup.map((v) => ({ id: v.id, value: `${v.id} - ${v.name}` })),
      validation: { required: "* required" },
    },
  ];

  const fieldsControlPLStatement: Field<MasterGLAccountFields>[] = [
    {
      id: "pl_statmt_account",
      type: "checkbox-horizontal-label",
      label: "P&L Statement Account Type",
      onChange: ({ target }) => {
        if (Boolean(form.getValues("balance_sheet")) === target.value) {
          form.setValue("balance_sheet", !target.value);
        }
      },
    },
    {
      id: "balance_sheet",
      type: "checkbox-horizontal-label",
      label: "Balance Sheet Account Type",
      onChange: ({ target }) => {
        if (Boolean(form.getValues("pl_statmt_account")) === target.value) {
          form.setValue("pl_statmt_account", !target.value);
        }
      },
    },
    {
      id: "relevant_to_cas",
      type: "checkbox-horizontal-label",
      label: "Relevant to Cash Flow",
    },
  ];

  const fieldsDescription: Field<MasterGLAccountFields>[] = [
    {
      id: "short_text",
      type: "text",
      label: "Short Text",
      validation: {
        required: errorRequired(),
        maxLength: errorMaxLength(20),
      },
    },
    {
      id: "gl_acct_long_text",
      type: "text",
      label: "G/L Account Long Text",
      validation: {
        required: errorRequired(),
        maxLength: errorMaxLength(50),
      },
    },
  ];

  const fieldsControlCompanyCode: Field<MasterGLAccountFields>[] = [
    {
      id: "acct_currency",
      type: "dropdown",
      label: "Account Currency",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryCurrency.data?.rows?.map((v) => ({ id: v.currency, value: `${v.currency} - ${v.currencyName}` })),
      validation: { required: "* required" },
    },
    {
      id: "tax_category",
      type: "dropdown",
      label: "Tax Category",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryTax.data?.rows?.map((v) => ({ id: v.taxId, value: `${v.taxId} - ${v.name}` })),
      validation: { required: "* required" },
    },
    {
      id: "balances_in_loc",
      type: "checkbox-horizontal-label",
      label: "Balance in Local Currency",
    },
    {
      id: "posting_without",
      type: "checkbox-horizontal-label",
      label: "Posting Without Tax Allowed",
    },
    {
      id: "recon_acct_for",
      type: "checkbox-horizontal-label",
      label: "Reccount Account Type",
    },
    {
      id: "post_auto_only",
      type: "checkbox-horizontal-label",
      label: "Post Automatically Only",
    },
    {
      id: "line_item_display",
      type: "checkbox-horizontal-label",
      label: "Line Item Display Possible",
    },
    {
      id: "blocked_for_pos",
      type: "checkbox-horizontal-label",
      label: "Blocked for Posting",
    },
    {
      id: "blocked_for_plan",
      type: "checkbox-horizontal-label",
      label: "Blocked for Planning",
    },
  ];

  const fieldsAccountManagement: Field<MasterGLAccountFields>[] = [
    {
      id: "sort_key",
      type: "text",
      label: "Sort Key",
      validation: {
        required: errorRequired(),
        maxLength: errorMaxLength(20),
      },
    },
    {
      id: "open_item_manage",
      type: "checkbox-horizontal-label",
      label: "Open Item Management",
    },
  ];

  const fieldsDocumentCreation: Field<MasterGLAccountFields>[] = [
    {
      id: "field_status",
      type: "dropdown",
      label: "Field Status Group",
      placeholder: "Select",
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: DS_GLStatusGroup.map((v) => ({ id: v.id, value: `${v.id} - ${v.name}` })),
      validation: { required: "* required" },
    },
  ];

  return (
    <div className="w-full">
      <Card padding="20px">
        <Row width="100%">
          <FormBuilder fields={fields} column={2} useForm={form} />
        </Row>
      </Card>
      <Accordion>
        <Accordion.Item key={1} style={{ marginTop: "20px" }}>
          <Accordion.Header variant="blue">Control In Chart Of Account</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder fields={fieldsControlCoA} column={2} useForm={form} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item key={2} style={{ marginTop: "20px" }}>
          <Accordion.Header variant="blue">Detail Control P&L Statement</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder fields={fieldsControlPLStatement} column={2} useForm={form} />
            </Row>
            <Spacer size={20} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item key={3} style={{ marginTop: "20px" }}>
          <Accordion.Header variant="blue">Description</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder fields={fieldsDescription} column={2} useForm={form} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item key={4} style={{ marginTop: "20px" }}>
          <Accordion.Header variant="blue">Account Control In Company Code</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder fields={fieldsControlCompanyCode} column={2} useForm={form} />
            </Row>
            <Spacer size={20} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item key={5} style={{ marginTop: "20px" }}>
          <Accordion.Header variant="blue">Account Management In Company Code</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder fields={fieldsAccountManagement} column={2} useForm={form} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item key={6} style={{ marginTop: "20px" }}>
          <Accordion.Header variant="blue">Control Of Document Creation</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder fields={fieldsDocumentCreation} column={2} useForm={form} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FormMasterGLAccount;
