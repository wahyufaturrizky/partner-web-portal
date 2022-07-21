import React, { useState } from "react";
import styled from "styled-components";
import ActivePartner from "../../components/partner-config-partner-list/active";
import InactivePartner from "../../components/partner-config-partner-list/inactive";
import DraftPartner from "../../components/partner-config-partner-list/draft";
import RejectedPartner from "../../components/partner-config-partner-list/rejected";
import WaitingApprovalPartner from "../../components/partner-config-partner-list/waiting-approval";
import { Col, Spin, Spacer, Text, ContentSwitcher } from "pink-lava-ui";
import { usePartnerConfigLists } from "../../hooks/partner-config-list/usePartnerConfigList";

const PartnerConfigPartnerList: any = () => {
	const {
		data: partnerLists,
		isLoading: isLoadingPartnerList,
		refetch,
	} = usePartnerConfigLists({
		query: {
			status: "ACTIVE",
		},
		options: {},
	});

	const totalRowByStatus = partnerLists?.totalRowByStatus;

	const options = [
		{
			label: (
				<Flex>
					Active {totalRowByStatus?.active > 0 && <Notif>{totalRowByStatus?.active}</Notif>}
				</Flex>
			),
			value: "active",
		},
		{
			label: (
				<Flex>
					Inactive {totalRowByStatus?.inactive > 0 && <Notif>{totalRowByStatus?.inactive}</Notif>}
				</Flex>
			),
			value: "inactive",
		},
		{
			label: (
				<Flex>
					Waiting for Approval{" "}
					{totalRowByStatus?.waiting > 0 && <Notif>{totalRowByStatus?.waiting}</Notif>}
				</Flex>
			),
			value: "waiting-approval",
		},
		{
			label: (
				<Flex>
					Rejected {totalRowByStatus?.reject > 0 && <Notif>{totalRowByStatus?.reject}</Notif>}
				</Flex>
			),
			value: "rejected",
		},
		{
			label: (
				<Flex>Draft {totalRowByStatus?.draft > 0 && <Notif>{totalRowByStatus?.draft}</Notif>}</Flex>
			),
			value: "draft",
		},
	];

	const [tab, setTab] = useState("active");

	return (
		<>
			{isLoadingPartnerList ? (
				<Center>
					<Spin tip="Loading data..." />
				</Center>
			) : (
				<Col>
					<Text variant={"h4"}>Partner List</Text>
					<Spacer size={20} />
					<ContentSwitcher
						options={options}
						defaultValue={tab}
						onChange={(value: string) => {
							setTab(value);
							refetch();
						}}
					/>
					<Spacer size={10} />

					{tab === "active" ? (
						<ActivePartner />
					) : tab === "inactive" ? (
						<InactivePartner />
					) : tab === "draft" ? (
						<DraftPartner refetchCount={refetch} />
					) : tab === "rejected" ? (
						<RejectedPartner />
					) : (
						<WaitingApprovalPartner />
					)}
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

export default PartnerConfigPartnerList;
