import React from "react";
import { Col, Spacer, Text, FormInput } from "pink-lava-ui";
import { LoadingOutlined, CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

const CreateSubdomain = () => {
  return (
    <Col alignItems={"Center"}>
      <Text variant={"h4"}>Create Subdomain</Text>
      <div style={{ width: "60%" }}>
        <Text variant={"caption"} textAlign={"center"} color={"grey.light"}>
          It's almost finished, Please check the subdomain name that we have suggested or want to
          create a new one according to your wishes. Subdomain are internet addresses for diferent
          section of your website
        </Text>
      </div>
      <Spacer size={10} />

      <div style={{ width: "50%" }}>
        <Text variant="subtitle1">Subdomain</Text>
        <FormInput
          size="large"
          placeholder="large size"
          suffix={
            <>
              <span>.com</span>

              <CheckCircleFilled style={{ color: "green" }} />

              {/* <ExclamationCircleFilled style={{color:"red"}}/> */}
              {/* <LoadingOutlined /> */}
            </>
          }
        />
      </div>
    </Col>
  );
};

export default CreateSubdomain;
