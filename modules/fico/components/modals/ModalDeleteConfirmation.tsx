/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, Spacer, Modal } from 'pink-lava-ui';

interface IModalDeleteConfirmation {
  visible: boolean;
  onCancel: (e) => void;
  onOk: (e) => void;
  totalSelected: number;
  isLoading?: boolean;
}

export function ModalDeleteConfirmation(props: IModalDeleteConfirmation) {
  const {
    visible, totalSelected, onOk, onCancel, isLoading,
  } = props;

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      title="Confirm Delete"
      footer={(
        <div
          style={{
            display: 'flex',
            marginBottom: '12px',
            marginRight: '12px',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <Button size="big" variant="secondary" key="submit" type="primary" onClick={onCancel}>
            No
          </Button>
          <Button variant="primary" size="big" onClick={onOk}>
            {isLoading ? 'loading...' : 'Yes'}
          </Button>
        </div>
      )}
      content={(
        <>
          <Spacer size={4} />
          {`Are you sure to delete ${totalSelected} selected item ?`}
          {/* {totalSelected > 1
            ? `Are you sure to delete ${totalSelected} selected item ?`
            : `Are you sure to delete ${itemTitle} ?`} */}
          <Spacer size={20} />
        </>
      )}
    />
  );
}
