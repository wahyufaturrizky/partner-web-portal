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
import moment from 'moment';
import { useDownPayment } from 'hooks/account-receivable/useDownPayment';
import { FormUpdateDownPayment, EditDownPaymentFields } from './form-edit';

function EditDownPayment() {
  const router = useRouter();
  const { id } = router.query;
  const form = useForm<EditDownPaymentFields>();
  const { handleSubmit, getValues, reset } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useDownPayment();
  const getDownPaymentByID = service.getByID({
    id,
    onSuccess: (res) => {
      reset({
        ...res?.data.items.dp,
        items: res?.data.items.dp_detail,
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateDownPayment = service.update({
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
  const getPayload = (data: EditDownPaymentFields) => ({
    dp: {
      ...data,
      doc_date: moment(data.doc_date).format('YYYY-MM-DD'),
      posting_date: moment(data.posting_date).format('YYYY-MM-DD'),
      translation_date: moment(data.translation_date).format('YYYY-MM-DD'),
      taxreporting_date: moment(data.taxreporting_date).format('YYYY-MM-DD'),
    },
    dp_detail: [{
      ...data.items,
      due_date: moment(data.doc_date).format('YYYY-MM-DD'),
    }],
  });
  const doSubmit = (data) => updateDownPayment.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => updateDownPayment.mutate(getPayload({ ...data, state: 'draft' }));

  if (getDownPaymentByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.push('/account-receivable/down-payment')} style={{ cursor: 'pointer' }} />
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
                    ...modals,
                    confirmation: {
                      open: true,
                      title: 'Confirm Cancel',
                      message: 'Are you sure want to cancel ? Change you made so far will not be saved',
                      onOk: () => Router.push('/account-receivable/down-payment'),
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
                  {updateDownPayment.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateDownPayment.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormUpdateDownPayment form={form} type="update" />
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
            Router.push('/account-receivable/down-payment');
          }}
        />
      )}
    </>
  );
}

export default EditDownPayment;
