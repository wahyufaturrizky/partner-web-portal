/* eslint-disable no-console */
/* eslint-disable no-alert */
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
import { Card } from 'components/Card';
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import { useSupplementReturnBudget } from 'hooks/budget/useSupplementOrReturnBudget';
import { message } from 'antd';
import { StatusBadge } from 'components/StatusBadge';
import { STATUS_VARIANT } from 'utils/utils';
import { FormSupplementOrReturnBudget, getPayload, SupplementOrReturnBudgetFields } from './form';

function SupplementOrReturnBudget() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<SupplementOrReturnBudgetFields>();
  const {
    handleSubmit, getValues, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useSupplementReturnBudget();
  const getSupplementReturnByID = service.getByID({
    id,
    onSuccess: (res) => {
      reset({ ...res?.data });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateSupplementReturn = service.update({
    id,
    onSuccess: (res) => {
      if (res.status === 'error') throw new Error(res.message);
      const alert = { title: 'Save Success', message: `Internal Order Number ${res.data.order_number} has been successfully saved` };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = `Internal Order Number ${res.data.order_number} has been successfully submitted`; }

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
  const doSubmit = (data) => updateSupplementReturn.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => updateSupplementReturn.mutate(getPayload({ ...data, state: 'draft' }));

  if (getSupplementReturnByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/budget/supplement-or-return-budget')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Internal Order Number ${getValues('order_number') || 'Loading..'}`}</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center">
            <Row>
              {form.getValues('state') && (
              <StatusBadge
                variant={STATUS_VARIANT[form.getValues('state').toUpperCase()]}
                value={form.getValues('state')}
              />
              )}
            </Row>
            <Row>
              <Row gap="16px">
                <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => setModals({
                    ...modals,
                    confirmation: {
                      open: true, title: 'Confirm Cancel', message: 'Are you sure want to cancel ? Change you made so far will not be saved', onOk: () => Router.push('/budget/supplement-or-return-budget'),
                    },
                  })}
                >
                  Cancel
                </Button>
                <Button
                  size="big"
                  variant="secondary"
                  onClick={handleSubmit(doSave)}
                >
                  {updateSupplementReturn.isLoading ? 'Loading...' : 'Save as Draft'}
                </Button>
                <Button
                  size="big"
                  variant="primary"
                  onClick={() => setModals({
                    ...modals,
                    confirmation: {
                      open: true, title: 'Confirm Submit', message: 'Are you sure want to submit ?', onOk: handleSubmit(doSubmit, closeModals),
                    },
                  })}
                >
                  {updateSupplementReturn.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormSupplementOrReturnBudget form={form} type="update" />
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
          onOk={() => {
            closeModals();
            Router.push('/budget/supplement-or-return-budget');
          }}
        />
      )}
    </>
  );
}

export default SupplementOrReturnBudget;
