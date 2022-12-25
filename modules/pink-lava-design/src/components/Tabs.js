import { Tabs as TabsAntd } from "antd";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
const { TabPane } = TabsAntd;

export const Tabs = ({ defaultActiveKey, onChange, listTabPane, ...props }) => {
  return (
    <>
      <TabsBase
        defaultActiveKey={defaultActiveKey}
        onChange={onChange}
        {...props}
      >
        {listTabPane?.map((data) => (
          <TabPane tab={data.title} key={data.title}>
            {data.children}
          </TabPane>
        ))}
      </TabsBase>
    </>
  );
};

const TabsBase = styled(TabsAntd)`
  .ant-tabs-top > .ant-tabs-nav::before {
    border: none;
  }

  .ant-tabs-tab {
    min-width: 96px !important;
    display: flex;
    justify-content: center;
  }

  .ant-tabs-nav {
    height: 54px;
    background: #ffffff;
    border-radius: 16px 16px 0px 0px;
  }

  .ant-tabs-ink-bar {
    background: #2bbecb;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #2bbecb;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  .ant-tabs-tab-btn {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #888888;
  }
`;

Tabs.propTypes = {
  listTabPane: PropTypes.oneOf([]),
  defaultActiveKey: PropTypes.string,
  onChange: PropTypes.func,
};

Tabs.defaultProps = {
  listTabPane: [],
};
