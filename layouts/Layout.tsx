import React, { useState } from "react";
import Router from "next/router";
import { Sidebar, Layout, Header, MenuLogout } from "pink-lava-ui";


import { ICField, ICUser, ICMenu, ICCalendar, ICFinance, ICInventory } from "../assets";
import ICAccount from '../assets/icons/ic-avatar-default.svg'
import ICAccountSetting from '../assets/icons/ic-setting.svg'
import ICCompany from '../assets/icons/ic-company.svg'
import ICChangeLanguage from '../assets/icons/ic-globe.svg'
import ICLogout from '../assets/icons/ic-logout.svg'
import ICArrowBottom from '../assets/icons/ic-arrow-bottom.svg'
import styled from "styled-components";

const menuConfig = [
  { type: "title", title: "Overview" },
  {
    key: "dashboard",
    type: "menu",
    title: "Dashboard",
    icon: ICField,
    content: () => "Dashboard",
    onClick: () => Router.push("/dashboard"),
  },
  { type: "divider" },
  { type: "title", title: "Configuration" },
  {
    key: "company-list",
    type: "menu",
    title: "Company List",
    icon: ICField,
    content: () => "Company List",
    onClick: () => Router.push("/company-list"),
  },
  {
    key: "user-config",
    title: "User Config",
    icon: ICUser,
    children: [
      {
        key: "user-config-list",
        title: "User List",
        content: () => "User List",
        onClick: () => Router.push("/user-config/"),
      },
      {
        key: "user-config-role-list",
        title: "Role List",
        content: () => "Role List",
        onClick: () => Router.push("/user-config/role"),
      },
      {
        key: "user-config-permission-list",
        title: "Permission List",
        content: () => "Permission List",
        onClick: () => Router.push("/user-config/permission"),
      },
      {
        key: "user-config-sequence-number",
        title: "Sequence Number",
        content: () => "Sequence List",
        onClick: () => Router.push("/user-config/sequence-number"),
      },
      {
        key: "user-config-approval-list",
        title: "Approval List",
        content: () => "Approval List",
        onClick: () => Router.push("/user-config/approval"),
      },
    ],
  },
  {
    key: "business-Process",
    title: "Business Process",
    icon: ICFinance,
    children: [
      {
        key: "process",
        title: "Process",
        content: () => "Process",
        onClick: () => Router.push("/business-process/process"),
      },
      {
        key: "business-process",
        title: "Business Process",
        content: () => "Business Process",
        onClick: () => Router.push("/business-process"),
      },
    ],
  },
  {
    key: "menu-config",
    title: "Menu Config",
    icon: ICMenu,
    children: [
      {
        key: "menu-list",
        title: "Menu List",
        content: () => "Menu List",
        onClick: () => Router.push("/menu-config"),
      },
      {
        key: "menu-design",
        title: "Menu Design",
        content: () => "Menu Design",
        onClick: () => Router.push("/menu-config/design"),
      },
    ],
  },
  {
    key: "module-config",
    type: "menu",
    title: "Module Config",
    icon: ICField,
    content: () => "Module Config",
    onClick: () => Router.push("/module-config"),
  },
  {
    key: "finance-config",
    title: "Finance Config",
    icon: ICCalendar,
    children: [
      {
        key: "account-group",
        title: "Acount Group",
        content: () => "Account Group",
        onClick: () => Router.push("/finance-config/account-group"),
      },
      {
        key: "coa-template",
        title: "CoA Template",
        content: () => "CoA Template",
        onClick: () => Router.push("/finance-config/coa-template"),
      },
    ],
  },
  {
    key: "formating",
    title: "Formating",
    icon: ICMenu,
    children: [
      {
        key: "currency-format",
        title: "Currency Format",
        content: () => "Currency Format",
        onClick: () => Router.push("/formating/currency"),
      },
      {
        key: "number-format",
        title: "Number Format",
        content: () => "Number Format",
        onClick: () => Router.push("/formating/number"),
      },
      {
        key: "date-format",
        title: "Date Format",
        content: () => "Date Format",
        onClick: () => Router.push("/formating/date"),
      },
    ],
  },
];

const menuMdm = [
  { type: "title", title: "Overview" },
  {
    key: "dashboard",
    type: "menu",
    title: "Dashboard",
    icon: ICField,
    content: () => "Dashboard",
    onClick: () => Router.push("/dashboard"),
  },
  { type: "divider" },
  { type: "title", title: "Configuration" },
  {
    key: "general",
    title: "General",
    icon: ICField,
    children: [
      {
        key: "general-channel",
        title: "Channel",
        content: () => "Channel",
        onClick: () => Router.push("/channel"),
      },
    ],
  },
  { type: "title", title: "Inventory" },
  {
    key: "product",
    title: "Product",
    icon: ICInventory,
    children: [
      {
        key: "product-brand",
        title: "Product Brand",
        content: () => "Product Brand",
        onClick: () => Router.push("/product-brand"),
      },
      {
        key: "uom-category",
        title: "UoM Category",
        content: () => "UoM Category",
        onClick: () => Router.push("/unit-of-measure-category"),
      },
      {
        key: "uom",
        title: "Unit of Measure",
        content: () => "Unit of Measure",
        onClick: () => Router.push("/unit-of-measure"),
      },
    ],
  },
];

const itemsMenu = [
  {label: "Config"},
  {label: "Master Data Management"},
];


const flexStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '.5rem',
  paddingBottom: '1rem',
  fontSize: '14px',
  cursor: 'pointer'
 }

const AdminLayout = (props: any) => {
  const [current, setCurrent] = useState("0");

  const handleCLickTabNav = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = (e: any) => {
    localStorage.clear()
    window.location.href = '/login'

  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        logo="/icons/logo-nabati.svg"
        menu={current === "0" ? menuConfig : menuMdm}
        defaultMenu={"dashboard"}
      />
      <Layout className="site-layout">
        <Header
          mode="horizontal"
          onClick={handleCLickTabNav}
          selectedKeys={[current]}
          items={itemsMenu}
        >
          <MenuLogout
            menu={
              <WrapperMenuLogout>
                <WrapeprProfile>
              <ICAccount />
                <div>
                  <TextName>Admin</TextName>
                  <TextRole>Super User</TextRole>
                </div>
              </WrapeprProfile>
              <div style={flexStyles}><ICAccountSetting /><p>Account Settings</p></div>
              <div style={flexStyles}><ICCompany /><p>Company List</p></div>
              <div style={flexStyles}><ICChangeLanguage /><p>Change Language</p></div>
              <div style={flexStyles} onClick={handleLogout}><ICLogout /><p>Logout</p></div>
            </WrapperMenuLogout>
          }
        >
          <MenuDropdown>
            <div style={{gap: '5px', display: 'flex', alignItems: 'center', fontSize: '14px'}}>
              <ICAccount />
              <p>Admin</p>
            </div>
            <ICArrowBottom />
          </MenuDropdown>
        </MenuLogout>
        </Header>
        <div style={{ padding: "20px" }}>{props}</div>
      </Layout>
    </Layout>
  );
};


const WrapeprProfile = styled.div`
display: flex;
align-items: center;
gap: .5rem;
border-bottom: 1px solid #F4F4F4;
padding-bottom: 1rem;
margin-bottom: 1rem;
cursor: pointer;
`

const WrapperMenuLogout = styled.div`
width: 200px;
height: 272px;
background: #FFFFFF;
box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
border-radius: 16px;
padding: 20px;
`

const MenuDropdown = styled.div`
  border: 1.5px solid #AAAAAA;
  border-radius: 24px;
  width: 180px;
  height: 3rem;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TextName = styled.p`
  margin: 0;
  fontSize: '16px',
  fontWeight: 600;
  color: #000000;
`

const TextRole = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  margin: 0;
  color: #666666;
`

export default AdminLayout;
