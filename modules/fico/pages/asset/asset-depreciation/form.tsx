/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import {
  Row, Accordion, Button,
} from 'pink-lava-ui';
import { FormBuilder, IField } from 'components/FormBuilder';
import React, { useState } from 'react';
import { IForm, IModals } from 'interfaces/interfaces';
import styled from 'styled-components';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterAsset } from 'hooks/master-data/useMasterAsset';
import { ModalChildren } from 'components/modals/ModalChildren';
import DataTable from 'components/DataTable';
import { useAssetDepreciation } from 'hooks/asset/useAssetDepreciation';
import { message } from 'antd';
import { Checkbox } from 'components/Checkbox';
import moment from 'moment';

export type AssetDepreciationFields = {
  company_from: string,
  company_to: string,
  fiscal_year: number,
  posting_period: number,
  ast_number_from: string,
  ast_number_to: string,
  sub_number_from: number,
  sub_number_to: number
}

export interface IAccrualJournalRunning {
  document_number_from: number;
  document_number_to: number;
  company_code: string;
  fiscal_year: string;
  period: string;
  document_type_from: string;
  document_type_to: string;
  posting_date_from: string;
  posting_date_to: string;
  entry_date_from: string;
  entry_date_to: string;
  settlement_period_from: string;
  settlement_period_to: string;
}

export const getPayload = (data: AssetDepreciationFields) => ({
  ...data,
  fiscal_year: Number(data.fiscal_year),
  posting_period: Number(data.posting_period),
  sub_number_from: Number(data.sub_number_from),
  sub_number_to: Number(data.sub_number_to),
});

export const FormAssetDepreciation = (props: IForm<AssetDepreciationFields>) => {
  const { form } = props;
  const [modals, setModals] = useState<IModals>();
  const closeModals = () => setModals({});

  const service = useAssetDepreciation();
  const testRunAssetDepreciation = service.testRun({
    onSuccess: () => {
      setModals({
        ...modals,
        transaction: { open: true, title: 'Test Run' },
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const doTestRun = (data) => testRunAssetDepreciation.mutate(getPayload(data));

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AssetDepreciationFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_from') || getSearchValue('company_to') },
  });
  const queryMasterAsset = useQueryMasterAsset({
    query: { req: getSearchValue('ast_number_from') || getSearchValue('ast_number_to') },
  });
  const fieldsPostingParameter: IField<AssetDepreciationFields>[] = [
    {
      id: 'company_from',
      type: 'dropdown',
      label: 'Company From',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'company_to',
      type: 'dropdown',
      label: 'Company To',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'fiscal_year',
      type: 'yearpicker',
      label: 'Fiscal Year',
      placeholder: 'YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'posting_period',
      type: 'monthpicker',
      label: 'Reversal Posting Period',
      placeholder: 'MM',
      validation: { required: '* required' },
    },
  ];

  const fieldsTestRunParameter: IField<AssetDepreciationFields>[] = [
    {
      id: 'ast_number_from',
      type: 'dropdown',
      label: 'Asset From',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAsset.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.description}` })),
    },
    {
      id: 'ast_number_to',
      type: 'dropdown',
      label: 'Asset To',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAsset.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.description}` })),
    },
    {
      id: 'sub_number_from',
      type: 'number',
      label: 'Sub Number Asset From',
      placeholder: 'e.g. 0',
      // validation: { required: '* required' },
    },
    {
      id: 'sub_number_to',
      type: 'number',
      label: 'Sub Number Asset To',
      placeholder: 'e.g. 0',
      // validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: '',
      type: 'custom',
      render: <ButtonStyled
        onClick={form.handleSubmit(doTestRun)}
        variant="tertiary"
        size="small"
      >
        TEST RUN
      </ButtonStyled>,
    },
  ];

  return (
    <>
      <div style={{ width: '100%' }}>
        <Accordion>
          <Accordion.Item key={2} style={{ marginTop: '20px' }}>
            <Accordion.Header variant="blue">Posting Parameter</Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <FormBuilder
                  fields={fieldsPostingParameter}
                  column={2}
                  useForm={form}
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion>
          <Accordion.Item key={2} style={{ marginTop: '20px' }}>
            <Accordion.Header variant="blue">Test Run Parameter</Accordion.Header>
            <Accordion.Body>
              <Row width="100%">
                <FormBuilder
                  fields={fieldsTestRunParameter}
                  column={2}
                  useForm={form}
                />
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {modals?.transaction && (
      <ModalChildren
        title={modals.transaction.title}
        visible={modals.transaction.open}
        width={1200}
        onOk={() => closeModals()}
        textBtnOk="Close"
        hideBtnCancel
      >
        <DataTable
          rowKey="doc_number"
          columns={columns}
          data={testRunAssetDepreciation.data?.data.assets || []}
          scroll={{ x: 1600 }}
        />
      </ModalChildren>
      )}
    </>
  );
};

const columns = [
  {
    title: 'Doc. Number',
    dataIndex: 'document_number',
  },
  {
    title: 'Asset Number',
    dataIndex: 'asset',
  },
  { title: 'D/C', dataIndex: 'debit_creditind', render: (value) => (value === 'S' ? 'Debit' : 'Credit') },
  {
    title: 'Depreciation',
    dataIndex: 'depreciation_ar',
    align: 'center',
    render: (value) => <Checkbox justifyContent="center" checked={value} disabled />,
  },
  {
    title: 'Posting Date',
    dataIndex: 'posting_date',
    render: (value) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Cost Center',
    dataIndex: 'cost_center',
  },
  {
    title: 'Profit Center',
    dataIndex: 'profit_center',
  },
  {
    title: 'Reference',
    dataIndex: 'reference_docum',
  },
];

const ButtonStyled = styled(Button)`
  border-radius: 5px;
  height: 48px;

  :hover {
    background-color: #EB008B;
    color: #fff;
    border: 0;
  }
`;
