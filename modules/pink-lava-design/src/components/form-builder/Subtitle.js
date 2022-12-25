import React from 'react';
import styled from 'styled-components';

export const Subtitle = styled.div`
  font-weight: normal;
  font-size: 12px;
  min-height: 18px;
  color: ${(p) => (p.error ? '#ED1C24' : '#888888')};
`;
