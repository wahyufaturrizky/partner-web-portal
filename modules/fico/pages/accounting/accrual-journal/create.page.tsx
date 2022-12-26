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
import { useAccrualJournal } from 'hooks/accounting/useAccrualJournal';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';
import { message } from 'antd';
import moment from 'moment';
import { FormAccrualJournal, AccrualJournalFields, getPayload } from './form';

function AccrualJournal() {
  const form = useForm<AccrualJournalFields>();
  const { handleSubmit, setValue } = form;
  const [modals, setModals] = useState<IModals>();

  useEffect(() => {
    setValue('company_code', 'PP01');
    setValue('document_type', 'AA');
  }, []);

  const serviceGeneralJournal = useGeneralJournal();
  const getDocumentNumber = serviceGeneralJournal.getDocumentNumber({
    onSuccess: (res) => {
      if (res.status !== 'success') throw new Error(res.data.message);

      setValue('document_number', res.data.number);
    },
    onError: (err) => {
      message.error(err?.message);
    },
    query: {
      company_code: form.getValues('company_code'),
      doc_type: form.getValues('document_type'),
      year: parseInt(moment().format('YYYY'), 10),
    },
  });

  const service = useAccrualJournal();

  const createAccrualJournal = service.create({
    onSuccess: (res) => {
      if (res.status !== 'success') throw new Error(res.message);

      const alert = { title: 'Save Success', message: `Document number ${res.data.document_number} has been successfully saved` };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = `Document number ${res.data.document_number} has been successfully submitted`; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: (err) => {
      getDocumentNumber.refetch();
      message.error(err?.message);
    },
  });

  const closeModals = () => setModals({});
  const doSubmit = (data) => createAccrualJournal.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => createAccrualJournal.mutate(getPayload({ ...data, state: 'draft' }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create Accrual Journal</Text>
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
                      onOk: () => Router.push('/accounting/accrual-journal'),
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
                  {createAccrualJournal.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createAccrualJournal.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAccrualJournal form={form} />
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
            Router.push('/accounting/accrual-journal');
          }}
        />
      )}
    </>
  );
}

export default AccrualJournal;
