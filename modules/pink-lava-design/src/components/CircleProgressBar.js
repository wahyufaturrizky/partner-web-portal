import { Progress as ProgressAntd } from "antd";
import React from "react";
import styled from "styled-components";
import { COLORS } from "../const/COLORS";

export const Progress = (props) => {
  return <BaseProgress {...props} />;
};

const BaseProgress = styled(ProgressAntd)`
  .ant-progress-inner:not(.ant-progress-circle-gradient)
    .ant-progress-circle-path {
    stroke: ${COLORS.blue.regular};
  }

  .ant-progress-text {
    font-style: normal;
    font-weight: 600;
    font-size: 34px;
    line-height: 46px;
    color: #2bbecb;
  }
`;
