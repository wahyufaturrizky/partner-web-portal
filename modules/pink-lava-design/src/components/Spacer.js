import React from "react";
import styled from 'styled-components';
import { COLORS } from '../const/COLORS';

export const Spacer = styled.span`
  display: ${p=> p.display || "block"};
  width: ${p => p.size}px;
  min-width: ${p => p.size}px;
  height: ${p => p.size}px;
  min-height: ${p => p.size}px;
  background-color: ${p => COLORS[p.color] || p.color || 'transparent'};
  flex-grow: ${(p) => p.filler && 1};
  flex-basis: ${p => p.basis || 'auto'};
`;