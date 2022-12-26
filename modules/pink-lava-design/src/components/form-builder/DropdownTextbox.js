import { Row } from '../../components';
import React from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';
import { BaseInput } from './Input';
import { Label } from './Label';

export const DropdownTextbox = React.forwardRef(({
  id,
  label,
  value,
  datasources,
  loading,
  placeholder = 'Select',
  disabled,
  error,
  ...props
}, ref) => (
  <Row>
    <Container width="30%">
      {label && <Label>{label}</Label>}
      <DropdownStyled
        ref={ref}
        id={id}
        loading={loading}
        items={datasources}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        value={value}
        noSearch
        {...props}
      />
    </Container>
    <Container width="70%">
      <Label style={{ color: 'transparent', marginBottom: '1px' }}>{id}</Label>
      <BaseInput
        height="48px"
        value={datasources.find((v) => v.id === value)?.description || ''}
        disabled
      />
    </Container>
  </Row>
));

const BaseInputStyled = styled(BaseInput)`
  border-color: #d9d9d9;
  border-left: none;
  border-radius: 0px 8px 8px 0px;
  margin-left: -1px;
  z-index: 10;

  :hover {
    border-left: none !important;
  }
`;

const DropdownStyled = styled(Dropdown)`
  .ant-select-selector {
    border-radius: 8px 0px 0px 8px !important;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: ${({ width }) => width || 'auto'}; 
  .ant-select-dropdown {
    width: auto !important;
  }  
`;
