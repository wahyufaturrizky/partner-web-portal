import React from "react";
import { Sidebar, Layout, Header } from "pink-lava-ui";
import FieldListIcon from "../assets/field-list.svg";
import UserListIcon from "../assets/user-list.svg";
import IcMenuIcon from "../assets/Ic_menu.svg";
import Calendar from "../assets/calendar.svg";
import FinanceGroupIcon from "../assets/finance-group-logo.svg";
import Router from "next/router";

const menu = [
	{ type: "title", title: "Overview" },
	{
		key: "dashboard",
		type: "menu",
		title: "Dashboard",
		icon: FieldListIcon,
		content: () => "Dashboard",
		onClick: () => Router.push("/dashboard"),
	},
	{ type: "divider" },
	{ type: "title", title: "Configuration" },
	{
		key: "partner-config",
		title: "Partner Config",
		icon: UserListIcon,
		children: [
			{
				key: "partner-config-partner-list",
				title: "Partner List",
				content: () => "Role Config Partner List",
				onClick: () => Router.push("/partner-config-partner-list"),
			},
			{
				key: "partner-config-role-list",
				title: "Role List",
				content: () => "Role Config Role List",
				onClick: () => Router.push("/partner-config-role-list"),
			},
			{
				key: "partner-config-approval",
				title: "Approval",
				content: () => "Approval",
				onClick: () => Router.push("/partner-config-approval"),
			},
			{
				key: "partner-config-permission-list",
				title: "Permission List",
				content: () => "Permission List",
				onClick: () => Router.push("/partner-config-permission-list"),
			},
		],
	},
	{
		key: "country-structure",
		title: "Country Structure",
		icon: UserListIcon,
		children: [
			{
				key: "country",
				title: "Country",
				content: () => "Country",
				onClick: () => Router.push("/country"),
			},

			{
				key: "postal",
				title: "Zip/Postal Code",
				content: () => "Zip/Postal Code",
				onClick: () => Router.push("/country/postal"),
			},

			{
				key: "currency",
				title: "Currency",
				content: () => "Currency",
				onClick: () => Router.push("/country/currency"),
			},
		],
	},
	{
		key: "template-config",
		title: "Template Config",
		icon: UserListIcon,
		children: [
			{
				key: "template-general",
				title: "General",
				content: () => "General",
				onClick: () => Router.push("/template-config/general"),
			},
			{
				key: "template-config-role-list",
				title: "Role",
				content: () => "Role",
				onClick: () => Router.push("/template-config/role"),
			},
			{
				key: "template-config-approval",
				title: "Approval",
				content: () => "Approval",
				onClick: () => Router.push("/template-config/approval"),
			},
			{
				key: "template-config-menu",
				title: "Menu",
				content: () => "Menu",
				onClick: () => Router.push("/template-config/menu"),
			},
		],
	},
	{
		key: "user-config",
		title: "Zeus User Config",
		icon: UserListIcon,
		children: [
			{
				key: "super-user-list",
				title: "Super User List",
				content: () => "Super User List",
				onClick: () => Router.push("/super-user"),
			},
			{
				key: "role-list",
				title: "Role List",
				content: () => "Role List",
				onClick: () => Router.push("/role"),
			},
			{
				key: "permission-list",
				title: "Permission List",
				content: () => "Permission List",
				onClick: () => Router.push("/permission"),
			},
			{
				key: "approval",
				title: "Approval List",
				content: () => "Approval List",
				onClick: () => Router.push("/approval"),
			},
		],
	},
	{
		key: "finance-config",
		title: "Finance Config",
		icon: FinanceGroupIcon,
		children: [
			{
				key: "account-group",
				title: "Account Group",
				content: () => "Account Group",
				onClick: () => Router.push("/account-group"),
			},
			{
				key: "coa-template",
				title: "CoA Template",
				content: () => "CoA Template",
				onClick: () => Router.push("/coa-template"),
			},
		],
	},
	{
		key: "config",
		type: "menu",
		title: "Module Config",
		icon: FieldListIcon,
		content: () => "Module Config",
		onClick: () => Router.push("/config"),
	},
	{
		key: "business-process",
		title: "Business Process",
		icon: IcMenuIcon,
		children: [
			{
				key: "process",
				title: "Process",
				content: () => "Process",
				onClick: () => Router.push("/process"),
			},
			{
				key: "Business-Process",
				title: "Business Process",
				content: () => "Business Process",
				onClick: () => Router.push("/business-process"),
			},
		],
	},
	{
		key: "menu-config",
		title: "Menu Config",
		icon: IcMenuIcon,
		children: [
			{
				key: "menu-list",
				title: "Menu List",
				content: () => "Menu List",
				onClick: () => Router.push("/menu-list"),
			},
			{
				key: "menu-design",
				title: "Menu Design",
				content: () => "Menu Design",
				onClick: () => Router.push("/menu-design"),
			},
		],
	},
	{
		key: "formatting",
		title: "Formatting",
		icon: Calendar,
		children: [
			{
				key: "number-format",
				title: "Number Format",
				content: () => "Number Format",
				onClick: () => Router.push("/number-format"),
			},
			{
				key: "currency-format",
				title: "Currency Format",
				content: () => "Currency Format",
				onClick: () => Router.push("/currency-format"),
			},
			{
				key: "date-format",
				title: "Date Format",
				content: () => "Date Format",
				onClick: () => Router.push("/date-format"),
			},
			{
				key: "sequence-format",
				title: "Sequence Format",
				content: () => "Sequence Format",
				onClick: () => Router.push("/sequence-format"),
			},
		],
	},
	{
		key: "field-list",
		type: "menu",
		title: "Field List",
		icon: FieldListIcon,
		content: () => "Field",
		onClick: () => Router.push("/field"),
	},
];

const AdminLayout = (props: any) => {
	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sidebar logo="/logo-nabati.svg" menu={menu} defaultMenu={"dashboard"} />
			<Layout className="site-layout">
				<Header />
				<div style={{ padding: "20px" }}>{props}</div>
			</Layout>
		</Layout>
	);
};

export default AdminLayout;
