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
import { useAssetMutation } from 'hooks/asset/useAssetMutation';
import { message } from 'antd';
import { FormAssetMutation, AssetMutationFields, getPayload } from './form';

function CreatePostAccountingVerification() {
  const form = useForm<AssetMutationFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useAssetMutation();
  const createAssetMutation = service.create({
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

  const doSubmit = (data) => createAssetMutation.mutate(getPayload({ ...data, status: 1 }));
  const doSave = (data) => createAssetMutation.mutate(getPayload({ ...data, status: 0 }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create Asset Mutation</Text>
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
                      onOk: () => Router.push('/account-payable/post-accounting-verification'),
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
                  {createAssetMutation.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createAssetMutation.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAssetMutation form={form} />
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
            Router.push('/account-payable/post-accounting-verification');
          }}
        />
      )}
    </>
  );
}

export default CreatePostAccountingVerification;
