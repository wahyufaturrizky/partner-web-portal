/* eslint-disable no-use-before-define */
import React from 'react';
import {
  Button, Spacer, Modal,
} from '../../components';
import styled from 'styled-components';

export function ModalChildren(props) {
  const {
    title, visible, textBtnOk, textBtnCancel, isLoading, onCancel, onOk, children, width, hideBtnCancel,
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
          {!hideBtnCancel
            && (
            <ButtonStyled size="big" variant="tertiary" key="submit" type="primary" onClick={onCancel}>
              {isLoading ? 'loading...' : (textBtnCancel ?? 'No')}
            </ButtonStyled>
            )}
          <ButtonStyled variant="primary" size="big" onClick={onOk}>
            {isLoading ? 'loading...' : (textBtnOk ?? 'Yes')}
          </ButtonStyled>
        </div>
  )}
      content={(
        <>
          <Spacer size={4} />
          {children}
          <Spacer size={20} />
        </>
  )}
    />
  );
}

const ButtonStyled = styled(Button)`
  && {
    width: 100%;
  }
`;

const ModalStyled = styled(Modal)`
  .ant-modal {
    width: 100% !important;
    max-width: 800px !important;
  }
`;
