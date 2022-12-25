import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { Button } from "./Button";
import { Text } from "./Text";
import styled from "styled-components";
import PropTypes from "prop-types";

export const DropdownMenu = ({
  title,
  menuList = [],
  onClick,
  buttonVariant,
  buttonSize,
  textVariant,
  textColor,
  iconStyle,
}) => {
  const menu = (
    <MenuContainer onClick={onClick}>
      {menuList.map((el) => (
        <Menu.Item key={el.key}>{el.value}</Menu.Item>
      ))}
    </MenuContainer>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button variant={buttonVariant} size={buttonSize}>
        <Space>
          <Text variant={textVariant} color={textColor}>
            {title}
          </Text>
          <DownOutlined style={iconStyle} />
        </Space>
      </Button>
    </Dropdown>
  );
};

const MenuContainer = styled(Menu)`
  border-radius: 16px;
  padding: 12px;
`;

DropdownMenu.propTypes = {
  title: PropTypes.string,
  menuList: PropTypes.array,
  onClick: PropTypes.func,
  buttonVariant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'ghost']),
  buttonSize: PropTypes.oneOf(['small', 'big', 'xtra']),
  textVariant: PropTypes.oneOf([
    'headingLarge', 'headingMedium', 'headingRegular',
    'headingSmall', 'label', 'link', 'body1', 'body2',
    'caption', 'alert', 'subtitle1', 'subtitle2', 'button',
    'buttonMobile', 'h5', 'h4', 'footer'
  ]),
  textColor: PropTypes.string,
  iconStyle: PropTypes.object,
}
