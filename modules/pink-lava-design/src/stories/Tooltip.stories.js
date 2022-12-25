import { Button } from 'antd';
import React from 'react';
import { Card } from '../components/Card';

import { Tooltip as TooltipComponent } from '../components/Tooltip';
const text = <span>Tooltip Info</span>;

export default {
  title: 'Pink Lava/Tooltip',
  component: TooltipComponent,
};

const buttonWidth = 70;

const Template = (args) => (
  <Card>
    <div style={{ marginLeft: buttonWidth * 2, marginTop: 50 }}>
      <div style={{ display: 'flex', gap: 50, marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
        <TooltipComponent color={"#F4FBFC"} placement="topLeft" title={text}>
          TL
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="top" title={text}>
          Top
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="topRight" title={text}>
          TR
        </TooltipComponent>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 50, width: buttonWidth, float: 'left' }}>
        <TooltipComponent color={"#F4FBFC"} placement="leftTop" title={text}>
          LT
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="left" title={text}>
          Left
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="leftBottom" title={text}>
          LB
        </TooltipComponent>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 50, width: buttonWidth, marginLeft: buttonWidth * 4 + 24 }}>
        <TooltipComponent color={"#F4FBFC"} placement="rightTop" title={text}>
          RT
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="right" title={text}>
          Right
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="rightBottom" title={text}>
          RB
        </TooltipComponent>
      </div>
      <div style={{ display: 'flex', gap: 50, marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
        <TooltipComponent color={"#F4FBFC"} placement="bottomLeft" title={text}>
          BL
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="bottom" title={text}>
          Bottom
        </TooltipComponent>
        <TooltipComponent color={"#F4FBFC"} placement="bottomRight" title={text}>
          BR
        </TooltipComponent>
      </div>
    </div>
  </Card>
);

export const Tooltip = Template.bind({});