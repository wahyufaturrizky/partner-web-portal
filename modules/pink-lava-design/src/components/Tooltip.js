import React from "react";
import { Tooltip as TooltipAntd } from "antd";

export const Tooltip = ({ children, ...props }) => (
  <TooltipAntd {...props}>{children}</TooltipAntd>
);
