import Text from 'antd/lib/typography/Text';
import styled from 'styled-components';
import { Row, Col } from 'pink-lava-ui';
import { Input } from './Input';
import { Select } from './Select';

export const Filter = ({ datasources, onSelect, onSearch }) => (
  <Row>
    <Col span={4}>
      <Text style={{ fontSize: '14px', fontWeight: 500 }}>Filter By </Text>
    </Col>
    <Col span={6}>
      <SelectStyled
        onSelect={onSelect}
        onClear={onSelect}
        datasources={datasources}
        placeholder="All Column"
        allowClear
      />
      {/* <Dropdown
        items={datasources}
        placeholder="All Column"
        onChange={onSelect}
        noSearch
      /> */}
    </Col>
    <Col span={10}>
      <InputStyled onChange={onSearch} placeholder="Search" />
    </Col>
  </Row>
);

const InputStyled = styled(Input)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  font-size: 14px;
  padding: 10px 14px;
`;

const SelectStyled = styled(Select)`
  width: 100%;
  font-size: 14px;
  .ant-select-selector {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: 0 !important;
    padding: 7px 14px !important;
  }

  .ant-select-item {
    font-size: 14px !important;
  }
`;
