import React, { forwardRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { baseTheme } from "../theme/baseTheme";
import { TEXTSTYLES } from "../const/TEXTSTYLES";
import { ThemeProvider } from "styled-components";

const SIZES = {
  xtra: {
    "--height": "54px",
    "--padding": "16px 24px",
    "--min-width": "144px",
  },
  big: {
    "--height": "48px",
    "--padding": "12px 24px",
    "--min-width": "144px",
  },
  small: {
    "--height": "32px",
    "--padding": "12px",
    "--min-width": "96px",
  },
};

export const Button = forwardRef(
  ({ variant = 'primary', size = 'big', children, disabled, full, style, redTheme,...props }, ref) => {
    const styles = SIZES[size];

    let Component;
    if (variant === "primary") {
      Component = PrimaryButton;
    } else if (variant === "secondary") {
      Component = SecondaryButton;
    } else if (variant === "tertiary") {
      Component = TertiaryButton;
    } else if (variant === "ghost") {
      Component = GhostButton;
    } else {
      throw new Error(`Unrecognized Button variant: ${variant}`);
    }

    return (
      <ThemeProvider theme={baseTheme}>
        <Component
          ref={ref}
          style={{ ...styles, ...style }}
          size={size}
          disabled={disabled}
          full={full}
          redTheme={redTheme}
          {...props}
        >
          {children}
        </Component>
      </ThemeProvider>
    );
  }
);

const ButtonBase = styled.button`

  ${p => p.size === "big" ? TEXTSTYLES.button : TEXTSTYLES.buttonMobile}
  padding: var(--padding);
  height: var(--height);
  min-width: var(--min-width);
  border-radius: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  ${({ full }) => (full ? `width: 100%;` : "")}
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: ${p => p.theme.pink.regular};
  color: ${p => p.theme.white};

  &:hover {
    background-color: ${p => p.theme.pink.dark};
  }

  &:disabled {
    background-color: ${p => p.theme.grey.lighter};
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: ${p => p.theme.pink.lightest};
  color: ${p => p.theme.pink.regular};

  &:hover {
    background-color: ${p => p.theme.pink.lightest};
    color: ${p => p.theme.pink.dark};
  }

  &:disabled {
    background-color: ${p => p.theme.grey.lighter};
    color:${p => p.theme.white};
  }
`;

const TertiaryButton = styled(ButtonBase)`
  color: ${p => p.redTheme ? p.theme.red.regular : p.theme.pink.regular};
  background-color: transparent;
  border: 2px solid ${p => p.redTheme ? p.theme.red.regular : p.theme.pink.regular};

  &:hover {
    color: ${p => p.redTheme ? p.theme.red.regular : p.theme.pink.dark};
    border: 2px solid${p => p.redTheme ? p.theme.red.regular : p.theme.pink.dark};
  }

  &:disabled {
    color: ${p => p.theme.grey.lighter};
    border: 2px solid ${p => p.theme.grey.lighter};
  }
`;

const GhostButton = styled(ButtonBase)`
  color: ${p => p.theme.pink.regular};
  border: none;
  padding: 12px;
  border-radius: none;
  background: transparent;

  &:hover {
    color:  ${p => p.theme.pink.dark};
  }

  &:disabled {
    color:  ${p => p.theme.grey.lighter};
  }
`;

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'ghost']),
  size: PropTypes.oneOf(['small', 'big', 'xtra']),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  full: PropTypes.bool
}