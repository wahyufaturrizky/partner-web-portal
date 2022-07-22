import React from "react";
import Router from "next/router";
import { Sidebar, Layout, Header } from "pink-lava-ui";

import {
	ICField,
  ICUser,
  ICMenu,
  ICCalendar,
  ICFinance
} from '../assets'

const menu = [
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

const AdminLayout = (props: any) => {
	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sidebar logo="/icons/logo-nabati.svg" menu={menu} defaultMenu={"dashboard"} />
			<Layout className="site-layout">
				<Header />
				<div style={{ padding: "20px" }}>{props}</div>
			</Layout>
		</Layout>
	);
};

export default AdminLayout;
