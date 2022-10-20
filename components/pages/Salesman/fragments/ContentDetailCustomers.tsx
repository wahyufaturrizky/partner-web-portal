import React, { useState } from "react";
import { Pagination, Checkbox, Spacer, Text, Row, Col, Table, DatePickerInput } from "pink-lava-ui";
import moment from "moment";
import { columnsDetailCustomers } from "../constants";
import { FlexElement } from "./ActionButton";
import { useFetchSalesmanCustomerDetail } from "hooks/mdm/salesman/useSalesman";
import usePagination from "@lucasmogari/react-pagination";
import useDebounce from "lib/useDebounce";

const ContentDetailCustomer = ({ customerId }: any) => {
  const pagination = usePagination({
    page: 1,
    itemsPerPage: 20,
    maxPageItems: Infinity,
    numbers: true,
    arrows: true,
    totalItems: 100,
  });

  const [defaultChecked, setDefaultChecked] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debounceStartDate = useDebounce(startDate, 1000);
  const debounceEndDate = useDebounce(endDate, 1000);
  const debounceToday = useDebounce(defaultChecked, 1000);

  const {
    data: salesCustomerData,
    isLoading: isLoadingSalesCustomer,
    isFetching: isFetchingSalesCustomer,
  } = useFetchSalesmanCustomerDetail({
    query: {
      customer: customerId,
      company: "KSNI",
      start: debounceStartDate,
      end: debounceEndDate,
      today: debounceToday ? "Y" : "N",
    },
    options: {
      onSuccess: (data: any) => {
        pagination.setTotalItems(data.totalRow);
      },
      select: (data: any) => {
        const mappedData = data?.rows?.map((element: any, index: any) => {
          return {
            key: index,
            branch: element.branch,
            frequency: element.visitFrequency,
            day: element.visitDay,
            date: element.date,
            startTime: element.startTime,
            endTime: element.endTime,
            duration: element.duration,
          };
        });
        return { data: mappedData, totalRow: data.totalRow };
      },
    },
  });

  return (
    <div>
      <Spacer size={20} />
      <Row alignItems="center" justifyContent="space-between">
        <Col width="45%">
          <DatePickerInput
            fullWidth
            placeholder="input start date"
            value={startDate === "" ? "" : moment(startDate, "MM-DD-YYYY")}
            label="Start Date"
            format={"DD/MM/YYYY"}
            onChange={(date: any, dateString: any) => {
              const formatDate = moment(dateString, "DD-MM-YYYY").format("MM-DD-YYYY");

              setStartDate(formatDate);
              setEndDate("");
              setDefaultChecked(false);
            }}
          />
        </Col>
        <Col width="45%">
          <DatePickerInput
            fullWidth
            disabled={defaultChecked}
            placeholder="end start date"
            value={endDate === "" ? "" : moment(endDate, "MM-DD-YYYY")}
            label="End Date"
            format={"DD/MM/YYYY"}
            onChange={(date: any, dateString: any) => {
              const formatDate = moment(dateString, "DD-MM-YYYY").format("MM-DD-YYYY");
              setEndDate(formatDate);
            }}
            disabledDate={(current: any) => {
              return startDate === ""
                ? false
                : current && current < moment(startDate, "MM-DD-YYYY").endOf("day");
            }}
          />
        </Col>
        <FlexElement style={{ paddingTop: "1.5rem", gap: "1px" }}>
          <Checkbox
            checked={defaultChecked}
            onChange={() => {
              setDefaultChecked(!defaultChecked);

              setStartDate(!defaultChecked ? moment().format("MM-DD-YYYY") : "");
              setEndDate(!defaultChecked ? moment().format("MM-DD-YYYY") : "");
            }}
          />
          <Text>Today</Text>
        </FlexElement>
      </Row>
      <Spacer size={20} />
      <Table
        loading={isLoadingSalesCustomer || isFetchingSalesCustomer}
        columns={columnsDetailCustomers}
        data={salesCustomerData?.data}
      />
      <Spacer size={20} />
      <Pagination pagination={pagination} />
      <Spacer size={20} />
    </div>
  );
};

export default ContentDetailCustomer;
