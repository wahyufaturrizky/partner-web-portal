/* eslint-disable no-use-before-define */
import { Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

const { Header: HeaderAntd } = Layout;
export function Header({ children }) {
  return (
    <BaseHeader className="site-layout-background" style={{ padding: 0 }}>
      {children}
    </BaseHeader>
  );
}

const BaseHeader = styled(HeaderAntd)`
  && {
    background-color: white !important;
    height: 54px !important;
  }
`;
