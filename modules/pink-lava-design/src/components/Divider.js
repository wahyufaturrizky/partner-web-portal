import React from "react";
import styled from "styled-components";

import { COLORS } from '../const/COLORS';

const Root = styled.div`
  display: flex;
  ${({ vertical }) => (vertical ? "flex-direction: column;" : "")}
  align-items: center;
  text-align: center;

  ${({ textOptions }) =>
    textOptions
      ? `
      ${textOptions.fontSize ? `font-size: ${textOptions.fontSize}` : ""};
      ${textOptions.lineHeight ? `line-height: ${textOptions.lineHeight}` : ""};
      ${textOptions.color ? `color: ${COLORS[textOptions.color]}` : ""};
    `
      : ""}

  ${({ vertical, size }) =>
    vertical
      ? `width: ${size ? `${size}px` : "1px"};`
      : `height: ${size ? `${size}px` : "1px"};`}

  margin: ${(props) => (props.margin ? `${props.margin}px` : "9px 0px")};

  ${({ vertical, offset }) =>
    vertical
      ? `
     margin-top: ${offset && `${-offset}px`};
     margin-bottom: ${offset && `${-offset}px`};`
      : `
     margin-left: ${offset && `${-offset}px`};
     margin-right: ${offset && `${-offset}px`};`}

  ::before,
  ::after {
    content: "";
    flex: 1;
    ${({ vertical, color }) =>
      vertical
        ? `
         height: 50%;
         border-left: ${1}px solid
       ${color ? (COLORS[color] ? COLORS[color] : color) : COLORS.black.regular};`
        : `border-bottom: ${1}px solid
       ${color ? (COLORS[color] ? COLORS[color] : color) : COLORS.black.regular};`}
  }

  ::before {
    ${({ vertical, children }) =>
      vertical
        ? `margin-bottom: ${children ? "9px" : 0};`
        : `margin-right: ${children ? "9px" : 0};`}
  }

  ::after {
    ${({ vertical, children }) =>
      vertical
        ? `margin-top: ${children ? "9px" : 0};`
        : `margin-left: ${children ? "9px" : 0};`}
  }
`;

export const Divider = (props) => {
  const { children } = props;

  return <Root {...props}>{children}</Root>;
}