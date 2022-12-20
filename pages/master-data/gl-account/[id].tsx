import Router, { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ArrowLeftIcon from 'assets/icons/arrow-left.svg';
import { omit } from 'lodash';
import { Modal } from 'types/modal';
import { useMasterGLAccount } from 'hooks/mdm/master-data/use-gl-account';
import {
  Button, Card, Col, FormSkeleton, message, ModalAlert, ModalConfirmation, Row, Spacer, Text,
} from 'components/pink-lava-ui';
import { FormMasterGLAccount, MasterGLAccountFields, getPayload } from './form';

function EditMasterGLAccount({ canEdit = true }) {
  const menuTitle = 'G/L Account';
  const router = useRouter();
  const { id } = router.query;

  const form = useForm<MasterGLAccountFields>();
  const {
    handleSubmit, getValues, reset,
  } = form;
  const [modals, setModals] = useState<Modal>();

  const service = useMasterGLAccount();
  const getByID = service.getByID({
    id,
    onSuccess: (res) => {
      const data = omit(res?.data, ['created_at', 'modified_at', 'created_by', 'modified_by', 'deleted_at', 'deleted_by']);

      reset({
        ...data,
        pl_statmt_account: data.pl_statmt_account === 'X',
        balance_sheet: data.balance_sheet === 'X',
        relevant_to_cas: data.relevant_to_cas === 'X',
        balances_in_loc: data.balances_in_loc === 'X',
        posting_without: data.balances_in_loc === 'X',
        recon_acct_for: data.recon_acct_for === 'X',
        post_auto_only: data.post_auto_only === 'X',
        line_item_display: data.line_item_display === 'X',
        blocked_for_pos: data.blocked_for_pos === 'X',
        blocked_for_plan: data.blocked_for_plan === 'X',
        open_item_manage: data.open_item_manage === 'X',
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const updateGLAccount = service.update({
    onSuccess: () => {
      const alert = { title: 'Update Success', message: `${menuTitle} has been successfully updated` };

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
  const doSubmit = (data) => updateGLAccount.mutate(getPayload({ ...data }));

  if (getByID.isLoading) {
    return <FormSkeleton />;
  }

  return (
    <>
      <Col>
        <Spacer size={20} />
        <Row gap="4px" alignItems="center">
          <ArrowLeftIcon onClick={() => Router.back()} style={{ cursor: 'pointer' }} />
          <Text variant="h4">{`${menuTitle} ${getValues('gl_account') || 'Loading..'}`}</Text>
        </Row>
        <Spacer size={20} />
        <Card padding="20px">
          <Row justifyContent="space-between" alignItems="center">
            {/* <Row>
              {form.getValues('status') !== null && (
              <StatusBadge
                variant="green"
                value="Submitted"
              />
              )}
            </Row> */}
            <Row />
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
                      onOk: () => Router.back(),
                    },
                  })}
                >
                  Cancel
                </Button>
                {/* <Button
                  size="big"
                  variant="secondary"
                  onClick={handleSubmit(doSave)}
                >
                  {updateGLAccount.isLoading ? 'Loading...' : 'Save as Draft'}
                </Button> */}
                <Button
                  size="big"
                  variant="primary"
                  onClick={() => setModals({
                    ...modals,
                    confirmation: {
                      open: true, title: 'Confirm Update', message: 'Are you sure want to update ?', onOk: handleSubmit(doSubmit, closeModals),
                    },
                  })}
                >
                  {updateGLAccount.isLoading ? 'Loading...' : 'Update'}
                </Button>
              </Row>
            </Row>
            )}

          </Row>
        </Card>

        <Spacer size={20} />
        <FormMasterGLAccount form={form} type="update" />
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

export default EditMasterGLAccount;
