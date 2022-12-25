/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Row, Spacer } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import DataTable from 'components/DataTable';
import usePagination from '@lucasmogari/react-pagination';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalChildren } from 'components/modals/ModalChildren';
import { IForm, IModals } from 'interfaces/interfaces';
import _ from 'lodash';
import { currencyFormater } from 'lib/currencyFormatter';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAssetDisposal } from 'hooks/asset/useAssetDisposal';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterAsset } from 'hooks/master-data/useMasterAsset';
import { useQueryMasterCurrency } from 'hooks/master-data/useMasterCurrency';
import { useQueryMasterDisposalType } from 'hooks/master-data/useMasterDisposalType';
import { Button } from 'components/Button';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import { errorMaxLength } from 'constants/errorMsg';

export type AssetListFields = {
  idx: string;
  id_ast_master: number,
  id_ast_disposal: number,
  ast_desc: string,
  sub_number: number,
  brand: string,
  type: string,
  currency: string,
  price: number,
  note: string,
  reason: string
}

export type AssetDisposalFields = {
  doc_number: number,
  doc_date: string,
  sent_date: string,
  disposal_type: string,
  sender: string,
  receiver: string,
  sender_dvsn: string,
  receiver_dvsn: string,
  vehicles: string,
  address: string,
  phone_number: string,
  status: string,
  arr_ast_h_disposal: AssetListFields[],
}

export const getPayload = (data: AssetDisposalFields) => ({
  ...data,
  doc_number: `${data.doc_number || 1900000000}`,
  disposal_type: Number(data.disposal_type),
  arr_ast_h_disposal: JSON.stringify(data.arr_ast_h_disposal),
});
export const FormAssetDisposal = (props: IForm<AssetDisposalFields>) => {
  const { form } = props;

  const service = useAssetDisposal();
  const getDropdownDatasources = service.getDropdownDatasources();
  const datasources = getDropdownDatasources.data;

  const { getSearchValue, setSearchDropdown } = useSearchDropdown<AssetDisposalFields>();
  const queryMasterDisposalType = useQueryMasterDisposalType({
    query: { req: getSearchValue('disposal_type') },
  });
  const companyCode = 'PP01'; // hardcode
  const queryMasterCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('receiver_dvsn') || getSearchValue('sender_dvsn'), company_code: companyCode },
  });

  const fields: IField<AssetDisposalFields>[] = [
    {
      id: 'doc_number',
      type: 'text',
      label: 'Doc. Number',
      placeholder: '',
      disabled: true,
    },
    { id: '', type: '' },
    {
      id: 'doc_date',
      type: 'datepicker',
      label: 'Doc. Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'sent_date',
      type: 'datepicker',
      label: 'Sent Date',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'sender',
      type: 'dropdown',
      label: 'Sender',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.sender?.map((v) => ({ id: v.plant, value: `${v.plant} - ${v.name1}` })),
    },
    {
      id: 'sender_dvsn',
      type: 'dropdown',
      label: 'Sender Division',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'vehicles',
      type: 'text',
      label: 'Vehicle Number',
      placeholder: 'e.g. D 1234 NBT',
      validation: { required: '* required' },
    },
    {
      id: 'disposal_type',
      type: 'dropdown',
      label: 'Type Disposal',
      placeholder: 'Select',
      validation: { required: '* required' },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterDisposalType.data?.map((v) => ({ id: v.disposal_type, value: `${v.name_dsp_type}` })),
    },
    {
      id: '',
      type: 'custom',
      render: <Divider />,
      flexWidth: 100,
    },
    {
      id: 'receiver',
      type: 'text',
      label: 'Receiver',
      placeholder: 'e.g Receiver',
      validation: { required: '* required', maxLength: errorMaxLength(25) },
      // datasources: datasources?.receiver?.map((v) => ({ id: v.plant, value: `${v.plant} - ${v.name1}` })),
    },
    {
      id: 'receiver_dvsn',
      type: 'text',
      label: 'Receiver Division',
      placeholder: 'e.g Division',
      validation: { required: '* required', maxLength: errorMaxLength(25) },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      // datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'address',
      type: 'text',
      label: 'Address',
      placeholder: 'e.g. HO Bandung',
      validation: { required: '* required' },
    },
    {
      id: 'phone_number',
      type: 'mobilephone',
      label: 'Phone Number',
      placeholder: 'e.g. 0812 1234 3344',
      validation: { required: '* required' },
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
      <FormAssetList form={form} />
    </Card>
  );
};

/* A function that is used to create a Form Orders. */
const FormAssetList = (props: IForm<AssetDisposalFields>) => {
  const { form: formAssetDisposal } = props;
  const form = useForm<AssetListFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    { title: 'Asset Master Number', dataIndex: 'id_ast_master' },
    { title: 'Sub Number', dataIndex: 'sub_number' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'Currency', dataIndex: 'currency' },
    { title: 'Price', dataIndex: 'price', render: (value) => currencyFormater(value) },
    { title: 'Note', dataIndex: 'note' },
    { title: 'Reason', dataIndex: 'reason' },
  ];

  const closeModals = () => setModals({});
  const doSubmit = () => {
    const values = form.getValues();
    const { arr_ast_h_disposal = [] } = formAssetDisposal.getValues();

    formAssetDisposal.setValue('arr_ast_h_disposal', [...arr_ast_h_disposal, { ...values, id_ast_disposal: 0, idx: _.uniqueId() }]);

    closeModals();
  };

  const doDelete = () => {
    const { arr_ast_h_disposal } = formAssetDisposal.getValues();

    formAssetDisposal.setValue('arr_ast_h_disposal', arr_ast_h_disposal.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AssetListFields>();
  const queryMasterAsset = useQueryMasterAsset({
    query: { req: getSearchValue('id_ast_master') },
  });
  const queryMasterCurrency = useQueryMasterCurrency({
    query: { req: getSearchValue('currency') },
  });

  const fields: IField<AssetListFields>[] = [
    {
      id: 'id_ast_master',
      type: 'dropdown',
      label: 'Asset Number',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAsset.data?.map((v) => ({ id: v.id, value: `${v.id}`, description: v.description })),
      onChange: ({ target }) => {
        form.setValue('ast_desc', target.selected?.description);
      },
    },
    {
      id: 'ast_desc',
      type: 'text',
      label: 'Asset Description',
      disabled: true,
    },
    {
      id: 'sub_number',
      type: 'number',
      label: 'Sub Number',
      placeholder: 'e.g. 0',
    },
    {
      id: 'type',
      type: 'text',
      label: 'Type',
      placeholder: 'e.g. HHT',
      validation: { required: '* required' },
    },
    {
      id: 'brand',
      type: 'text',
      label: 'Brand',
      placeholder: 'e.g. Samsung',
      validation: { required: '* required' },
    },
    {
      id: 'currency',
      type: 'dropdown',
      label: 'Currency',
      placeholder: 'Select',
      validation: { required: '* required' },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCurrency.data?.map((v) => ({ id: v.id_currency, value: `${v.name_currency}` })),
    },
    {
      id: 'price',
      type: 'currency',
      label: 'Price',
      placeholder: 'e.g. 10.000.000',
      validation: { required: '* required' },
    },
    {
      id: 'note',
      type: 'text',
      label: 'Note',
      placeholder: 'e.g. Note',
      validation: { required: '* required' },
    },
    {
      id: 'reason',
      type: 'text',
      label: 'Reason',
      placeholder: 'e.g Upgrade',
      validation: { required: '* required' },
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
            rowKey="ID"
            columns={columns}
            data={formAssetDisposal.getValues('arr_ast_h_disposal') || []}
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
