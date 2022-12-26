/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import { Row, Spacer } from 'pink-lava-ui';
import { Card } from 'components/Card';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Divider } from 'components/Divider';
import DataTable from 'components/DataTable';
import usePagination from '@lucasmogari/react-pagination';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalChildren } from 'components/modals/ModalChildren';
import { IForm, IModals } from 'interfaces/interfaces';
import _ from 'lodash';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { useAssetMutation } from 'hooks/asset/useAssetMutation';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterAsset } from 'hooks/master-data/useMasterAsset';
import { Button } from 'components/Button';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';

export type AssetListFields = {
  idx: string;
  id_ast_master: string,
  id_ast_mutation: number,
  ast_desc: string,
  sub_number: number,
  brand: string,
  type: string,
  cost_center: string,
  cost_center_n: string,
  plant: string,
  plant_n: string,
  new_user: string
}

export type AssetMutationFields = {
  doc_number: number,
  doc_date: string,
  sent_date: string,
  sender: string,
  receiver: string,
  sender_dvsn: string,
  receiver_dvsn: string,
  vehicles: string,
  address: string,
  phone_number: string,
  status: boolean,
  arr_ast_h_mutation: AssetListFields[]
}

export const getPayload = (data: AssetMutationFields) => ({
  ...data,
  doc_number: `${data.doc_number || 1900000005}`,
  arr_ast_h_mutation: JSON.stringify(data.arr_ast_h_mutation),
});

export const FormAssetMutation = (props: IForm<AssetMutationFields>) => {
  const { form } = props;

  const service = useAssetMutation();
  const getDropdownDatasources = service.getDropdownDatasources();
  const datasources = getDropdownDatasources.data;

  const companyCode = 'PP01';
  const { getSearchValue, setSearchDropdown } = useSearchDropdown<AssetMutationFields>();
  const queryMasterCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('receiver_dvsn') || getSearchValue('sender_dvsn'), company_code: companyCode },
  });

  const fields: IField<AssetMutationFields>[] = [
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
    { id: '', type: '' },
    {
      id: '',
      type: 'custom',
      render: <Divider />,
      flexWidth: 100,
    },
    {
      id: 'receiver',
      type: 'dropdown',
      label: 'Receiver',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.receiver?.map((v) => ({ id: v.plant, value: `${v.plant} - ${v.name1}` })),
    },
    {
      id: 'receiver_dvsn',
      type: 'dropdown',
      label: 'Receiver Division',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
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
const FormAssetList = (props: IForm<AssetMutationFields>) => {
  const { form: formAssetMutation } = props;
  const form = useForm<AssetListFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  useEffect(() => {
    preparePayload(formAssetMutation.getValues('arr_ast_h_mutation'));
  }, [
    formAssetMutation.getValues('sender'), formAssetMutation.getValues('sender_dvsn'),
    formAssetMutation.getValues('receiver'), formAssetMutation.getValues('receiver_dvsn'),
  ]);

  const preparePayload = (items: AssetListFields[]) => {
    if (!items) return;

    const newItems = items.map((item) => ({
      ...item,
      cost_center: formAssetMutation.getValues('sender_dvsn'),
      cost_center_n: formAssetMutation.getValues('receiver_dvsn'),
      plant: formAssetMutation.getValues('sender'),
      plant_n: formAssetMutation.getValues('receiver'),
    }));

    formAssetMutation.setValue('arr_ast_h_mutation', newItems);
  };

  const columns = [
    { title: 'Asset Number', dataIndex: 'id_ast_master' },
    { title: 'Asset Description', dataIndex: 'ast_desc' },
    { title: 'Sub Number', dataIndex: 'sub_number' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Brand', dataIndex: 'brand' },
    { title: 'Old CC', dataIndex: 'cost_center' },
    { title: 'New CC', dataIndex: 'cost_center_n' },
    { title: 'Old Plant', dataIndex: 'plant' },
    { title: 'New Plant', dataIndex: 'plant_n' },
    { title: 'New User', dataIndex: 'new_user' },
  ];

  const closeModals = () => setModals({});
  const doSubmit = () => {
    const values = form.getValues();
    const { arr_ast_h_mutation = [] } = formAssetMutation.getValues();

    formAssetMutation.setValue('arr_ast_h_mutation', [...arr_ast_h_mutation, { ...values, sub_number: values.sub_number || 0, idx: _.uniqueId() }]);

    closeModals();
  };

  const doDelete = () => {
    const { arr_ast_h_mutation } = formAssetMutation.getValues();

    formAssetMutation.setValue('arr_ast_h_mutation', arr_ast_h_mutation.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AssetListFields>();
  const queryMasterAsset = useQueryMasterAsset({
    query: { req: getSearchValue('id_ast_master') },
  });
  // const queryOldCC = useQueryMasterCostCenterAsset({
  //   query: { req: getSearchValue('cost_center') },
  // });
  // const queryNewCC = useQueryMasterCostCenterAsset({
  //   query: { req: getSearchValue('cost_center_n') },
  // });
  // const queryMasterPlant = useQueryMasterPlantAsset({
  //   query: { req: getSearchValue('plant') },
  // });

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
    { id: '', type: '' },
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
      id: 'cost_center',
      type: 'text',
      label: 'Old CC',
      placeholder: 'Select',
      validation: { required: '* required' },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      // datasources: queryOldCC.data?.map((v) => ({ id: v.cost_center, value: `${v.cost_center}` })),
      disabled: true,
    },
    {
      id: 'cost_center_n',
      type: 'text',
      label: 'New CC',
      placeholder: 'Select',
      validation: { required: '* required' },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      // datasources: queryNewCC.data?.map((v) => ({ id: v.cost_center, value: `${v.cost_center}` })),
      disabled: true,
    },
    {
      id: 'plant',
      type: 'text',
      label: 'Old Plant',
      placeholder: 'Select',
      validation: { required: '* required' },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      // datasources: queryMasterPlant.data?.map((v) => ({ id: v.plant, value: `${v.plant} - ${v.name1}` })),
      disabled: true,
    },
    {
      id: 'plant_n',
      type: 'text',
      label: 'New Plant',
      placeholder: 'Select',
      validation: { required: '* required' },
      // onSearch: (search, field) => setSearchDropdown({ field, search }),
      // datasources: queryMasterPlant.data?.map((v) => ({ id: v.plant, value: `${v.plant} - ${v.name1}` })),
      disabled: true,
    },
    {
      id: 'new_user',
      type: 'text',
      label: 'New User',
      placeholder: 'e.g John',
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
            form.reset({
              cost_center: formAssetMutation.getValues('sender_dvsn'),
              cost_center_n: formAssetMutation.getValues('receiver_dvsn'),
              plant: formAssetMutation.getValues('sender'),
              plant_n: formAssetMutation.getValues('receiver'),
            });
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
            data={formAssetMutation.getValues('arr_ast_h_mutation') || []}
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
