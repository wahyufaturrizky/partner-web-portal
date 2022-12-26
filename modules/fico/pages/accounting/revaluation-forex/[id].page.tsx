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
import { omit, capitalize } from 'lodash';
import { StatusBadge } from 'components/StatusBadge';
import { STATUS_VARIANT } from 'utils/utils';
import { FormGeneralJournal, GeneralJournalFields, getPayload } from 'pages/accounting/general-journal/form';
import { useRevaluationForex } from 'hooks/accounting/useRevaluationForex';

function EditRevaluationForex() {
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<GeneralJournalFields>();
  const {
    handleSubmit, getValues, reset,
  } = form;
  const [modals, setModals] = useState<IModals>();

  const service = useRevaluationForex();
  const getReversalJournalByID = service.getByID({
    id,
    onSuccess: (res) => {
      const data = omit(res?.data, ['created_at', 'updated_at']);
      reset({
        ...data,
        items: res?.items,
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateRevaluation = service.update({
    id,
    onSuccess: (res) => {
      const alert = { title: 'Save Success', message: `Document number ${res.data.info.document_number} has been successfully saved` };
      if (res.data.info.state === 'submit') { alert.title = 'Submit Success'; alert.message = `Document number ${res.data.info.document_number} has been successfully submitted`; }

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

  const doSubmit = (data) => updateRevaluation.mutate(getPayload({ ...data, state: 'submit' }));
  const doSave = (data) => updateRevaluation.mutate(getPayload({ ...data, state: 'draft' }));

  if (getReversalJournalByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.back()} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`Document Number ${getValues('document_number') || 'Loading..'}`}</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center">
            <Row>
              {form.getValues('state') && (
              <StatusBadge
                variant={STATUS_VARIANT[form.getValues('state').toUpperCase()]}
                value={form.getValues('state') === 'submit' ? 'Submitted' : capitalize(form.getValues('state'))}
              />
              )}
            </Row>
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
                      onOk: () => Router.back(),
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
                  {updateRevaluation.isLoading ? 'Loading...' : 'Save as Draft'}
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
                  {updateRevaluation.isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </Row>
            </Row>
          </Row>
        </Card>

        <Spacer size={20} />
        <FormGeneralJournal form={form} type="update" />
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

export default EditRevaluationForex;
