import { css } from '@emotion/css';
import { Row } from 'pink-lava-ui';
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
}: any, ref) => (
  <Row>
    <Container width="30%">
      {label && <Label>{label}</Label>}
      <Dropdown
        ref={ref}
        id={id}
        loading={loading}
        items={datasources}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        value={value}
        className={css`
          .ant-select-selector {
            border-radius: 8px 0px 0px 8px !important;
          }
        `}
        noSearch
        {...props}
      />
    </Container>
    <Container width="70%">
      <Label style={{ color: 'transparent' }}>{id}</Label>
      <BaseInput
        height="50px"
        value={datasources.find((v) => v.id === value)?.description || ''}
        className={css`
          border-color: #d9d9d9;
          border-left: none;
          border-radius: 0px 8px 8px 0px;
          margin-left: -5px;
          z-index: 10;

          :hover {
            border-left: none !important;
          }
        `}
        disabled
      />
    </Container>
  </Row>
));

const Container = styled.div<{width?: string}>`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: ${({ width }) => width || 'auto'}; 
  .ant-select-dropdown {
    width: auto !important;
  }  
`;
