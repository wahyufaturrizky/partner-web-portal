import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export function Card({ children, padding, style = {} }) {
  return (
    <CardStyled padding={padding} style={style}>
      {children}
    </CardStyled>
  );
}

const CardStyled = styled.div`
  background: #fff;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : '20px')};
  width: 100%;
`;

Card.defaultProps = {
  children: 'Children',
}