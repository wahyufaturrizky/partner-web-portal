import React from "react";
import { Steps as StepsAntd } from "antd";
import styled from "styled-components";
import Icon, {
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { ReactComponent as CircleSvg } from "../assets/circle.svg";
import { ReactComponent as CircleOutlinedSvg } from "../assets/circle-outlined.svg";

const { Step } = StepsAntd;

const CircleIcon = (props) => <Icon component={CircleSvg} {...props} />;
const CirlceOutlinedIcon = (props) => (
  <Icon component={CircleOutlinedSvg} {...props} />
);

const renderStatusIcon = (status) => {
  switch (status) {
    case "wait":
      return <CirlceOutlinedIcon style={{ color: "white" }} />;
    case "process":
      return (
        <CircleIcon
          style={{
            color: "#2BBECB",
          }}
        />
      );
    case "finish":
      return <CheckCircleFilled style={{ color: "#2BBECB" }} />;
    case "error":
      return <ExclamationCircleFilled style={{ color: "#ED1C24" }} />;

    default:
      break;
  }
};

export const Steps = ({ stepList, ...props }) => {
  return (
    <StepBase {...props}>
      {stepList?.map((el, index) => (
        <Step
          key={index}
          status={el.status}
          title={el.title}
          icon={renderStatusIcon(el.status)}
        />
      ))}
    </StepBase>
  );
};

const StepBase = styled(StepsAntd)`
  .ant-steps-item-process
    .ant-steps-item-icon
    > .ant-steps-icon
    .ant-steps-icon-dot {
    background: #2bbecb;
  }

  .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background-color: #2bbecb;
  }

  .ant-steps-item:not(.ant-steps-item-active)
    > .ant-steps-item-container[role="button"]:hover
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: #2bbecb;
  }
`;
