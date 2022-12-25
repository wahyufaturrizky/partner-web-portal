/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import {
  Col, Row, Spacer, Text,
} from 'pink-lava-ui';
import { Button } from 'components/Button';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormBuilder, IField } from 'components/FormBuilder';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
import { If } from 'react-if';
import { useCarryForwardCommitmentBudget } from 'hooks/budget/useCarryForwardCommitmentBudget';
import { useBudget } from 'hooks/budget/useBudget';
import { message } from 'antd';
import { useQueryMasterCompany } from 'hooks/master-data/useMasterCompany';
import { useQueryMasterControllArea } from 'hooks/master-data/useMasterControllArea';
import { useQueryMasterOrderType } from 'hooks/master-data/useMasterOrderType';

type CarryForwardCommitmentBudgetFields = {
  ID: number,
  budget_from_id?: number,
  budget_to_id?: number,
  company_code: string,
  controll_area: string,
  order_type: string,
  order_number_from: string,
  order_number_to: string,
  year_from: string,
  year_to: string,
  state: string,
  type: string,
}

function CarryForwardCommitmentBudget() {
  const form = useForm<CarryForwardCommitmentBudgetFields>();
  const {
    handleSubmit, getValues, setValue, reset, watch,
  } = form;

  const [modals, setModals] = useState<IModals>();

  const serviceBudget = useBudget();
  const getBudgetCompany = serviceBudget.getBudgetCompany({
    query: {
      company_code: getValues('company_code'),
      controll_area: getValues('controll_area'),
      order_type: getValues('order_type'),
    },
  });

  const service = useCarryForwardCommitmentBudget();
  const getCarryForwardList = service.getList({
    onSuccess: (res) => {
      const { data } = res;
      if (res.data.length) reset(data[0]);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const createCarryForward = service.create({
    onSuccess: (res) => {
      if (res.status === 'error') throw new Error(res.message);
      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = '2 Order numbers has been successfully closed'; }

      setModals({
        alert: { open: true, title: alert.title, message: alert.message },
      });

      setCanEdit(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateCarryForward = service.update({
    id: getValues('ID'),
    onSuccess: (res) => {
      if (res.status === 'error') throw new Error(res.message);
      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = '2 Order numbers has been successfully closed'; }

      setModals({
        alert: { open: true, title: alert.title, message: alert.message },
      });

      setCanEdit(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});
  const doSave = (data) => (getValues('ID') ? updateCarryForward.mutate({ ...data, state: 'draft' }) : createCarryForward.mutate({ ...data, state: 'draft' }));
  const doSubmit = (data) => (getValues('ID') ? updateCarryForward.mutate({ ...data, state: 'submit' }) : createCarryForward.mutate({ ...data, state: 'submit' }));

  const resetDSBudget = () => {
    reset({
      budget_from_id: undefined,
      budget_to_id: undefined,
    });
  };

  const [searchDropdown, setSearchDropdown] = useState({ field: null, search: '' });

  const getSearchValue = (field: keyof CarryForwardCommitmentBudgetFields) => {
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

  const [canEdit, setCanEdit] = useState(true);
  const disableEdit = getValues('ID') !== null && !canEdit;
  const fields: IField<CarryForwardCommitmentBudgetFields>[] = [
    {
      id: 'company_code',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Company Code',
      placeholder: 'Select',
      onSearch: (search, field) => setSearchDropdown({ field, search }),
      datasources: queryMasterCompany.data?.map((v) => ({ id: v.id, value: `${v.id} - ${v.text}` })),
      disabled: disableEdit,
      onChange: () => {
        form.reset({
          ...form.getValues(),
          controll_area: undefined,
          order_type: undefined,
          budget_from_id: undefined,
          budget_to_id: undefined,
        });
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
      disabled: disableEdit,
      onChange: () => {
        form.reset({
          ...form.getValues(),
          order_type: undefined,
          budget_from_id: undefined,
          budget_to_id: undefined,
        });
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
      disabled: disableEdit,
      onChange: () => {
        form.reset({
          ...form.getValues(),
          budget_from_id: undefined,
          budget_to_id: undefined,
        });
      },
    },
    {
      id: '', type: '',
    },
    {
      id: 'budget_from_id',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Number From',
      placeholder: 'Select',
      isLoading: getBudgetCompany.isLoading,
      disabled: disableEdit,
      datasources: getBudgetCompany.data?.data?.map((v) => ({ id: v.ID, value: v.order_number })),
    },
    {
      id: 'budget_to_id',
      validation: { required: '* required' },
      type: 'dropdown',
      label: 'Order Number To',
      placeholder: 'Select',
      isLoading: getBudgetCompany.isLoading,
      disabled: disableEdit,
      datasources: getBudgetCompany.data?.data?.map((v) => ({ id: v.ID, value: v.order_number })),
    },
    {
      id: 'year_from',
      validation: { required: '* required' },
      type: 'yearpicker',
      label: 'Year From',
      placeholder: 'YYYY',
      disabled: disableEdit,
    },
    {
      id: 'year_to',
      validation: { required: '* required' },
      type: 'yearpicker',
      label: 'Year To',
      placeholder: 'YYYY',
      disabled: disableEdit,
    },
  ];

  if (getCarryForwardList.isFetching) {
    return <FormSkeleton />;
  }

  const isLoading = createCarryForward.isLoading || updateCarryForward.isLoading;
  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Carry Forward Commitment Budget</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                <If condition={disableEdit}>
                  <Button
                    size="big"
                    variant="secondary"
                    onClick={() => setCanEdit(true)}
                  >
                    Edit
                  </Button>
                </If>
                <If condition={!disableEdit}>
                  <Button
                    size="big"
                    variant="secondary"
                    onClick={handleSubmit(doSave, closeModals)}
                  >
                    {isLoading ? 'Loading...' : 'Save'}
                  </Button>
                </If>
                <Button
                  size="big"
                  variant="primary"
                  onClick={() => setModals({
                    ...modals,
                    confirmation: {
                      open: true, title: 'Confirm Submit', message: 'Are you sure want to Submit Carry Forward Commitment Budget ?', onOk: handleSubmit(doSubmit, closeModals),
                    },
                  })}
                  disabled={disableEdit}
                >
                  {isLoading ? 'Loading...' : 'Submit'}
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

export default CarryForwardCommitmentBudget;
