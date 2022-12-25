/* eslint-disable no-console */
/* eslint-disable no-alert */
import Router from 'next/router';
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
import { useReversalJournal } from 'hooks/accounting/useReversalJournal';
import { message } from 'antd';
import { FormReversalJournal, getPayload, ReversalJournalFields } from './form';

function GeneralJournal() {
  const form = useForm<ReversalJournalFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useReversalJournal();

  const createReversalJournal = service.create({
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: `Document number ${res.data.document_number} has been successfully saved` };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = `Document number has ${res.data.document_number} been successfully submitted`; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: () => {
      message.error('No data received when do test run parameter');
    },
  });

  const closeModals = () => setModals({});
  const doSubmit = (data) => createReversalJournal.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => createReversalJournal.mutate(getPayload({ ...data, state: 'draft' }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create Reversal Journal</Text>
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
                      onOk: () => Router.push('/accounting/reversal-journal'),
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
                  {createReversalJournal.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createReversalJournal.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormReversalJournal form={form} doSubmitTestRun={handleSubmit(doSubmit)} />
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
            Router.push('/accounting/reversal-journal');
          }}
        />
      )}
    </>
  );
}

export default GeneralJournal;
