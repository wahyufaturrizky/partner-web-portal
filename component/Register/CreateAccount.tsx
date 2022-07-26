import React from "react";
import { Row, Col, Spacer, Text, FormInput, FormSelect } from "pink-lava-ui";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const CreateAccount = () => {
  return (
    <Col alignItems={"Center"}>
      <Text variant={"h4"}>Create Account</Text>
      <div style={{ width: "60%" }}>
        <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
          We're so happy you're here, let’s start by signing up. It may take less than 5 minutes.
        </Text>
      </div>
      <Spacer size={10} />

      <div style={{ width: "50%" }}>
        <Text variant="subtitle1">{"Email"}</Text>
        <FormInput size="large" placeholder="large size" />

        <Spacer size={20} />

        <Text variant="subtitle1">Phone Number</Text>
        <Row noWrap gap={"8px"}>
          <FormSelect
            size={"large"}
            defaultValue="+62"
            items={[
              { value: "+62", label: "+62" },
              { value: "+65", label: "+65" },
            ]}
          />
          <FormInput size="large" placeholder="large size" />
        </Row>

        <Spacer size={20} />

        <Text variant="subtitle1">{"Password"}</Text>
        <FormInput
          type="password"
          size="large"
          placeholder="large size"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          style={{ borderRadius: "8px" }}
        />

        <Spacer size={20} />

        <Text variant="subtitle1">{"Confirm Password"}</Text>
        <FormInput
          type="password"
          size="large"
          placeholder="large size"
          style={{ borderRadius: "8px" }}
        />
      </div>
    </Col>
  );
};

export default CreateAccount;
