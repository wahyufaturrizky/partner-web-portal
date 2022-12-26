import { Calendar as CalendarAntd, Select, Row, Col } from "antd";
import React from "react";
import styled from "styled-components";

export const Calendar = ({ width, ...props }) => {
  return (
    <Container width={width}>
      <StyledCalendar
        {...props}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];
          const current = value.clone();
          const localeData = value.localeData();
          const months = [];

          for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.months(current));
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i}>
                {months[i]}
              </Select.Option>
            );
          }

          const year = value.year();
          const month = value.month();
          const options = [];

          for (let i = year - 90; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i}>
                {i}
              </Select.Option>
            );
          }
          return (
            <Row gutter={8} style={{ marginBottom: "8px" }}>
              <Col>
                <Select
                  size="large"
                  value={month}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
              <Col>
                <Select
                  size="large"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Col>
            </Row>
          );
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  width: ${(props) => (props.width ? `${props.width}` : "800px")};
`;

const StyledCalendar = styled(CalendarAntd)`
  .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
    background: #e6f7ff;
    border-radius: 0;
  }

  .ant-picker-cell:hover:not(.ant-picker-cell-in-view) .ant-picker-cell-inner,
  .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end)
    .ant-picker-cell-inner {
    background: #d5fafd;
    border-radius: 0;
  }

  .ant-picker-date-panel {
    background: #ffffff;
    box-shadow: none;
    border-radius: 0;
  }
`;
