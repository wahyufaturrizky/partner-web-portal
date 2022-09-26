import React from "react";
import { Text, Col, Row, Spacer, DatePickerInput } from "pink-lava-ui";
import { Controller } from "react-hook-form";
import moment from "moment";

const StartEndWorkingField = ({ control }: any) => {
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
            name={`start`}
            render={({ field: { onChange } }) => (
              <DatePickerInput
                label=""
                fullWidth
                onChange={(date: any, dateString: any) => {
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
            render={({ field: { onChange } }) => (
              <DatePickerInput
                label=""
                fullWidth
                onChange={(date: any, dateString: any) => {
                  onChange(dateString);
                }}
                format={"DD/MM/YYYY"}
              />
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default StartEndWorkingField;
