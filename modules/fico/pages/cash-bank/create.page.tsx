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
import { message } from 'antd';
import { useCashBank } from 'hooks/cash-bank/useCashBank';
import { useGeneralJournal } from 'hooks/accounting/useGeneralJournal';
import { FormCashBank, CashBankFields, getPayload } from './form';

function CreateCashBank() {
  const form = useForm<CashBankFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useCashBank();
  const createCashBank = service.create({
    onSuccess: (res) => {
      if (res.status === 'error') throw Error(res.message);
      const alert = { title: 'Save Success', message: 'Document number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Document number has been successfully submitted'; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: (err) => {
      refetchDocNumber();
      message.error(err?.message);
    },
  });

  const { getDocumentNumber } = useGeneralJournal();
  const { refetch: refetchDocNumber } = getDocumentNumber({
    onSuccess: (res) => {
      if (!res.success) throw new Error(res.message);

      form.setValue('document_number', res.number);
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const closeModals = () => setModals({});

  const doSubmit = (data) => createCashBank.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => createCashBank.mutate(getPayload({ ...data, state: 'draft' }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Add New Cash Bank</Text>
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
                      onOk: () => Router.push('/cash-bank'),
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
                  {createCashBank.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createCashBank.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormCashBank form={form} />
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
            Router.push('/cash-bank');
          }}
        />
      )}
    </>
  );
}

export default CreateCashBank;
