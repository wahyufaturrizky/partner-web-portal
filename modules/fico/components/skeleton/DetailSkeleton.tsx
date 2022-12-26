import {
  Col, Row, Spacer,
} from 'pink-lava-ui';
import { Card } from 'components/Card';
import { Skeleton } from 'antd';

export const DetailSkeleton = () => (
  <Col>
    <Row gap="4px" alignItems="center">
      <Skeleton.Button size="large" active block style={{ maxWidth: '300px' }} />
    </Row>
    <Spacer size={20} />
    <Card padding="10px 20px">
      <Row gap="12px">
        <Col width="10%">
          <Skeleton.Button size="small" active block />
        </Col>
        <Col width="10%">
          <Skeleton.Button size="small" active block />
        </Col>
        <Col width="10%">
          <Skeleton.Button size="small" active block />
        </Col>
      </Row>
      <Spacer size={20} />
      <Row>
        <Skeleton paragraph active />
      </Row>
    </Card>
  </Col>
);
