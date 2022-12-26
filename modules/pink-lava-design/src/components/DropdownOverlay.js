import React from "react";
import { Dropdown, Menu } from "antd";
import styled from "styled-components";

export const DropdownOverlay = ({ menuList = [], onClick, ...props }) => {
  const menu = (
    <MenuContainer onClick={onClick}>
      {menuList.map((el) => (
        <Menu.Item key={el.key}>{el.value}</Menu.Item>
      ))}
    </MenuContainer>
  );

  return <Dropdown overlay={menu} trigger={["click"]} {...props} />;
};

const MenuContainer = styled(Menu)`
  border-radius: 16px;
  padding: 12px;
`;
