import { DatePicker as DatePickerAntd } from "antd";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
const { RangePicker } = DatePickerAntd;

export const RangeDatePicker = ({
  label,
  subtitle,
  error,
  picker,
  fullWidth,
  disabled,
  ...props
}) => {

  return (
    <Container>
      <Label>{label}</Label>
      <DatePickerBase
        error={error}
        disabled={disabled}
        fullWidth={fullWidth}
        picker={picker}
        {...props}
      />
      <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
    </Container>
  );
};

const Subtitle = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.error ? "#ED1C24" : "#888888")};
`;

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const DatePickerBase = styled(RangePicker)`
  && {
    width: ${(p) => (p.fullWidth ? "100%" : "362px")};
    height: 48px;
    background: ${(p) => (p.disabled ? "#F4F4F4" : "#FFFFFF")};
    border-radius: 8px;
    border: 1px solid ${(p) => (p.error ? "#ED1C24" : "#AAAAAA")};
  }

  .anticon {
    color: ${(p) => p.theme.black?.regular};
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

RangeDatePicker.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  picker: PropTypes.oneOf(["year", "date"]),
};

RangeDatePicker.defaultProps = {
  picker: "date",
  label: "Text Input Label",
  subtitle: "",
  placeholder: "",
  error: "",
  disabled: false,
};
