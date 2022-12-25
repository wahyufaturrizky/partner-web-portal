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
import { message } from 'antd';
import moment from 'moment';
import { useDownPayment } from 'hooks/account-payable/useDownPayment';
import { DownPaymentFields, FormDownPayment, getPayload } from './form';

function CreateDownPayment() {
  const form = useForm<DownPaymentFields>();
  const {
    handleSubmit, setValue,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useDownPayment();

  service.getDocumentNumber({
    onSuccess: (res) => {
      if (res.status !== 'success') throw new Error(res.data.message);

      setValue('doc_number', res.data.number);
    },
    onError: (err) => {
      message.error(err?.message);
    },
    query: {
      company_code: form.getValues('company_code'),
      doc_type: form.getValues('doc_type'),
      year: parseInt(moment().format('YYYY'), 10),
    },
  });
  const createDownPayment = service.create({
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
  const doSubmit = (data) => createDownPayment.mutate(getPayload({ ...data, status: 2 }));
  const doSave = (data) => createDownPayment.mutate(getPayload({ ...data, status: 1 }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create Down Payment</Text>
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
                      onOk: () => Router.push('/account-receivable/down-payment'),
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
                  {createDownPayment.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createDownPayment.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormDownPayment form={form} />
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
            Router.push('/account-receivable/down-payment');
          }}
        />
      )}
    </>
  );
}

export default CreateDownPayment;
