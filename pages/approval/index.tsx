import React, { useState } from "react";
import styled from "styled-components";
import Role from "../../components/role";
import SuperUser from "../../components/super-user";
import Permission from "../../components/permission";
import { Col, Spin, Spacer, Text, ContentSwitcher } from "pink-lava-ui";
import { useApprovalPermissions } from "../../hooks/permission/usePermission";
import { useApprovalRolePermissions } from "../../hooks/role/useRole";
import { useApprovalSuperUsers } from "../../hooks/super-user/useSuperUser";

const Approval: any = () => {
	const { data: permissions, isLoading: isLoadingPermission } = useApprovalPermissions();
	const { data: roles, isLoading: isLoadingRole } = useApprovalRolePermissions();
	const { data: users, isLoading: isLoadingUsers } = useApprovalSuperUsers();

	const options = [
		{
			label: <Flex>Super User List {users?.totalRow > 0 && <Notif>{users?.totalRow}</Notif>}</Flex>,
			value: "super-user",
		},
		{
			label: <Flex>Role List {roles?.totalRow > 0 && <Notif>{roles?.totalRow}</Notif>}</Flex>,
			value: "role",
		},
		{
			label: (
				<Flex>
					Permission List {permissions?.totalRow > 0 && <Notif>{permissions?.totalRow}</Notif>}
				</Flex>
			),
			value: "permission",
		},
	];

	const [tab, setTab] = useState("super-user");

	return (
		<>
			{isLoadingPermission || isLoadingRole || isLoadingUsers ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Text variant={"h4"}>Approval List</Text>
					<Spacer size={20} />
					<ContentSwitcher
						options={options}
						defaultValue={tab}
						onChange={(value: string) => setTab(value)}
					/>
					<Spacer size={10} />

					{tab === "super-user" ? <SuperUser /> : tab === "role" ? <Role /> : <Permission />}
				</Col>
			)}
		</>
	);
};

const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Notif = styled.div`
	background: #ffffff;
	border: 1px solid #eb008b;
	box-sizing: border-box;
	border-radius: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	font-weight: 600;
	font-size: 10px;
	line-height: 14px;
	color: #eb008b;
`;

const Flex = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 7.5px;
`;

const Card = styled.div`
	background: #ffffff;
	border-radius: 16px;
	padding: 16px;
`;

export default Approval;
