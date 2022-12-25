/* eslint-disable camelcase */
import { useForm } from 'react-hook-form';
import {
  Row, Spacer,
} from 'pink-lava-ui';
import { IForm, IModals } from 'interfaces/interfaces';
import usePagination from '@lucasmogari/react-pagination';
import React, { useState } from 'react';
import { TableRowSelection } from 'antd/lib/table/interface';
import { uniqueId } from 'lodash';
import { FormBuilder, IField } from 'components/FormBuilder';
import DataTable from 'components/DataTable';
import { ModalChildren } from 'components/modals/ModalChildren';
import { useConfigPagination } from 'hooks/pagination/useConfigPagination';
import { Checkbox } from 'components/Checkbox';
import moment from 'moment';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterAreaNumber } from 'hooks/master-data/useMasterAreaNumber';
import { Button } from 'components/Button';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import { AssetFields } from './form';

export type DepreciationAreaFields = {
  idx: string,
  id: number | string;
  id_ast_master: string,
  ast_class: string,
  company_code: string,
  area_number: string,
  depre_area: number,
  depre_key: string,
  use_life: string,
  period: number,
  valid_from: string,
  valid_to: string,
  deactive_status: number,
  cost_center: string,
  profit_center: string,
}

export const FormDepreciationArea = (props: IForm<AssetFields>) => {
  const { form, datasources } = props;
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<DepreciationAreaFields>();

  const formDepreciationArea = useForm<DepreciationAreaFields>();
  const { configPagination } = useConfigPagination();
  const pagination = usePagination(configPagination);
  const [modals, setModals] = useState<IModals>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { getValues, setValue } = form;
  const {
    handleSubmit,
    getValues: getValuesDepreciation,
    reset,
  } = formDepreciationArea;

  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: (selected) => setSelectedRowKeys(selected),
  };

  const columns = [
    // {
    //   title: 'Deactive', dataIndex: 'deactive', align: 'center', render: (value) => <Checkbox justifyContent="center" checked={value} disabled />,
    // },
    // { title: 'Area Number', dataIndex: 'area_number' },
    { title: 'Depreciation Area', dataIndex: 'depre_area' },
    { title: 'Depreciation Key', dataIndex: 'depre_key' },
    { title: 'Use Life', dataIndex: 'use_life' },
    { title: 'Period', dataIndex: 'period' },
    { title: 'Valid From', dataIndex: 'valid_from', render: (value) => moment(value).format('DD/MM/YYYY') },
    { title: 'Valid To', dataIndex: 'valid_to', render: (value) => moment(value).format('DD/MM/YYYY') },
    {
      title: 'Deactive ?', dataIndex: 'deactive_status', align: 'center', render: (value) => <Checkbox justifyContent="center" checked={value} disabled />,
    },
  ];

  const closeModals = () => setModals({});
  const doSubmitTransaction = () => {
    const values = getValuesDepreciation();
    const { deprecation_area = [] } = getValues();

    setValue('deprecation_area', [...deprecation_area, { ...values, id: 0, idx: uniqueId() }]);

    closeModals();
  };

  const doDeleteTransaction = () => {
    const { deprecation_area } = getValues();

    setValue('deprecation_area', deprecation_area.filter((v) => !selectedRowKeys.includes(v.idx || '')));
    setSelectedRowKeys([]);
  };

  const companyCode = 'PP01'; // hardcode
  const queryMasterAreaNumber = useQueryMasterAreaNumber({
    query: { search: getSearchValue('area_number') },
  });
  const queryMasterCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('cost_center'), company_code: companyCode },
  });
  const queryMasterProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('profit_center'), company_code: companyCode },
  });

  const fields: IField<DepreciationAreaFields>[] = [
    {
      id: 'depre_area',
      type: 'dropdown',
      label: 'Deprecation Area',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.depre_area?.map((v) => ({ id: v.depreciation_ar, value: `${v.depreciation_ar} - ${v.name_of_depreci}` })),
    },
    {
      id: 'depre_key',
      type: 'dropdown',
      label: 'Depreciation Key',
      placeholder: 'Select',
      datasources: datasources?.depre_key?.map((v) => ({ id: v.depreciation_ke, value: `${v.depreciation_ke} - ${v.name_for_whole}` })),
      validation: { required: '* required' },
    },
    {
      id: 'area_number',
      type: 'dropdown',
      label: 'Area Number',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAreaNumber.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.desc}` })),
    },
    {
      id: 'use_life',
      type: 'number',
      label: 'Use Life',
      placeholder: 'e.g 10',
      validation: { required: '* required' },
    },
    {
      id: 'period',
      type: 'monthpicker',
      label: 'Period',
      placeholder: 'MM',
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'valid_from',
      type: 'datepicker',
      label: 'Valid From',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'valid_to',
      type: 'datepicker',
      label: 'Valid To',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
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
      id: 'deactive_status',
      type: 'checkbox',
      label: 'Deactive Status',
    },
  ];

  return (
    <>
      <Row width="100%" className="overflow-x-auto" gap="4px">
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
        <div className="w-[400%] md:w-full">
          <DataTable
            rowKey="idx"
            columns={columns}
            data={getValues('deprecation_area') || []}
            pagination={pagination}
            rowSelection={rowSelection}
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
          <Row width="100%" padding="20px 0">
            <FormBuilder
              fields={fields}
              column={2}
              useForm={formDepreciationArea}
            />
          </Row>
        </ModalChildren>
      )}
    </>
  );
};
