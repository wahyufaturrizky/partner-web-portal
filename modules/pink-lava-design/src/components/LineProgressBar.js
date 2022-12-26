import { Progress as ProgressAntd } from 'antd';
import React from 'react'
import styled from 'styled-components';

export const Progress = () => {
  return (
      <BaseProgress percent={75} strokeWidth={12} width={192} />
  )
}

const BaseProgress = styled(ProgressAntd)`
  .ant-progress-bg {
    background-color: ${p => p.theme.blue.regular} !important;
    height: 10px !important;
  }

  .ant-progress-text {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #2BBECB;
  }
`