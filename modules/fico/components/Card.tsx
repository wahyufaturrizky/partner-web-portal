/* eslint-disable no-use-before-define */
import React from 'react';
import styled from 'styled-components';

interface ICard {
  padding?: string | number;
  children?: React.ReactNode;
  style?: Object
}

export function Card({ children, padding, style = {} }: ICard) {
  return (
    <CardStyled padding={padding} style={style}>
      {children}
    </CardStyled>
  );
}

const CardStyled = styled.div<{ padding }>`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : '20px')};
  width: 100%;
`;
