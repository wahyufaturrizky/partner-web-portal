import React from "react";
import styled from "styled-components";
import { COLORS } from '../const/COLORS';

const Root = styled.div`
  width: ${({ width }) => width || "auto"};
  display: flex;
  flex-direction: column;
  flex-wrap: ${({ noWrap }) => (noWrap ? "nowrap" : "wrap")};
  ${({ shrink }) => (shrink ? `flex-shrink: ${shrink};` : "")}
  ${({ ratio }) => (ratio ? `flex: ${ratio};` : "")}
  ${({ justifyContent }) =>
    justifyContent ? `justify-content: ${justifyContent};` : ""}
  ${({ alignItems }) => (alignItems ? `align-items: ${alignItems};` : "")}
  ${({ grow }) => (grow ? "flex-grow: 1;" : "")}
  ${({ color }) => (color ? `background-color: ${COLORS[color]};` : "")}

  ${({ clickable }) => (clickable ? "cursor: pointer;" : "")}
  ${({ margin }) => (margin ? `margin: ${margin};` : "")}
  ${({ padding }) => (padding ? `padding: ${padding};` : "")}
  ${({ gap }) => (gap ? `gap: ${gap};` : "")}
`;

export const Col = (props) => {
  const { children } = props;

  return <Root {...props}>{children}</Root>;
}
