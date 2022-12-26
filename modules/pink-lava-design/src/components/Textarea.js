import React, { forwardRef } from "react";
import styled from "styled-components";
import { Input } from "antd";
import PropTypes from "prop-types";

const { TextArea: TextAreaAntd } = Input;

export const TextArea = forwardRef(
  (
    {
      label,
      isOptional,
      subtitle,
      error,
      placeholder,
      disabled,
      onChange,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <Container>
        {typeof label === "string" ? (
          <Label>
            {label}{" "}
            {isOptional && <Span isOptional={isOptional}>(Optional)</Span>}
            {required && <Span>&#42;</Span>}
          </Label>
        ) : (
          label
        )}
        <BaseTextArea
          disabled={disabled}
          ref={ref}
          placeholder={placeholder}
          error={error}
          showCount
          maxLength={100}
          onChange={onChange}
          {...props}
        />
        <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
      </Container>
    );
  }
);

const Span = styled.span`
  font-weight: ${(props) => (props.isOptional ? "lighter" : undefined)};
  line-height: 18px;
  color: ${(props) => (props.isOptional ? "#000000" : "#ED1C24")};
`;

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

const BaseTextArea = styled(TextAreaAntd)`
  && {
    /* Neutral/White Cheese */
    background: ${(p) => (p.disabled ? "#F4F4F4" : "#FFFFFF")};

    border: 1px solid ${(p) => (p.error ? "#ED1C24" : "#AAAAAA")};
    /* Neutral/Grey Cheese */
    box-sizing: border-box;
    border-radius: 8px;

    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    color: #000000;
  }

  &:hover {
    border: 1px solid #2bbecb;
  }

  .ant-input {
    border-radius: 8px;
  }
`;

TextArea.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

TextArea.defaultProps = {
  label: "Job Requirment",
  subtitle: "",
  placeholder: "Type here...",
  error: "",
  disabled: false,
  required: false,
};
