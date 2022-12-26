import React from "react";
import styled from "styled-components";
import { COLORS } from '../const/COLORS';

const Root = styled.div`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
  flex-wrap: ${({ noWrap }) => (noWrap ? "nowrap" : "wrap")};
  ${({ padding }) => (padding ? `padding: ${padding};` : "")}
  ${({ width }) => (width ? `width: ${width};` : "")}
  ${({ height }) => (height ? `height: ${height};` : "")}
  ${({ gap }) => (gap ? `gap: ${gap};` : "")}
  ${({ justifyContent }) =>
    justifyContent ? `justify-content: ${justifyContent};` : ""}
  ${({ alignItems }) => (alignItems ? `align-items: ${alignItems};` : "")}
  ${({ clickable }) => (clickable ? "cursor: pointer;" : "")}
  ${({ hoverBackground }) =>
    hoverBackground
      ? `
  &:hover {
    background-color: ${COLORS[hoverBackground]};
  }`
    : ""}
`;

export const Row = (props) => {
  const { children = null } = props;

  return <Root {...props}>{children}</Root>;
}
