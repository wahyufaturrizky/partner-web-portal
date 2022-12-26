import React from 'react';
import styled from 'styled-components';
import {
  Col, Row, Spacer,
} from '../../components';
import { Skeleton } from 'antd';

export const FormSkeleton = () => (
  <Col>
    <Card padding="20px">
      <Row justifyContent="flex-end" alignItems="center" nowrap>
        <Row width="30%">
          <Skeleton.Button size="large" active block />
        </Row>
      </Row>
    </Card>
    <Spacer size={20} />
    <Card padding="20px">
      <Row width="100%" gap="20px">
        <Col width="48%" gap="20px">
          <Skeleton.Input size="small" active />
          <Skeleton.Input size="large" active block />
        </Col>
        <Col width="48%" gap="20px">
          <Skeleton.Input size="small" active />
          <Skeleton.Input size="large" active block />
        </Col>
        <Col width="48%" gap="20px">
          <Skeleton.Input size="small" active />
          <Skeleton.Input size="large" active block />
        </Col>
        <Col width="48%" gap="20px">
          <Skeleton.Input size="small" active />
          <Skeleton.Input size="large" active block />
        </Col>
      </Row>
    </Card>
  </Col>
);

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(p) => (p.padding ? p.padding : '16px')};
`;
