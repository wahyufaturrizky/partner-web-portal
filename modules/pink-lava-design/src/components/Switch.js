import { Switch as SwitchAntd } from "antd";
import React from "react";
import styled from "styled-components";

export const Switch = ({
  defaultChecked = true,
  onChange,
  checked,
  disabled,
}) => {
  return (
    <BaseSwitch
      disabled={disabled}
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={onChange}
    />
  );
};

const BaseSwitch = styled(SwitchAntd)`
  width: 51px;
  height: 31px;
  background: #dddddd;

  .ant-switch-handle {
    top: 2px;
    width: 25px;
    left: 3px;
    height: 25px;
    background: #ffffff;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
    border-radius: 100px;
  }

  .ant-switch-handle::before {
    border-radius: 100px;
  }
`;
