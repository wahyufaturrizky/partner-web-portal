/* eslint-disable no-use-before-define */
import React from 'react';
import {
  Button, Spacer, Modal, Text,
} from '../../components';
import styled from 'styled-components';

export function ModalConfirmation(props) {
  const {
    title, message, visible, isLoading, onCancel, onOk, width,
  } = props;

  return (
    <ModalStyled
      onCancel={onCancel}
      visible={visible}
      title={title}
      width={width}
      footer={(
        <div
          style={{
            display: 'flex',
            marginBottom: '12px',
            marginRight: '12px',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
          }}
        >
          <ButtonStyled size="big" variant="tertiary" key="submit" type="primary" onClick={onCancel}>
            No
          </ButtonStyled>
          <ButtonStyled variant="primary" size="big" onClick={onOk}>
            {isLoading ? 'loading...' : 'Yes'}
          </ButtonStyled>
        </div>
      )}
      content={(
        <>
          <Spacer size={4} />
          <Text variant="headingRegular">{message}</Text>
          {/* {totalSelected > 1
            ? `Are you sure to delete ${totalSelected} selected item ?`
            : `Are you sure to delete ${itemTitle} ?`} */}
          <Spacer size={20} />
        </>
      )}
    />
  );
}

const ModalStyled = styled(Modal)`
  .ant-modal-title {
    font-size: 28px !important;
  }

  .ant-modal-body {
    padding: 20px !important;
  }
`;
const ButtonStyled = styled(Button)`
  && {
    width: 100%;
  }
`;
