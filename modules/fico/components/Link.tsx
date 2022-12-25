import React from 'react';
import styled from 'styled-components';

export const Link = ({ children, ...props }: any) => (
  <BaseLink {...props}>{children}</BaseLink>
);

const BaseLink = styled.div`
  && {
    font-style: normal;
    font-weight: 500;
    // font-size: 14px;
    line-height: 18px;
    text-decoration-line: underline;

    /* Primary/Wafer Blue (Maximum Blue Green) */
    color: #2BBECB;
    cursor: pointer;
  }
`;
