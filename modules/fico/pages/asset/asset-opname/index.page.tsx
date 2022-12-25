/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import Router from 'next/router';
import {
  Col, Row, Spacer, Text,
} from 'pink-lava-ui';
import { Button } from 'components/Button';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FormBuilder, IField } from 'components/FormBuilder';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import {
  DS_ASSET_CLASS, DS_ASSET_NO, DS_COMPANY, DS_PLANT,
} from 'constants/datasources';
import { useAssetOpname } from 'hooks/asset/useAssetOpname';
import { message } from 'antd';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterPlant } from 'hooks/master-data/useMasterPlant';
import { useQueryMasterAssetClass } from 'hooks/master-data/useMasterAssetClass';
import { objectToParams } from 'lib/url';

export type AssetOpnameFields = {
  company_code: string,
  id_ast_from: string,
  id_ast_to: string,
  ast_class_from: string,
  ast_class_to: string,
  plant_from: string,
  plant_to: string,
  report_date: string
}

function AssetOpname() {
  const form = useForm<AssetOpnameFields>();
  const { handleSubmit, reset, formState: { isValid } } = form;
  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AssetOpnameFields>();

  const [modals, setModals] = useState<IModals>();

  const service = useAssetOpname();
  const getDropdownDatasources = service.getDropdownDatasources();
  const datasources = getDropdownDatasources.data;

  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterPlantFrom = useQueryMasterPlant({
    query: { search: getSearchValue('plant_from'), company_code: form.getValues('company_code') },
  });
  const queryMasterPlantTo = useQueryMasterPlant({
    query: { search: getSearchValue('plant_to'), company_code: form.getValues('company_code') },
  });
  const queryMasterAssetClass = useQueryMasterAssetClass({
    query: { req: getSearchValue('ast_class_from') || getSearchValue('ast_class_to') },
  });

  const createAssetOpname = service.create({
    onSuccess: () => {
      Router.push(`${Router.pathname}/list?${objectToParams(form.getValues())}`);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const clearAll = () => {
    reset();
  };

  const closeModals = () => setModals({});
  const doSubmit = () => {
    setModals({
      confirmation: { open: false, title: '', message: '' },
      alert: {
        open: true, title: 'Submit Success', message: 'Order number 1040000000140 has been successfully submited', variant: 'success',
      },
    });
  };

  const getAssetOpname = service.getList({
    query: form.getValues(),
    enabled: !!form.getValues('company_code'), // pause until user input "company_code"
    onSuccess: (res) => {},
    onError: (err) => {
      message.error(err.message);
    },
  });

  const doExecute = (data) => {
    const assetOpname = getAssetOpname.data?.data || [];
    if (assetOpname.length > 0) Router.push(`${Router.pathname}/list?${objectToParams(form.getValues())}`);
    else createAssetOpname.mutate(data);
  };

  const fields: IField<AssetOpnameFields>[] = [
    {
      id: 'company_code',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: '', type: '',
    },
    {
      id: 'id_ast_from',
      // validation: { required: '* required' },
      type: 'dropdown',
      label: 'No Asset From',
      placeholder: 'Select',
      datasources: datasources?.id_ast_master?.filter(
        (v) => v.company_code === form.getValues('company_code'),
      ).map(
        (v) => ({ id: v.id_ast_number, value: `${v.id_ast_number} - ${v.description}` }),
      ),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'id_ast_to',
      // validation: { required: '* required' },
      type: 'dropdown',
      label: 'No Asset To',
      placeholder: 'Select',
      datasources: datasources?.id_ast_master?.filter(
        (v) => v.company_code === form.getValues('company_code'),
      ).map(
        (v) => ({ id: v.id_ast_number, value: `${v.id_ast_number} - ${v.description}` }),
      ),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'plant_from',
      // validation: { required: '* required' },
      type: 'dropdown',
      label: 'Plant From',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPlantFrom.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'plant_to',
      // validation: { required: '* required' },
      type: 'dropdown',
      label: 'Plant To',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPlantTo.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'ast_class_from',
      // validation: { required: '* required' },
      type: 'dropdown',
      label: 'Asset Class From',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAssetClass.data?.map((v) => ({ id: v.id_ast_class, value: `${v.id_ast_class} - ${v.name_ast_class}` })),
    },
    {
      id: 'ast_class_to',
      // validation: { required: '* required' },
      type: 'dropdown',
      label: 'Asset Class To',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAssetClass.data?.map((v) => ({ id: v.id_ast_class, value: `${v.id_ast_class} - ${v.name_ast_class}` })),
    },
    {
      id: 'report_date',
      // validation: { required: '* required' },
      type: 'datepicker',
      label: 'Report Date',
      placeholder: 'DD/MM/YYYY',
    },
  ];

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Asset Opname</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <Button size="big" variant="tertiary" onClick={() => clearAll()}>
                  {createAssetOpname.isLoading ? 'loading...' : 'Clear All'}
                </Button>
                <Button size="big" variant="primary" onClick={handleSubmit(doExecute)}>
                  {createAssetOpname.isLoading ? 'loading...' : 'Execute'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <Card padding="20px">
          <Row width="100%">
            <FormBuilder
              fields={fields}
              column={2}
              useForm={form}
            />
          </Row>
        </Card>

      </Col>
      {modals?.confirmation && (
      <ModalConfirmation
        title={modals.confirmation.title}
        message={modals.confirmation.message}
        visible={modals.confirmation.open}
        onCancel={() => closeModals()}
        onOk={() => modals.confirmation?.onOk?.()}
      />
      )}
      {modals?.alert && (
      <ModalAlert
        visible={modals.alert.open}
        title={modals.alert.title}
        message={modals.alert.message}
        variant={modals.alert.variant}
        onOk={() => closeModals()}
      />
      )}
    </>
  );
}

const Span = styled.div`
  font-size: 14px;
  line-height: 18px;
  font-weight: normal;
  color: #ffe12e;
`;

const Card = styled.div<{ padding }>`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : '16px')};
`;

export default AssetOpname;
