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
import { useDownPayment } from 'hooks/account-receivable/useDownPayment';
import { message } from 'antd';
import moment from 'moment';
import { FormGeneralJournal, DownPaymentFields } from './form';

function GeneralJournal() {
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
  const createGeneralJournal = service.create({
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
  const getPayload = (data: DownPaymentFields) => ({
    ...data,
    doc_number: Number(data.doc_number),
    taxreporting_date: moment(data.taxreporting_date).format('YYYY-MM-DD'),
    translation_date: moment(data.translation_date).format('YYYY-MM-DD'),
    posting_date: moment(data.posting_date).format('YYYY-MM-DD'),
    period: Number(data.period),
    outlet_id: Number(data.outlet_id),
    gl_id: Number(data.gl_id),
    doc_date: moment(data.doc_date).format('YYYY-MM-DD'),
  });
  const doSubmit = (data) => createGeneralJournal.mutate(getPayload({ ...data, status: 2 }));
  const doSave = (data) => createGeneralJournal.mutate(getPayload({ ...data, status: 1 }));

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
                  {createGeneralJournal.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createGeneralJournal.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormGeneralJournal form={form} />
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

export default GeneralJournal;
