import React, { forwardRef } from "react";
import { Input, InputNumber, TimePicker } from "antd";
import styled from "styled-components";

export const FormInput = forwardRef((props, ref) => {
  const renderInput = (type) => {
    switch (type) {
      case "password":
        return <StyledInput.Password {...props} ref={ref} />;
      case "number":
        return <StyledInputNumber {...props} ref={ref} />;
      case "timepicker":
        return <StyledTimePicker {...props} ref={ref} />;
      default:
        return <StyledInput {...props} ref={ref} />;
    }
  };

  return <>{renderInput(props.type)}</>;
});

const StyledTimePicker = styled(TimePicker)`
  border-radius: 8px;

  &:focus,
  &:hover {
    border-color: #2bbecb;
    box-shadow: none;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  border-radius: 8px;

  &:focus,
  &:hover {
    border-color: #2bbecb;
    box-shadow: none;
  }

  .ant-input-number-handler-wrap {
    opacity: 1;
    border-radius: 0 8px 8px 0;
  }
`;

const StyledInput = styled(Input)`
  border-radius: 8px;

  &:focus {
    border-color: #2bbecb;
  }
`;
