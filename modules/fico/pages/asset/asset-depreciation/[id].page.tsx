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
import { useAssetDepreciation } from 'hooks/asset/useAssetDepreciation';
import { message } from 'antd';
import { FormAssetDepreciation, AssetDepreciationFields } from './form';

function EditAssetDepreciation() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<AssetDepreciationFields>();
  const {
    handleSubmit, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useAssetDepreciation();
  const getAssetDepreciationByID = service.getByID({
    id,
    onSuccess: (res) => {
      reset({ ...res?.data, budget_id: Number(id), orders: res?.orders });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateAssetDepreciation = service.update({
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
  const getPayload = (data: AssetDepreciationFields) => ({
    ...data,
  });
  const doSubmit = (data) => updateAssetDepreciation.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => updateAssetDepreciation.mutate(getPayload({ ...data, state: 'draft' }));

  if (getAssetDepreciationByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/asset/asset-create')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`ID ${id || 'Loading..'}`}</Text>
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
                      onOk: () => Router.push('/asset/asset-create'),
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
                  {updateAssetDepreciation.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateAssetDepreciation.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAssetDepreciation form={form} type="update" />
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
            Router.push('/asset/asset-create');
          }}
        />
      )}
    </>
  );
}

export default EditAssetDepreciation;
