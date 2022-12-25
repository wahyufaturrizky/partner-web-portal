/* eslint-disable no-use-before-define */
/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { InputNumber as InputNumberAntd, Skeleton } from 'antd';
import { Else, If, Then } from 'react-if';
import { Subtitle } from './Subtitle';

export const InputNumber = React.forwardRef(
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
      formatter,
      parser,
      onChange,
      isLoading,
      ...props
    },
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
      <Container key={`input-number-${id}`}>
        <If condition={!label || label === ''}>
          <Then><Label style={{ color: 'transparent' }}>{id}</Label></Then>
          <Else>
            <Label>{label}</Label>
          </Else>
        </If>
        <BaseInputNumber
          key={id}
          ref={ref}
          disabled={disabled}
          size="large"
          placeholder={placeholder}
          height={height}
          error={error}
          formatter={formatter}
          parser={parser}
          controls={false}
          {...props}
          onChange={(value) => onChange?.({ target: { value, name: id } })}
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

const BaseInputNumber = styled(InputNumberAntd)`
  width: 100%;
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
  padding-top: 4px;
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
