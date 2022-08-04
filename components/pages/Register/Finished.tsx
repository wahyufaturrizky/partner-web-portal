import React, { useContext } from "react";
import { Col, Spacer, Text, Row } from "pink-lava-ui";
import { LoadingOutlined, CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import styled from "styled-components";
import { useFormContext } from "react-hook-form";
import { RegisterFormContext } from "../../../context/RegisterContext";

const Finished = () => {
  const { getValues } = useFormContext();
  const { setCurrentStep, setStepList } = useContext(RegisterFormContext);

  const formValues = getValues();

  return (
    <Col alignItems={"Center"}>
      <span>
        <CheckCircleFilled style={{ color: "#00C572", fontSize: "28px" }} />{" "}
        <Text inline variant={"h4"}>
          Congratulations
        </Text>
      </span>

      <div
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
          Your data is complete, please check again before registering.
        </Text>
      </div>

      <Spacer size={10} />

      <FormViewContainer>
        <Row justifyContent={"space-between"}>
          <Text inline color={"grey.regular"} variant={"headingMedium"}>
            Account
          </Text>
          <Text
            inline
            color={"pink.light"}
            clickable
            variant={"link"}
            style={{ lineHeight: "normal" }}
            onClick={() => {
              setCurrentStep((prevStep: any) => {
                setStepList([
                  { status: "process", title: "Create Account" },
                  { status: "wait", title: "Bussines Type" },
                  { status: "wait", title: "Create Subdomain" },
                  { status: "wait", title: "Finished" },
                ]);
                return 0;
              });
            }}
          >
            Edit
          </Text>
        </Row>

        <Separator />

        <Spacer size={10} />

        <Text variant="subtitle1">Email</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {formValues?.email}
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Phone Number</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {`${formValues?.phone_code} ${formValues.phone_number}`}
        </Text>

        <Spacer size={10} />

        <Row justifyContent={"space-between"}>
          <Text inline color={"grey.regular"} variant={"headingMedium"}>
            Business Type
          </Text>
          <Text
            inline
            color={"pink.light"}
            clickable
            variant={"link"}
            style={{ lineHeight: "normal" }}
            onClick={() => {
              setCurrentStep((prevStep: any) => {
                setStepList([
                  { status: "finish", title: "Create Account" },
                  { status: "process", title: "Bussines Type" },
                  { status: "wait", title: "Create Subdomain" },
                  { status: "wait", title: "Finished" },
                ]);
                return 1;
              });
            }}
          >
            Edit
          </Text>
        </Row>

        <Separator />

        <Spacer size={10} />

        <Text variant="subtitle1">Company Name</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {formValues?.company_name}
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Company Type</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {formValues?.company_type}
        </Text>

        {formValues?.company_type !== "holding" && (
          <>
            <Spacer size={10} />

            <Text variant="subtitle1">Industry Fields</Text>
            <Text variant="subtitle2" style={{ color: "grey" }}>
              {formValues?.industry_fields}
            </Text>

            <Spacer size={10} />

            <Text variant="subtitle1">Sector/Segment</Text>
            <Text variant="subtitle2" style={{ color: "grey" }}>
              {formValues?.sector}
            </Text>
          </>
        )}

        <Spacer size={10} />

        <Text variant="subtitle1">Number of Employee</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {formValues?.number_employees}
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Country</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {formValues?.country}
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">City</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {formValues?.city}
        </Text>

        <Spacer size={10} />

        <Row justifyContent={"space-between"}>
          <Text inline color={"grey.regular"} variant={"headingMedium"}>
            Subdomain
          </Text>
          <Text
            inline
            color={"pink.light"}
            clickable
            variant={"link"}
            style={{ lineHeight: "normal" }}
            onClick={() => {
              setCurrentStep((prevStep: any) => {
                setStepList([
                  { status: "finish", title: "Create Account" },
                  { status: "finish", title: "Bussines Type" },
                  { status: "process", title: "Create Subdomain" },
                  { status: "wait", title: "Finished" },
                ]);
                return 2;
              });
            }}
          >
            Edit
          </Text>
        </Row>

        <Separator />

        <Spacer size={10} />

        <Text variant="subtitle1">Subdomain Name</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          {`https://www.${formValues?.subdomain}.com`}
        </Text>
      </FormViewContainer>
    </Col>
  );
};

const FormViewContainer = styled.div`
  width: 400px;
  height: 320px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    margin-bottom: 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #a59b9b80;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a59b9ba1;
  }
`;

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px solid #dddddd;
`;

export default Finished;
