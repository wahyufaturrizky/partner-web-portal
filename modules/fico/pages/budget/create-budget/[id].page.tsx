/* eslint-disable no-console */
/* eslint-disable camelcase */
import Router, { useRouter } from 'next/router';
import {
  Col, Row, Spacer, Text,
} from 'pink-lava-ui';
import { Button } from 'components/Button';
import React, { useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
import { Card } from 'components/Card';
import { useBudget } from 'hooks/budget/useBudget';
import { message } from 'antd';
import moment from 'moment';
import { StatusBadge } from 'components/StatusBadge';
import { STATUS_ORDER_VARIANT } from 'utils/utils';
import { BudgetFields, FormBudget, getPayload } from './form';

function CreateBudget() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<BudgetFields>();
  const { handleSubmit, reset } = form;

  const [modals, setModals] = useState<IModals>();

  const service = useBudget();
  const getBudgetByID = service.getByID({
    id,
    onSuccess: (res) => {
      reset({
        ...res.data,
        app_date: moment(res.data.app_date),
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateBudget = service.update({
    id,
    onSuccess: (res) => {
      if (res.status === 'error') throw new Error(res.message);
      const alert = { title: 'Save Success', message: `Order number ${res.data.order_number} has been successfully saved` };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = `Order number ${res.data.order_number} has been successfully submitted`; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});
  const doSubmit = (data) => updateBudget.mutate(getPayload({ ...data, state: 'Released' }));
  const doSave = (data) => updateBudget.mutate(getPayload({ ...data, state: 'Created' }));

  if (getBudgetByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/budget/create-budget')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Order Number ${getBudgetByID.data?.data?.order_number}`}</Text>
        </Row>

        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center">
            <Row>
              {form.getValues('order_status') && (
              <StatusBadge
                variant={STATUS_ORDER_VARIANT[form.getValues('order_status').toUpperCase()]}
                value={form.getValues('order_status')}
              />
              )}
            </Row>
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => setModals({
                    confirmation: {
                      open: true,
                      title: 'Confirm Cancel',
                      message: 'Are you sure want to cancel ? Change you made so far will not be saved',
                      onOk: () => Router.push('/budget/create-budget'),
                    },
                  })}
                >
                  Cancel
                </Button>
                <Button size="big" variant="secondary" onClick={handleSubmit((data) => doSave(data))}>
                  {updateBudget.isLoading ? 'Loading...' : 'Save As Draft'}
                </Button>
                <Button
                  size="big"
                  variant="primary"
                  onClick={handleSubmit((data) => setModals({
                    ...modals,
                    confirmation: {
                      open: true, title: 'Confirmation Submit', message: 'Are you sure want to submit ?', onOk: () => doSubmit(data),
                    },
                  }))}
                >
                  {updateBudget.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <FormBudget form={form} type="update" />
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
        title={modals.alert.title}
        variant={modals.alert.variant}
        message={modals.alert.message}
        visible={modals.alert.open}
        onOk={() => { closeModals(); Router.push('/budget/create-budget'); }}
      />
      )}
    </>
  );
}

export default CreateBudget;
