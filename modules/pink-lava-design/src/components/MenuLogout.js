import React from "react";
import { Dropdown, Menu } from "antd";

const MenuLogout = ({ children, menu }) => {
  return <Dropdown overlay={menu}>{children}</Dropdown>;
};

export { MenuLogout };
