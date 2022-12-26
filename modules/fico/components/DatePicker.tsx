/* eslint-disable no-use-before-define */
/* eslint-disable react/display-name */
import { DatePicker as DatePickerAntd, Skeleton } from 'antd';
import moment from 'moment';
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { baseTheme } from 'theme/baseTheme';
import { Subtitle } from './Subtitle';

export const DatePicker = React.forwardRef(
  (
    {
      id,
      label,
      subtitle,
      placeholder,
      error,
      disabled,
      picker,
      onChange,
      onBlur,
      isLoading,
      format,
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
      <ThemeProvider theme={baseTheme}>
        <Container>
          <Label>{label}</Label>
          <DatePickerBase
            ref={ref}
            fullscreen={false}
            picker={picker}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            format={format}
            {...props}
            onChange={(date, dateString) => {
              if (moment(dateString, format).isValid() === false) {
                onChange?.({ target: { value: null, name: id } });
                return;
              }

              if (format === 'DD/MM/YYYY') onChange?.({ target: { value: moment(dateString, format).format('YYYY-MM-DD HH:mm:ss'), name: id } });
              else onChange?.({ target: { value: dateString, name: id } });
            }}
            onBlur={(e) => {
              const dateString = e.target.value;
              if (moment(dateString, format).isValid() === false) {
                onBlur?.({ target: { value: null, name: id } });
                return;
              }

              if (format === 'DD/MM/YYYY') onBlur?.({ target: { value: moment(dateString, format).format('YYYY-MM-DD HH:mm:ss'), name: id } });
              else onBlur?.({ target: { value: dateString, name: id } });
            }}
          />
          <Subtitle error={error}>{error || subtitle}</Subtitle>
        </Container>
      </ThemeProvider>
    );
  },
);

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const DatePickerBase = styled(DatePickerAntd)<{fullscreen, error}>`
  width: 100%;
  height: 48px;
  background: ${(p) => p.theme.white};
  border-radius: 8px;
  border: 1px solid ${(p) => (p.error ? p.theme.red.regular : '#d9d9d9')};
  
  .ant-picker-input > input[disabled] {
    color: #000;
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }

  .ant-picker-disabled {
    background: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    cursor: not-allowed;
  }

  .anticon {
    color: ${(p) => p.theme.black.regular};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .anticon svg {
    width: 22px !important;
    height: 24px !important;
  }

  .ant-picker-input input {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
  }
`;
