/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';

import { get } from 'lodash';
import { COLORS } from 'styles/COLOR';
import { TEXTSTYLES } from 'styles/TEXTSTYLES';

const DefaultRoot = styled.p<any>`
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

  display: ${({ inline }) => (inline ? 'inline' : 'block')};
  width: ${({ fluid, width }) => (fluid ? '100%' : width || 'fit-content')};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
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
  ...rest
}: any) => (isHtml ? (
  <DefaultRoot
    {...rest}
    dangerouslySetInnerHTML={{ __html: `${children}` }}
  />
) : (
  <DefaultRoot {...rest}>{children}</DefaultRoot>
));
