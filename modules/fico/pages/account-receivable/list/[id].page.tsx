/* eslint-disable no-unused-vars */
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
import { FormSkeleton } from 'components/skeleton/FormSkeleton';
import ArrowLeftIcon from 'assets/arrow-left.svg';
import { message } from 'antd';
import { useARList } from 'hooks/account-receivable/useARList';
import { FormAccountReceivable, IAccountReceivable } from './form';

function EditAccountReceivable() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<IAccountReceivable>();
  const {
    handleSubmit, getValues, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useARList();
  const getARListByID = service.getByID({
    id,
    onSuccess: (res) => {
      reset({ ...res?.data, budget_id: Number(id), orders: res?.orders });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateARList = service.update({
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
  const doSubmit = (data) => updateARList.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => updateARList.mutate(getPayload({ ...data, state: 'draft' }));

  if (getARListByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/account-receivable/list')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Account Receivable Sales ${id || 'Loading..'}`}</Text>
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
                  {updateARList.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateARList.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormAccountReceivable form={form} type="update" />
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
            Router.push('/asset/asset-mutation');
          }}
        />
      )}
    </>
  );
}

export default EditAccountReceivable;
