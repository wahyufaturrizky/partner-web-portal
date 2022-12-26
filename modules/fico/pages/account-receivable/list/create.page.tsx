/* eslint-disable no-console */
/* eslint-disable no-alert */
import Router, { useRouter } from 'next/router';
import {
  Button, Col, Row, Spacer, Text,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { useARList } from 'hooks/account-receivable/useARList';
import { message } from 'antd';
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
import { FormAccountReceivable, IAccountReceivable } from './form';

function CreateAR() {
  const router = useRouter();
  const { id } = router.query;
  const form = useForm<IAccountReceivable>();
  const { handleSubmit, reset } = form;
  const [modals, setModals] = useState<IModals>();
  console.log('test');

  const service = useARList();
  const getAR = service.getByID({
    id,
    onSuccess: (res) => {
      reset(res?.data.items);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const createAR = service.create({
    id,
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Order number has been successfully submitted'; }

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
  const getPayload = (data: IAccountReceivable) => ({
    ...data,
  });
  const doSubmit = (data) => createAR.mutate(getPayload({ ...data, status: 2 }));
  const doSave = (data) => createAR.mutate(getPayload({ ...data, status: 1 }));

  if (getAR.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Input Account Receivable</Text>
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
                      onOk: () => Router.push('/account-receivable/list'),
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
                  {createAR.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createAR.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAccountReceivable form={form} />
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
            Router.push('/asset/asset-disposal');
          }}
        />
      )}
    </>
  );
}

export default CreateAR;
