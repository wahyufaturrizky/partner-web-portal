import usePagination from "@lucasmogari/react-pagination";
import { useNotification } from 'hooks/notification/useNotification';
import { useRouter } from "next/router";
import {
  Button,
  Col,
  Pagination,
  Row,
  Search,
  Spacer,
  Text,
  ContentSwitcher,
} from "pink-lava-ui";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";

const getLinkViewDetail = (screenCode: any) => {
  const approvalEngineScreen = {
    "mdm.salesman": "salesman",
    "mdm.pricing.structure": "pricing-structure",
  };

  const url = `/${approvalEngineScreen[screenCode]}`;
  return url;
};

const Notification: any = () => {
  const router = useRouter();
  const companyCode = localStorage.getItem("companyCode");
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const {
    data: notification,
  } = useNotification({
    options: {
      onSuccess: (items: any) => {
        pagination.setTotalItems(items?.totalRow);
      },
      select: ({ rows, totalRow, totalWaiting }: any) => {
        const data = rows?.map((items: any) => ({
          key: items?.id,
          id: items?.id,
          link: getLinkViewDetail(items?.screenCode),
          message: items?.message || "-",
          createdAt: items?.createdAt,
        }));
        return { data, totalRow, totalWaiting };
      },
    },
    query: {
      search,
      page: pagination.page,
      limit: pagination.itemsPerPage,
      status: tab,
      company_id: companyCode,
    },
  });

  const options = [
    {
      label: (
        <Flex>
          All
        </Flex>
      ),
      value: "all",
    },
    {
      label: (
        <Flex>
          Waiting for Approval
          {" "}
          {notification?.totalWaiting > 0 && <Notif>{notification?.totalWaiting}</Notif>}
        </Flex>
      ),
      value: "waiting",
    },
  ];

  return (
    <Col>
      <Text variant="h4">Notification</Text>
      <Spacer size={20} />
      <Row>
        <Search
          width="380px"
          placeholder="Search Approval, Info, Task, etc"
          onChange={(e: any) => setSearch(e.target.value)}
        />
        <Spacer size={8} />
        <ContentSwitcher
          options={options}
          defaultValue={tab}
          onChange={(value: string) => {
            setTab(value);
          }}
        />
      </Row>
      <Spacer size={20} />
      <div style={{
        display: 'flex', gap: '8px', flexDirection: "column", minHeight: 'calc(100vh - 260px)',
      }}
      >
        {notification?.data?.map((notif: any) => (
          <NotificationList active={!!notif.readDate}>
            <div>
              <NotificationContent>{notif?.message}</NotificationContent>
              <NotificationDate>{moment(notif?.createdAt).format("MM DD, YYYY, HH.mm")}</NotificationDate>
            </div>
            <Button
              size="small"
              variant="tertiary"
              onClick={
                  () => {
                    router.push(notif?.link);
                  }
                }
            >
              View Detail
            </Button>
          </NotificationList>
        ))}
      </div>
      <Pagination pagination={pagination} />
    </Col>
  );
};

const NotificationHighlight = styled.span`
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: #444444;
`;

const NotificationContent = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #444444;
`;

const NotificationDate = styled.p`
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;
  color: #666666;
`;
const NotificationList = styled.div`
  background: ${({ active } : any) => (active ? "#F4FBFC" : "#FFFFFF")};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  cursor: pointer;

`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7.5px;
`;

const Notif = styled.div`
  background: #ffffff;
  border: 1px solid #eb008b;
  box-sizing: border-box;
  border-radius: 24px;
  display: ${(p: any) => (p.hidden ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #eb008b;
`;

export default Notification;
