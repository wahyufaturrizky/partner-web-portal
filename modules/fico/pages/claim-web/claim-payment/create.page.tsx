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
import { message } from 'antd';
import { useClaimPayment } from 'hooks/claim-web/useClaimPayment';
import { FormVendorInvoicing, VendorInvoicingFields, getPayload } from './form';

function CreateVendorInvoicing() {
  const form = useForm<VendorInvoicingFields>();
  const { handleSubmit } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useClaimPayment();
  const getDocumentNumber = service.getDocumentNumber({
    onSuccess: (res) => {
      if (res.status !== 'success') throw new Error(res.message);
      form.setValue('doc_number', res.data);
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const createVendorInvoice = service.create({
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
      getDocumentNumber.refetch();
      message.error(err.message);
    },
  });

  const closeModals = () => setModals({});

  const doSubmit = (data) => createVendorInvoice.mutate(getPayload({ ...data, status: 1 }));
  const doSave = (data) => createVendorInvoice.mutate(getPayload({ ...data, status: 0 }));

  return (
    <>
      <Col>
        <Row gap="4px">
          <Text variant="h4">Create Vendor Invoice</Text>
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
                      onOk: () => Router.push('/claim-web/claim-payment'),
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
                  {createVendorInvoice.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {createVendorInvoice.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormVendorInvoicing form={form} />
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

export default CreateVendorInvoicing;
