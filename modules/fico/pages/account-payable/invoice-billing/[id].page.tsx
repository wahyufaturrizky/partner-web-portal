import Router, { useRouter } from 'next/router';
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
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import { useAssetMutation } from 'hooks/asset/useAssetMutation';
import { message } from 'antd';
import { omit } from 'lodash';
import { FormAssetMutation, AssetMutationFields, getPayload } from './form';

function EditAssetMutation() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<AssetMutationFields>();
  const {
    handleSubmit, getValues, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useAssetMutation();
  const getAssetMutationByID = service.getByID({
    id,
    onSuccess: (res) => {
      const data = omit(res?.data, ['created_at', 'modified_at', 'created_by', 'modified_by', 'deleted_at', 'deleted_by']);

      reset(data);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateAssetMutation = service.update({
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
    },
  });

  const closeModals = () => setModals({});
  const doSubmit = (data) => updateAssetMutation.mutate(getPayload({ ...data, status: 1 }));
  const doSave = (data) => updateAssetMutation.mutate(getPayload({ ...data, status: 0 }));

  if (getAssetMutationByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/account-payable/invoice-billing')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Document Number ${getValues('doc_number') || 'Loading..'}`}</Text>
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
                      onOk: () => Router.push('/account-payable/invoice-billing'),
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
                  {updateAssetMutation.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateAssetMutation.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAssetMutation form={form} type="update" />
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
            Router.push('/account-payable/invoice-billing');
          }}
        />
      )}
    </>
  );
}

export default EditAssetMutation;
