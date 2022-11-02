import Router from "next/router";
import {
  Header,
  Layout,
  MenuLogout,
  Notification,
  Sidebar,
  Spacer,
  Row,
  Col,
  Text,
} from "pink-lava-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ICCalendar,
  ICDollar,
  ICField,
  ICFinance,
  ICInventory,
  ICMenu,
  ICPackage,
  ICPurchasOrg,
  ICUser,
} from "../assets";
import ICArrowBottom from "../assets/icons/ic-arrow-bottom.svg";
import ICAccount from "../assets/icons/ic-avatar-default.svg";
import ICBadge from "../assets/icons/ic-badge.svg";
import ICCompany from "../assets/icons/ic-company.svg";
import ICDocument from "../assets/icons/ic-document.svg";
import ICChangeLanguage from "../assets/icons/ic-globe.svg";
import ICLogout from "../assets/icons/ic-logout.svg";
import ICPaperMoney from "../assets/icons/ic-paper-money.svg";
import ICPercent from "../assets/icons/ic-percent.svg";
import ICSalesman from "../assets/icons/ic-salesman.svg";
import ICAccountSetting from "../assets/icons/ic-setting.svg";
import ICTransportation from "../assets/icons/ic-transportation.svg";
import ICFlagIndonesia from "../assets/icons/ic-flag-idn.svg";
import ICFlagEnglish from "../assets/icons/ic-flag-us.svg";

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
    key: "billing",
    title: "Billing",
    icon: ICUser,
    children: [
      {
        key: "billing-calculation",
        title: "Calculation",
        content: () => "Calculation",
        onClick: () => Router.push("/calculation/"),
      },
      {
        key: "billing-report",
        title: "Report",
        content: () => "Report",
        onClick: () => Router.push("/user-config/role"),
      },
    ],
  },
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
        key: "product-category",
        title: "Product Category",
        content: () => "Product Category",
        onClick: () => Router.push("/product-category"),
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
  {
    key: "vendor",
    title: "Vendor",
    content: () => "Vendor",
    icon: ICPackage,
    onClick: () => Router.push("/vendor"),
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
      {
        key: "retail-pricing",
        title: "Retail Pricing",
        content: () => "Retail Pricing",
        onClick: () => Router.push("/retail-pricing"),
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
        key: "salesman-sub-menu",
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
  {
    key: "profit-center",
    title: "Profit Center",
    content: () => "Profit Center",
    icon: ICPaperMoney,
    onClick: () => Router.push("/profit-center"),
  },
  {
    key: "tax",
    title: "Tax",
    content: () => "Tax",
    icon: ICPercent,
    onClick: () => Router.push("/tax"),
  },
  {
    key: "cost-center",
    title: "Cost Center",
    content: () => "Cost Center",
    icon: ICDollar,
    onClick: () => Router.push("/cost-center"),
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
      {
        key: "exchange-rate",
        title: "Exchange Rate",
        content: () => "Exchange Rate",
        onClick: () => Router.push("/country-structure/exchange-rate"),
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
  {
    key: "working-calendar",
    title: "Working Calendar",
    content: () => "Working Calendar",
    icon: ICCalendar,
    onClick: () => Router.push("/working-calendar"),
  },
];

const itemsMenu = [{ label: "Config" }, { label: "Master Data Management" }];

const notifItems = [
  {
    isRead: false,
    content: (
      <p style={{ fontWeight: "600", marginBottom: 0 }}>
        Term of payment of the week, Please complete it before 01-01-2022
      </p>
    ),
  },
  {
    isRead: false,
    content: (
      <p style={{ fontWeight: "600", marginBottom: 0 }}>
        Term of payment following the month, Please complete it before 01-01-2022
      </p>
    ),
  },
  {
    isRead: true,
    content: <p style={{ fontWeight: "600", marginBottom: 0 }}>New Product Launch</p>,
  },
  {
    isRead: true,
    content: <p style={{ fontWeight: "600", marginBottom: 0 }}>You need review a approval Here</p>,
  },
];

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
  const [isChangeLang, setIsChangeLang] = useState(false);

  const handleCLickTabNav = (e: any) => {
    setCurrent(e.key);
    Router.push("/dashboard");
  };

  const handleLogout = (e: any) => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar
        logo="/icons/logo-nabati.svg"
        menu={current === "0" ? menuConfig : menuMdm}
        defaultMenu={"dashboard"}
      />
      <Layout
        className="site-layout"
        style={{
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Header
          mode="horizontal"
          onClick={handleCLickTabNav}
          selectedKeys={[current]}
          items={itemsMenu}
        >
          <div
            style={{
              display: "flex",
              paddingTop: ".7rem",
              marginBottom: ".78rem",
              background: "#fff",
            }}
          >
            <Notification items={notifItems} />
            <Spacer size={15} />

            {isChangeLang ? (
              <LanguageOption>
                <Col>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      localStorage.setItem("lan", "id-ID");
                      setIsChangeLang(false);
                    }}
                  >
                    <Text variant="headingRegular">Change Language</Text>
                    <Row gap="12px" alignItems="center">
                      <ICFlagIndonesia />
                      <p>Indonesia</p>
                    </Row>
                  </div>

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      localStorage.setItem("lan", "en-US");
                      setIsChangeLang(false);
                    }}
                  >
                    <Row gap="12px" alignItems="center">
                      <ICFlagEnglish />
                      <p>English</p>
                    </Row>
                  </div>
                </Col>
              </LanguageOption>
            ) : (
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
                    <a
                      style={{ color: "#000" }}
                      target="_blank"
                      href="https://accounts.edot.id/infopribadi"
                      rel="noopener noreferrer"
                    >
                      <div style={flexStyles}>
                        <ICAccountSetting />
                        <p>Account Settings</p>
                      </div>
                    </a>
                    <div style={flexStyles}>
                      <ICCompany />
                      <p>Company List</p>
                    </div>
                    <div style={flexStyles} onClick={() => setIsChangeLang(true)}>
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
                  <div
                    style={{ gap: "5px", display: "flex", alignItems: "center", fontSize: "14px" }}
                  >
                    <ICAccount size={64} />
                    <p>Admin</p>
                  </div>
                  <ICArrowBottom />
                </MenuDropdown>
              </MenuLogout>
            )}
          </div>
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

const LanguageOption = styled.div`
  top: 1rem;
  right: 1rem;
  position: absolute;
  background-color: white;
  width: 200px;
  height: 160px;
  box-shadow: 0px 4px 16px rgba(170, 170, 170, 0.15);
  border-radius: 16px;
  padding: 20px;
`;

export default AdminLayout;
