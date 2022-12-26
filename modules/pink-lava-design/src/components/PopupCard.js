/* eslint-disable no-use-before-define */
import React from 'react';
import styled from 'styled-components';

export function PopupCard({ children, show, ...props }) {
  return (
    <CardBorder show={show} {...props}>
      <CardBody>
        {children}
      </CardBody>
    </CardBorder>
  );
}

const CardBorder = styled.div`
  display: flex;
  position: fixed;
  
  bottom: ${({ show }) => (show ? '100px' : '-100px')};
  transition: bottom 0.2s linear;

  width: 85%;
  max-width: 850px;
  background: linear-gradient(to right, rgba(43, 190, 203, 0.8), rgba(255, 52, 172, 0.8));
  padding: 2px;
  box-shadow: 0px 16px 16px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  z-index: 3;
`;
const CardBody = styled.div`
  display: flex;
  width: 100%;
  background: linear-gradient(89.97deg, #F4FBFC 0.03%, #FFFFFF 99.97%);
  border-radius: 14px;
  padding: 20px 15px;
`;
