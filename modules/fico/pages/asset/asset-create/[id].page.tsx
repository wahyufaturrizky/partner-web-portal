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
import { useAssetCreate } from 'hooks/asset/useAssetCreate';
import { message } from 'antd';
import { FormAsset, AssetFields, getPayload } from './form';

function AssetCreate() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<AssetFields>();
  const {
    handleSubmit, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useAssetCreate();
  const getAssetCreateByID = service.getByID({
    id,
    onSuccess: (res) => {
      reset({
        ...res?.data,
        integration_asset_equipment: res?.data?.ast_equip_intg?.map((v) => ({
          ...v, syc_status: v.syc_status === 1, workflow_status: v.workflow_status === 1, idx: v.id,
        })) || [],
        deprecation_area: res?.data?.ast_depre?.map((v) => ({ ...v, deactive_status: v.deactive_status === 1, idx: v.id })) || [],
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateAssetCreate = service.update({
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: 'Document number has been successfully saved' };
      if (res.data.ast_status === 1) { alert.title = 'Submit Success'; alert.message = 'Document number has been successfully submitted'; }

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
  const doSubmit = (data) => updateAssetCreate.mutate(getPayload({ ...data, ast_status: 1 }));
  const doSave = (data) => updateAssetCreate.mutate(getPayload({ ...data, ast_status: 0 }));

  if (getAssetCreateByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/asset/asset-create')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Document Number ${id || 'Loading..'}`}</Text>
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
                  {updateAssetCreate.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateAssetCreate.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAsset form={form} type="update" />
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

export default AssetCreate;
