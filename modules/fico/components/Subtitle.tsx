import styled from 'styled-components';

export const Subtitle = styled.div<{error}>`
  font-weight: normal;
  font-size: 12px;
  min-height: 18px;
  color: ${(p) => (p.error ? '#ED1C24' : '#888888')};
`;
