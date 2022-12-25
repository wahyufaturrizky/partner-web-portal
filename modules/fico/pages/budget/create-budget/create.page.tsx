/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import Router from 'next/router';
import {
  Col, Row, Spacer, Text,
} from 'pink-lava-ui';
import { Button } from 'components/Button';
import React, { useEffect, useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import moment from 'moment';
import { useBudget } from 'hooks/budget/useBudget';
import { message } from 'antd';
import { BudgetFields, FormBudget, getPayload } from './form';

function CreateBudget() {
  const form = useForm<BudgetFields>();
  const { handleSubmit, setValue } = form;

  const [modals, setModals] = useState<IModals>();

  const service = useBudget();
  const createBudget = service.create({
    onSuccess: (res) => {
      if (res.status === 'error') throw new Error(res.message);
      const alert = { title: 'Save Success', message: `Order number ${res.data.order_number} has been successfully saved` };
      if (res.state === 'submit') { alert.title = 'Submit Success'; alert.message = `Order number${res.data.order_number} has been successfully submitted`; }

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
  const doSubmit = (data) => createBudget.mutate(getPayload({ ...data, state: 'Released' }));
  const doSave = (data) => createBudget.mutate(getPayload({ ...data, state: 'Created' }));

  useEffect(() => {
    setValue('app_date', moment().format('DD/MM/YYYY'));
  }, []);

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create New Budget</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
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
                  {createBudget.isLoading ? 'Loading...' : 'Save As Draft'}
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
                  {createBudget.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />

        <FormBudget form={form} type="create" />
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
