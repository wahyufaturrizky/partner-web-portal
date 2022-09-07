import React, { useState } from "react";
import Router from "next/router";
import { Sidebar, Layout, Header, MenuLogout } from "pink-lava-ui";

import {
  ICField,
  ICUser,
  ICMenu,
  ICCalendar,
  ICFinance,
  ICInventory,
  ICPurchasOrg,
  ICDollar,
} from "../assets";
import ICAccount from "../assets/icons/ic-avatar-default.svg";
import ICAccountSetting from "../assets/icons/ic-setting.svg";
import ICCompany from "../assets/icons/ic-company.svg";
import ICChangeLanguage from "../assets/icons/ic-globe.svg";
import ICLogout from "../assets/icons/ic-logout.svg";
import ICArrowBottom from "../assets/icons/ic-arrow-bottom.svg";
import ICBadge from "../assets/icons/ic-badge.svg";
import ICSalesman from "../assets/icons/ic-salesman.svg";
import ICDocument from "../assets/icons/ic-document.svg";
import ICTransportation from "../assets/icons/ic-transportation.svg";
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
  { type: "title", title: "OVERVIEW" },
  {
    key: "dashboard",
    type: "menu",
    title: "Dashboard",
    icon: ICField,
    content: () => "Dashboard",
    onClick: () => Router.push("/dashboard"),
  },
  { type: "divider" },
  { type: "title", title: "INVENTORY" },
  {
    key: "product",
    title: "Product",
    icon: ICInventory,
    children: [
      {
        key: "product-list",
        title: "Product List",
        content: () => "Product List",
        onClick: () => Router.push("/product-list"),
      },
      {
        key: "product-variant",
        title: "Product Variant",
        content: () => "Product Variant",
        onClick: () => Router.push("/product-variant"),
      },
      {
        key: "product-option",
        title: "Product Option",
        content: () => "Product Option",
        onClick: () => Router.push("/product-option"),
      },
      {
        key: "product-brand",
        title: "Product Brand",
        content: () => "Product Brand",
        onClick: () => Router.push("/product-brand"),
      },
      {
        key: "product-group",
        title: "Product Group",
        content: () => "Product Group",
        onClick: () => Router.push("/product-group"),
      },
      {
        key: "uom",
        title: "Unit of Measure",
        content: () => "Unit of Measure",
        onClick: () => Router.push("/unit-of-measure"),
      },
      {
        key: "uom-category",
        title: "UoM Category",
        content: () => "UoM Category",
        onClick: () => Router.push("/unit-of-measure-category"),
      },
      {
        key: "uom-conversion",
        title: "UoM Conversion",
        content: () => "UoM Conversion",
        onClick: () => Router.push("/unit-of-measure-conversion"),
      },
    ],
  },
  { type: "divider" },
  { type: "title", title: "SALES" },
  {
    key: "pricing",
    title: "Pricing",
    icon: ICDollar,
    children: [
      {
        key: "pricing-structure",
        title: "Pricing Structure",
        content: () => "Pricing Structure",
        onClick: () => Router.push("/pricing-structure"),
      },
    ],
  },
  {
    key: "customer",
    title: "Customer",
    icon: ICUser,
    children: [
      {
        key: "customers",
        title: "Customers",
        content: () => "Customers",
        onClick: () => Router.push("/customers"),
      },
      {
        key: "customer-group",
        title: "Customer Group",
        content: () => "Customer Group",
        onClick: () => Router.push("/customers/group"),
      },
    ],
  },
  {
    key: "salesman",
    title: "Salesman",
    icon: ICSalesman,
    children: [
      {
        key: "salesman-group",
        title: "Salesman Group",
        content: () => "Salesman Group",
        onClick: () => Router.push("/salesman/group"),
      },
      {
        key: "salesman",
        title: "Salesman",
        content: () => "Salesman",
        onClick: () => Router.push("/salesman"),
      },
      {
        key: "sales division",
        title: "Sales Division",
        content: () => "Sales Division",
        onClick: () => Router.push("/salesman/division"),
      },
    ],
  },
  { type: "divider" },
  { type: "title", title: "FINANCE" },
  {
    key: "term-of-payment",
    title: "Term Of Payment",
    content: () => "Term Of Payment",
    icon: ICDocument,
    onClick: () => Router.push("/term-of-payment"),
  },
  { type: "divider" },
  { type: "title", title: "LOGISTIC" },
  {
    key: "transportation-group",
    title: "Transportation Group",
    content: () => "Transportation Group",
    icon: ICTransportation,
    onClick: () => Router.push("/transportation-group"),
  },
  { type: "divider" },
  { type: "title", title: "HUMAN CAPITAL" },
  {
    key: "employee",
    title: "Employee",
    icon: ICBadge,
    children: [
      {
        key: "employee-list",
        title: "Employee List",
        content: () => "Employee List",
        onClick: () => Router.push("/employee-list"),
      },
      {
        key: "job-position",
        title: "Job Position",
        content: () => "Job Position",
        onClick: () => Router.push("/job-position"),
      },
      {
        key: "job-level",
        title: "Job Level",
        content: () => "Job Level",
        onClick: () => Router.push("/job-level"),
      },
      {
        key: "department",
        title: "Department",
        content: () => "Department",
        onClick: () => Router.push("/department"),
      },
      {
        key: "training-type",
        title: "Training Type",
        content: () => "Training Type",
        onClick: () => Router.push("/training-type"),
      },
    ],
  },
  { type: "divider" },
  { type: "title", title: "GENERAL" },
  {
    key: "country",
    title: "Country Structure",
    icon: ICBadge,
    children: [
      {
        key: "country",
        title: "Country",
        content: () => "Country",
        onClick: () => Router.push("/country-structure"),
      },
      {
        key: "zip-postal",
        title: "Zip/Postal Code",
        content: () => "Zip/Postal Code",
        onClick: () => Router.push("/country-structure/postal-code"),
      },
      {
        key: "currency",
        title: "Currency",
        content: () => "Currency",
        onClick: () => Router.push("/country-structure/currency"),
      },
    ],
  },
  {
    key: "company structure",
    title: "Company Structure",
    icon: ICField,
    children: [
      {
        key: "general-channel",
        title: "Channel",
        content: () => "Channel",
        onClick: () => Router.push("/channel"),
      },
      {
        key: "branch",
        title: "Branch/Depo",
        content: () => "Branch/Depo",
        onClick: () => Router.push("/branch"),
      },
      {
        key: "sales-organization",
        title: "Sales Organization",
        content: () => "Sales Organization",
        onClick: () => Router.push("/sales-organization"),
      },
      {
        key: "purchase-organization",
        title: "Purchase Organization",
        icon: ICPurchasOrg,
        content: () => "Purchase Organization",
        onClick: () => Router.push("/purchase-organization"),
      },
    ],
  },
];

const itemsMenu = [{ label: "Config" }, { label: "Master Data Management" }];

const flexStyles = {
  display: "flex",
  alignItems: "center",
  gap: ".5rem",
  paddingBottom: "1rem",
  fontSize: "14px",
  cursor: "pointer",
};

const AdminLayout = (props: any) => {
  const [current, setCurrent] = useState("0");

  const handleCLickTabNav = (e: any) => {
    setCurrent(e.key);
  };

  const handleLogout = (e: any) => {
    localStorage.clear();
    window.location.href = "/login";
  };

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
                <div style={flexStyles}>
                  <ICAccountSetting />
                  <p>Account Settings</p>
                </div>
                <div style={flexStyles}>
                  <ICCompany />
                  <p>Company List</p>
                </div>
                <div style={flexStyles}>
                  <ICChangeLanguage />
                  <p>Change Language</p>
                </div>
                <div style={flexStyles} onClick={handleLogout}>
                  <ICLogout />
                  <p>Logout</p>
                </div>
              </WrapperMenuLogout>
            }
          >
            <MenuDropdown>
              <div style={{ gap: "5px", display: "flex", alignItems: "center", fontSize: "14px" }}>
                <ICAccount size={64} />
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
  gap: 0.5rem;
  border-bottom: 1px solid #f4f4f4;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const WrapperMenuLogout = styled.div`
  width: 200px;
  height: 272px;
  background: #ffffff;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 16px;
  padding: 20px;
`;

const MenuDropdown = styled.div`
  border: 1.5px solid #aaaaaa;
  margin-right: 1rem;
  border-radius: 24px;
  width: 180px;
  height: 3rem;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TextName = styled.p`
  margin: 0;
  fontSize: '16px',
  fontWeight: 600;
  color: #000000;
`;

const TextRole = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  margin: 0;
  color: #666666;
`;

export default AdminLayout;
