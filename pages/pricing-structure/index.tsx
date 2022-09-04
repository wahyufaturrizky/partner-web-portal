import React, { useState } from "react";
import styled from "styled-components";
import ActivePricingStructure from "../../components/pricing-structure/active";
import InActivePricingStructure from "../../components/pricing-structure/inactive";
import DraftPricingStructure from "../../components/pricing-structure/draft";
import RejectedPricingStructure from "../../components/pricing-structure/rejected";
import WaitingApprovalPricingStructure from "../../components/pricing-structure/waiting-approval";
import { Col, Spin, Spacer, Text, ContentSwitcher } from "pink-lava-ui";
import { usePricingStructureLists } from "../../hooks/pricing-structure/usePricingStructure";

const PricingStructureList: any = () => {
  const {
    data: pricingStructureLists,
    isLoading: isLoadingPricingStructureList,
    refetch,
  } = usePricingStructureLists({
    query: {
      status: "ACTIVE",
    },
    options: {},
  });

  const totalRowByStatus = pricingStructureLists?.totalRowByStatus;

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
      {isLoadingPricingStructureList ? (
        <Center>
          <Spin tip="Loading data..." />
        </Center>
      ) : (
        <Col>
          <Text variant={"h4"}>Pricing Structure</Text>
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
            <ActivePricingStructure />
          ) : tab === "inactive" ? (
            <InActivePricingStructure />
          ) : tab === "draft" ? (
            <DraftPricingStructure refetchCount={refetch} />
          ) : tab === "rejected" ? (
            <RejectedPricingStructure />
          ) : (
            <WaitingApprovalPricingStructure />
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

export default PricingStructureList;
