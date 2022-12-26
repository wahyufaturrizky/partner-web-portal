import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import styled from "styled-components";

export const Input = forwardRef(
  (
    {
      label,
      subtitle,
      placeholder,
      error,
      disabled,
      required,
      icon,
      height,
      type,
      isOptional,
      ...props
    },
    ref
  ) => {
    return (
      <Container>
        {label && <Label>
          {label}{" "}
          {isOptional && <Span isOptional={isOptional}>(Optional)</Span>}
          {required && <Span>&#42;</Span>}
        </Label>}
        <BaseInput
          type={type}
          ref={ref}
          disabled={disabled}
          size="large"
          placeholder={placeholder}
          height={height}
          error={error}
          {...props}
        />
        <Subtitle error={error}>{error ? error : subtitle}</Subtitle>
      </Container>
    );
  }
);

const Span = styled.span`
  color: ${(props) => (props.isOptional ? "#000000" : "#ed1c24")};
  margin-left: 1px;
  font-weight: ${(props) => (props.isOptional ? "lighter" : undefined)};
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
  width: 100%;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

const BaseInput = styled.input`
  background: ${(p) => (p.disabled ? "#F4F4F4" : "#FFFFFF")};
  border: 1px solid ${(p) => (p.error ? "#ED1C24" : "#AAAAAA")};
  box-sizing: border-box;
  border-radius: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  height: ${(p) => p.height || "54px"};
  color: #000000;
  padding: 12px 16px;
  outline: none;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "default")};

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

Input.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.any,
};

Input.defaultProps = {
  label: "Text Input Label",
  subtitle: "",
  placeholder: "Ex Nabati Croffle",
  error: "",
  type: "text",
  disabled: false,
  required: false,
  icon: PropTypes.any,
};
