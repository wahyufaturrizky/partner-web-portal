import React from "react";
import styled from "styled-components";

import { COLORS } from '../const/COLORS';
import { TEXTSTYLES } from '../const/TEXTSTYLES';
import get from "lodash.get";
import PropTypes from "prop-types";

const DefaultRoot = styled.p`
  overflow-wrap: break-word;
  color: ${({ color }) => (color ? get(COLORS, color) : COLORS.black.regular)};
  &:hover {
    color: ${({ color, hoverColor }) => (hoverColor
    ? get(COLORS, hoverColor)
    : color
      ? get(COLORS, hoverColor)
      : COLORS.black.regular)};
    ${({ underLineOnHover }) => (underLineOnHover ? 'text-decoration: underline;' : '')};
  }

  display: ${({ inline }) => (inline ? "inline" : "block")};
  width: ${({ fluid, width }) => (fluid ? "100%" : width || "fit-content")};
  text-align: ${({ textAlign }) => textAlign || "left"};
  text-transform: ${({ uppercase }) => (uppercase ? "uppercase" : "none")};
  margin: 0px;

  white-space: pre-wrap;

  ${({ ellipsis }) => (ellipsis
    ? `text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;`
    : '')}
  ${({ clickable }) => (clickable ? 'cursor: pointer;' : '')}

  ${({ variant }) => TEXTSTYLES[variant]};
`;

export const Text = ({
  isHtml,
  children,
  withHover=true,
  ...rest
}) => (isHtml ? (
  <DefaultRoot
    {...rest}
    withHover={withHover}
    dangerouslySetInnerHTML={{ __html: `${children}` }}
  />
) : (
  <DefaultRoot {...rest}>{children}</DefaultRoot>
));

Text.propTypes = {
  variant: PropTypes.oneOf([
    'headingLarge', 'headingMedium', 'headingRegular',
    'headingSmall', 'label', 'link', 'body1', 'body2',
    'caption', 'alert', 'subtitle1', 'subtitle2', 'button',
    'buttonMobile', 'h5', 'h4', 'footer'
  ]),
  clickable: PropTypes.bool,
  textAlign: PropTypes.oneOf(['left', 'center', 'justify', 'right']),
  uppercase: PropTypes.bool,
  fluid: PropTypes.bool,
  width: PropTypes.string,
  inline: PropTypes.bool,
  underLineOnHover: PropTypes.bool,
  color: PropTypes.string,
  hoverColor: PropTypes.string
}