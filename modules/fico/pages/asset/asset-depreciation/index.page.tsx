/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import Router from 'next/router';
import {
  Button, Col, Row, Text,
} from 'pink-lava-ui';
import React, { useState } from 'react';
import { ModalConfirmation } from 'components/modals/ModalConfirmation';
import { ModalAlert } from 'components/modals/ModalAlert';
import { useForm } from 'react-hook-form';
import { IModals } from 'interfaces/interfaces';
import { Card } from 'components/Card';
import { useRouterPath } from 'hooks/helper/useRouterPath/useRouterPath';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import { useAssetDepreciation } from 'hooks/asset/useAssetDepreciation';
import { FormAssetDepreciation, AssetDepreciationFields } from './form';

function CreateAssetDepreciation() {
  const form = useForm<AssetDepreciationFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useAssetDepreciation();
  const createAssetDepreciation = service.create({
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.data.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Order number has been successfully submitted'; }

      setModals({
        ...modals,
        confirmation: { open: false, title: '', message: '' },
        alert: { open: true, title: alert.title, message: alert.message },
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const closeModals = () => setModals({});
  const getPayload = (data: AssetDepreciationFields) => ({
    ...data,
  });
  const doSubmit = (data) => createAssetDepreciation.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => createAssetDepreciation.mutate(getPayload({ ...data, state: 'draft' }));

  const { rootMenuPath } = useRouterPath();
  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push(`${rootMenuPath}`)} style={{ cursor: 'pointer' }} />
          <Text variant="h4">Create Asset Depreciation</Text>
        </Row>
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                {/* <Button
                  size="big"
                  variant="tertiary"
                  onClick={() => setModals({
                    confirmation: {
                      open: true,
                      title: 'Confirm Cancel',
                      message: 'Are you sure want to cancel ? Change you made so far will not be saved',
                      onOk: () => Router.push('/asset/asset-depreciation'),
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
                  {createAssetDepreciation.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createAssetDepreciation.isLoading ? 'Loading...' : 'Submit'}
                </Button> */}
              </Row>
            </Row>
          </Row>
        </Card>
        <FormAssetDepreciation form={form} />
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
            Router.push(`${rootMenuPath}`);
          }}
        />
      )}
    </>
  );
}

export default CreateAssetDepreciation;
