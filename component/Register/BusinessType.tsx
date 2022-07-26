import React from "react";
import { Row, Col, Spacer, Text, FormInput, FormSelect } from "pink-lava-ui";

const BusinessType = () => {
  return (
    <Col alignItems={"Center"}>
      <Text variant={"h4"}>Business Type</Text>
      <div
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
          Fill in the data according to where you work, after that we will verify the data.
        </Text>
      </div>
      <Spacer size={10} />

      <div style={{ width: "40%" }}>
        <Text variant="label">{"Company Name"}</Text>
        <FormInput size="large" placeholder="large size" />

        <Spacer size={20} />

        <Row noWrap gap={"8px"} width={"100%"}>
          <Col width={"100%"}>
            <Text variant="label">Company Type</Text>
            <FormSelect
              size={"large"}
              defaultValue="+62"
              items={[
                { value: "+62", label: "+62" },
                { value: "+65", label: "+65" },
              ]}
            />
          </Col>
          <Col width={"100%"}>
            <Text variant="label">Number Of employees</Text>
            <FormSelect
              size={"large"}
              defaultValue="+62"
              items={[
                { value: "+62", label: "+62" },
                { value: "+65", label: "+65" },
              ]}
            />
          </Col>
        </Row>

        <Spacer size={20} />

        <Row noWrap gap={"8px"} width={"100%"}>
          <Col width={"100%"}>
            <Text variant="label">Country</Text>
            <FormSelect
              size={"large"}
              defaultValue="+62"
              items={[
                { value: "+62", label: "+62" },
                { value: "+65", label: "+65" },
              ]}
            />
          </Col>
          <Col width={"100%"}>
            <Text variant="label">City</Text>
            <FormSelect
              size={"large"}
              defaultValue="+62"
              items={[
                { value: "+62", label: "+62" },
                { value: "+65", label: "+65" },
              ]}
            />
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default BusinessType;
