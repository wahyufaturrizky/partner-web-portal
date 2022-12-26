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
import { useGiro } from 'hooks/account-receivable/useGiro';
import { message } from 'antd';
import { FormCreateCekGiro, EditCekGiroFields } from './form-edit';

function EditGiro() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<EditCekGiroFields>();
  const { handleSubmit, getValues, reset } = form;

  const [modals, setModals] = useState<IModals>();
  const [cancleBtn, setCancleBtn] = useState(true);

  const service = useGiro();
  const getGiro = service.getByID({
    id,
    onSuccess: (res) => {
      reset(res?.data.items);
      res?.data.items.status === 2 && setCancleBtn(false);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateGiro = service.update({
    id,
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Order number has been successfully submitted'; }

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

  const deleteGiro = service.close({
    id,
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: 'Order number has been successfully saved' };
      if (res.state === 'submit') { alert.title = 'Submit Success'; alert.message = 'Order number has been successfully submitted'; }

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
  const getPayload = (data: EditCekGiroFields) => ({
    ...data,
  });

  const doSubmit = (data) => updateGiro.mutate(getPayload({ ...data, status: 2 }));
  const doSave = (data) => updateGiro.mutate(getPayload({ ...data, status: 1 }));
  const doDelete = (data) => deleteGiro.mutate(getPayload({ ...data }));

  if (getGiro.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/account-receivable/giro')} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Order Number ${getValues('giro_number') || 'Loading..'}`}</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="20px">
          <Row justifyContent="flex-end" alignItems="center" nowrap>
            <Row>
              <Row gap="16px">
                {cancleBtn
                  && (
                  <Button
                    size="big"
                    variant="tertiary"
                    onClick={() => setModals({
                      ...modals,
                      confirmation: {
                        open: true,
                        title: 'Confirm Delete',
                        message: 'Are you sure want to delete ?',
                        onOk: handleSubmit(doDelete, closeModals),
                      },
                    })}
                  >
                    Delete
                  </Button>
                  )}
                {!cancleBtn
                  && (
                  <Button
                    size="big"
                    variant="tertiary"
                    onClick={() => setModals({
                      ...modals,
                      confirmation: {
                        open: true,
                        title: 'Confirm Cancel',
                        message: 'Are you sure want to cancel ? Change you made so far will not be saved',
                        onOk: () => Router.push('/account-receivable/giro'),
                      },
                    })}
                  >
                    Cancel
                  </Button>
                  )}
                <Button
                  size="big"
                  variant="secondary"
                  onClick={handleSubmit(doSave)}
                  disabled={getValues('status') === 2}
                >
                  {updateGiro.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  disabled={getValues('status') === 2}
                >
                  {updateGiro.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormCreateCekGiro form={form} type="update" />
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
            Router.push('/account-receivable/giro');
          }}
        />
      )}
    </>
  );
}

export default EditGiro;
