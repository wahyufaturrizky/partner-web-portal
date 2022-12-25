import React from 'react';
import styled from 'styled-components';

export const Label = ({ children, ...props }) => (
  <LabelStyled {...props}>{children}</LabelStyled>
);

const LabelStyled = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;
