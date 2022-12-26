import React, { forwardRef } from "react";
import styled from "styled-components";
import { COLORS } from "../const/COLORS";
import PropTypes from "prop-types";

const CHECKED = {
  true: {
    "--background": `${COLORS.blue.regular}`,
    "--visibility": "visible",
    "--border": `2px solid ${COLORS.blue.regular}`,
  },
  false: {
    "--background": `${COLORS.white}`,
    "--visibility": "hidden",
    "--border": `2px solid ${COLORS.grey.light}`,
  },
};

const DISABLED_CHECKED = {
  true: {
    "--background": `${COLORS.blue.light}`,
    "--visibility": "visible",
    "--border": `2px solid ${COLORS.blue.light}`,
  },
  false: {
    "--background": `${COLORS.white}`,
    "--visibility": "hidden",
    "--border": `2px solid ${COLORS.grey.lighter}`,
  },
};

const SIZES = {
  big: {
    "--height": "24px",
    "--width": "24px",
  },
  small: {
    "--height": "16px",
    "--width": "16px",
  },
};

export const Checkbox = forwardRef(
  (
    {
      className,
      checked,
      onChange,
      disabled,
      size = 24,
      text,
      stopPropagation,
      ...props
    },
    ref
  ) => {
    const styles = CHECKED[checked];
    const disabledStyles = DISABLED_CHECKED[checked];
    const sizeStyles = SIZES[size];
    const baseStyles = disabled ? disabledStyles : styles;

    return (
      <Container
        onClick={(e) => {
          if (disabled) {
            e.stopPropagation();
          } else {
            if (stopPropagation) {
              e.stopPropagation();
            }
            onChange(!checked, e);
          }
        }}
      >
        <CheckboxContainer disabled={disabled} className={className}>
          <HiddenCheckbox
            disabled={disabled}
            ref={ref}
            checked={checked}
            {...props}
          />
          <StyledCheckbox
            disabled={disabled}
            size={size}
            style={{ ...baseStyles, ...sizeStyles }}
            checked={checked}
          >
            <Icon viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </Icon>
          </StyledCheckbox>
        </CheckboxContainer>

        <Text>{text}</Text>
      </Container>
    );
  }
);

const Text = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
`;

const Container = styled.div`
  display: inline-flex;
  gap: 8px;
  cursor: pointer;
  align-items: center;
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  align-items: center;
  display: flex;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;
// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -5px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
  top: -2px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: var(--width);
  height: var(--height);
  background: var(--background);
  border-radius: ${(p) => (p.size ? "4px" : "6px")};
  transition: all 150ms;
  border: var(--border);

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px pink;
  }

  ${Icon} {
    margin-bottom: ${(p) => (p.size === "small" ? "3px" : "0px")};
    visibility: var(--visibility);
  }
`;

Checkbox.propTypes = {
  checked: PropTypes.bool,
  size: PropTypes.oneOf(["small", "big"]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  checked: true,
  size: "big",
  disabled: false,
  onChange: () => {},
};
