import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import {
  Text,
  Button,
  Col,
  Row,
  Spacer,
  Search,
  Table,
  Pagination,
  Modal,
  Switch,
} from "pink-lava-ui";
import usePagination from "@lucasmogari/react-pagination";
import {
  useWorkingCalendars,
  useUpdateActiveWorkingCalendar,
  useDeleteWorkingCalendar,
} from "../../hooks/mdm/working-calendar/useWorkingCalendar";
import useDebounce from "../../lib/useDebounce";
import { queryClient } from "../_app";
import { useRouter } from "next/router";

const renderConfirmationText = (type: any, data: any) => {
  switch (type) {
    case "selection":
      return data.selectedRowKeys.length > 1
        ? `Are you sure to delete ${data.selectedRowKeys.length} items ?`
        : `Are you sure to delete ${
            data?.workingCalendarData?.data.find((el: any) => el.key === data.selectedRowKeys[0])
              ?.calendarName
          } ?`;
    case "detail":
      return `Are you sure to delete ${data.workingCalendarName} ?`;

    default:
      break;
  }
};

const WorkingCalendar = () => {
  const router = useRouter();

  const pagination = usePagination({
    page: 1,
    itemsPerPage: 10,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [workingCalendarId, setWorkingCalendarId] = useState(0);
  const [status, setStatus] = useState(false);

  const [search, setSearch] = useState("");
  const [isShowDelete, setShowDelete] = useState({ open: false, type: "selection", data: {} });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const debounceSearch = useDebounce(search, 1000);

  const initialRender = useRef(true);

  const { mutate: updateWorkingCalendar, isLoading: isLoadingUpdateWorkingCalendar } =
    useUpdateActiveWorkingCalendar({
      id: workingCalendarId,
      status,
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries(["working-calendars"]);
        },
      },
    });

  const {
    data: workingCalendarData,
    isLoading: isLoadingWorkingCalendar,
    isFetching: isFetchingWorkingCalendar,
  } = useWorkingCalendars({
    query: {
      search: debounceSearch,
      page: pagination.page,
      limit: pagination.itemsPerPage,
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any) => {
          return {
            key: element.id,
            id: element.id,
            calendarName: element.calendarName,
            country: element.country,
            company: element.company,
            workingDays: element.workingDays,
            publicHolidays: element.publicHolidays,
            lastUpdate: element.modifiedAt,
            active: (
              <Switch
                defaultChecked={element.active}
                onChange={() => {
                  setWorkingCalendarId(element.id);
                  setStatus(!element.active);
                }}
              />
            ),
            action: (
              <div style={{ display: "flex", justifyContent: "left" }}>
                <Button
                  size="small"
                  onClick={() => {
                    router.push(`/working-calendar/${element.id}`);
                  }}
                  variant="tertiary"
                >
                  View Detail
                </Button>
              </div>
            ),
          };
        });

        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  const { mutate: deleteWorkingCalendar, isLoading: isLoadingDeleteWorkingCalendar } =
    useDeleteWorkingCalendar({
      options: {
        onSuccess: () => {
          setShowDelete({ open: false, data: {}, type: "" });
          setSelectedRowKeys([]);
          queryClient.invalidateQueries(["working-calendars"]);
        },
      },
    });

  const columns = [
    {
      title: "Calendar Name",
      dataIndex: "calendarName",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Working Days",
      dataIndex: "workingDays",
    },
    {
      title: "Public Holidays",
      dataIndex: "publicHolidays",
    },
    {
      title: "Last Update",
      dataIndex: "lastUpdate",
    },
    {
      title: "Active",
      dataIndex: "active",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      align: "left",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    updateWorkingCalendar();
  }, [workingCalendarId, status]);

  return (
    <>
      <Col>
        <Text variant={"h4"}>Working Calendar</Text>
        <Spacer size={20} />
      </Col>
      <Card>
        <Row justifyContent="space-between">
          <Search
            width="340px"
            placeholder="Search Working Calendar Name, Days."
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
          />
          <Row gap="16px">
            <Button
              size="big"
              variant={"tertiary"}
              onClick={() =>
                setShowDelete({
                  open: true,
                  type: "selection",
                  data: { workingCalendarData, selectedRowKeys },
                })
              }
              disabled={rowSelection.selectedRowKeys?.length === 0}
            >
              Delete
            </Button>
            <Button
              size="big"
              variant="primary"
              onClick={() => router.push(`/working-calendar/create`)}
            >
              Create
            </Button>
          </Row>
        </Row>
      </Card>
      <Spacer size={10} />

      <Card style={{ padding: "16px 20px" }}>
        <Col gap={"60px"}>
          <Table
            loading={isLoadingWorkingCalendar || isFetchingWorkingCalendar}
            columns={columns}
            data={workingCalendarData?.data}
            rowSelection={rowSelection}
          />
          <Pagination pagination={pagination} />
        </Col>
      </Card>

      {isShowDelete.open && (
        <Modal
          closable={false}
          centered
          visible={isShowDelete.open}
          onCancel={() => setShowDelete({ open: false, type: "", data: {} })}
          title={"Confirm Delete"}
          footer={null}
          content={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Spacer size={4} />
              {renderConfirmationText(isShowDelete.type, isShowDelete.data)}
              <Spacer size={20} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <Button
                  size="big"
                  variant="tertiary"
                  key="submit"
                  type="primary"
                  onClick={() => setShowDelete({ open: false, type: "", data: {} })}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="big"
                  onClick={() => {
                    if (isShowDelete.type === "selection") {
                      deleteWorkingCalendar({ ids: selectedRowKeys });
                    }
                  }}
                >
                  {isLoadingDeleteWorkingCalendar ? "loading..." : "Yes"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
`;

export default WorkingCalendar;
