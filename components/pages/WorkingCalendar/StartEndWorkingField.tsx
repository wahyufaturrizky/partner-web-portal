import React, { useState } from "react";
import { Text, Col, Row, Spacer, DatePickerInput } from "pink-lava-ui";
import { Controller } from "react-hook-form";
import moment from "moment";

const StartEndWorkingField = ({ control, setStartDate, setEndDate, workingCalendarData }: any) => {
  const [startDateValue, setStartDateValue] = useState(workingCalendarData?.start ?? "");

  return (
    <>
      <Text variant={"headingMedium"}>Which date start and end working days?</Text>

      <Spacer size={20} />

      <Row gap={"8px"} width={"100%"} alignItems={"center"} noWrap>
        <Col width="100%">
          <Text variant="headingRegular">
            Start Working Date<span style={{ color: "#EB008B" }}>*</span>
          </Text>
          <Controller
            control={control}
            defaultValue={workingCalendarData?.start}
            name={`start`}
            render={({ field: { onChange } }) => (
              <DatePickerInput
                label=""
                fullWidth
                placeholder={"01/01/2022"}
                defaultValue={
                  workingCalendarData?.start ? moment(workingCalendarData?.start, "DD/MM/YYYY") : ""
                }
                onChange={(date: any, dateString: any) => {
                  setStartDate(dateString);
                  setStartDateValue(dateString);
                  onChange(dateString);
                }}
                format={"DD/MM/YYYY"}
              />
            )}
          />
        </Col>
        <Col width="100%">
          <Text variant="headingRegular">
            End Working Date<span style={{ color: "#EB008B" }}>*</span>
          </Text>
          <Controller
            control={control}
            name={`end`}
            defaultValue={workingCalendarData?.end}
            render={({ field: { onChange } }) => (
              <DatePickerInput
                label=""
                fullWidth
                placeholder={"01/01/2022"}
                defaultValue={
                  workingCalendarData?.end ? moment(workingCalendarData?.end, "DD/MM/YYYY") : ""
                }
                onChange={(date: any, dateString: any) => {
                  setEndDate(dateString);
                  onChange(dateString);
                }}
                format={"DD/MM/YYYY"}
                disabledDate={(current: any) => {
                  return startDateValue === ""
                    ? false
                    : current && current < moment(startDateValue, "DD-MM-YYYY").endOf("day");
                }}
              />
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default StartEndWorkingField;
