import React from "react";
import { Col, Spacer, Text, Row, FormInput } from "pink-lava-ui";
import { LoadingOutlined, CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import styled from "styled-components";

const Finished = () => {
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

      <div style={{ width: "50%", height: "320px", overflow: "auto" }}>
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
          >
            Edit
          </Text>
        </Row>

        <Separator />

        <Spacer size={10} />

        <Text variant="subtitle1">Email</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          Gwen.Stacy@nabatisnack.co.id
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Phone Number</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          +62 81234 56789
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
          >
            Edit
          </Text>
        </Row>

        <Separator />

        <Spacer size={10} />

        <Text variant="subtitle1">Company Name</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          Nabati Group
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Company Type</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          Holding
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Number of Employee</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          5000+
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">Country</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          Indonesia
        </Text>

        <Spacer size={10} />

        <Text variant="subtitle1">City</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          Surabaya
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
          >
            Edit
          </Text>
        </Row>

        <Separator />

        <Spacer size={10} />

        <Text variant="subtitle1">Subdomain Name</Text>
        <Text variant="subtitle2" style={{ color: "grey" }}>
          https://www.nabatigroup.edot.id
        </Text>
      </div>
    </Col>
  );
};

const Separator = styled.div`
  display: block;
  height: 0;
  border-bottom: 1px solid #dddddd;
`;

export default Finished;
