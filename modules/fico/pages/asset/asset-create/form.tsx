/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable react/no-unused-prop-types */
import {
  Row, Accordion,
} from 'pink-lava-ui';
import { FormBuilder, IField } from 'components/FormBuilder';
import React from 'react';
import { IForm } from 'interfaces/interfaces';
import { DS_COUNTRY_ORIGIN } from 'constants/datasources';
import { useAssetCreate } from 'hooks/asset/useAssetCreate';
import { useSearchDropdown } from 'hooks/helper/useSearchDropdown';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import { useQueryMasterPlant } from 'hooks/master-data/useMasterPlant';
import { errorMaxLength } from 'constants/errorMsg';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import { useQueryMasterAssetClass } from 'hooks/master-data/useMasterAssetClass';
import { FormIntegrationAssetEquipment, IntegrationAssetEquipmentFields } from './form-integration-asset';
import { FormDepreciationArea, DepreciationAreaFields } from './form-depreciation-area';

export type AssetFields = {
  id: string,
  ast_class: string,
  company_code: string,
  description: string,
  serial_number: string,
  inv_number: string,
  quantity: number,
  uom: string,
  last_inv: string,
  inv_note: string,
  capitalized_on: string,
  deactivation_on: string,
  cost_center: string,
  profit_center: string,
  plant: string,
  location: string,
  room: string,
  tax_ast: string,
  ast_super_num: string,
  ivt_reason: string,
  eval_group2: string,
  eval_group3: string,
  eval_group4: string,
  eval_group5: string,
  vendor: string,
  manufacture: string,
  trading_partner: string,
  country: string,
  type_name: string,
  ast_purchasing: string,
  purchased_new: string,
  origin_ast: string,
  origin_acquis: string,
  origin_value: string,
  inhouse_prod: string,
  acquistion_on: string,
  ivt_order: string,
  created_at: string,
  integration_asset_equipment: IntegrationAssetEquipmentFields[],
  deprecation_area: DepreciationAreaFields[],
  ast_equip_intg: IntegrationAssetEquipmentFields[],
  ast_depre: DepreciationAreaFields[],
  ast_status: number,
}

export type AccrualJournalRunningFields = {
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

export const getPayload = (data: AssetFields) => {
  const integrationAssetEquipment = data.integration_asset_equipment?.map((iae) => ({
    ...iae,
    id_ast_master: data.id,
    syc_status: iae.syc_status ? 1 : 0,
    workflow_status: iae.workflow_status ? 1 : 0,
  }));

  const deprecationArea = data.deprecation_area?.map((da) => ({
    ...da,
    id_ast_master: data.id,
    ast_class: data.ast_class,
    company_code: data.company_code,
    depre_area: Number(da.depre_area),
    deactive_status: da.deactive_status ? 1 : 0,
  }));

  return {
    ...data,
    ast_purchasing: data.ast_purchasing ? '1' : '0',
    purchased_new: data.purchased_new ? '1' : '0',
    integration_asset_equipment: JSON.stringify(integrationAssetEquipment),
    deprecation_area: JSON.stringify(deprecationArea),
  };
};

export const FormAsset = (props: IForm<AssetFields>) => {
  const { form } = props;

  const service = useAssetCreate();
  const getDropdownDatasources = service.getDropdownDatasources();
  const datasources = getDropdownDatasources.data;

  const { setSearchDropdown, getSearchValue } = useSearchDropdown<AssetFields>();
  const queryMasterCompany = useQueryMasterCompany({
    query: { search: getSearchValue('company_code') },
  });
  const queryMasterCostCenter = useQueryMasterCostCenter({
    query: { search: getSearchValue('cost_center'), company_code: form.getValues('company_code') },
  });
  const queryMasterProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('profit_center'), company_code: form.getValues('company_code') },
  });
  const queryMasterLocation = useQueryMasterPlant({
    query: { search: getSearchValue('location'), company_code: form.getValues('company_code') },
  });
  const queryMasterPlant = useQueryMasterPlant({
    query: { search: getSearchValue('plant'), company_code: form.getValues('company_code') },
  });
  const queryMasterAssetClass = useQueryMasterAssetClass({
    query: { req: getSearchValue('ast_class') },
  });

  const fieldsGeneralData: IField<AssetFields>[] = [
    {
      id: 'ast_class',
      type: 'dropdown',
      label: 'Asset Class',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterAssetClass.data?.map((v) => ({ id: v.id_ast_class, value: `${v.id_ast_class} - ${v.name_ast_class}` })),
      validation: { required: '* required' },
    },
    { id: '', type: '' },
    {
      id: 'company_code',
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Type here..',
      validation: { required: '* required' },
    },
    {
      id: 'serial_number',
      type: 'text',
      label: 'Serial Number',
      placeholder: 'Type here..',
      validation: { required: '* required' },
    },
    {
      id: 'inv_number',
      type: 'text',
      label: 'Inventory Number',
      placeholder: 'Type here..',
      validation: { required: '* required' },
    },
    {
      id: 'quantity',
      type: 'number',
      label: 'Quantity',
      placeholder: 'e.g 10',
      validation: { required: '* required' },
    },
    {
      id: 'uom',
      type: 'dropdown',
      label: 'UoM',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.uom?.map((v) => ({ id: v.id_uom, value: v.name_uom })),
    },
  ];

  const fieldsInventory: IField<AssetFields>[] = [
    {
      id: 'last_inv',
      type: 'datepicker',
      label: 'Last Inventory On',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'inv_note',
      type: 'text',
      label: 'Last Inventory Note',
      placeholder: 'Type here..',
      validation: { required: '* required', maxLength: errorMaxLength(8) },
    },
  ];

  const fieldsPostingInformation: IField<AssetFields>[] = [
    {
      id: 'capitalized_on',
      type: 'datepicker',
      label: 'Capitalized On',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'deactivation_on',
      type: 'datepicker',
      label: 'Deactivation On',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
  ];

  const fieldsLocation: IField<AssetFields>[] = [
    {
      id: 'profit_center',
      type: 'dropdown',
      label: 'Profit Center',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterProfitCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'cost_center',
      type: 'dropdown',
      label: 'Cost Center',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCostCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'location',
      type: 'dropdown',
      label: 'Location',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterLocation.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'plant',
      type: 'dropdown',
      label: 'Plant',
      placeholder: 'Select',
      validation: { required: '* required' },
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPlant.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'room',
      type: 'text',
      label: 'Room',
      placeholder: 'Type here...',
      validation: { required: '* required' },
    },
  ];

  const fieldsAllocation: IField<AssetFields>[] = [
    {
      id: 'tax_ast',
      type: 'dropdown',
      label: 'Tax Group Asset',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.tax_asset?.map((v) => ({ id: v.tax_code, value: `${v.tax_code} - ${v.description}` })),
    },
    {
      id: 'eval_group2',
      type: 'text',
      label: 'Evaluation Group 2',
      placeholder: 'Type here...',
      validation: { required: '* required', maxLength: errorMaxLength(4) },
    },
    {
      id: 'ivt_reason',
      type: 'dropdown',
      label: 'Investment Reason',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.investment_reason?.map((v) => ({ id: v.reason_for_inve, value: `${v.reason_for_inve} - ${v.text}` })),
    },
    {
      id: 'eval_group3',
      type: 'text',
      label: 'Evaluation Group 3',
      placeholder: 'Type here...',
      validation: { required: '* required', maxLength: errorMaxLength(4) },
    },
    {
      id: 'ast_super_num',
      type: 'dropdown',
      label: 'Asset Super Number',
      validation: { required: '* required' },
      datasources: datasources?.ast_super_num?.map((v) => ({ id: v.id_ast_super_num, value: `${v.id_ast_super_num} - ${v.name_ast_super_number}` })),
    },
    {
      id: 'eval_group4',
      type: 'text',
      label: 'Evaluation Group 4',
      placeholder: 'Type here...',
      validation: { required: '* required', maxLength: errorMaxLength(4) },
    },
    { id: '', type: '' },
    {
      id: 'eval_group5',
      type: 'text',
      label: 'Evaluation Group 5',
      placeholder: 'Type here...',
      validation: { required: '* required', maxLength: errorMaxLength(4) },
    },
  ];

  const fieldsOrigin: IField<AssetFields>[] = [
    {
      id: 'vendor',
      type: 'dropdown',
      label: 'Vendor',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.vendor?.map((v) => ({ id: v.vendor, value: `${v.vendor} - ${v.name1}` })),
    },
    { id: '', type: '' },
    {
      id: 'manufacture',
      label: 'Manufacture',
      type: 'text',
      placeholder: 'Type here..',
      validation: { required: '* required' },
      flexWidth: 50,
    },
    {
      id: 'ast_purchasing',
      label: 'Asset Purchasing New',
      type: 'checkbox-horizontal-label',
      flexWidth: 25,
    },
    {
      id: 'purchased_new',
      label: 'Purchased New',
      type: 'checkbox-horizontal-label',
      flexWidth: 25,
    },
    {
      id: 'trading_partner',
      type: 'dropdown',
      label: 'Trading Partner',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.trading_partner?.map((v) => ({ id: v.id_trp, value: `${v.id_trp} - ${v.name_trp}` })),
    },
    {
      id: 'country',
      type: 'dropdown',
      label: 'Country of Origin',
      placeholder: 'Select',
      datasources: DS_COUNTRY_ORIGIN.map((v) => ({ id: v.id, value: v.name })),
      validation: { required: '* required' },
    },
    {
      id: 'type_name',
      type: 'text',
      label: 'Type Name',
      placeholder: 'Type here..',
      validation: { required: '* required' },
    },
    {
      id: 'origin_ast',
      type: 'dropdown',
      label: 'Original Asset',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.original_asset?.map((v) => ({ id: v.id_oat, value: `${v.id_oat} - ${v.name_oat}` })),
    },
    {
      id: 'origin_acquis',
      type: 'yearpicker',
      label: 'Original Acquis. Year',
      placeholder: 'YYYY',
      validation: { required: '* required' },
    },
    {
      id: 'origin_value',
      type: 'number',
      label: 'Original Value',
      placeholder: 'e.g. 1000',
      validation: { required: '* required' },
    },
    {
      id: 'inhouse_prod',
      type: 'number',
      label: 'In-House prod Perc.',
      placeholder: 'e.g 100',
      validation: { required: '* required' },
    },
    {
      id: 'acquistion_on',
      type: 'datepicker',
      label: 'Acq. On',
      placeholder: 'DD/MM/YYYY',
      validation: { required: '* required' },
    },
  ];

  const fieldsAccountInvesment: IField<AssetFields>[] = [
    {
      id: 'ivt_order',
      type: 'dropdown',
      label: 'Invesment Order',
      placeholder: 'Select',
      validation: { required: '* required' },
      datasources: datasources?.investment_order?.map((v) => ({ id: v.id_ivo, value: `${v.id_ivo} - ${v.name_ivo}` })),
    },
    { id: '', type: '' },
  ];

  return (
    <div className="w-full">
      <Accordion>
        <Accordion.Item key={2}>
          <Accordion.Header variant="blue">General Data</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsGeneralData}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Inventory</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsInventory}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Posting Information</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsPostingInformation}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Location</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsLocation}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Allocation</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsAllocation}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Integration of Asset and Equipment</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" gap="4px">
              <FormIntegrationAssetEquipment form={form} datasources={datasources} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Origin</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsOrigin}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Account Assignment for Invesment</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsAccountInvesment}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Depreciation Area</Accordion.Header>
          <Accordion.Body>
            <Row width="100%" gap="4px">
              <FormDepreciationArea form={form} datasources={datasources} />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <Divider dashed /> */}
      {/* <FormGLAccount form={form} /> */}
    </div>
  );
};
