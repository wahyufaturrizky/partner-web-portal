/* eslint-disable no-use-before-define */
/* eslint-disable react/display-name */
import { Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Else, If, Then } from 'react-if';
import { debounce } from 'lodash';
import { Subtitle } from './Subtitle';

export const Input = React.forwardRef(
  (
    {
      id,
      label,
      subtitle,
      placeholder,
      error,
      disabled,
      required,
      icon,
      height,
      type,
      isLoading,
      ...props
    }: any,
    ref,
  ) => {
    if (isLoading) {
      return (
        <Container>
          <Label>{label}</Label>
          <Skeleton.Input size="large" active block />
        </Container>
      );
    }

    return (
      <Container key={`input-${id}`}>
        <If condition={!label || label === ''}>
          <Then><Label style={{ color: 'transparent' }}>{id}</Label></Then>
          <Else>
            <Label>{label}</Label>
          </Else>
        </If>
        <BaseInput
          key={id}
          type={type}
          ref={ref}
          disabled={disabled}
          size="large"
          placeholder={placeholder}
          height={height}
          error={error}
          {...props}
          onChange={debounce((e) => props.onChange?.(e), 600)}
        />
        <Subtitle error={error}>{error || subtitle}</Subtitle>
      </Container>
    );
  },
);

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export const BaseInput = styled.input<{error?: string | null}>`
  background: ${(p) => (p.disabled ? '#F4F4F4' : '#FFFFFF')};
  border: 1px solid ${(p) => (p.error ? '#ED1C24' : '#d9d9d9')};
  box-sizing: border-box;
  border-radius: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  height: ${(p) => p.height || '54px'};
  color: #000000;
  padding: 12px 16px;
  outline: none;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'default')};

  :focus {
    border: 1px solid #2bbecb;
  }

  :hover {
    border: 1px solid #2bbecb;
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #aaaaaa;
    opacity: 1; /* Firefox */
  }

  .ant-input-prefix {
    margin-right: 10px;
  }
`;
