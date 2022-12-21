/* eslint-disable no-console */
/* eslint-disable no-alert */
import {
  Button, Card, Col, message, ModalAlert, ModalConfirmation, Row, Spacer, Text,
} from 'components/pink-lava-ui';
import { useMasterGLAccount } from 'hooks/mdm/master-data/use-gl-account';
import Router from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'types/modal';
import { FormMasterGLAccount, MasterGLAccountFields, getPayload } from './form';

function CreateMasterGLAccount() {
  const menuTitle = 'G/L Account';
  const form = useForm<MasterGLAccountFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<Modal>();

  const service = useMasterGLAccount();

  const createGLAccount = service.create({
    onSuccess: () => {
      const alert = { title: 'Save Success', message: `${menuTitle} has been successfully created` };

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

  const doSubmit = (data) => createGLAccount.mutate(getPayload({ ...data }));

  return (
    <>
      <Col>
        <Spacer size={20} />
        <Row gap="4px">
          <Text variant="h4">{`Create ${menuTitle}`}</Text>
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
                      onOk: () => Router.back(),
                    },
                  })}
                >
                  Cancel
                </Button>
                {/* <Button
                  size="big"
                  variant="secondary"
                  onClick={handleSubmit(doSave)}
                >
                  {createVendorInvoice.isLoading ? 'Loading...' : 'Save as Draft'}
                </Button> */}
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
                  {createGLAccount.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormMasterGLAccount form={form} type="create" />
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
            Router.back();
          }}
        />
      )}
    </>
  );
}

export default CreateMasterGLAccount;
