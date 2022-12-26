/* eslint-disable no-console */
/* eslint-disable no-alert */
import Router from 'next/router';
import {
  Button, Col, Row, Spacer, Text,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { useGiro } from 'hooks/account-receivable/useGiro';
import { message } from 'antd';
import moment from 'moment';
import { FormCreateCekGiro, CreateCekGiroFields } from './form';

function CreateCekGiro() {
  const form = useForm<CreateCekGiroFields>();
  const {
    handleSubmit,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useGiro();
  const createCreateCekGiro = service.create({
    onSuccess: (res) => {
      if (res.status === 'error') throw new Error(res.message);

      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Order number has been successfully submitted'; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const closeModals = () => setModals({});
  const getPayload = (data: CreateCekGiroFields) => ({
    ...data,
    giro_number: Number(data.giro_number),
    giro_date: moment(data.giro_date).format('YYYY-MM-DD'),
    due_date: moment(data.due_date).format('YYYY-MM-DD'),
    cash_date: moment(data.cash_date).format('YYYY-MM-DD'),
  });
  const doSubmit = (data) => createCreateCekGiro.mutate(getPayload({ ...data, status: 2 }));
  const doSave = (data) => createCreateCekGiro.mutate(getPayload({ ...data, status: 1 }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Add New Cek / Giro</Text>
        </Row>
        <Spacer size={20} />
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
                      onOk: () => Router.push('/account-receivable/giro'),
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
                  {createCreateCekGiro.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createCreateCekGiro.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormCreateCekGiro form={form} />
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
            Router.push('/account-receivable/giro');
          }}
        />
      )}
    </>
  );
}

export default CreateCekGiro;
