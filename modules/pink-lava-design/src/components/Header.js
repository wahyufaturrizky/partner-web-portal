import { Col, Layout, Menu as MenuAntd, Row } from "antd";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const { Header: HeaderAntd } = Layout;
export const Header = ({
  onClick,
  selectedKeys,
  items,
  withMenu = true,
  headerStyle,
  children,
}) => {
  return (
    <BaseHeader style={{ padding: 0, ...headerStyle }}>
      <Container>
        {withMenu && (
          <BaseMenu
            onClick={onClick}
            selectedKeys={selectedKeys}
            mode={"horizontal"}
          >
            {items?.map((data, key) => (
              <BaseMenuItem key={key}>{data.label}</BaseMenuItem>
            ))}
          </BaseMenu>
        )}
        {children}
      </Container>
    </BaseHeader>
  );
};

const BaseHeader = styled(HeaderAntd)`
  && {
    background-color: white !important;
  }

  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected,
  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected {
    color: #2bbecb;
  }

  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected::after,
  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected::after {
    border-bottom: 2px solid #2bbecb;
  }

  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,
  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover,
  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-active {
    color: #2bbecb !important;
  }
`;

const BaseMenu = styled(MenuAntd)`
  width: 100%;
  && {
    color: #888888;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BaseMenuItem = styled(BaseMenu.Item)``;

Header.propTypes = {
  onClick: PropTypes.func,
  selectedKeys: PropTypes.array,
  items: PropTypes.array,
  withMenu: PropTypes.bool,
  headerStyle: PropTypes.object,
  children: PropTypes.node,
};
