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
import { message } from 'antd';
import { omit } from 'lodash';
import { useVendorInvoicing } from 'hooks/account-payable/useVendorInvoicing';
import { StatusBadge } from 'components/StatusBadge';
import { STATUS_AP_VARIANT, STATUS_AP_WORDING } from 'utils/utils';
import { FormVendorInvoicing, VendorInvoicingFields, getPayload } from './form';

function EditVendorInvoicing({ canEdit = true }) {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<VendorInvoicingFields>();
  const {
    handleSubmit, getValues, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useVendorInvoicing();
  const getVendorInvoiceByID = service.getByID({
    id,
    onSuccess: (res) => {
      const data = omit(res?.data, ['created_at', 'modified_at', 'created_by', 'modified_by', 'deleted_at', 'deleted_by']);

      reset(data);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateVendorInvoicing = service.update({
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
  const doSubmit = (data) => updateVendorInvoicing.mutate(getPayload({ ...data, status: 1 }));
  const doSave = (data) => updateVendorInvoicing.mutate(getPayload({ ...data, status: 0 }));

  if (getVendorInvoiceByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.back()} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Document Number ${getValues('doc_number') || 'Loading..'}`}</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center">
            <Row>
              {form.getValues('status') !== null && (
              <StatusBadge
                variant={STATUS_AP_VARIANT[form.getValues('status')]}
                value={STATUS_AP_WORDING[form.getValues('status')]}
              />
              )}
            </Row>
            {canEdit
            && (
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
                      onOk: () => Router.push('/account-payable/vendor-invoicing'),
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
                  {updateVendorInvoicing.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateVendorInvoicing.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
            )}

          </Row>
        </Card>

        <Spacer size={20} />
        <FormVendorInvoicing form={form} type="update" />
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
            Router.push('/account-payable/vendor-invoicing');
          }}
        />
      )}
    </>
  );
}

export default EditVendorInvoicing;
