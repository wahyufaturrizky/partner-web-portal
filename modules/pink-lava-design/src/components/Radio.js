import React from "react";
import { Radio as RadioAntd } from "antd";
import styled from "styled-components";
import { TEXTSTYLES } from "../const/TEXTSTYLES";
import { COLORS } from "../const/COLORS";
import PropTypes from "prop-types";
import { Text } from "./Text";

const CHECKED = {
  true: {
    "--background": `${COLORS.blue.regular}`,
    "--border": `2px solid ${COLORS.blue.regular}`,
  },
  false: {
    "--background": `${COLORS.white}`,
    "--border": `2px solid ${COLORS.grey.light}`,
  },
};

const DISABLED_CHECKED = {
  true: {
    "--background": `${COLORS.blue.light}`,
    "--border": `2px solid ${COLORS.blue.light}`,
  },
  false: {
    "--background": `${COLORS.white}`,
    "--border": `2px solid ${COLORS.grey.lighter}`,
  },
};

export const Radio = ({ disabled, checked, children, ...props }) => {
  const styles = CHECKED[checked];
  const disabledStyles = DISABLED_CHECKED[checked];
  return (
    <RadioBase
      style={disabled ? disabledStyles : styles}
      checked={checked}
      disabled={disabled}
      {...props}
    >
      {children}
    </RadioBase>
  );
};

const RadioBase = styled(RadioAntd)`
  .ant-radio-inner {
    width: 24px;
    height: 24px;
    border: var(--border);
  }

  .ant-radio-inner:after {
    width: 24px;
    height: 24px;
    top: 30%;
    left: 30%;
    background-color: var(--background);
  }
`;

Radio.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
};

Radio.defaultProps = {
  checked: false,
  disabled: false,
};
