import {
  Accordion, Row,
} from 'pink-lava-ui';
import { FormBuilder, IField } from 'components/FormBuilder';
import { Card } from 'components/Card';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useEffect, useState } from 'react';
import { useQueryMasterControllArea } from 'hooks/master-data/useMasterControllArea';
import { useQueryMasterOrderType } from 'hooks/master-data/useMasterOrderType';
import { useQueryMasterObjectClass } from 'hooks/master-data/useMasterObjectClass';
import { useQueryMasterCostCenter } from 'hooks/master-data/useMasterCostCenter';
import { useQueryMasterProfitCenter } from 'hooks/master-data/useMasterProfitCenter';
import { useQueryMasterPlant } from 'hooks/master-data/useMasterPlant';
import { useQueryMasterOrderCategory } from 'hooks/master-data/useMasterOrderCategory';
import { useQueryMasterOverheadKey } from 'hooks/master-data/useMasterOverheadKey';
import { useQueryMasterInterestProfile } from 'hooks/master-data/useMasterInterestProfile';
import { useQueryMasterProcessingGroup } from 'hooks/master-data/useMasterProcessingGroup';
import { DS_ASSET_CLASS, DS_CURRENCY } from 'constants/datasources';
import { IForm } from 'interfaces/interfaces';
import moment from 'moment';
import { errorMaxLength } from 'constants/errorMsg';
import { normalisedPayload } from 'lib/normalisedPayload';

export type BudgetFields = {
  order_number?: number;
  company_code: string;
  controll_area: string;
  order_type: string;
  description: string;
  object_class: string;
  profit_center: string;
  responsible_cc: string;
  requester_cc: string;
  plant: string;
  order_status: string;
  order_category: string;
  overhead_key: string;
  interest_profil: string;
  applicant: string;
  telephone: string;
  person_responsib: string;
  app_date: string;
  department: string;
  work_start: string;
  work_end: string;
  processing_grp: string;
  asset_class: string;
  capital_date: string;
  ammount: number;
  currency: string;
  year: string;
  state: string;
  estimated_cost: number;
  mobile_phone: string;
};

export const getPayload = (data: BudgetFields) => {
  // eslint-disable-next-line no-param-reassign
  delete data.order_number;

  const payload = normalisedPayload(data, ['ID', 'created_at', 'created_by', 'deleted_at', 'updated_at', 'updated_by', 'value_order_id', 'general_ord_id', 'type']);

  return {
    ...payload,
    ammount: payload.ammount,
    app_date: moment(payload.app_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    estimated_cost: Number(payload.estimated_cost),
    order_status: payload.state,
  };
};

export const FormBudget = (props: IForm<BudgetFields>) => {
  const { form, type } = props;
  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  useEffect(() => {
    // Default Value
    if (type === 'create') {
      form.setValue('object_class', 'INVST');
      // form.setValue('order_status', 'Released');
      form.setValue('currency', 'IDR');
      form.setValue('order_category', '01');
    }
  }, []);

  const getSearchValue = (field: keyof BudgetFields) => {
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
  const queryMasterObjectClass = useQueryMasterObjectClass({
    query: { search: getSearchValue('object_class') },
  });
  const queryMasterResponsibleCC = useQueryMasterCostCenter({
    query: { search: getSearchValue('responsible_cc'), company_code: form.getValues('company_code') },
  });
  const queryMasterRequesterCC = useQueryMasterCostCenter({
    query: { search: getSearchValue('requester_cc'), company_code: form.getValues('company_code') },
  });
  const queryMasterProfitCenter = useQueryMasterProfitCenter({
    query: { search: getSearchValue('profit_center'), company_code: form.getValues('company_code') },
  });
  const queryMasterPlant = useQueryMasterPlant({
    query: { search: getSearchValue('plant'), controll_area: form.getValues('controll_area'), company_code: form.getValues('company_code') },
  });
  const queryMasterOrderCategory = useQueryMasterOrderCategory({
    query: { search: getSearchValue('order_category') },
  });
  const queryMasterOverheadKey = useQueryMasterOverheadKey({
    query: { search: getSearchValue('overhead_key') },
  });
  const queryMasterInterestProfile = useQueryMasterInterestProfile({
    query: { search: getSearchValue('interest_profil') },
  });
  const queryMasterProcessingGroup = useQueryMasterProcessingGroup({
    query: { search: getSearchValue('processing_grp'), controll_area: form.getValues('controll_area') },
  });

  const fields: IField<BudgetFields>[] = [
    {
      id: 'company_code',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      onChange: () => {
        form.setValue('controll_area', '');
        form.setValue('responsible_cc', '');
        form.setValue('requester_cc', '');
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
        form.setValue('plant', '');
        form.setValue('profit_center', '');
        form.setValue('processing_grp', '');
      },
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'order_type',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Type',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterOrderType.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: '', type: '',
    },
    {
      id: 'order_number',
      type: 'text',
      label: 'Order Number',
      disabled: true,
    },
    {
      id: 'description',
      validation: { required: '* required' },
      type: 'text',
      label: 'Description',
      placeholder: 'e.g Testing Asset',
    },
  ];

  const fieldsAssignment: IField<BudgetFields>[] = [
    {
      id: 'object_class',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Object Class',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterObjectClass.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    { id: '', type: '' },
    {
      id: 'responsible_cc',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Responsible Cost Center',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterResponsibleCC.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'requester_cc',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Requester Cost Center',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterRequesterCC.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('company_code'),
    },
    {
      id: 'profit_center',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Profit Center',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterProfitCenter.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('controll_area'),
    },
    {
      id: 'plant',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Plant',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterPlant.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('controll_area'),
    },
  ];

  const fieldsControlData: IField<BudgetFields>[] = [
    // {
    //   id: 'order_status',
    //   validation: { required: '* required' },
    //   type: 'dropdown',
    //   label: 'Order Status',
    //   placeholder: 'Select',
    //   datasources: DS_ORDER_STATUS?.map((v) => ({ id: v.id, value: v.name })),
    // },
    // {
    //   id: '', type: '',
    // },
    {
      id: 'currency',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Currency',
      placeholder: 'Select',
      datasources: DS_CURRENCY?.map((v) => ({ id: v.name, value: v.name })),
    },
    {
      id: 'ammount',
      validation: { required: '* required', maxLength: errorMaxLength(15) },
      type: 'currency',
      label: 'Amount',
      placeholder: 'e.g 10.000.000',
    },
    {
      id: 'order_category',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Category',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterOrderCategory.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'year',
      validation: { required: '* required' },
      type: 'yearpicker',
      label: 'Year',
      placeholder: 'YYYY',
    },
  ];

  const fieldsPRDEndClosing: IField<BudgetFields>[] = [
    {
      id: 'overhead_key',
      type: 'dropdown',
      label: 'Overhead Key',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterOverheadKey.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
    {
      id: 'interest_profil',
      type: 'dropdown',
      label: 'Interest Profile',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterInterestProfile.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
    },
  ];

  const fieldsGeneralData: IField<BudgetFields>[] = [
    {
      id: 'applicant',
      type: 'text',
      label: 'Applicant',
      placeholder: 'e.g Testing',
    },
    {
      id: 'app_date',
      type: 'datepicker',
      label: 'Application Date',
      placeholder: 'DD/MM/YYYY',
      disabled: true,
    },
    {
      id: 'telephone',
      type: 'telephone',
      label: 'Telephone',
      placeholder: 'e.g 022 123 456',
    },
    {
      id: 'department',
      type: 'text',
      label: 'Department',
      placeholder: 'e.g Finance',
    },
    {
      id: 'person_responsib',
      type: 'text',
      label: 'Person Responsible',
      placeholder: 'e.g Gwen Stacy',
    },
    {
      id: 'work_start',
      type: 'datepicker',
      label: 'Work Start',
      placeholder: 'DD/MM/YYYY',
    },
    {
      id: 'mobile_phone',
      type: 'mobilephone',
      label: 'Mobile Phone',
      placeholder: 'eg 0852 1234 5678',
    },
    {
      id: 'work_end',
      type: 'datepicker',
      label: 'Work End',
      placeholder: 'DD/MM/YYYY',
    },
    {
      id: 'estimated_cost',
      validation: { maxLength: errorMaxLength(15) },
      type: 'currency',
      label: 'Estimated Cost',
      placeholder: 'e.g 10.000.000',
    },
    {
      id: 'processing_grp',
      type: 'dropdown',
      label: 'Processing Group',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterProcessingGroup.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: !form.getValues('controll_area'),
    },
  ];

  const fieldsInvestment: IField<BudgetFields>[] = [
    {
      id: 'asset_class',
      type: 'dropdown',
      label: 'Asset Class',
      placeholder: 'Select',
      datasources: DS_ASSET_CLASS?.map((v) => ({ id: v.id, value: v.name })),
    },
    {
      id: 'capital_date',
      type: 'datepicker',
      label: 'Capitalization Date',
      placeholder: 'DD/MM/YYYY',
    },
  ];

  return (
    <>
      <Card padding="20px">
        <Row width="100%">
          <FormBuilder
            fields={fields}
            column={2}
            useForm={form}
          />
        </Row>
      </Card>

      <Accordion>
        <Accordion.Item key={1} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Assignment</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsAssignment}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={2} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Control Data</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsControlData}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion className="lg:max-h-[200px]">
        <Accordion.Item key={3} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">PRD-End Closing</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsPRDEndClosing}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item key={4} style={{ marginTop: '10px' }}>
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
        <Accordion.Item key={5} style={{ marginTop: '20px' }}>
          <Accordion.Header variant="blue">Investment</Accordion.Header>
          <Accordion.Body>
            <Row width="100%">
              <FormBuilder
                fields={fieldsInvestment}
                column={2}
                useForm={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
