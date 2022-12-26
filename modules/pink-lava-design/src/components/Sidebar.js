import { Layout, Menu, Divider, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as FieldListIcon } from '../assets/field-list.svg';
import { ReactComponent as UserListIcon } from '../assets/user-list.svg';
import { Text } from './Text';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export const Sidebar = ({ menu, defaultMenu, logo, logoSubtitle, style }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [activePage, setActivePage] = useState(defaultMenu || 'dashboard');
    const [activeContent, setActiveContent] = useState(
        menu.find((menu) => menu.key === defaultMenu).content
    );
  
    return (
        // <Layout style={{ minHeight: '100vh' }}>
        <BaseSider
            theme={'light'}
            style={{
                overflow: 'auto',
                height: '100vh',
                scrollbarColor: 'white',
                scrollbarWidth: 'none',
                background: '#2BBECB',
                width: '268px !important',
                paddingLeft: '24px',
                paddingRight: '24px',
                ...style,
            }}
            collapsible
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}>
            {!collapsed && (
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}>
                        <Logo>
                            {logo && <img style={{ objectFit: 'contain' }} src={logo} />}
                        </Logo>
                        {logoSubtitle && (
                            <Text variant='headingRegular' textAlign='center' color='white'>
                                {logoSubtitle}
                            </Text>
                        )}
                    </div>

                    {/* <Logo src="/edot-logo.png" /> */}
                    {/* <Text>Name Your System</Text> */}
                </>
            )}
            <BaseMenu
                style={{ background: '#2BBECB' }}
                theme='light'
                defaultSelectedKeys={[activePage]}
                mode='inline'>
                {menu.map((menu) =>
                    menu.type === 'divider' ? (
                        <BaseDivider />
                    ) : menu.type === 'title' ? (
                        <OverViewText style={{ marginTop: '8px' }} collapsed={collapsed}>
                            {menu.title}
                        </OverViewText>
                    ) : menu.type === 'dropdown' ? (
                        <InputSelect
                            options={menu?.items?.map((item) => ({
                                value: item.name,
                                label: item.name
                            }))}
                            onChange={menu?.onChange}
                            defaultValue={menu?.default?.name}
                        />
                    ) : menu.children ? (
                        <BaseSubMenu
                            collapsed={collapsed}
                            key={menu.key}
                            icon={<menu.icon />}
                            title={menu.title}>
                            {menu.children.map((child) => (
                                <BaseMenuItem
                                    onClick={() => {
                                        setActivePage(child.key);
                                        setActiveContent(child.content);
                                        child.onClick();
                                    }}
                                    collapsed={collapsed}
                                    key={child.key}>
                                    {child.title}
                                </BaseMenuItem>
                            ))}
                        </BaseSubMenu>
                    ) : (
                        <BaseMenuItem
                            onClick={() => {
                                setActivePage(menu.key);
                                setActiveContent(menu.content);
                                menu.onClick();
                            }}
                            collapsed={collapsed}
                            key={menu.key}
                            icon={<menu.icon />}>
                            {menu.title}
                        </BaseMenuItem>
                    )
                )}
            </BaseMenu>
        </BaseSider>
        //   {/* <Layout className="site-layout">
        //     <BaseHeader className="site-layout-background" style={{ padding: 0 }} />
        //     <Body>
        //       {activeContent}
        //       <Col>
        //         <Text variant={"h4"}>Field</Text>
        //         <Spacer size={20} />
        //         <Card padding="16px">
        //           <Row justifyContent="space-between">
        //             <Search width="380px"/>
        //             <Row gap="16px">
        //               <Button size="big" variant={"tertiary"}>Delete</Button>
        //               <Button size="big" variant={"primary"}>Register</Button>
        //             </Row>
        //           </Row>
        //         </Card>
        //         <Spacer size={10} />
        //         <Card padding="16px 20px">
        //           <Col gap="60px">
        //             <Table />
        //             <Pagination />
        //           </Col>
        //         </Card>
        //       </Col>
        //       {}
        //     </Body>
        //   </Layout>
        // </Layout> */}
    );
};

Sidebar.defaultProps = {
    menu: [
        { type: 'title', title: 'Overview' },
        {
            key: 'dashboard',
            type: 'menu',
            title: 'Dashboard',
            icon: FieldListIcon,
            content: () => 'Dashboard',
        },
        { type: 'divider' },
        { type: 'title', title: 'Configuration' },
        {
            key: 'field-list',
            type: 'menu',
            title: 'Field List',
            icon: FieldListIcon,
            content: () => 'Field',
        },
        {
            key: 'user-config',
            title: 'Zeus User Config',
            icon: UserListIcon,
            children: [
                {
                    key: 'super-user-list',
                    title: 'Super User List',
                    content: () => 'Super User List',
                },
                { key: 'role-list', title: 'Role List', content: () => 'Role List' },
                {
                    key: 'permission-list',
                    title: 'Permission List',
                    content: () => 'Permission List',
                },
            ],
        },
    ],
    defaultMenu: 'dashboard',
};

const Card = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 16px;
`;

const Body = styled.div`
    padding: 20px;
`;

const BaseHeader = styled(Header)`
    && {
        background-color: white !important;
        height: 54px !important;
    }
`;

const BaseDivider = styled(Divider)`
    margin: 0px !important;
    border-top: 0.5px solid #f4fbfc;
`;

const Logo = styled.div`
    display: flex;
    justify-content: center;
    align-self: center;
    margin-top: 16px;
    margin-bottom: 19px;
    width: 160px;
    height: 72px;
`;

const OverViewText = styled.div`
    width: 220px;
    height: 36px;
    padding: 9px 10px !important;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    align-items: center;
    text-transform: uppercase;
    color: #ffffff;
    display: ${(p) => (p.collapsed ? 'none' : 'flex')} !important;
`;

const BaseSider = styled(Sider)`
    .ant-layout-sider-children {
        margin-top: ${(p) => (p.collapsed ? '88px' : '0px')} !important;
    }

    .ant-layout-sider-trigger {
        width: 24px !important;
        height: 24px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #aae5ea !important;
        color: white !important;
        border-radius: 4px;
        position: absolute;
        top: 29px;
        right: ${(p) => (p.collapsed ? '23px' : '15px')};
    }

    && {
        width: ${(p) => (p.collapsed ? '80px' : '268px')} !important;
        flex: unset !important;
        max-width: unset !important;
    }
`;

const BaseMenuItem = styled(Menu.Item)`
    height: 36px;
    border-radius: 8px;
    padding: ${(p) => (p.collapsed ? '10px 10px' : '7px 12px')} !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    color: #ffffff;
    width: ${(p) => (p.collapsed ? '36px' : '220px')} !important;

    span:last-child {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        margin-left: 4px;
    }
`;

const BaseMenu = styled(Menu)`
    border: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .ant-menu-item::after {
        border: none;
    }
`;

const BaseSubMenu = styled(SubMenu)`
    .ant-menu-submenu-title {
        span {
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            margin-left: 4px;
        }
        height: 36px;
        border-radius: 8px;
        padding: ${(p) => (p.collapsed ? '10px 10px' : '7px 12px')} !important;
        margin: 0 !important;
        display: flex;
        align-items: center;
        color: #ffffff;
    }

    && {
        width: ${(p) => (p.collapsed ? '36px' : '220px')} !important;
    }

    .ant-menu-item:hover {
        background: #ff34ac;
        color: white !important;
        border-radius: 8px;
    }
`;

const InputSelect = styled(Select)`
  min-height: 48px !important;
  background: transparent !important;
  box-sizing: border-box !important;
  border-radius: ${(p) => (p.rounded ? "64px" : "8px")} !important;

  .ant-select-selector {
    min-height: 48px !important;
    background: transparent !important;
    border: 1px solid ${(p) => (p.error ? "#ED1C24" : "#fff")} !important;
    box-sizing: border-box !important;
    border-radius: ${(p) => (p.rounded ? "64px" : "8px")} !important;
    display: flex;
    align-items: center;
    padding: 8px 16px !important;
    display: flex;
    color: white !important;
  }

  .ant-select-selection-item {
    display: flex;
    padding: 16px 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  .ant-select-arrow {
    color: #fff;
  }

  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    border-color: transparent !important;
    box-shadow: none;
    outline: none;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: transparent !important;
  }

  .rc-virtual-list-holder-inner {
    gap: 8px;
  }

  .ant-select-dropdown {
    padding: 0px !important;
  }
`;