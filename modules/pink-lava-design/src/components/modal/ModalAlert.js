/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Button, Spacer, Modal, Row, Col, Text,
} from '../../components';
import styled from 'styled-components';
import { ReactComponent as CheckmarkIcon } from "../../assets/checkmark.svg";

export function ModalAlert(props) {
  const {
    visible, title, message, onOk, isLoading, variant,
  } = props;

  return (
    <Modal
      visible={visible}
      footer={(
        <div
          style={{
            display: 'flex',
            marginBottom: '12px',
            marginRight: '12px',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <ButtonStyled variant="primary" size="big" onClick={onOk}>
            {isLoading ? 'loading...' : 'Ok'}
          </ButtonStyled>
        </div>
      )}
      content={(
        <Row justifyContent="center">
          <Col alignItems="center">
            <Spacer size={40} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckmarkIcon width="32" height="32" viewBox="0 0 24 24" />
              <Text textAlign="center" variant="headingLarge" color="green.darker">{title}</Text>
            </div>
            <Spacer size={20} />
            <Text textAlign="center" variant="headingMedium">{message}</Text>
            <Spacer size={20} />
          </Col>
        </Row>
      )}
    />
  );
}

const ButtonStyled = styled(Button)`
  && {
    width: 100%;
  }
`;
