import React from 'react'
import { Popover } from 'antd';

export const CustomPopover = ({
  content,
  children,
  title,
  trigger
}) => (
  <Popover content={content} title={title} trigger={trigger}>
    {children}
  </Popover>
);

