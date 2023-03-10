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
import { useRouterPath } from 'hooks/helper/useRouterPath/useRouterPath';
import { useAdjustmentAssetValue } from 'hooks/asset/useAdjustmentAssetValue';
import { message } from 'antd';
import { FormAdjustmentAssetValue, AdjustmentAssetValueFields, getPayload } from './form';

function CreateAssetDisposal() {
  const form = useForm<AdjustmentAssetValueFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<IModals>();

  useEffect(() => {
    form.setValue('doc_type', 'AA');
  }, []);

  const service = useAdjustmentAssetValue();
  const getDocumentNumber = service.getDocumentNumber({
    onSuccess: (res) => {
      if (res.status !== 'success') throw new Error(res.message);

      form.setValue('doc_number', res.data);
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const createAdjustmentAssetValue = service.create({
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: 'Document number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Document number has been successfully submitted'; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: (err) => {
      message.error(err.message);
      getDocumentNumber.refetch();
    },
  });

  const closeModals = () => setModals({});

  const doSubmit = (data) => createAdjustmentAssetValue.mutate(getPayload({ ...data, status: 1 }));
  const doSave = (data) => createAdjustmentAssetValue.mutate(getPayload({ ...data, status: 0 }));

  const { rootMenuPath } = useRouterPath();
  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create Asset Adjustment</Text>
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
                      onOk: () => Router.push(rootMenuPath),
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
                  {createAdjustmentAssetValue.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createAdjustmentAssetValue.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAdjustmentAssetValue form={form} />
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
            Router.push(rootMenuPath);
          }}
        />
      )}
    </>
  );
}

export default CreateAssetDisposal;
